import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    posts: BlogPost[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const TestApi: React.FC = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseTime, setResponseTime] = useState<number>(0);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [showJson, setShowJson] = useState<boolean>(false);
  
  // API配置 - 与blogService.ts保持一致
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://postapi.kgzivf.com';
  const API_KEY = import.meta.env.VITE_API_KEY || '';
  const ENABLE_LOGGING = import.meta.env.VITE_ENABLE_API_LOGGING === 'true';
  const ENABLE_DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';

  const testApi = async () => {
    setStatus('loading');
    setError('');
    setApiResponse(null);
    
    const startTime = Date.now();
    const apiUrl = `${API_BASE_URL}/api/posts`;
    
    try {
      if (ENABLE_LOGGING) {
        console.log('🚀 开始API测试...');
        console.log('📡 请求URL:', apiUrl);
        console.log('🔑 API Key:', API_KEY ? '已配置' : '未配置');
        console.log('🌍 环境变量:', {
          VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
          VITE_API_KEY: import.meta.env.VITE_API_KEY ? '已设置' : '未设置',
          VITE_ENABLE_API_LOGGING: import.meta.env.VITE_ENABLE_API_LOGGING,
          VITE_ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG
        });
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // 添加API Key（如果配置了）
      if (API_KEY) {
        headers['X-API-Key'] = API_KEY;
      }
      
      if (ENABLE_LOGGING) {
        console.log('⚙️ 请求配置:', {
          method: 'GET',
          credentials: 'include',
          mode: 'cors',
          headers
        });
      }
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers
      });
      
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      if (ENABLE_LOGGING) {
        console.log('📊 响应状态:', response.status);
        console.log('⏱️ 响应时间:', endTime - startTime, 'ms');
        console.log('📋 响应头:', Object.fromEntries(response.headers.entries()));
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        if (ENABLE_DEBUG) {
          console.error(`❌ HTTP错误 ${response.status}:`, errorText);
        }
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (ENABLE_DEBUG) {
          console.error('❌ 响应不是JSON格式:', text.substring(0, 200));
        }
        throw new Error('API返回了非JSON格式的响应');
      }
      
      const data: ApiResponse = await response.json();
      if (ENABLE_LOGGING) {
        console.log('✅ API响应成功:', data);
      }
      
      setApiResponse(data);
      setStatus('success');
      
    } catch (err) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      if (ENABLE_DEBUG) {
        console.error('❌ API请求失败:', errorMessage);
      }
      
      setStatus('error');
      
      // 提供详细的错误诊断信息
      let detailedError = errorMessage;
      
      if (errorMessage.includes('Failed to fetch')) {
        detailedError = `网络连接失败\n\n可能的原因：\n1. CORS配置问题\n2. 网络连接中断\n3. API服务器不可用\n4. 环境变量配置错误\n\n当前配置：\n- API URL: ${apiUrl}\n- API Key: ${API_KEY ? '已配置' : '未配置'}\n- 环境: ${import.meta.env.MODE}`;
      } else if (errorMessage.includes('HTTP')) {
        detailedError = `服务器返回错误: ${errorMessage}\n\n请检查：\n1. API服务器状态\n2. 请求参数是否正确\n3. API Key是否有效`;
      } else if (errorMessage.includes('JSON')) {
        detailedError = `响应格式错误: ${errorMessage}\n\n可能的原因：\n1. API返回了HTML错误页面\n2. 代理配置问题\n3. 服务器内部错误`;
      }
      
      setError(detailedError);
    }
  };
  
  const clearResults = () => {
    setStatus('idle');
    setApiResponse(null);
    setError('');
    setResponseTime(0);
    setShowJson(false);
    console.clear();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // 页面加载时自动执行一次测试
  React.useEffect(() => {
    testApi();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('testApi.title', 'API连接测试')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('testApi.description', '测试与博客API的连接状态')}
          </p>
        </div>
        
        {/* 控制按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={testApi}
            disabled={status === 'loading'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('testApi.testing', '测试中...')}
              </span>
            ) : (
              t('testApi.testButton', '测试API连接')
            )}
          </button>
          
          <button
            onClick={clearResults}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            {t('testApi.clearButton', '清空结果')}
          </button>
        </div>
        
        {/* 状态显示 */}
        {status !== 'idle' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {t('testApi.connectionStatus', '连接状态')}
              </h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === 'success' ? 'bg-green-100 text-green-800' :
                status === 'error' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {status === 'success' && '✅ 连接成功'}
                {status === 'error' && '❌ 连接失败'}
                {status === 'loading' && '⏳ 连接中...'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">API地址:</span>
                <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {API_BASE_URL}/api/posts
                </span>
              </div>
              <div>
                <span className="text-gray-600">API Key:</span>
                <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {API_KEY ? '已配置' : '未配置'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">环境:</span>
                <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {import.meta.env.MODE}
                </span>
              </div>
              <div>
                <span className="text-gray-600">响应时间:</span>
                <span className="ml-2 font-semibold text-blue-600">
                  {responseTime}ms
                </span>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">错误详情:</h3>
                <pre className="text-red-700 text-sm whitespace-pre-wrap">{error}</pre>
              </div>
            )}
          </div>
        )}
        
        {/* API响应数据 */}
        {apiResponse && (
          <div className="space-y-8">
            {/* JSON查看器 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t('testApi.apiResponse', 'API响应数据')}
                </h2>
                <button
                  onClick={() => setShowJson(!showJson)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  {showJson ? t('testApi.hideJson', '隐藏JSON') : t('testApi.showJson', '查看JSON')}
                </button>
              </div>
              
              {showJson && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
                  <pre className="text-sm">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* 文章列表 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {t('testApi.articleList', '博客文章列表')} ({apiResponse.data.total}篇)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apiResponse.data.posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {post.id}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {post.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>发布: {formatDate(post.created_at)}</div>
                      <div>更新: {formatDate(post.updated_at)}</div>
                      <div>Slug: <code className="bg-gray-100 px-1 rounded">{post.slug}</code></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 分页信息 */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    第 {apiResponse.data.page} 页，共 {apiResponse.data.totalPages} 页
                  </div>
                  <div className="flex gap-4">
                    <span>总计: {apiResponse.data.total} 篇文章</span>
                    <span>上一页: {apiResponse.data.hasPrev ? '有' : '无'}</span>
                    <span>下一页: {apiResponse.data.hasNext ? '有' : '无'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 使用说明 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('testApi.instructions', '使用说明')}
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>• 此页面用于测试与博客API的连接状态</p>
            <p>• 使用后端建议的fetch配置：credentials: 'include'</p>
            <p>• 页面加载时会自动执行一次API测试</p>
            <p>• 可以查看详细的JSON响应数据和格式化的文章列表</p>
            <p>• 适合在DOKPLOY部署环境中进行API连接调试</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestApi;