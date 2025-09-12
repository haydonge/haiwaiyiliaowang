// PostgreSQL API路由 - 处理数据库连接和查询
import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();

// 数据库连接配置
const isDokployEnvironment = process.env.NODE_ENV === 'production' && 
  process.env.VERCEL_URL && process.env.VERCEL_URL.includes('traefik.me');

// 根据环境选择数据库连接字符串
function getDatabaseUrl(): string {
  if (isDokployEnvironment) {
    // DOKPLOY环境使用内部连接
    return process.env.DATABASE_URL_INTERNAL || 'postgresql://postgres:79nsrfotjvzdmgwp@donorlib-ecqf39:5432/donorlib';
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

// PostgreSQL API处理
router.post('/', async (req: Request, res: Response) => {
  try {
    const { action, sql, params, table, data, whereCondition, whereParams } = req.body;
    const pool = getPool();
    
    console.log('📡 PostgreSQL API请求:', { action, table });
    
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