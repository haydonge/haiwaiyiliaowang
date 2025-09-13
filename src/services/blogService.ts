// 博客服务 - 直接调用API，不使用代理

// API配置
// 开发环境使用vite代理，生产环境使用nginx代理（避免CORS和API服务器问题）
const API_BASE_URL = 'https://postapi.kgzivf.com';
// 从环境变量获取API密钥，如果没有则使用空字符串（公开API不需要密钥）
const API_KEY = import.meta.env.VITE_API_KEY || '';

// 博客文章接口定义
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  status: 'Published' | 'Draft' | 'Archived';
  type: 'Post';
  created_at: string;
  updated_at: string;
  featured_image?: string;
  read_time?: number;
  author?: {
    name: string;
    bio_zh?: string;
    bio_en?: string;
    avatar_url?: string;
  };
}

// API查询参数接口
export interface PostsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string;
  status?: 'Published' | 'Draft' | 'Archived';
  search?: string;
}

// API响应接口
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// HTTP请求工具函数
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // 如果是需要认证的请求，添加API Key
  if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
    headers['X-API-Key'] = API_KEY;
  }

  try {
    console.log(`🌐 API请求: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP错误 ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ 响应不是JSON格式:', text.substring(0, 200));
      throw new Error('API返回了非JSON格式的响应');
    }

    const data = await response.json();
    console.log(`✅ API响应成功:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API请求失败 ${url}:`, error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('网络连接失败，请检查网络连接或API服务是否可用');
    }
    
    throw error;
  }
};

// 获取博客文章列表
export const getBlogPosts = async (params: PostsQueryParams = {}): Promise<BlogPost[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    // 设置默认参数
    queryParams.append('status', params.status || 'Published');
    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('limit', (params.limit || 20).toString());
    
    // 添加可选参数
    if (params.category) queryParams.append('category', params.category);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.search) queryParams.append('search', params.search);

    const response = await apiRequest<ApiResponse<{ posts: BlogPost[] }>>(
      `/api/posts?${queryParams.toString()}`
    );

    return response.success ? response.data.posts : [];
  } catch (error) {
    console.error('❌ 获取博客文章列表失败:', error);
    throw new Error('无法获取博客文章列表，请检查网络连接或稍后重试');
  }
};

// 根据ID获取单篇博客文章
export const getBlogPostById = async (id: number): Promise<BlogPost | null> => {
  try {
    const response = await apiRequest<ApiResponse<BlogPost>>(`/api/posts/${id}`);
    return response.success ? response.data : null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    console.error('❌ 获取博客文章详情失败:', error);
    throw new Error('获取博客文章详情失败');
  }
};

// 根据slug获取单篇博客文章
export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await apiRequest<ApiResponse<BlogPost>>(`/api/posts/slug/${slug}`);
    return response.success ? response.data : null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    console.error('❌ 获取博客文章详情失败:', error);
    throw new Error('无法获取博客文章详情，请检查网络连接或稍后重试');
  }
};

// 搜索博客文章
export const searchBlogPosts = async (query: string, limit = 10): Promise<BlogPost[]> => {
  return getBlogPosts({ search: query, limit });
};

// 获取博客分类列表
export const getBlogCategories = async (): Promise<string[]> => {
  try {
    const posts = await getBlogPosts({ limit: 100 });
    const categories = [...new Set(posts.map(post => post.category))].filter(Boolean);
    return categories;
  } catch (error) {
    console.error('❌ 获取博客分类失败:', error);
    return [];
  }
};

// 获取博客标签列表
export const getBlogTags = async (): Promise<string[]> => {
  try {
    const posts = await getBlogPosts({ limit: 100 });
    const allTags = posts.flatMap(post => post.tags || []);
    const uniqueTags = [...new Set(allTags)].filter(Boolean);
    return uniqueTags;
  } catch (error) {
    console.error('❌ 获取博客标签失败:', error);
    return [];
  }
};