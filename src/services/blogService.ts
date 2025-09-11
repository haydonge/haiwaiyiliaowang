import { supabase } from '../lib/supabase'

export interface BlogPost {
  id: string
  title_zh: string
  title_en: string
  content_zh: string
  content_en: string
  excerpt_zh: string
  excerpt_en: string
  slug: string
  category: string
  featured_image?: string
  read_time: number
  published: boolean
  created_at: string
  updated_at: string
  author_id: string
  blog_authors?: {
    name: string
    bio_zh?: string
    bio_en?: string
    avatar_url?: string
  }
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio_zh: string;
  bio_en: string;
  avatar_url?: string;
  created_at: string;
}

export interface BlogFormData {
  title_zh: string;
  title_en: string;
  content_zh: string;
  content_en: string;
  excerpt_zh: string;
  excerpt_en: string;
  category: string;
  author_id: string;
  featured_image?: string;
  read_time: number;
  published: boolean;
}

// 获取已发布的文章列表
export async function getPublishedPosts(category?: string, limit = 10) {
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      blog_authors(name, bio_zh, bio_en, avatar_url)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching posts:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error
    })
    throw error
  }
  
  return data as BlogPost[]
}

// 获取所有文章（包括未发布的，用于管理）
export async function getAllPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_authors(name, bio_zh, bio_en, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all posts:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error
    })
    throw error
  }

  return data as BlogPost[]
}

// 获取所有作者
export async function getAuthors() {
  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching authors:', error)
    throw error
  }

  return data as BlogAuthor[]
}

// 创建新文章
export async function createPost(postData: BlogFormData) {
  // 生成slug
  const slug = generateSlug(postData.title_en || postData.title_zh)
  
  // 生成特色图片URL（如果没有提供）
  const featured_image = postData.featured_image || generateFeaturedImage(postData.category)

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...postData,
      slug,
      featured_image
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', error)
    throw error
  }

  return data
}

// 更新文章
export async function updatePost(id: string, postData: Partial<BlogFormData>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    throw error
  }

  return data
}

// 删除文章
export async function deletePost(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    throw error
  }

  return data
}

// 生成slug的辅助函数
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50) // 限制长度
}

// 生成特色图片URL的辅助函数
function generateFeaturedImage(category: string): string {
  const prompts = {
    medical: 'modern medical facility healthcare professional consultation',
    success: 'happy family success story celebration joy',
    guide: 'medical guidance consultation healthcare advice'
  }
  const prompt = prompts[category as keyof typeof prompts] || prompts.medical
  return `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_4_3`
}

// 创建新作者
export async function createAuthor(authorData: Omit<BlogAuthor, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('blog_authors')
    .insert(authorData)
    .select()
    .single()

  if (error) {
    console.error('Error creating author:', error)
    throw error
  }

  return data
}

// 更新作者
export async function updateAuthor(id: string, authorData: Partial<Omit<BlogAuthor, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('blog_authors')
    .update(authorData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating author:', error)
    throw error
  }

  return data
}

// 删除作者
export async function deleteAuthor(id: string) {
  // 首先检查是否有文章使用此作者
  const { data: posts, error: checkError } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('author_id', id)
    .limit(1)

  if (checkError) {
    console.error('Error checking author usage:', checkError)
    throw checkError
  }

  if (posts && posts.length > 0) {
    throw new Error('无法删除作者：仍有文章使用此作者')
  }

  const { data, error } = await supabase
    .from('blog_authors')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting author:', error)
    throw error
  }

  return data
}

// 导出blogService对象以保持向后兼容
export const blogService = {
  getPublishedPosts,
  getPostBySlug,
  searchPosts,
  getAllPosts,
  getAuthors,
  createPost,
  updatePost,
  deletePost,
  createAuthor,
  updateAuthor,
  deleteAuthor
}

// 根据slug获取文章
export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_authors(name, bio_zh, bio_en, avatar_url)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data as BlogPost
}

// 搜索文章
export async function searchPosts(searchTerm: string, language: 'zh' | 'en' = 'zh') {
  const titleColumn = language === 'zh' ? 'title_zh' : 'title_en'
  const excerptColumn = language === 'zh' ? 'excerpt_zh' : 'excerpt_en'
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_authors(name, bio_zh, bio_en, avatar_url)
    `)
    .eq('published', true)
    .or(`${titleColumn}.ilike.%${searchTerm}%,${excerptColumn}.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching posts:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error
    })
    throw error
  }

  return data as BlogPost[]
}