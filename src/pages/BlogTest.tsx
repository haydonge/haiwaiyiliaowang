import React, { useState, useEffect } from 'react';
import { getAllPosts, getPostBySlug, searchPosts, getPostsByCategory } from '../services/blogService';
import { BlogPost } from '../lib/postgresql';

export default function BlogTest() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [singlePost, setSinglePost] = useState<BlogPost | null>(null);
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testGetPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      addLog('开始测试获取文章列表...');
      
      const data = await getAllPosts(10);
      setPosts(data);
      addLog(`✅ 成功获取 ${data.length} 篇文章`);
      
      if (data.length > 0) {
        addLog(`示例文章: ${data[0].title_zh || data[0].title_en}`);
      }
    } catch (err: any) {
      const errorMsg = `❌ 获取文章列表失败: ${err.message}`;
      setError(errorMsg);
      addLog(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const testGetSinglePost = async () => {
    if (posts.length === 0) {
      addLog('⚠️ 请先获取文章列表');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const slug = posts[0].slug;
      addLog(`开始测试获取单篇文章: ${slug}`);
      
      const data = await getPostBySlug(slug);
      setSinglePost(data);
      
      if (data) {
        addLog(`✅ 成功获取文章: ${data.title_zh || data.title_en}`);
      } else {
        addLog('❌ 未找到文章');
      }
    } catch (err: any) {
      const errorMsg = `❌ 获取单篇文章失败: ${err.message}`;
      setError(errorMsg);
      addLog(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const testSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const searchTerm = '医疗';
      addLog(`开始测试搜索功能: "${searchTerm}"`);
      
      const data = await searchPosts(searchTerm, 'zh');
      setSearchResults(data);
      addLog(`✅ 搜索完成，找到 ${data.length} 篇文章`);
    } catch (err: any) {
      const errorMsg = `❌ 搜索失败: ${err.message}`;
      setError(errorMsg);
      addLog(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const testCategoryFilter = async () => {
    try {
      setLoading(true);
      setError(null);
      const category = 'medical';
      addLog(`开始测试分类筛选: "${category}"`);
      
      const data = await getPostsByCategory(category);
      addLog(`✅ 分类筛选完成，找到 ${data.length} 篇文章`);
    } catch (err: any) {
      const errorMsg = `❌ 分类筛选失败: ${err.message}`;
      setError(errorMsg);
      addLog(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setError(null);
  };

  useEffect(() => {
    addLog('博客测试页面已加载');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">博客功能测试</h1>
        
        {/* 测试按钮 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试操作</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testGetPosts}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试获取文章列表'}
            </button>
            <button
              onClick={testGetSinglePost}
              disabled={loading || posts.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              测试获取单篇文章
            </button>
            <button
              onClick={testSearch}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              测试搜索功能
            </button>
            <button
              onClick={testCategoryFilter}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              测试分类筛选
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              清除日志
            </button>
          </div>
        </div>

        {/* 错误显示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 日志面板 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">测试日志</h2>
            <div className="bg-gray-100 rounded p-4 h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">暂无日志</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-sm mb-1 font-mono">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 结果面板 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">测试结果</h2>
            
            {/* 文章列表 */}
            {posts.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">文章列表 ({posts.length} 篇)</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="text-sm p-2 bg-gray-50 rounded">
                      <div className="font-medium">{post.title_zh || post.title_en}</div>
                      <div className="text-gray-500">分类: {post.category} | 阅读时间: {post.read_time}分钟</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 单篇文章 */}
            {singlePost && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">单篇文章详情</h3>
                <div className="text-sm p-2 bg-gray-50 rounded">
                  <div className="font-medium">{singlePost.title_zh || singlePost.title_en}</div>
                  <div className="text-gray-500">作者: {singlePost.blog_authors?.name || '未知'}</div>
                  <div className="text-gray-500">分类: {singlePost.category}</div>
                  <div className="text-gray-500">Slug: {singlePost.slug}</div>
                </div>
              </div>
            )}

            {/* 搜索结果 */}
            {searchResults.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">搜索结果 ({searchResults.length} 篇)</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {searchResults.slice(0, 3).map((post) => (
                    <div key={post.id} className="text-sm p-2 bg-gray-50 rounded">
                      <div className="font-medium">{post.title_zh || post.title_en}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}