// DOKPLOY环境专用代理服务器 - 解决HTTPS混合内容问题
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// Supabase配置
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://databackup-supabase-434385-107-173-35-13.traefik.me';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTA5MTc3NTUsImV4cCI6MTg5MzQ1NjAwMCwiaXNzIjoiZG9rcGxveSJ9.FEAR6GhERxdZKmfgJq9Fy6aveRxq2oz4cUmvcfJHY44';

console.log('🐳 DOKPLOY代理服务器配置:');
console.log('📍 Supabase URL:', SUPABASE_URL);
console.log('🔑 使用匿名密钥');

// 代理路由
app.all('/api/supabase-proxy', async (req, res) => {
  try {
    const { method, body, query } = req;
    
    console.log(`🔄 代理请求: ${method} ${req.originalUrl}`);
    console.log('📋 查询参数:', query);
    
    // 构建目标URL
    const { path, ...queryParams } = query;
    const targetPath = Array.isArray(path) ? path.join('/') : (path || '');
    
    // 构建查询字符串
    const queryString = new URLSearchParams(queryParams).toString();
    const targetUrl = `${SUPABASE_URL}/rest/v1/${targetPath}${queryString ? '?' + queryString : ''}`;
    
    console.log('🎯 目标URL:', targetUrl);
    
    // 准备请求头
    const headers = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    };
    
    // 添加Prefer头部（如果存在）
    if (req.headers.prefer) {
      headers['Prefer'] = req.headers.prefer;
    }
    
    // 发送请求到Supabase
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
    });
    
    console.log('📡 响应状态:', response.status);
    
    // 获取响应数据
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // 返回响应
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('💥 代理请求失败:', error.message);
    
    res.status(500).json({ 
      error: '代理请求失败',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL
  });
});

// 测试端点
app.get('/test-supabase', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=id,title_zh&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const data = await response.json();
    
    res.json({
      status: 'success',
      supabaseStatus: response.status,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 DOKPLOY代理服务器启动成功!`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔗 代理端点: http://localhost:${PORT}/api/supabase-proxy`);
  console.log(`❤️  健康检查: http://localhost:${PORT}/health`);
  console.log(`🧪 测试端点: http://localhost:${PORT}/test-supabase`);
  console.log('\n准备处理代理请求...');
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('\n🛑 收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});