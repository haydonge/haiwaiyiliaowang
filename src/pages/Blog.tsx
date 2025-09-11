import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, Search } from 'lucide-react';
import { getPublishedPosts, searchPosts } from '../services/blogService';
import { BlogPost } from '../lib/supabase';

// BlogPost interface is now imported from supabase types

// Posts will be loaded from Supabase

const categories = [
  { id: 'all', name: 'blog.categories.all' },
  { id: 'medical', name: 'blog.categories.medical' },
  { id: 'success', name: 'blog.categories.success' },
  { id: 'news', name: 'blog.categories.news' },
  { id: 'faq', name: 'blog.categories.faq' },
];

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentLanguage = i18n.language as 'zh' | 'en';

  // Load posts from Supabase
  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);
  
  // Handle search
  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      loadPosts();
    }
  }, [searchTerm]);
  
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublishedPosts(selectedCategory === 'all' ? undefined : selectedCategory, 20);
      setPosts(data);
    } catch (err: any) {
      console.error('Failed to load posts:', {
        message: err?.message || 'Unknown error',
        details: err?.details,
        hint: err?.hint,
        code: err?.code,
        stack: err?.stack,
        fullError: err
      });
      setError(`加载文章失败: ${err?.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchPosts(searchTerm, currentLanguage);
      const filteredData = selectedCategory === 'all' ? data : data.filter(post => post.category === selectedCategory);
      setPosts(filteredData);
    } catch (err: any) {
      console.error('Search failed:', {
        message: err?.message || 'Unknown error',
        details: err?.details,
        hint: err?.hint,
        code: err?.code,
        stack: err?.stack,
        fullError: err
      });
      setError(`搜索失败: ${err?.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const getPostTitle = (post: BlogPost) => {
    return currentLanguage === 'zh' ? post.title_zh : post.title_en;
  };
  
  const getPostExcerpt = (post: BlogPost) => {
    return currentLanguage === 'zh' ? post.excerpt_zh : post.excerpt_en;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? t(category.name) : categoryId;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t('blog.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {t('blog.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="py-8 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-medical leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-medical text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary'
                  }`}
                >
                  {t(category.name)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-500">加载中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <button 
                onClick={loadPosts}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-medical hover:bg-primary-600 transition-colors"
              >
                重试
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">没有找到相关文章</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-medical shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <Link to={`/blog/${post.slug}`}>
                    <img
                      src={post.featured_image || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20healthcare%20blog%20article&image_size=landscape_4_3'}
                      alt={getPostTitle(post)}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                        {getCategoryName(post.category)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.read_time} {t('blog.minutes')}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-foreground mb-3 hover:text-primary transition-colors duration-200">
                      <Link to={`/blog/${post.slug}`}>
                        {getPostTitle(post)}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {getPostExcerpt(post)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.created_at).toLocaleDateString('zh-CN')}
                      </div>
                      
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-primary hover:text-primary-600 font-medium text-sm transition-colors duration-200"
                      >
                        {t('common.readMore')} →
                      </Link>
                    </div>
                    
                    {/* Author */}
                    {post.blog_authors && (
                      <div className="mt-4 flex items-center">
                        <img
                          src={post.blog_authors.avatar_url || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20doctor%20avatar&image_size=square'}
                          alt={post.blog_authors.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-600">{post.blog_authors.name}</span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              订阅我们的医疗资讯
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              获取最新的医疗知识和行业动态
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="输入您的邮箱地址"
                className="flex-1 px-4 py-3 rounded-medical border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              />
              <button className="px-6 py-3 bg-white text-primary rounded-medical font-medium hover:bg-gray-50 transition-colors duration-200">
                订阅
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}