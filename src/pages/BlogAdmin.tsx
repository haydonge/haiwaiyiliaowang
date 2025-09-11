import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Save, X, AlertCircle, Users, FileText, LogOut } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { blogService } from '@/services/blogService';
import type { BlogPost, BlogAuthor } from '@/services/blogService';
import AdminLogin from '@/components/AdminLogin';

interface BlogFormData {
  title_zh: string;
  title_en: string;
  content_zh: string;
  content_en: string;
  excerpt_zh: string;
  excerpt_en: string;
  category: string;
  author_id: string;
  featured_image: string;
  read_time: number;
  published: boolean;
}

const BlogAdmin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'authors'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<BlogAuthor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{type: 'post' | 'author', id: string, name: string} | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title_zh: '',
    title_en: '',
    content_zh: '',
    content_en: '',
    excerpt_zh: '',
    excerpt_en: '',
    category: 'medical',
    author_id: '',
    featured_image: '',
    read_time: 5,
    published: true
  });

  const [authorFormData, setAuthorFormData] = useState({
    name: '',
    bio_zh: '',
    bio_en: '',
    avatar_url: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, authorsData] = await Promise.all([
        blogService.getAllPosts(),
        blogService.getAuthors()
      ]);
      setPosts(postsData);
      setAuthors(authorsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title_zh.trim()) newErrors.title_zh = '中文标题不能为空';
    if (!formData.title_en.trim()) newErrors.title_en = '英文标题不能为空';
    if (!formData.excerpt_zh.trim()) newErrors.excerpt_zh = '中文摘要不能为空';
    if (!formData.excerpt_en.trim()) newErrors.excerpt_en = '英文摘要不能为空';
    if (!formData.content_zh.trim()) newErrors.content_zh = '中文内容不能为空';
    if (!formData.content_en.trim()) newErrors.content_en = '英文内容不能为空';
    if (!formData.author_id) newErrors.author_id = '请选择作者';
    if (formData.read_time < 1 || formData.read_time > 60) newErrors.read_time = '阅读时间应在1-60分钟之间';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editingPost) {
        await blogService.updatePost(editingPost.id, formData);
      } else {
        await blogService.createPost(formData);
      }
      await loadData();
      resetForm();
    } catch (error) {
      console.error('保存文章失败:', error);
      setErrors({ submit: '保存失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title_zh: post.title_zh,
      title_en: post.title_en,
      content_zh: post.content_zh,
      content_en: post.content_en,
      excerpt_zh: post.excerpt_zh,
      excerpt_en: post.excerpt_en,
      category: post.category,
      author_id: post.author_id,
      featured_image: post.featured_image || '',
      read_time: post.read_time,
      published: post.published
    });
    setShowForm(true);
  };

  const handleDelete = (type: 'post' | 'author', id: string, name: string) => {
    setDeleteConfirm({ type, id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      if (deleteConfirm.type === 'post') {
        await blogService.deletePost(deleteConfirm.id);
      } else {
        await blogService.deleteAuthor(deleteConfirm.id);
      }
      await loadData();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('删除失败:', error);
      alert(error instanceof Error ? error.message : '删除失败，请重试');
    }
  };

  const resetForm = () => {
    setFormData({
      title_zh: '',
      title_en: '',
      content_zh: '',
      content_en: '',
      excerpt_zh: '',
      excerpt_en: '',
      category: 'medical',
      author_id: '',
      featured_image: '',
      read_time: 5,
      published: true
    });
    setEditingPost(null);
    setShowForm(false);
    setErrors({});
  };

  const resetAuthorForm = () => {
    setAuthorFormData({
      name: '',
      bio_zh: '',
      bio_en: '',
      avatar_url: ''
    });
    setEditingAuthor(null);
    setShowAuthorForm(false);
  };

  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAuthor) {
        await blogService.updateAuthor(editingAuthor.id, authorFormData);
      } else {
        await blogService.createAuthor(authorFormData);
      }
      await loadData();
      resetAuthorForm();
    } catch (error) {
      console.error('保存作者失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleEditAuthor = (author: BlogAuthor) => {
    setEditingAuthor(author);
    setAuthorFormData({
      name: author.name,
      bio_zh: author.bio_zh,
      bio_en: author.bio_en,
      avatar_url: author.avatar_url || ''
    });
    setShowAuthorForm(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const generateFeaturedImage = (category: string) => {
    const prompts = {
      medical: 'modern medical facility healthcare professional consultation',
      success: 'happy family success story celebration joy',
      guide: 'medical guidance consultation healthcare advice'
    };
    const prompt = prompts[category as keyof typeof prompts] || prompts.medical;
    return `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_4_3`;
  };

  // Quill编辑器配置
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block', 'link'
  ];

  // 如果未认证，显示登录页面
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">博客管理系统</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>

      {/* 标签页导航 */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              文章管理
            </button>
            <button
              onClick={() => setActiveTab('authors')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'authors'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              作者管理
            </button>
          </nav>
        </div>
      </div>

      {/* 内容区域 */}
      <>
        {/* 文章管理 */}
        {activeTab === 'posts' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">文章列表</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加文章
            </button>
          </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingPost ? '编辑文章' : '添加新文章'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  {errors.submit}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    中文标题 *
                  </label>
                  <input
                    type="text"
                    value={formData.title_zh}
                    onChange={(e) => {
                      setFormData({ ...formData, title_zh: e.target.value });
                      if (errors.title_zh) setErrors({ ...errors, title_zh: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.title_zh ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.title_zh && (
                    <p className="mt-1 text-sm text-red-600">{errors.title_zh}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => {
                      setFormData({ ...formData, title_en: e.target.value });
                      if (errors.title_en) setErrors({ ...errors, title_en: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.title_en ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.title_en && (
                    <p className="mt-1 text-sm text-red-600">{errors.title_en}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    中文摘要 *
                  </label>
                  <textarea
                    value={formData.excerpt_zh}
                    onChange={(e) => {
                      setFormData({ ...formData, excerpt_zh: e.target.value });
                      if (errors.excerpt_zh) setErrors({ ...errors, excerpt_zh: '' });
                    }}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.excerpt_zh ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.excerpt_zh && (
                    <p className="mt-1 text-sm text-red-600">{errors.excerpt_zh}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt_en}
                    onChange={(e) => {
                      setFormData({ ...formData, excerpt_en: e.target.value });
                      if (errors.excerpt_en) setErrors({ ...errors, excerpt_en: '' });
                    }}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.excerpt_en ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.excerpt_en && (
                    <p className="mt-1 text-sm text-red-600">{errors.excerpt_en}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setFormData({ 
                        ...formData, 
                        category: newCategory,
                        featured_image: generateFeaturedImage(newCategory)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="medical">医疗指南</option>
                    <option value="success">成功案例</option>
                    <option value="guide">实用指南</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    作者 *
                  </label>
                  <select
                    value={formData.author_id}
                    onChange={(e) => {
                      setFormData({ ...formData, author_id: e.target.value });
                      if (errors.author_id) setErrors({ ...errors, author_id: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.author_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">选择作者</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                  {errors.author_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.author_id}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    阅读时间（分钟） *
                  </label>
                  <input
                    type="number"
                    value={formData.read_time}
                    onChange={(e) => {
                      setFormData({ ...formData, read_time: parseInt(e.target.value) || 1 });
                      if (errors.read_time) setErrors({ ...errors, read_time: '' });
                    }}
                    min="1"
                    max="60"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.read_time ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.read_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.read_time}</p>
                  )}
                </div>
              </div>

              {/* 特色图片部分 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  特色图片
                </label>
                <div className="space-y-4">
                  <div>
                    <input
                      type="url"
                      value={formData.featured_image}
                      onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                      placeholder="输入图片URL或使用下方按钮生成"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured_image: generateFeaturedImage('medical') })}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      生成医疗图片
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured_image: generateFeaturedImage('success') })}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      生成成功案例图片
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured_image: generateFeaturedImage('guide') })}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                    >
                      生成指南图片
                    </button>
                  </div>
                  {formData.featured_image && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">图片预览：</p>
                      <img
                        src={formData.featured_image}
                        alt="特色图片预览"
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliKDovb3lpLHotKU8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    中文内容 *
                  </label>
                  <div className={`border rounded-md ${errors.content_zh ? 'border-red-300' : 'border-gray-300'}`}>
                    <ReactQuill
                      theme="snow"
                      value={formData.content_zh}
                      onChange={(value) => {
                        setFormData({ ...formData, content_zh: value });
                        if (errors.content_zh) setErrors({ ...errors, content_zh: '' });
                      }}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="请输入文章内容..."
                      style={{ height: '300px', marginBottom: '42px' }}
                    />
                  </div>
                  {errors.content_zh && (
                    <p className="mt-1 text-sm text-red-600">{errors.content_zh}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Content *
                  </label>
                  <div className={`border rounded-md ${errors.content_en ? 'border-red-300' : 'border-gray-300'}`}>
                    <ReactQuill
                      theme="snow"
                      value={formData.content_en}
                      onChange={(value) => {
                        setFormData({ ...formData, content_en: value });
                        if (errors.content_en) setErrors({ ...errors, content_en: '' });
                      }}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Please enter article content..."
                      style={{ height: '300px', marginBottom: '42px' }}
                    />
                  </div>
                  {errors.content_en && (
                    <p className="mt-1 text-sm text-red-600">{errors.content_en}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="mr-2"
                  />
                  发布文章
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? '保存中...' : (editingPost ? '更新' : '保存')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  分类
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  作者
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">暂无文章</p>
                      <p className="text-sm">点击上方"添加文章"按钮创建第一篇文章</p>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post, index) => (
                  <tr key={post.id} className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {i18n.language === 'zh' ? post.title_zh : post.title_en}
                        </div>
                        <div className="text-sm text-gray-500 truncate mt-1">
                          {i18n.language === 'zh' ? post.excerpt_zh : post.excerpt_en}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        post.category === 'medical' ? 'bg-blue-100 text-blue-800' :
                        post.category === 'success' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {post.category === 'medical' ? '医疗指南' : 
                         post.category === 'success' ? '成功案例' : '实用指南'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {post.blog_authors?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                          title="编辑文章"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('post', post.id, i18n.language === 'zh' ? post.title_zh : post.title_en)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-200"
                          title="删除文章"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}

        {/* 作者管理 */}
        {activeTab === 'authors' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">作者列表</h2>
              <button
                onClick={() => setShowAuthorForm(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加作者
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作者信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      中文简介
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      英文简介
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {authors.map((author) => (
                    <tr key={author.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={author.avatar_url || 'https://via.placeholder.com/40'}
                              alt={author.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{author.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{author.bio_zh}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{author.bio_en}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(author.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditAuthor(author)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('author', author.id, author.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 作者表单模态框 */}
        {showAuthorForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingAuthor ? '编辑作者' : '添加新作者'}
                </h2>
                <button
                  onClick={resetAuthorForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAuthorSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    作者姓名
                  </label>
                  <input
                    type="text"
                    value={authorFormData.name}
                    onChange={(e) => setAuthorFormData({ ...authorFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    中文简介
                  </label>
                  <textarea
                    value={authorFormData.bio_zh}
                    onChange={(e) => setAuthorFormData({ ...authorFormData, bio_zh: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    英文简介
                  </label>
                  <textarea
                    value={authorFormData.bio_en}
                    onChange={(e) => setAuthorFormData({ ...authorFormData, bio_en: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    头像URL
                  </label>
                  <input
                    type="url"
                    value={authorFormData.avatar_url}
                    onChange={(e) => setAuthorFormData({ ...authorFormData, avatar_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {authorFormData.avatar_url && (
                    <div className="mt-2">
                      <img
                        src={authorFormData.avatar_url}
                        alt="头像预览"
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={resetAuthorForm}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingAuthor ? '更新' : '保存'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 删除确认对话框 */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  确认删除
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  您确定要删除{deleteConfirm.type === 'post' ? '文章' : '作者'} "{deleteConfirm.name}" 吗？
                  {deleteConfirm.type === 'post' ? '此操作不可撤销。' : '删除作者前请确保没有文章使用此作者。'}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default BlogAdmin;