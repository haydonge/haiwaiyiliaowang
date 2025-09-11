import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string;
}

const Debug: React.FC = () => {
  const [envTests, setEnvTests] = useState<TestResult[]>([]);
  const [dbTests, setDbTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkEnvironmentVariables();
  }, []);

  const checkEnvironmentVariables = () => {
    const tests: TestResult[] = [];
    
    // 检查必需的环境变量
    const requiredVars = {
      'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
      'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY
    };
    
    for (const [key, value] of Object.entries(requiredVars)) {
      if (value) {
        tests.push({
          name: key,
          status: 'success',
          message: '已配置',
          details: `${value.substring(0, 50)}...`
        });
      } else {
        tests.push({
          name: key,
          status: 'error',
          message: '未配置或为空',
          details: '请检查Vercel环境变量设置'
        });
      }
    }
    
    // 检查环境信息
    tests.push({
      name: '部署环境',
      status: 'info',
      message: window.location.hostname.includes('vercel.app') ? 'Vercel生产环境' : '本地开发环境',
      details: `域名: ${window.location.hostname}`
    });
    
    tests.push({
      name: '构建时间',
      status: 'info',
      message: new Date().toLocaleString(),
      details: `用户代理: ${navigator.userAgent.substring(0, 100)}...`
    });
    
    setEnvTests(tests);
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    const tests: TestResult[] = [];
    
    try {
      // 测试基本连接
      const startTime = Date.now();
      const { data: healthCheck, error: healthError } = await supabase
        .from('blog_posts')
        .select('count', { count: 'exact', head: true });
      
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      if (healthError) {
        tests.push({
          name: '数据库连接',
          status: 'error',
          message: '连接失败',
          details: healthError.message
        });
      } else {
        tests.push({
          name: '数据库连接',
          status: 'success',
          message: `连接成功 (${latency}ms)`,
          details: `响应时间: ${latency}ms`
        });
      }
      
      // 测试文章数据
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('id, title_zh, title_en, author_id')
        .limit(5);
      
      if (postsError) {
        tests.push({
          name: '文章数据查询',
          status: 'error',
          message: '查询失败',
          details: postsError.message
        });
      } else {
        tests.push({
          name: '文章数据查询',
          status: posts && posts.length > 0 ? 'success' : 'warning',
          message: posts ? `找到 ${posts.length} 篇文章` : '没有找到文章',
          details: posts && posts.length > 0 ? posts.map(p => p.title_zh || p.title_en).join(', ') : '数据库中可能没有文章数据'
        });
      }
      
      // 测试作者数据
      const { data: authors, error: authorsError } = await supabase
        .from('blog_authors')
        .select('id, name')
        .limit(5);
      
      if (authorsError) {
        tests.push({
          name: '作者数据查询',
          status: 'error',
          message: '查询失败',
          details: authorsError.message
        });
      } else {
        tests.push({
          name: '作者数据查询',
          status: authors && authors.length > 0 ? 'success' : 'warning',
          message: authors ? `找到 ${authors.length} 位作者` : '没有找到作者',
          details: authors && authors.length > 0 ? authors.map(a => a.name).join(', ') : '数据库中可能没有作者数据'
        });
      }
      
    } catch (error) {
      tests.push({
        name: '数据库测试',
        status: 'error',
        message: '测试失败',
        details: error instanceof Error ? error.message : '未知错误'
      });
    }
    
    setDbTests(tests);
    setLoading(false);
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Vercel部署诊断页面</h1>
          <p className="text-gray-600 mb-8">此页面用于诊断Vercel部署中的环境变量配置和数据库连接问题。</p>
          
          {/* 环境变量检查 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 环境变量检查</h2>
            <div className="space-y-3">
              {envTests.map((test, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(test.status)}</span>
                      <span className="font-medium">{test.name}</span>
                      <span className="text-sm">{test.message}</span>
                    </div>
                  </div>
                  {test.details && (
                    <div className="mt-2 text-sm font-mono bg-gray-50 p-2 rounded border">
                      {test.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 数据库连接测试 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🗄️ 数据库连接测试</h2>
            <button
              onClick={testDatabaseConnection}
              disabled={loading}
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? '测试中...' : '测试数据库连接'}
            </button>
            
            {dbTests.length > 0 && (
              <div className="mt-4 space-y-3">
                {dbTests.map((test, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getStatusIcon(test.status)}</span>
                        <span className="font-medium">{test.name}</span>
                        <span className="text-sm">{test.message}</span>
                      </div>
                    </div>
                    {test.details && (
                      <div className="mt-2 text-sm bg-gray-50 p-2 rounded border">
                        {test.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 解决方案建议 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 常见问题解决方案</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>环境变量未配置：</strong> 请在Vercel项目设置中添加 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY</p>
              <p><strong>数据库连接失败：</strong> 检查Supabase服务是否正常运行，URL和密钥是否正确</p>
              <p><strong>没有数据：</strong> 可能需要重新添加文章和作者数据到数据库</p>
              <p><strong>CORS错误：</strong> 检查Supabase项目的CORS设置是否允许Vercel域名访问</p>
            </div>
          </div>
          
          {/* 返回链接 */}
          <div className="mt-8 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">
              ← 返回主页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug;