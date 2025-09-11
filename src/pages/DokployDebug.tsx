import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface DebugInfo {
  environment: string;
  supabaseUrl: string;
  hasAnonKey: boolean;
  hostname: string;
  protocol: string;
  userAgent: string;
  timestamp: string;
}

interface ConnectionTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
  duration?: number;
}

export default function DokployDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [tests, setTests] = useState<ConnectionTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Collect debug information
    const info: DebugInfo = {
      environment: detectEnvironment(),
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'Not set',
      hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(info);
  }, []);

  const detectEnvironment = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
      return 'Vercel Production';
    }
    if (hostname.includes('traefik.me')) {
      return 'DOKPLOY Environment';
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return 'Local Development';
    }
    return 'Unknown Environment';
  };

  const runTests = async () => {
    setIsRunning(true);
    const testResults: ConnectionTest[] = [];

    // Test 1: Environment Variables
    const envTest: ConnectionTest = {
      name: 'Environment Variables Check',
      status: 'pending',
      message: 'Checking environment variables...'
    };
    testResults.push(envTest);
    setTests([...testResults]);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      envTest.status = 'error';
      envTest.message = 'Missing environment variables';
      envTest.details = {
        VITE_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
        VITE_SUPABASE_ANON_KEY: anonKey ? 'Set' : 'Missing'
      };
    } else {
      envTest.status = 'success';
      envTest.message = 'Environment variables are set';
      envTest.details = {
        VITE_SUPABASE_URL: supabaseUrl,
        VITE_SUPABASE_ANON_KEY: anonKey.substring(0, 20) + '...'
      };
    }
    setTests([...testResults]);

    if (envTest.status === 'error') {
      setIsRunning(false);
      return;
    }

    // Test 2: Basic Network Connectivity
    const networkTest: ConnectionTest = {
      name: 'Network Connectivity',
      status: 'pending',
      message: 'Testing network connectivity...'
    };
    testResults.push(networkTest);
    setTests([...testResults]);

    try {
      const startTime = Date.now();
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        }
      });
      const duration = Date.now() - startTime;

      networkTest.duration = duration;
      networkTest.status = response.ok ? 'success' : 'error';
      networkTest.message = response.ok 
        ? `Network connectivity successful (${duration}ms)` 
        : `Network error: HTTP ${response.status}`;
      networkTest.details = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: `${supabaseUrl}/rest/v1/`
      };
    } catch (error: any) {
      networkTest.status = 'error';
      networkTest.message = `Network connection failed: ${error.message}`;
      networkTest.details = {
        error: error.message,
        stack: error.stack,
        type: error.constructor.name
      };
    }
    setTests([...testResults]);

    // Test 3: Supabase Client Creation
    const clientTest: ConnectionTest = {
      name: 'Supabase Client Creation',
      status: 'pending',
      message: 'Creating Supabase client...'
    };
    testResults.push(clientTest);
    setTests([...testResults]);

    try {
      const supabase = createClient(supabaseUrl, anonKey);
      clientTest.status = 'success';
      clientTest.message = 'Supabase client created successfully';
      clientTest.details = {
        clientType: 'Direct Connection',
        url: supabaseUrl
      };
    } catch (error: any) {
      clientTest.status = 'error';
      clientTest.message = `Failed to create Supabase client: ${error.message}`;
      clientTest.details = error;
    }
    setTests([...testResults]);

    // Test 4: Database Query
    const queryTest: ConnectionTest = {
      name: 'Database Query Test',
      status: 'pending',
      message: 'Testing database query...'
    };
    testResults.push(queryTest);
    setTests([...testResults]);

    try {
      const supabase = createClient(supabaseUrl, anonKey);
      const startTime = Date.now();
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title_zh, title_en, published, created_at')
        .eq('published', true)
        .limit(5);
      
      const duration = Date.now() - startTime;
      queryTest.duration = duration;

      if (error) {
        queryTest.status = 'error';
        queryTest.message = `Database query failed: ${error.message}`;
        queryTest.details = {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        };
      } else {
        queryTest.status = 'success';
        queryTest.message = `Database query successful (${duration}ms)`;
        queryTest.details = {
          recordCount: data?.length || 0,
          sampleData: data?.slice(0, 2) || [],
          queryDuration: duration
        };
      }
    } catch (error: any) {
      queryTest.status = 'error';
      queryTest.message = `Database query exception: ${error.message}`;
      queryTest.details = {
        error: error.message,
        stack: error.stack,
        type: error.constructor.name
      };
    }
    setTests([...testResults]);

    // Test 5: Authors Query
    const authorsTest: ConnectionTest = {
      name: 'Authors Query Test',
      status: 'pending',
      message: 'Testing authors query...'
    };
    testResults.push(authorsTest);
    setTests([...testResults]);

    try {
      const supabase = createClient(supabaseUrl, anonKey);
      const startTime = Date.now();
      
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .limit(5);
      
      const duration = Date.now() - startTime;
      authorsTest.duration = duration;

      if (error) {
        authorsTest.status = 'error';
        authorsTest.message = `Authors query failed: ${error.message}`;
        authorsTest.details = {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        };
      } else {
        authorsTest.status = 'success';
        authorsTest.message = `Authors query successful (${duration}ms)`;
        authorsTest.details = {
          recordCount: data?.length || 0,
          authors: data?.map(author => ({ id: author.id, name: author.name })) || []
        };
      }
    } catch (error: any) {
      authorsTest.status = 'error';
      authorsTest.message = `Authors query exception: ${error.message}`;
      authorsTest.details = error;
    }
    setTests([...testResults]);

    setIsRunning(false);
  };

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">DOKPLOY Environment Debug</h1>
            <p className="mt-1 text-sm text-gray-600">
              Comprehensive debugging tool for DOKPLOY Supabase connection issues
            </p>
          </div>

          <div className="p-6">
            {/* Debug Information */}
            {debugInfo && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Environment Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Environment</dt>
                      <dd className="text-sm text-gray-900">{debugInfo.environment}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Hostname</dt>
                      <dd className="text-sm text-gray-900">{debugInfo.hostname}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Protocol</dt>
                      <dd className="text-sm text-gray-900">{debugInfo.protocol}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Supabase URL</dt>
                      <dd className="text-sm text-gray-900 break-all">{debugInfo.supabaseUrl}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Has Anon Key</dt>
                      <dd className="text-sm text-gray-900">{debugInfo.hasAnonKey ? 'Yes' : 'No'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
                      <dd className="text-sm text-gray-900">{new Date(debugInfo.timestamp).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Test Controls */}
            <div className="mb-6">
              <button
                onClick={runTests}
                disabled={isRunning}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isRunning 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isRunning ? 'Running Tests...' : 'Run Connection Tests'}
              </button>
            </div>

            {/* Test Results */}
            {tests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
                <div className="space-y-4">
                  {tests.map((test, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-md font-medium text-gray-900">
                          {getStatusIcon(test.status)} {test.name}
                        </h3>
                        {test.duration && (
                          <span className="text-sm text-gray-500">{test.duration}ms</span>
                        )}
                      </div>
                      <p className={`text-sm ${getStatusColor(test.status)} mb-2`}>
                        {test.message}
                      </p>
                      {test.details && (
                        <details className="mt-2">
                          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                            Show Details
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Troubleshooting Guide */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">Troubleshooting Guide</h2>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>If Environment Variables test fails:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Check DOKPLOY environment variables configuration</li>
                  <li>Ensure VITE_SUPABASE_URL uses HTTPS protocol</li>
                  <li>Verify VITE_SUPABASE_ANON_KEY is correctly set</li>
                  <li>Rebuild and redeploy the application</li>
                </ul>
                
                <p className="mt-4"><strong>If Network Connectivity test fails:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Check if Supabase service is running in DOKPLOY</li>
                  <li>Verify network configuration between services</li>
                  <li>Check firewall and security group settings</li>
                  <li>Ensure CORS is properly configured</li>
                </ul>
                
                <p className="mt-4"><strong>If Database Query test fails:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Check RLS (Row Level Security) policies</li>
                  <li>Verify table permissions for anon role</li>
                  <li>Ensure database tables exist and are properly configured</li>
                  <li>Check if data exists in the tables</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}