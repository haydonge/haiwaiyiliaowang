// PostgreSQL API路由 - 处理数据库连接和查询
import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();

// 数据库连接配置
const isDokployEnvironment = process.env.NODE_ENV === 'production' && 
  process.env.VERCEL_URL && process.env.VERCEL_URL.includes('traefik.me');

// 根据环境选择数据库连接字符串
function getDatabaseUrl(): string {
  // 优先使用DOKPLOY内部连接（仅在DOKPLOY环境中）
  if (isDokployEnvironment && process.env.DOKPLOY_DATABASE_URL) {
    return process.env.DOKPLOY_DATABASE_URL;
  }
  
  if (isDokployEnvironment) {
    // DOKPLOY环境使用内部连接
    return process.env.DATABASE_URL_INTERNAL || 'postgresql://postgres:79nsrfotjvzdmgwp@donorlib-ecqf39:5432/donorlib';
  }
  
  // 本地开发环境：使用模拟数据库连接（避免真实数据库连接问题）
  if (process.env.NODE_ENV !== 'production') {
    // 返回一个模拟的连接字符串，实际会被拦截处理
    return 'postgresql://mock:mock@localhost:5432/mock';
  }
  
  // 其他环境使用外部连接
  return process.env.DATABASE_URL || 'postgresql://postgres:79nsrfotjvzdmgwp@107.173.35.13:2346/donorlib';
}

// 创建连接池
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const databaseUrl = getDatabaseUrl();
    
    console.log('🐘 初始化PostgreSQL连接池');
    console.log('🌍 环境检测:', {
      isDokployEnvironment,
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL
    });
    console.log('📍 数据库URL:', databaseUrl.replace(/:\/\/.*@/, '://***:***@'));
    
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: false,
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000'),
    });
    
    // 连接池事件监听
    pool.on('connect', () => {
      console.log('✅ PostgreSQL客户端已连接');
    });
    
    pool.on('error', (err) => {
      console.error('❌ PostgreSQL连接池错误:', err);
    });
  }
  
  return pool;
}

// 模拟数据（本地开发环境使用）
const mockBlogPosts = [
  {
    id: '1',
    title_zh: '欢迎来到我们的博客',
    title_en: 'Welcome to Our Blog',
    content_zh: '这是我们博客的第一篇文章...',
    content_en: 'This is the first post on our blog...',
    excerpt_zh: '博客介绍文章',
    excerpt_en: 'Blog introduction post',
    slug: 'welcome-to-our-blog',
    category: 'general',
    featured_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20blog%20welcome%20banner&image_size=landscape_16_9',
    read_time: 5,
    published: true,
    author_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: '博客管理员',
    bio_zh: '博客管理员',
    bio_en: 'Blog Administrator',
    avatar_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar&image_size=square'
  },
  {
    id: '2',
    title_zh: '技术分享：前端开发最佳实践',
    title_en: 'Tech Share: Frontend Development Best Practices',
    content_zh: '在现代前端开发中，有许多最佳实践值得我们学习...',
    content_en: 'In modern frontend development, there are many best practices worth learning...',
    excerpt_zh: '前端开发技术分享',
    excerpt_en: 'Frontend development tech sharing',
    slug: 'frontend-best-practices',
    category: 'technology',
    featured_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=frontend%20development%20coding&image_size=landscape_16_9',
    read_time: 8,
    published: true,
    author_id: '1',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    name: '博客管理员',
    bio_zh: '博客管理员',
    bio_en: 'Blog Administrator',
    avatar_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar&image_size=square'
  }
];

const mockAuthors = [
  {
    id: '1',
    name: '博客管理员',
    bio_zh: '专注于前端开发和技术分享',
    bio_en: 'Focus on frontend development and tech sharing',
    avatar_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar&image_size=square',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// 检查是否为本地开发环境
function isLocalDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production' && !isDokployEnvironment;
}

// PostgreSQL API处理
router.post('/', async (req: Request, res: Response) => {
  try {
    const { action, sql, params, table, data, whereCondition, whereParams } = req.body;
    
    console.log('📡 PostgreSQL API请求:', { action, table });
    
    // 本地开发环境使用模拟数据
    if (isLocalDevelopment()) {
      console.log('🔧 使用模拟数据（本地开发环境）');
      
      switch (action) {
        case 'query':
          // 解析SQL查询以返回适当的模拟数据
          if (sql.includes('blog_posts')) {
            return res.json({ data: mockBlogPosts, error: null });
          } else if (sql.includes('blog_authors')) {
            return res.json({ data: mockAuthors, error: null });
          }
          return res.json({ data: [], error: null });
          
        case 'testConnection':
          return res.json({ 
            success: true, 
            version: 'Mock PostgreSQL 14.0 (Local Development)',
            connectionType: 'mock',
            serverTime: new Date().toISOString()
          });
          
        default:
          return res.json({ data: mockBlogPosts[0], error: null });
      }
    }
    
    // 生产环境使用真实数据库
    const pool = getPool();
    
    switch (action) {
      case 'query':
        const queryResult = await pool.query(sql, params || []);
        return res.json({ data: queryResult.rows, error: null });
        
      case 'insert':
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        
        const insertSql = `
          INSERT INTO ${table} (${columns.join(', ')}) 
          VALUES (${placeholders}) 
          RETURNING *
        `;
        
        const insertResult = await pool.query(insertSql, values);
        return res.json({ data: insertResult.rows[0], error: null });
        
      case 'update':
        const updateColumns = Object.keys(data);
        const updateValues = Object.values(data);
        
        const setClause = updateColumns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        
        const updateSql = `
          UPDATE ${table} 
          SET ${setClause}, updated_at = NOW() 
          WHERE ${whereCondition} 
          RETURNING *
        `;
        
        const allParams = [...updateValues, ...whereParams];
        const updateResult = await pool.query(updateSql, allParams);
        return res.json({ data: updateResult.rows[0], error: null });
        
      case 'delete':
        const deleteSql = `DELETE FROM ${table} WHERE ${whereCondition} RETURNING *`;
        const deleteResult = await pool.query(deleteSql, whereParams);
        return res.json({ data: deleteResult.rows, error: null });
        
      case 'testConnection':
        const testResult = await pool.query('SELECT NOW() as current_time, version() as version');
        const version = testResult.rows[0].version;
        const connectionType = isDokployEnvironment ? 'internal' : 'external';
        
        return res.json({ 
          success: true, 
          version, 
          connectionType,
          serverTime: testResult.rows[0].current_time
        });
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
  } catch (error: any) {
    console.error('❌ PostgreSQL API错误:', error);
    return res.status(500).json({ 
      data: null, 
      error: error.message,
      details: error.stack
    });
  }
});

// 清理连接池
process.on('SIGINT', async () => {
  if (pool) {
    await pool.end();
    console.log('🔌 PostgreSQL连接池已关闭');
  }
});

export default router;