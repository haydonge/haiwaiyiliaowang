import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Tag, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { getBlogPost, type BlogPost } from '../services/blogService';
import Empty from '../components/Empty';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载文章数据
  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError('文章标识符缺失');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const postData = await getBlogPost(slug);
        
        if (!postData) {
          setError('文章不存在或已被删除');
        } else {
          setPost(postData);
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
        setError(err instanceof Error ? err.message : '加载文章失败');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 计算阅读时间
  const calculateReadTime = (content: string | undefined) => {
    if (!content) return 1; // 默认1分钟
    const wordsPerMinute = 200;
    const wordCount = content.length;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
  };

  // 分享功能
  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享取消或失败');
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载文章中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Empty 
              title="文章不存在"
              description={error || '抱歉，您访问的文章不存在或已被删除。'}
            />
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                返回上页
              </button>
              <Link
                to="/blog"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                浏览所有文章
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按钮 */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
        </div>

        {/* 文章内容 */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 文章头图 */}
          {post.featured_image && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* 文章分类 */}
            {post.category && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  <Tag className="w-4 h-4 mr-1" />
                  {post.category}
                </span>
              </div>
            )}

            {/* 文章标题 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* 文章摘要 */}
            {post.summary && (
              <div className="bg-gray-50 border-l-4 border-indigo-500 p-4 mb-8">
                <p className="text-lg text-gray-700 italic">
                  {post.summary}
                </p>
              </div>
            )}

            {/* 文章元信息 */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              
              {post.author && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span>{post.author.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{post.read_time || calculateReadTime(post.summary || post.content)} 分钟阅读</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors ml-auto"
              >
                <Share2 className="w-5 h-5" />
                分享
              </button>
            </div>

            {/* 文章内容 */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                style={{
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}
              >
                {/* 简单的内容渲染，将换行符转换为段落 */}
                {(post.content || post.summary || '暂无内容').split('\n\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-6">
                      {paragraph.trim()}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* 文章标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 作者信息 */}
            {post.author && (post.author.bio_zh || post.author.bio_en) && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-start gap-4">
                  {post.author.avatar_url && (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      关于作者：{post.author.name}
                    </h3>
                    <p className="text-gray-600">
                      {post.author.bio_zh || post.author.bio_en}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* 底部导航 */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/blog"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            浏览更多文章
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;