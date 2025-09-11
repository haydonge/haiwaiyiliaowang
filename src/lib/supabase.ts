import { createClient } from '@supabase/supabase-js'

// 检测运行环境
const isVercelProduction = typeof window !== 'undefined' && 
  (window.location.hostname.includes('vercel.app') || 
   window.location.hostname.includes('vercel.com'));

// 检测是否在DOKPLOY环境（通过域名特征识别）
const isDokployEnvironment = typeof window !== 'undefined' && 
  window.location.hostname.includes('traefik.me');

// 检测是否为本地开发环境
const isLocalDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname.startsWith('192.168.'));

console.log('🌍 环境检测:', {
  isVercelProduction,
  isDokployEnvironment,
  isLocalDevelopment,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server-side'
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 代理客户端类
class SupabaseProxy {
  private baseUrl = '/api/supabase-proxy';
  
  private async request(path: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}?path=${encodeURIComponent(path)}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
  from(table: string) {
    return new SupabaseQueryBuilder(table, this.request.bind(this));
  }
}

// 查询构建器类
class SupabaseQueryBuilder {
  private table: string;
  private request: (path: string, options?: RequestInit) => Promise<any>;
  private selectColumns = '*';
  private filters: string[] = [];
  private orderBy: string[] = [];
  private limitCount?: number;
  private singleResult = false;
  
  constructor(table: string, request: (path: string, options?: RequestInit) => Promise<any>) {
    this.table = table;
    this.request = request;
  }
  
  select(columns = '*') {
    this.selectColumns = columns;
    return this;
  }
  
  eq(column: string, value: any) {
    this.filters.push(`${column}=eq.${value}`);
    return this;
  }
  
  or(conditions: string) {
    this.filters.push(`or=(${conditions})`);
    return this;
  }
  
  order(column: string, options: { ascending?: boolean } = {}) {
    const direction = options.ascending !== false ? 'asc' : 'desc';
    this.orderBy.push(`${column}.${direction}`);
    return this;
  }
  
  limit(count: number) {
    this.limitCount = count;
    return this;
  }
  
  single() {
    this.singleResult = true;
    return this;
  }
  
  private buildQuery() {
    const params = new URLSearchParams();
    params.set('select', this.selectColumns);
    
    this.filters.forEach(filter => {
      const [key, value] = filter.split('=', 2);
      params.set(key, value);
    });
    
    if (this.orderBy.length > 0) {
      params.set('order', this.orderBy.join(','));
    }
    
    if (this.limitCount) {
      params.set('limit', this.limitCount.toString());
    }
    
    return `${this.table}?${params.toString()}`;
  }
  
  async then(resolve: (result: any) => void, reject?: (error: any) => void) {
    try {
      const query = this.buildQuery();
      const data = await this.request(query);
      
      if (this.singleResult) {
        const result = Array.isArray(data) ? data[0] || null : data;
        resolve({ data: result, error: null });
      } else {
        resolve({ data: data || [], error: null });
      }
    } catch (error) {
      const result = { data: null, error };
      if (reject) {
        reject(result);
      } else {
        resolve(result);
      }
    }
  }
  
  // 插入数据
  insert(data: any) {
    return {
      select: (columns = '*') => {
        return this.request(this.table, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Prefer': 'return=representation' }
        })
        .then(result => ({ data: result, error: null }))
        .catch(error => ({ data: null, error }));
      },
      
      single: () => {
        return this.request(this.table, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Prefer': 'return=representation' }
        })
        .then(result => ({ data: Array.isArray(result) ? result[0] : result, error: null }))
        .catch(error => ({ data: null, error }));
      }
    };
  }
  
  // 更新数据
  update(data: any) {
    return {
      eq: (column: string, value: any) => ({
        select: (columns = '*') => {
          const query = `${this.table}?${column}=eq.${value}`;
          return this.request(query, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Prefer': 'return=representation' }
          })
          .then(result => ({ data: result, error: null }))
          .catch(error => ({ data: null, error }));
        },
        
        single: () => {
          const query = `${this.table}?${column}=eq.${value}`;
          return this.request(query, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Prefer': 'return=representation' }
          })
          .then(result => ({ data: Array.isArray(result) ? result[0] : result, error: null }))
          .catch(error => ({ data: null, error }));
        }
      })
    };
  }
  
  // 删除数据
  delete() {
    return {
      eq: (column: string, value: any) => {
        const query = `${this.table}?${column}=eq.${value}`;
        return this.request(query, {
          method: 'DELETE'
        })
        .then(result => ({ data: result, error: null }))
        .catch(error => ({ data: null, error }));
      }
    };
  }
}

// 创建客户端
function createSupabaseClient() {
  // 只有在Vercel生产环境才使用代理
  if (isVercelProduction) {
    console.log('🔄 使用Supabase代理客户端（Vercel生产环境）');
    return new SupabaseProxy() as any;
  }
  
  // DOKPLOY环境和本地开发环境都使用直接连接
  if (isDokployEnvironment) {
    console.log('🐳 使用Supabase直接连接（DOKPLOY环境）');
    console.log('📍 Supabase URL:', supabaseUrl);
  } else {
    console.log('🔗 使用Supabase直接连接（本地开发环境）');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();

// 数据库类型定义
export interface BlogPost {
  id: string
  title_zh: string
  title_en: string
  content_zh: string
  content_en: string
  excerpt_zh?: string
  excerpt_en?: string
  slug: string
  category: string
  featured_image?: string
  read_time: number
  published: boolean
  created_at: string
  updated_at: string
  author_id?: string
  blog_authors?: {
    name: string
    bio_zh?: string
    bio_en?: string
    avatar_url?: string
  }
}