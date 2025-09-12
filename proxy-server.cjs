// 简化的CORS代理服务器
const express = require('express');
const cors = require('cors');
// 使用Node.js内置的fetch API (Node.js 18+)

const app = express();
const PORT = 3001;
const TARGET_API = 'https://postapi.kgzivf.com';



// 启用CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 代理所有API请求
app.use('/api', async (req, res) => {
  try {
    const targetUrl = `${TARGET_API}${req.originalUrl}`;
    console.log(`🔄 代理请求: ${req.method} ${targetUrl}`);
    
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CORS-Proxy/1.0'
      }
    };
    
    // 添加请求体（如果有）
    if (req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
    }
    
    // 添加API Key（如果需要）
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      options.headers['X-API-Key'] = 'blog-api-secret-key-2024';
    }
    
    const response = await fetch(targetUrl, options);
    const data = await response.text();
    
    console.log(`✅ 代理响应: ${response.status} ${targetUrl}`);
    
    // 设置响应头
    res.status(response.status);
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    
    res.send(data);
  } catch (error) {
    console.error(`❌ 代理错误:`, error.message);
    res.status(500).json({ 
      error: '代理服务器错误', 
      details: error.message,
      url: req.originalUrl 
    });
  }
});

// 代理健康检查
app.use('/health', async (req, res) => {
  try {
    const targetUrl = `${TARGET_API}/health`;
    console.log(`🔄 健康检查代理: ${targetUrl}`);
    
    const response = await fetch(targetUrl);
    const data = await response.text();
    
    console.log(`✅ 健康检查响应: ${response.status}`);
    
    res.status(response.status);
    res.set('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    console.error(`❌ 健康检查错误:`, error.message);
    res.status(500).json({ error: '健康检查失败', details: error.message });
  }
});

// 本地健康检查端点
app.get('/proxy-health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CORS代理服务器运行正常', 
    timestamp: new Date().toISOString(),
    target: TARGET_API
  });
});

// 全局CORS中间件处理所有请求
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 CORS代理服务器启动成功!`);
  console.log(`📡 代理地址: http://localhost:${PORT}`);
  console.log(`🎯 目标API: ${TARGET_API}`);
  console.log(`🌐 允许的源: http://localhost:5173`);
  console.log(`\n使用方法:`);
  console.log(`- 将前端API_BASE_URL改为: http://localhost:${PORT}`);
  console.log(`- 原始API调用: ${TARGET_API}/api/posts`);
  console.log(`- 代理API调用: http://localhost:${PORT}/api/posts`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭CORS代理服务器...');
  process.exit(0);
});