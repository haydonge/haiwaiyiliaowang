import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Heart } from 'lucide-react';
import { getPostBySlug } from '../services/blogService';
import { BlogPost as BlogPostType } from '../lib/postgresql';

// BlogPost interface is now imported from supabase types

// Post data will be loaded from Supabase

// Related posts will be loaded from Supabase

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentLanguage = i18n.language as 'zh' | 'en';
  
  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);
  
  const loadPost = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPostBySlug(slug);
      setPost(data);
    } catch (err) {
      console.error('Failed to load post:', err);
      setError('加载文章失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  const getPostTitle = (post: BlogPostType) => {
    return currentLanguage === 'zh' ? post.title_zh : post.title_en;
  };
  
  const getPostContent = (post: BlogPostType) => {
    return currentLanguage === 'zh' ? post.content_zh : post.content_en;
  };
  
  const getPostExcerpt = (post: BlogPostType) => {
    return currentLanguage === 'zh' ? post.excerpt_zh : post.excerpt_en;
  };
  
  const getAuthorBio = (author: any) => {
    return currentLanguage === 'zh' ? author.bio_zh : author.bio_en;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => id && loadPost(id)}
            className="px-4 py-2 bg-primary text-white rounded-medical hover:bg-primary-600 transition-colors mr-4"
          >
            重试
          </button>
          <Link to="/blog" className="text-primary hover:text-primary-600">
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
          <Link to="/blog" className="text-primary hover:text-primary-600">
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={post.featured_image || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20healthcare%20blog%20article&image_size=landscape_4_3'}
          alt={getPostTitle(post)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-white bg-opacity-90 rounded-medical text-foreground hover:bg-opacity-100 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('blog.backToList')}
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary">
                  {post.category}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.read_time} {t('blog.minutes')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.created_at).toLocaleDateString('zh-CN')}
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                {getPostTitle(post)}
              </h1>
              
              {/* Author Info */}
              {post.blog_authors && (
                <div className="flex items-center mb-6">
                  <img
                    src={post.blog_authors.avatar_url || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20doctor%20avatar&image_size=square'}
                    alt={post.blog_authors.name}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-medium text-foreground">{post.blog_authors.name}</div>
                    <div className="text-sm text-gray-500">{getAuthorBio(post.blog_authors)}</div>
                  </div>
                </div>
              )}
              
              {/* Social Share */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary rounded-medical hover:bg-primary-100 transition-colors duration-200">
                  <Share2 className="h-4 w-4" />
                  分享
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-medical hover:bg-red-100 transition-colors duration-200">
                  <Heart className="h-4 w-4" />
                  收藏
                </button>
              </div>
            </header>
            
            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: getPostContent(post) }}
              style={{
                '--tw-prose-body': '#374151',
                '--tw-prose-headings': '#1f2937',
                '--tw-prose-links': '#2563eb',
                '--tw-prose-bold': '#1f2937',
                '--tw-prose-counters': '#6b7280',
                '--tw-prose-bullets': '#d1d5db',
                '--tw-prose-hr': '#e5e7eb',
                '--tw-prose-quotes': '#1f2937',
                '--tw-prose-quote-borders': '#e5e7eb',
                '--tw-prose-captions': '#6b7280',
                '--tw-prose-code': '#1f2937',
                '--tw-prose-pre-code': '#e5e7eb',
                '--tw-prose-pre-bg': '#1f2937',
                '--tw-prose-th-borders': '#d1d5db',
                '--tw-prose-td-borders': '#e5e7eb',
              } as React.CSSProperties}
            />
            
            {/* Category */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                  <Tag className="h-3 w-3 mr-1" />
                  {post.category}
                </span>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Related Posts */}
              <div className="bg-muted rounded-medical p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  相关文章
                </h3>
                <div className="text-sm text-gray-500">
                  相关文章功能正在开发中...
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="bg-primary rounded-medical p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">
                  订阅我们的资讯
                </h3>
                <p className="text-primary-100 text-sm mb-4">
                  获取最新的医疗知识和行业动态
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="输入邮箱地址"
                    className="w-full px-3 py-2 rounded-md text-gray-900 text-sm"
                  />
                  <button className="w-full bg-white text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                    订阅
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}