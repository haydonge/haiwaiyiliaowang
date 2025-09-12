// API配置文件 - 处理开发和生产环境的差异

// 环境检测
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// 从环境变量获取配置，提供默认值
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl !== undefined) {
    return envUrl;
  }
  // 如果环境变量未设置，使用默认逻辑
  if (isDevelopment) {
    return ''; // 开发环境使用Vite代理
  } else {
    // DOKPLOY生产环境直接访问API
    return 'https://postapi.kgzivf.com';
  }
};

// API配置
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  API_KEY: import.meta.env.VITE_API_KEY || 'blog-api-secret-key-2024',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  RETRY_ATTEMPTS: 3, // 重试次数
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_API_LOGGING === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
};

// CORS配置
export const CORS_CONFIG = {
  mode: 'cors' as RequestMode,
  credentials: 'omit' as RequestCredentials, // 生产环境不发送凭据
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// 生产环境特殊处理
if (isProduction) {
  console.log('🚀 生产环境API配置已加载');
  console.log('🔗 API基础URL:', API_CONFIG.BASE_URL);
  
  // 检查API可用性
  fetch(`${API_CONFIG.BASE_URL}/health`, {
    method: 'GET',
    ...CORS_CONFIG,
  })
    .then(response => {
      if (response.ok) {
        console.log('✅ API服务连接正常');
      } else {
        console.warn('⚠️ API服务响应异常:', response.status);
      }
    })
    .catch(error => {
      console.error('❌ API服务连接失败:', error.message);
      console.log('💡 建议检查网络连接或联系管理员');
    });
}

// 导出环境信息
export const ENV_INFO = {
  isDevelopment,
  isProduction,
  nodeEnv: import.meta.env.MODE,
  apiUrl: API_CONFIG.BASE_URL,
};