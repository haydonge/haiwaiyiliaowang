// Vercel API代理 - 解决HTTPS/HTTP混合内容问题

export default async function handler(req, res) {
  // 设置CORS头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, Prefer');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const { method, body, query } = req;
    
    // 从环境变量获取Supabase配置
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !anonKey) {
      return res.status(500).json({ 
        error: 'Supabase配置缺失',
        details: 'VITE_SUPABASE_URL或VITE_SUPABASE_ANON_KEY未配置'
      });
    }
    
    // 构建目标URL
    const { path, ...queryParams } = query;
    const targetPath = Array.isArray(path) ? path.join('/') : (path || '');
    
    // 构建查询字符串
    const queryString = new URLSearchParams(queryParams).toString();
    const targetUrl = `${supabaseUrl}/rest/v1/${targetPath}${queryString ? '?' + queryString : ''}`;
    
    console.log(`代理请求: ${method} ${targetUrl}`);
    
    // 准备请求头
    const headers = {
      'Content-Type': 'application/json',
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
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
    console.error('代理请求失败:', error);
    
    res.status(500).json({ 
      error: '代理请求失败',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}