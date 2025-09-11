// DOKPLOY环境专用代理客户端 - 解决HTTPS混合内容问题

// DOKPLOY代理客户端类
class DokploySupabaseProxy {
  private supabaseUrl: string;
  private anonKey: string;
  
  constructor(supabaseUrl: string, anonKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.anonKey = anonKey;
  }
  
  private async request(path: string, options: RequestInit = {}) {
    // DOKPLOY环境混合内容解决方案
    // 1. 首先尝试使用内置代理（如果可用）
    // 2. 如果代理不可用，尝试HTTPS直连
    // 3. 最后回退到HTTP（仅在开发环境）
    
    const isHttpsPage = typeof window !== 'undefined' && window.location.protocol === 'https:';
    
    // 方案1: 尝试使用前端代理
    if (isHttpsPage) {
      try {
        console.log('🔄 尝试使用前端代理解决混合内容问题');
        const proxyUrl = `/api/supabase-proxy?path=${encodeURIComponent(path)}`;
        
        const response = await fetch(proxyUrl, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
        
        if (response.ok) {
          console.log('✅ 前端代理请求成功');
          return response.json();
        } else {
          console.log('⚠️ 前端代理不可用，尝试其他方案');
        }
      } catch (error) {
        console.log('⚠️ 前端代理失败，尝试直连:', error.message);
      }
    }
    
    // 方案2: 尝试HTTPS直连
    if (isHttpsPage) {
      try {
        const httpsUrl = `${this.supabaseUrl.replace('http://', 'https://')}/rest/v1/${path}`;
        console.log('🔒 尝试HTTPS直连:', httpsUrl);
        
        const response = await fetch(httpsUrl, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.anonKey,
            'Authorization': `Bearer ${this.anonKey}`,
            ...options.headers,
          },
        });
        
        if (response.ok) {
          console.log('✅ HTTPS直连成功');
          return response.json();
        } else {
          console.log('⚠️ HTTPS直连失败，状态码:', response.status);
        }
      } catch (error) {
        console.log('⚠️ HTTPS直连异常:', error.message);
      }
    }
    
    // 方案3: HTTP直连（仅在非HTTPS页面或开发环境）
    const httpUrl = `${this.supabaseUrl}/rest/v1/${path}`;
    console.log('🌐 使用HTTP直连:', httpUrl);
    
    const response = await fetch(httpUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.anonKey,
        'Authorization': `Bearer ${this.anonKey}`,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: '请检查Supabase服务状态和网络连接'
      }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
  from(table: string) {
    return new DokployQueryBuilder(table, this.request.bind(this));
  }
}

// DOKPLOY查询构建器类
class DokployQueryBuilder {
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

export { DokploySupabaseProxy };