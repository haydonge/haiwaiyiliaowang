import { postgresql, type BlogPost, type BlogAuthor } from '../lib/postgresql'

// 重新导出类型定义
export type { BlogPost, BlogAuthor }

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

// getPublishedPosts函数已被getAllPosts和getPostsByCategory替代

// 获取所有文章（包括未发布的，用于管理）
export async function getAllPosts(limit = 20): Promise<BlogPost[]> {
  try {
    console.log('📚 获取所有博客文章...');
    
    const { data, error } = await postgresql
      .from('blog_posts')
      .select(`
        blog_posts.*,
        blog_authors.name,
        blog_authors.bio_zh,
        blog_authors.bio_en,
        blog_authors.avatar_url
      `)
      .leftJoin('blog_authors', 'blog_posts.author_id = blog_authors.id')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit)
      .execute();

    if (error) {
      console.error('Error fetching posts:', error)
      throw error
    }

    // 转换数据格式以匹配原有接口
    const posts = (data || []).map((row: any) => ({
      id: row.id,
      title_zh: row.title_zh,
      title_en: row.title_en,
      content_zh: row.content_zh,
      content_en: row.content_en,
      excerpt_zh: row.excerpt_zh,
      excerpt_en: row.excerpt_en,
      slug: row.slug,
      category: row.category,
      featured_image: row.featured_image,
      read_time: row.read_time,
      published: row.published,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author_id: row.author_id,
      blog_authors: row.name ? {
        name: row.name,
        bio_zh: row.bio_zh,
        bio_en: row.bio_en,
        avatar_url: row.avatar_url
      } : undefined
    }));

    console.log(`✅ 成功获取 ${posts.length} 篇文章`);
    return posts;
  } catch (error) {
    console.error('Failed to load posts:', error)
    throw error
  }
}

// 获取所有作者
export async function getAuthors(): Promise<BlogAuthor[]> {
  try {
    console.log('👥 获取所有作者...');
    
    const { data, error } = await postgresql
      .from('blog_authors')
      .select('*')
      .order('created_at', { ascending: false })
      .execute();

    if (error) {
      console.error('Error fetching authors:', error)
      throw error
    }

    console.log(`✅ 成功获取 ${data?.length || 0} 位作者`);
    return (data || []) as BlogAuthor[]
  } catch (error) {
    console.error('Failed to get authors:', error)
    throw error
  }
}

// 创建新文章
export async function createPost(postData: BlogFormData): Promise<BlogPost> {
  try {
    console.log('📝 创建新文章:', postData.title_zh);
    
    // 生成slug
    const slug = generateSlug(postData.title_zh)
    
    // 检查slug是否已存在
    const existingPost = await getPostBySlug(slug)
    if (existingPost) {
      throw new Error(`文章slug "${slug}" 已存在，请修改标题`)
    }

    const { data, error } = await postgresql.insert('blog_posts', {
      title_zh: postData.title_zh,
      title_en: postData.title_en,
      content_zh: postData.content_zh,
      content_en: postData.content_en,
      excerpt_zh: postData.excerpt_zh,
      excerpt_en: postData.excerpt_en,
      slug,
      category: postData.category,
      featured_image: postData.featured_image,
      read_time: postData.read_time,
      published: postData.published,
      author_id: postData.author_id
    });

    if (error) {
      console.error('Error creating post:', error)
      throw error
    }

    console.log('✅ 文章创建成功:', data.title_zh);
    return data as BlogPost
  } catch (error) {
    console.error('Failed to create post:', error)
    throw error
  }
}

// 更新文章
export async function updatePost(id: string, postData: Partial<BlogFormData>): Promise<BlogPost> {
  try {
    console.log('📝 更新文章:', id);
    
    const { data, error } = await postgresql.update('blog_posts', postData, 'id = $1', [id]);

    if (error) {
      console.error('Error updating post:', error)
      throw error
    }

    console.log('✅ 文章更新成功:', data.title_zh);
    return data as BlogPost
  } catch (error) {
    console.error('Failed to update post:', error)
    throw error
  }
}

// 删除文章
export async function deletePost(id: string): Promise<{ success: boolean }> {
  try {
    console.log('🗑️ 删除文章:', id);
    
    const { error } = await postgresql.delete('blog_posts', 'id = $1', [id]);

    if (error) {
      console.error('Error deleting post:', error)
      throw error
    }

    console.log('✅ 文章删除成功');
    return { success: true }
  } catch (error) {
    console.error('Failed to delete post:', error)
    throw error
  }
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
export async function createAuthor(authorData: Omit<BlogAuthor, 'id' | 'created_at' | 'updated_at'>): Promise<BlogAuthor> {
  try {
    console.log('👤 创建新作者:', authorData.name);
    
    const { data, error } = await postgresql.insert('blog_authors', authorData);

    if (error) {
      console.error('Error creating author:', error)
      throw error
    }

    console.log('✅ 作者创建成功:', data.name);
    return data as BlogAuthor
  } catch (error) {
    console.error('Failed to create author:', error)
    throw error
  }
}

// 更新作者
export async function updateAuthor(id: string, authorData: Partial<Omit<BlogAuthor, 'id' | 'created_at' | 'updated_at'>>): Promise<BlogAuthor> {
  try {
    console.log('👤 更新作者:', id);
    
    const { data, error } = await postgresql.update('blog_authors', authorData, 'id = $1', [id]);

    if (error) {
      console.error('Error updating author:', error)
      throw error
    }

    console.log('✅ 作者更新成功:', data.name);
    return data as BlogAuthor
  } catch (error) {
    console.error('Failed to update author:', error)
    throw error
  }
}

// 删除作者
export async function deleteAuthor(id: string): Promise<{ success: boolean }> {
  try {
    console.log('🗑️ 删除作者:', id);
    
    const { error } = await postgresql.delete('blog_authors', 'id = $1', [id]);

    if (error) {
      console.error('Error deleting author:', error)
      throw error
    }

    console.log('✅ 作者删除成功');
    return { success: true }
  } catch (error) {
    console.error('Failed to delete author:', error)
    throw error
  }
}

// 根据分类获取文章
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    console.log('📂 根据分类获取文章:', category);
    
    const { data, error } = await postgresql
      .from('blog_posts')
      .select(`
        blog_posts.*,
        blog_authors.name,
        blog_authors.bio_zh,
        blog_authors.bio_en,
        blog_authors.avatar_url
      `)
      .leftJoin('blog_authors', 'blog_posts.author_id = blog_authors.id')
      .eq('category', category)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .execute();

    if (error) {
      console.error('Error fetching posts by category:', error)
      throw error
    }

    // 转换数据格式
    const posts = (data || []).map((row: any) => ({
      id: row.id,
      title_zh: row.title_zh,
      title_en: row.title_en,
      content_zh: row.content_zh,
      content_en: row.content_en,
      excerpt_zh: row.excerpt_zh,
      excerpt_en: row.excerpt_en,
      slug: row.slug,
      category: row.category,
      featured_image: row.featured_image,
      read_time: row.read_time,
      published: row.published,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author_id: row.author_id,
      blog_authors: row.name ? {
        name: row.name,
        bio_zh: row.bio_zh,
        bio_en: row.bio_en,
        avatar_url: row.avatar_url
      } : undefined
    }));

    console.log(`✅ 成功获取分类 ${category} 的 ${posts.length} 篇文章`);
    return posts;
  } catch (error) {
    console.error('Failed to get posts by category:', error)
    throw error
  }
}

// 导出blogService对象以保持向后兼容
export const blogService = {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  searchPosts,
  createPost,
  updatePost,
  deletePost,
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor
}

// 根据slug获取单篇文章
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    console.log('🔍 根据slug获取文章:', slug);
    
    const { data, error } = await postgresql
      .from('blog_posts')
      .select(`
        blog_posts.*,
        blog_authors.name,
        blog_authors.bio_zh,
        blog_authors.bio_en,
        blog_authors.avatar_url
      `)
      .leftJoin('blog_authors', 'blog_posts.author_id = blog_authors.id')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }

    if (!data) {
      console.log('📄 文章不存在:', slug);
      return null
    }

    // 转换数据格式
    const post: BlogPost = {
      id: data.id,
      title_zh: data.title_zh,
      title_en: data.title_en,
      content_zh: data.content_zh,
      content_en: data.content_en,
      excerpt_zh: data.excerpt_zh,
      excerpt_en: data.excerpt_en,
      slug: data.slug,
      category: data.category,
      featured_image: data.featured_image,
      read_time: data.read_time,
      published: data.published,
      created_at: data.created_at,
      updated_at: data.updated_at,
      author_id: data.author_id,
      blog_authors: data.name ? {
        name: data.name,
        bio_zh: data.bio_zh,
        bio_en: data.bio_en,
        avatar_url: data.avatar_url
      } : undefined
    };

    console.log('✅ 成功获取文章:', post.title_zh);
    return post;
  } catch (error) {
    console.error('Failed to get post by slug:', error)
    return null
  }
}

// 搜索文章
export async function searchPosts(searchTerm: string, language: 'zh' | 'en' = 'zh'): Promise<BlogPost[]> {
  try {
    console.log('🔍 搜索文章:', searchTerm, '语言:', language);
    
    const titleColumn = language === 'zh' ? 'title_zh' : 'title_en'
    const excerptColumn = language === 'zh' ? 'excerpt_zh' : 'excerpt_en'
    
    // 使用PostgreSQL的ILIKE进行模糊搜索
    const searchQuery = `
      SELECT 
        blog_posts.*,
        blog_authors.name,
        blog_authors.bio_zh,
        blog_authors.bio_en,
        blog_authors.avatar_url
      FROM blog_posts
      LEFT JOIN blog_authors ON blog_posts.author_id = blog_authors.id
      WHERE blog_posts.published = true
        AND (blog_posts.${titleColumn} ILIKE $1 OR blog_posts.${excerptColumn} ILIKE $1)
      ORDER BY blog_posts.created_at DESC
    `;
    
    const { data, error } = await postgresql.query(searchQuery, [`%${searchTerm}%`]);

    if (error) {
      console.error('Error searching posts:', error)
      throw error
    }

    // 转换数据格式
    const posts = (data || []).map((row: any) => ({
      id: row.id,
      title_zh: row.title_zh,
      title_en: row.title_en,
      content_zh: row.content_zh,
      content_en: row.content_en,
      excerpt_zh: row.excerpt_zh,
      excerpt_en: row.excerpt_en,
      slug: row.slug,
      category: row.category,
      featured_image: row.featured_image,
      read_time: row.read_time,
      published: row.published,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author_id: row.author_id,
      blog_authors: row.name ? {
        name: row.name,
        bio_zh: row.bio_zh,
        bio_en: row.bio_en,
        avatar_url: row.avatar_url
      } : undefined
    }));

    console.log(`✅ 搜索到 ${posts.length} 篇文章`);
    return posts;
  } catch (error) {
    console.error('Failed to search posts:', error)
    throw error
  }
}