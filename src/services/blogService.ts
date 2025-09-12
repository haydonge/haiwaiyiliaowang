// 博客服务 - 基于 https://postapi.kgzivf.com API

import { API_CONFIG, CORS_CONFIG, ENV_INFO } from '../config/api';

// 使用统一的API配置
const { BASE_URL: API_BASE_URL, API_KEY } = API_CONFIG;

// 根据配置决定是否输出日志
if (API_CONFIG.ENABLE_LOGGING) {
  console.log(`🌍 当前环境: ${ENV_INFO.isDevelopment ? '开发环境' : '生产环境'}`);
  console.log(`🔗 API基础URL: ${API_BASE_URL || '相对路径(通过代理)'}`);  
  console.log(`🔧 调试模式: ${API_CONFIG.ENABLE_DEBUG ? '开启' : '关闭'}`);
}

// 博客作者接口定义
export interface BlogAuthor {
  id: number | string;
  name: string;
  bio_zh?: string;
  bio_en?: string;
  avatar_url?: string;
  avatar?: string;
  created_at?: string;
}

// 博客文章接口定义
export interface BlogPost {
  id: number | string;
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
  // 兼容前端组件的额外字段
  title_zh?: string;
  title_en?: string;
  content_zh?: string;
  content_en?: string;
  summary_zh?: string;
  summary_en?: string;
  excerpt_zh?: string;
  excerpt_en?: string;
  featured_image?: string;
  image?: string;
  read_time?: number;
  published?: boolean;
  createdAt?: string;
  author_id?: string;
  blog_authors?: {
    name: string;
    bio_zh?: string;
    bio_en?: string;
    avatar_url?: string;
  };
  author?: {
    name: string;
    bio_zh?: string;
    bio_en?: string;
    avatar_url?: string;
    avatar?: string;
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

// HTTP请求工具函数
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...CORS_CONFIG.headers,
    ...options.headers,
  };

  // 如果是需要认证的请求，添加API Key
  if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
    headers['X-API-Key'] = API_KEY;
  }

  try {
    if (API_CONFIG.ENABLE_LOGGING) {
      console.log(`🌐 API请求: ${options.method || 'GET'} ${url}`);
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
      mode: CORS_CONFIG.mode,
      credentials: CORS_CONFIG.credentials,
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (API_CONFIG.ENABLE_LOGGING) {
        console.error(`❌ HTTP错误 ${response.status}:`, errorText);
      }
      
      // 如果返回的是HTML页面（通常是404或错误页面），提供更友好的错误信息
      if (errorText.includes('<!doctype') || errorText.includes('<html')) {
        throw new Error(`API服务不可用 (HTTP ${response.status})，请检查网络连接或联系管理员`);
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      if (API_CONFIG.ENABLE_LOGGING) {
        console.error('❌ 响应不是JSON格式:', text.substring(0, 200));
      }
      throw new Error('API返回了非JSON格式的响应，可能是服务器错误页面');
    }

    const data = await response.json();
    if (API_CONFIG.ENABLE_LOGGING) {
      console.log(`✅ API响应成功:`, data);
    }
    return data;
  } catch (error) {
    if (API_CONFIG.ENABLE_LOGGING) {
      console.error(`❌ API请求失败 ${url}:`, error);
    }
    
    // 如果是网络错误或CORS错误，提供更具体的错误信息
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('网络连接失败，请检查网络连接或API服务是否可用');
    }
    
    throw error;
  }
};

// 数据转换函数：将API数据转换为前端兼容格式
const transformPost = (apiPost: any): BlogPost => {
  return {
    ...apiPost,
    // 兼容字段映射
    title_zh: apiPost.title_zh || apiPost.title,
    title_en: apiPost.title_en || apiPost.title,
    content_zh: apiPost.content_zh || apiPost.content,
    content_en: apiPost.content_en || apiPost.content,
    summary_zh: apiPost.summary_zh || apiPost.summary,
    summary_en: apiPost.summary_en || apiPost.summary,
    excerpt_zh: apiPost.excerpt_zh || apiPost.summary,
    excerpt_en: apiPost.excerpt_en || apiPost.summary,
    featured_image: apiPost.featured_image,
    image: apiPost.image || apiPost.featured_image || '',
    read_time: apiPost.read_time || 5,
    published: apiPost.status === 'Published',
    createdAt: apiPost.created_at,
    // 如果API没有返回作者信息，提供默认值
    author: apiPost.author ? {
      ...apiPost.author,
      avatar: apiPost.author.avatar_url || apiPost.author.avatar
    } : {
      name: '系统管理员',
      bio_zh: '网站管理员',
      bio_en: 'Site Administrator',
      avatar_url: '',
      avatar: ''
    }
  };
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

    const response = await apiRequest<any>(
      `/api/posts?${queryParams.toString()}`
    );

    // 处理API返回的数据结构 {success: true, data: {posts: [...]}}
    const posts = response.success ? response.data.posts : response.data;
    return posts.map(transformPost);
  } catch (error) {
    console.error('❌ 获取博客文章列表失败:', error);
    throw new Error('无法获取博客文章列表，请检查网络连接或稍后重试');
  }
};

// 根据ID获取单篇博客文章
export const getBlogPostById = async (id: number): Promise<BlogPost | null> => {
  try {
    const response = await apiRequest<any>(`/api/posts/${id}`);
    const post = response.success ? response.data : response;
    return transformPost(post);
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
    const response = await apiRequest<any>(`/api/posts/slug/${slug}`);
    const post = response.success ? response.data : response;
    return transformPost(post);
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    console.error('❌ 获取博客文章详情失败:', error);
    throw new Error('无法获取博客文章详情，请检查网络连接或稍后重试');
  }
};

// 搜索博客文章
export const searchBlogPosts = async (query: string, limit?: number): Promise<BlogPost[]> => {
  return getBlogPosts({ search: query, status: 'Published' });
};

// 获取博客分类列表
export const getBlogCategories = async (): Promise<string[]> => {
  try {
    const posts = await getBlogPosts({ status: 'Published', limit: 1000 });
    const categories = [...new Set(posts.map(post => post.category))];
    return categories.filter(Boolean);
  } catch (error) {
    console.error('❌ 获取博客分类失败:', error);
    return [];
  }
};

// 获取博客标签列表
export const getBlogTags = async (): Promise<string[]> => {
  try {
    const posts = await getBlogPosts({ status: 'Published', limit: 1000 });
    const allTags = posts.flatMap(post => post.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.filter(Boolean);
  } catch (error) {
    console.error('❌ 获取博客标签失败:', error);
    return [];
  }
};

// 创建博客文章（需要API Key）
export const createBlogPost = async (postData: Partial<BlogPost>): Promise<BlogPost> => {
  try {
    const response = await apiRequest<any>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
    const post = response.success ? response.data : response;
    return transformPost(post);
  } catch (error) {
    console.error('❌ 创建博客文章失败:', error);
    throw new Error('创建博客文章失败，请检查权限或稍后重试');
  }
};

// 更新博客文章（需要API Key）
export const updateBlogPost = async (id: number | string, data: Partial<BlogPost>): Promise<BlogPost> => {
  try {
    const response = await apiRequest<any>(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    const post = response.success ? response.data : response;
    return transformPost(post);
  } catch (error) {
    console.error('❌ 更新博客文章失败:', error);
    throw new Error('更新博客文章失败，请检查权限或稍后重试');
  }
};

// 删除博客文章（需要API Key）
export const deleteBlogPost = async (id: number | string): Promise<boolean> => {
  try {
    await apiRequest<any>(`/api/posts/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error('❌ 删除博客文章失败:', error);
    throw new Error('删除博客文章失败，请检查权限或稍后重试');
  }
};

// 检查API健康状态
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await apiRequest<any>('/health');
    return true;
  } catch (error) {
    console.error('❌ API健康检查失败:', error);
    return false;
  }
};

// 作者管理函数（兼容性）
export const getAuthors = async (): Promise<BlogAuthor[]> => {
  try {
    const response = await apiRequest<any[]>('/api/authors');
    return response.map((author, index) => ({
      id: author.id || index + 1,
      name: author.name || 'Unknown Author',
      bio_zh: author.bio_zh || '',
      bio_en: author.bio_en || '',
      avatar_url: author.avatar_url || '',
      avatar: author.avatar || author.avatar_url || '',
      created_at: author.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('❌ 获取作者列表失败:', error);
    return [];
  }
};

export const createAuthor = async (authorData: any) => {
  // 作者信息通常包含在文章中，这里返回空实现
  console.warn('⚠️ 作者创建功能需要通过文章管理实现');
  return null;
};

export const updateAuthor = async (id: number | string, authorData: any) => {
  // 作者信息通常包含在文章中，这里返回空实现
  console.warn('⚠️ 作者更新功能需要通过文章管理实现');
  return null;
};

export const deleteAuthor = async (id: number | string) => {
  // 作者信息通常包含在文章中，这里返回空实现
  console.warn('⚠️ 作者删除功能需要通过文章管理实现');
  return false;
};

// 博客服务对象（兼容现有代码）
export const blogService = {
  getBlogPosts,
  getAllPosts: getBlogPosts, // 别名
  getBlogPost,
  getBlogPostById,
  searchBlogPosts,
  getBlogCategories,
  getBlogTags,
  createBlogPost,
  createPost: createBlogPost, // 别名
  updateBlogPost,
  updatePost: updateBlogPost, // 别名
  deleteBlogPost,
  deletePost: deleteBlogPost, // 别名
  checkApiHealth,
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor
};

// 默认导出
export default blogService;