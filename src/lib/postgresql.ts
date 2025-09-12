// PostgreSQL数据库连接和查询服务 - 通过API代理

// API调用辅助函数
async function apiCall(body: any): Promise<any> {
  try {
    console.log('📡 发送API请求:', body.action);
    
    const response = await fetch('/api/postgresql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('📡 API响应:', result);
    
    return result;
  } catch (error) {
    console.error('❌ API调用失败:', error);
    throw error;
  }
}

// 数据库查询接口
export interface BlogAuthor {
  id: string;
  name: string;
  bio_zh?: string;
  bio_en?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title_zh: string;
  title_en: string;
  content_zh: string;
  content_en: string;
  excerpt_zh?: string;
  excerpt_en?: string;
  slug: string;
  category: string;
  featured_image?: string;
  read_time: number;
  published: boolean;
  author_id?: string;
  created_at: string;
  updated_at: string;
  blog_authors?: {
    name: string;
    bio_zh?: string;
    bio_en?: string;
    avatar_url?: string;
  };
}

// PostgreSQL查询构建器
export class PostgreSQLQueryBuilder {
  private tableName: string;
  private selectColumns: string = '*';
  private whereConditions: string[] = [];
  private orderByClause: string = '';
  private limitCount?: number;
  private joinClauses: string[] = [];
  private params: any[] = [];
  private paramIndex: number = 1;
  
  constructor(tableName: string) {
    this.tableName = tableName;
  }
  
  select(columns: string = '*'): this {
    this.selectColumns = columns;
    return this;
  }
  
  eq(column: string, value: any): this {
    this.whereConditions.push(`${column} = $${this.paramIndex}`);
    this.params.push(value);
    this.paramIndex++;
    return this;
  }
  
  or(conditions: string): this {
    // 简化的OR条件处理
    this.whereConditions.push(`(${conditions})`);
    return this;
  }
  
  order(column: string, options: { ascending?: boolean } = {}): this {
    const direction = options.ascending !== false ? 'ASC' : 'DESC';
    this.orderByClause = `ORDER BY ${column} ${direction}`;
    return this;
  }
  
  limit(count: number): this {
    this.limitCount = count;
    return this;
  }
  
  // 添加JOIN支持
  leftJoin(table: string, condition: string): this {
    this.joinClauses.push(`LEFT JOIN ${table} ON ${condition}`);
    return this;
  }
  
  private buildQuery(): { sql: string; params: any[] } {
    let sql = `SELECT ${this.selectColumns} FROM ${this.tableName}`;
    
    // 添加JOIN子句
    if (this.joinClauses.length > 0) {
      sql += ' ' + this.joinClauses.join(' ');
    }
    
    // 添加WHERE子句
    if (this.whereConditions.length > 0) {
      sql += ' WHERE ' + this.whereConditions.join(' AND ');
    }
    
    // 添加ORDER BY子句
    if (this.orderByClause) {
      sql += ' ' + this.orderByClause;
    }
    
    // 添加LIMIT子句
    if (this.limitCount) {
      sql += ` LIMIT ${this.limitCount}`;
    }
    
    return { sql, params: this.params };
  }
  
  async execute(): Promise<{ data: any[] | null; error: any }> {
    try {
      const { sql, params } = this.buildQuery();
      return await apiCall({
        action: 'query',
        sql,
        params
      });
    } catch (error) {
      console.error('❌ 查询失败:', error);
      return { data: null, error };
    }
  }
  
  // 兼容Supabase的then方法
  async then(resolve: (result: any) => void, reject?: (error: any) => void) {
    try {
      const result = await this.execute();
      resolve(result);
    } catch (error) {
      if (reject) {
        reject({ data: null, error });
      } else {
        resolve({ data: null, error });
      }
    }
  }
  
  // 获取单条记录
  async single(): Promise<{ data: any | null; error: any }> {
    try {
      const { sql, params } = this.buildQuery();
      const result = await apiCall({
        action: 'query',
        sql: sql + ' LIMIT 1',
        params
      });
      
      return { 
        data: result.data && result.data.length > 0 ? result.data[0] : null, 
        error: result.error 
      };
      
    } catch (error) {
      console.error('❌ 单条查询失败:', error);
      return { data: null, error };
    }
  }
}

// PostgreSQL客户端类
export class PostgreSQLClient {
  from(tableName: string): PostgreSQLQueryBuilder {
    return new PostgreSQLQueryBuilder(tableName);
  }
  
  // 插入数据
  async insert(tableName: string, data: any): Promise<{ data: any | null; error: any }> {
    try {
      return await apiCall({
        action: 'insert',
        table: tableName,
        data
      });
    } catch (error) {
      console.error('❌ 插入失败:', error);
      return { data: null, error };
    }
  }
  
  // 更新数据
  async update(tableName: string, data: any, whereCondition: string, whereParams: any[]): Promise<{ data: any | null; error: any }> {
    try {
      return await apiCall({
        action: 'update',
        table: tableName,
        data,
        whereCondition,
        whereParams
      });
    } catch (error) {
      console.error('❌ 更新失败:', error);
      return { data: null, error };
    }
  }
  
  // 删除数据
  async delete(tableName: string, whereCondition: string, whereParams: any[]): Promise<{ data: any | null; error: any }> {
    try {
      return await apiCall({
        action: 'delete',
        table: tableName,
        whereCondition,
        whereParams
      });
    } catch (error) {
      console.error('❌ 删除失败:', error);
      return { data: null, error };
    }
  }
  
  // 执行原始SQL查询
  async query(sql: string, params: any[] = []): Promise<{ data: any[] | null; error: any }> {
    try {
      return await apiCall({
        action: 'query',
        sql,
        params
      });
    } catch (error) {
      console.error('❌ 原始查询失败:', error);
      return { data: null, error };
    }
  }
  
  // 测试数据库连接
  async testConnection(): Promise<{ success: boolean; error?: string; version?: string; connectionType?: string }> {
    try {
      const result = await apiCall({
        action: 'testConnection'
      });
      
      return result;
    } catch (error: any) {
      console.error('❌ PostgreSQL连接测试失败:', error);
      return { success: false, error: error.message };
    }
  }
}

// 创建全局PostgreSQL客户端实例
export const postgresql = new PostgreSQLClient();