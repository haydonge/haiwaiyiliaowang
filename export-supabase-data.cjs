// 从Supabase导出数据到PostgreSQL
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase配置
const SUPABASE_URL = 'http://databackup-supabase-434385-107-173-35-13.traefik.me';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTA5MTc3NTUsImV4cCI6MTg5MzQ1NjAwMCwiaXNzIjoiZG9rcGxveSJ9.FEAR6GhERxdZKmfgJq9Fy6aveRxq2oz4cUmvcfJHY44';

async function exportSupabaseData() {
  console.log('🚀 开始从Supabase导出数据...');
  
  try {
    // 创建Supabase客户端
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    console.log('\n1️⃣ 导出blog_authors表数据...');
    
    // 导出blog_authors表
    const { data: authors, error: authorsError } = await supabase
      .from('blog_authors')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (authorsError) {
      console.error('❌ 导出blog_authors失败:', authorsError.message);
      return false;
    }
    
    console.log(`✅ 成功导出 ${authors?.length || 0} 位作者`);
    
    console.log('\n2️⃣ 导出blog_posts表数据...');
    
    // 导出blog_posts表
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (postsError) {
      console.error('❌ 导出blog_posts失败:', postsError.message);
      return false;
    }
    
    console.log(`✅ 成功导出 ${posts?.length || 0} 篇文章`);
    
    console.log('\n3️⃣ 生成PostgreSQL插入脚本...');
    
    // 生成PostgreSQL插入脚本
    let sqlScript = `-- PostgreSQL数据迁移脚本\n-- 从Supabase导出的数据\n-- 生成时间: ${new Date().toISOString()}\n\n`;
    
    // 创建表结构
    sqlScript += `-- 创建blog_authors表\nCREATE TABLE IF NOT EXISTS blog_authors (\n`;
    sqlScript += `  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
    sqlScript += `  name VARCHAR(255) NOT NULL,\n`;
    sqlScript += `  bio_zh TEXT,\n`;
    sqlScript += `  bio_en TEXT,\n`;
    sqlScript += `  avatar_url TEXT,\n`;
    sqlScript += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n`;
    sqlScript += `  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n`;
    sqlScript += `);\n\n`;
    
    sqlScript += `-- 创建blog_posts表\nCREATE TABLE IF NOT EXISTS blog_posts (\n`;
    sqlScript += `  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
    sqlScript += `  title_zh VARCHAR(500) NOT NULL,\n`;
    sqlScript += `  title_en VARCHAR(500) NOT NULL,\n`;
    sqlScript += `  content_zh TEXT NOT NULL,\n`;
    sqlScript += `  content_en TEXT NOT NULL,\n`;
    sqlScript += `  excerpt_zh TEXT,\n`;
    sqlScript += `  excerpt_en TEXT,\n`;
    sqlScript += `  slug VARCHAR(255) UNIQUE NOT NULL,\n`;
    sqlScript += `  category VARCHAR(100) NOT NULL,\n`;
    sqlScript += `  featured_image TEXT,\n`;
    sqlScript += `  read_time INTEGER DEFAULT 5,\n`;
    sqlScript += `  published BOOLEAN DEFAULT false,\n`;
    sqlScript += `  author_id UUID REFERENCES blog_authors(id),\n`;
    sqlScript += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n`;
    sqlScript += `  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n`;
    sqlScript += `);\n\n`;
    
    // 创建索引
    sqlScript += `-- 创建索引\n`;
    sqlScript += `CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);\n`;
    sqlScript += `CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);\n`;
    sqlScript += `CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);\n`;
    sqlScript += `CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);\n\n`;
    
    // 插入authors数据
    if (authors && authors.length > 0) {
      sqlScript += `-- 插入blog_authors数据\n`;
      for (const author of authors) {
        const name = author.name?.replace(/'/g, "''") || '';
        const bioZh = author.bio_zh?.replace(/'/g, "''") || null;
        const bioEn = author.bio_en?.replace(/'/g, "''") || null;
        const avatarUrl = author.avatar_url || null;
        const createdAt = author.created_at || new Date().toISOString();
        const updatedAt = author.updated_at || new Date().toISOString();
        
        sqlScript += `INSERT INTO blog_authors (id, name, bio_zh, bio_en, avatar_url, created_at, updated_at) VALUES\n`;
        sqlScript += `  ('${author.id}', '${name}', ${bioZh ? `'${bioZh}'` : 'NULL'}, ${bioEn ? `'${bioEn}'` : 'NULL'}, ${avatarUrl ? `'${avatarUrl}'` : 'NULL'}, '${createdAt}', '${updatedAt}')\n`;
        sqlScript += `ON CONFLICT (id) DO UPDATE SET\n`;
        sqlScript += `  name = EXCLUDED.name,\n`;
        sqlScript += `  bio_zh = EXCLUDED.bio_zh,\n`;
        sqlScript += `  bio_en = EXCLUDED.bio_en,\n`;
        sqlScript += `  avatar_url = EXCLUDED.avatar_url,\n`;
        sqlScript += `  updated_at = EXCLUDED.updated_at;\n\n`;
      }
    }
    
    // 插入posts数据
    if (posts && posts.length > 0) {
      sqlScript += `-- 插入blog_posts数据\n`;
      for (const post of posts) {
        const titleZh = post.title_zh?.replace(/'/g, "''") || '';
        const titleEn = post.title_en?.replace(/'/g, "''") || '';
        const contentZh = post.content_zh?.replace(/'/g, "''") || '';
        const contentEn = post.content_en?.replace(/'/g, "''") || '';
        const excerptZh = post.excerpt_zh?.replace(/'/g, "''") || null;
        const excerptEn = post.excerpt_en?.replace(/'/g, "''") || null;
        const slug = post.slug?.replace(/'/g, "''") || '';
        const category = post.category?.replace(/'/g, "''") || '';
        const featuredImage = post.featured_image || null;
        const readTime = post.read_time || 5;
        const published = post.published || false;
        const authorId = post.author_id || null;
        const createdAt = post.created_at || new Date().toISOString();
        const updatedAt = post.updated_at || new Date().toISOString();
        
        sqlScript += `INSERT INTO blog_posts (id, title_zh, title_en, content_zh, content_en, excerpt_zh, excerpt_en, slug, category, featured_image, read_time, published, author_id, created_at, updated_at) VALUES\n`;
        sqlScript += `  ('${post.id}', '${titleZh}', '${titleEn}', '${contentZh}', '${contentEn}', ${excerptZh ? `'${excerptZh}'` : 'NULL'}, ${excerptEn ? `'${excerptEn}'` : 'NULL'}, '${slug}', '${category}', ${featuredImage ? `'${featuredImage}'` : 'NULL'}, ${readTime}, ${published}, ${authorId ? `'${authorId}'` : 'NULL'}, '${createdAt}', '${updatedAt}')\n`;
        sqlScript += `ON CONFLICT (id) DO UPDATE SET\n`;
        sqlScript += `  title_zh = EXCLUDED.title_zh,\n`;
        sqlScript += `  title_en = EXCLUDED.title_en,\n`;
        sqlScript += `  content_zh = EXCLUDED.content_zh,\n`;
        sqlScript += `  content_en = EXCLUDED.content_en,\n`;
        sqlScript += `  excerpt_zh = EXCLUDED.excerpt_zh,\n`;
        sqlScript += `  excerpt_en = EXCLUDED.excerpt_en,\n`;
        sqlScript += `  slug = EXCLUDED.slug,\n`;
        sqlScript += `  category = EXCLUDED.category,\n`;
        sqlScript += `  featured_image = EXCLUDED.featured_image,\n`;
        sqlScript += `  read_time = EXCLUDED.read_time,\n`;
        sqlScript += `  published = EXCLUDED.published,\n`;
        sqlScript += `  author_id = EXCLUDED.author_id,\n`;
        sqlScript += `  updated_at = EXCLUDED.updated_at;\n\n`;
      }
    }
    
    // 保存SQL脚本
    const sqlFilePath = path.join(__dirname, 'postgresql-migration.sql');
    fs.writeFileSync(sqlFilePath, sqlScript, 'utf8');
    
    console.log(`✅ PostgreSQL迁移脚本已生成: ${sqlFilePath}`);
    
    // 保存JSON数据备份
    const dataBackup = {
      authors: authors || [],
      posts: posts || [],
      exportTime: new Date().toISOString(),
      totalAuthors: authors?.length || 0,
      totalPosts: posts?.length || 0
    };
    
    const jsonFilePath = path.join(__dirname, 'supabase-data-backup.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(dataBackup, null, 2), 'utf8');
    
    console.log(`✅ 数据备份已保存: ${jsonFilePath}`);
    
    console.log('\n🎉 数据导出完成！');
    console.log('\n📋 导出统计:');
    console.log(`  - 作者数量: ${authors?.length || 0}`);
    console.log(`  - 文章数量: ${posts?.length || 0}`);
    console.log(`  - SQL脚本: postgresql-migration.sql`);
    console.log(`  - JSON备份: supabase-data-backup.json`);
    
    return true;
    
  } catch (error) {
    console.error('💥 导出过程中发生错误:', error.message);
    console.error('详细错误信息:', error);
    return false;
  }
}

// 运行导出
exportSupabaseData().catch(console.error);