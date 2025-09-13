import React, { useState, useEffect } from 'react';

interface DiagnosticResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

const NetworkDiagnostic: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (index: number, status: DiagnosticResult['status'], message: string, details?: any) => {
    setResults(prev => prev.map((result, i) => 
      i === index ? { ...result, status, message, details } : result
    ));
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    
    const tests: Omit<DiagnosticResult, 'status' | 'message'>[] = [
      { test: '环境变量检查' },
      { test: 'API服务器连通性测试' },
      { test: 'CORS预检请求测试' },
      { test: 'API数据获取测试' },
      { test: '代理配置测试' }
    ];

    setResults(tests.map(test => ({ ...test, status: 'pending', message: '等待执行...' })));

    // 测试1: 环境变量检查
    try {
      const envVars = {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        VITE_API_KEY: import.meta.env.VITE_API_KEY,
        VITE_ENABLE_API_LOGGING: import.meta.env.VITE_ENABLE_API_LOGGING,
        VITE_ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG,
        MODE: import.meta.env.MODE,
        PROD: import.meta.env.PROD
      };
      
      updateResult(0, 'success', '环境变量加载正常', envVars);
    } catch (error) {
      updateResult(0, 'error', `环境变量检查失败: ${error}`);
    }

    // 测试2: API服务器连通性测试
    try {
      const response = await fetch('https://postapi.kgzivf.com/api/posts', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      updateResult(1, 'success', 'API服务器可访问');
    } catch (error) {
      updateResult(1, 'error', `API服务器连接失败: ${error}`);
    }

    // 测试3: CORS预检请求测试
    try {
      const response = await fetch('https://postapi.kgzivf.com/api/posts', {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
      };
      
      updateResult(2, 'success', 'CORS预检请求成功', corsHeaders);
    } catch (error) {
      updateResult(2, 'error', `CORS预检请求失败: ${error}`);
    }

    // 测试4: API数据获取测试
    try {
      const apiUrl = import.meta.env.PROD ? '/api/posts' : 'https://postapi.kgzivf.com/api/posts';
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      updateResult(3, 'success', 'API数据获取成功', {
        status: response.status,
        dataLength: data.data?.posts?.length || 0,
        responseTime: response.headers.get('x-response-time')
      });
    } catch (error) {
      updateResult(3, 'error', `API数据获取失败: ${error}`);
    }

    // 测试5: 代理配置测试（仅在生产环境）
    if (import.meta.env.PROD) {
      try {
        const response = await fetch('/api/posts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        updateResult(4, 'success', 'Vercel代理配置正常', {
          status: response.status,
          url: response.url
        });
      } catch (error) {
        updateResult(4, 'error', `代理配置测试失败: ${error}`);
      }
    } else {
      updateResult(4, 'success', '开发环境跳过代理测试');
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>;
      case 'success':
        return <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>;
      case 'error':
        return <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</div>;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pending': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">网络诊断工具</h2>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? '诊断中...' : '重新诊断'}
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(result.status)}
              <h3 className="font-semibold text-gray-800">{result.test}</h3>
            </div>
            
            <p className={`text-sm ${getStatusColor(result.status)} mb-2`}>
              {result.message}
            </p>
            
            {result.details && (
              <details className="text-xs text-gray-600">
                <summary className="cursor-pointer hover:text-gray-800">查看详细信息</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">诊断说明</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>环境变量检查</strong>: 验证所有必要的环境变量是否正确加载</li>
          <li>• <strong>API服务器连通性</strong>: 测试API服务器是否可访问</li>
          <li>• <strong>CORS预检请求</strong>: 检查跨域资源共享配置</li>
          <li>• <strong>API数据获取</strong>: 测试实际的API数据请求</li>
          <li>• <strong>代理配置测试</strong>: 验证Vercel代理配置（仅生产环境）</li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkDiagnostic;