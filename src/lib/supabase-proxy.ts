// Supabase代理客户端 - 用于Vercel生产环境

import { createClient } from '@supabase/supabase-js';

// 检测是否在Vercel生产环境
const isVercelProduction = typeof window !== 'undefined' && 
  (window.location.hostname.includes('vercel.app') || 
   window.location.hostname.includes('vercel.com'));

// 代理配置
class SupabaseProxy {
  private baseUrl: string;
  private anonKey: string;
  
  constructor() {
    this.baseUrl = '/api/supabase-proxy';
    this.anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  }
  
  // 通用请求方法
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
  
  // 模拟Supabase客户端的from方法
  from(table: string) {
    return {
      select: (columns = '*') => ({
        eq: (column: string, value: any) => 
          this.request(`${table}?select=${columns}&${column}=eq.${value}`),
        
        order: (column: string, options: { ascending?: boolean } = {}) => ({
          limit: (count: number) => 
            this.request(`${table}?select=${columns}&order=${column}.${options.ascending !== false ? 'asc' : 'desc'}&limit=${count}`),
          
          // 直接执行查询
          then: (resolve: (value: any) => void, reject?: (reason: any) => void) => 
            this.request(`${table}?select=${columns}&order=${column}.${options.ascending !== false ? 'asc' : 'desc'}`)
              .then(data => resolve({ data, error: null }))
              .catch(error => reject ? reject(error) : resolve({ data: null, error }))
        }),
        
        limit: (count: number) => ({
          then: (resolve: (value: any) => void, reject?: (reason: any) => void) => 
            this.request(`${table}?select=${columns}&limit=${count}`)
              .then(data => resolve({ data, error: null }))
              .catch(error => reject ? reject(error) : resolve({ data: null, error }))
        }),
        
        // 直接执行查询
        then: (resolve: (value: any) => void, reject?: (reason: any) => void) => 
          this.request(`${table}?select=${columns}`)
            .then(data => resolve({ data, error: null }))
            .catch(error => reject ? reject(error) : resolve({ data: null, error }))
      }),
      
      insert: (data: any) => ({
        select: (columns = '*') => ({
          then: (resolve: (value: any) => void, reject?: (reason: any) => void) => 
            this.request(table, {
              method: 'POST',
              body: JSON.stringify(data),
              headers: { 'Prefer': 'return=representation' }
            })
              .then(result => resolve({ data: result, error: null }))
              .catch(error => reject ? reject(error) : resolve({ data: null, error }))
        }),
        
        then: (resolve: (value: any) => void, reject?: (reason: any) => void) => 
          this.request(table, {
            method: 'POST',
            body: JSON.stringify(data)
          })
            .then(result => resolve({ data: result, error: null }))
            .catch(error => reject ? reject(error) : resolve({ data: null, error }))
      }),
      
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns = '*') => ({
            then: (resolve: (value: any) => void, reject?: (reason: any) => void) => 
              this.request(`${table}?${column}=eq.${value}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: { 'Prefer': 'return=representation' }
              })
                .then(result => resolve({ data: result, error: null }))
                .catch(error => reject ? reject(error) : resolve({ data: null, error }))
          }),
          
          then: (resolve: (value: any) => void, reject?: (reason: any) => void) => 
            this.request(`${table}?${column}=eq.${value}`, {
              method: 'PATCH',
              body: JSON.stringify(data)
            })
              .then(result => resolve({ data: result, error: null }))
              .catch(error => reject ? reject(error) : resolve({ data: null, error }))
        })
      }),
      
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: (resolve: (value: any) => void, reject?: (reason: any) => void) => 
            this.request(`${table}?${column}=eq.${value}`, {
              method: 'DELETE'
            })
              .then(result => resolve({ data: result, error: null }))
              .catch(error => reject ? reject(error) : resolve({ data: null, error }))
        })
      })
    };
  }
}

// 创建Supabase客户端
function createSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // 在Vercel生产环境使用代理
  if (isVercelProduction) {
    console.log('🔄 使用Supabase代理客户端（Vercel生产环境）');
    return new SupabaseProxy() as any;
  }
  
  // 本地开发环境使用直接连接
  console.log('🔗 使用Supabase直接连接（本地开发环境）');
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();
export default supabase;