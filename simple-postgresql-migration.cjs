// 简化的PostgreSQL数据库迁移
const { Client } = require('pg');

// PostgreSQL连接配置
const EXTERNAL_CONNECTION = 'postgresql://postgres:79nsrfotjvzdmgwp@107.173.35.13:2346/donorlib';

async function runSimpleMigration() {
  console.log('🚀 开始PostgreSQL数据库迁移...');
  
  const client = new Client({
    connectionString: EXTERNAL_CONNECTION,
    ssl: false
  });
  
  try {
    await client.connect();
    console.log('✅ 数据库连接成功！');
    
    // 1. 启用UUID扩展
    console.log('\n1️⃣ 启用UUID扩展...');
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      console.log('✅ UUID扩展已启用');
    } catch (error) {
      console.log('⚠️  UUID扩展可能已存在:', error.message);
    }
    
    // 2. 创建blog_authors表
    console.log('\n2️⃣ 创建blog_authors表...');
    const createAuthorsTable = `
      CREATE TABLE IF NOT EXISTS blog_authors (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        bio_zh TEXT,
        bio_en TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    
    await client.query(createAuthorsTable);
    console.log('✅ blog_authors表创建成功');
    
    // 3. 创建blog_posts表
    console.log('\n3️⃣ 创建blog_posts表...');
    const createPostsTable = `
      CREATE TABLE IF NOT EXISTS blog_posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title_zh VARCHAR(500) NOT NULL,
        title_en VARCHAR(500) NOT NULL,
        content_zh TEXT NOT NULL,
        content_en TEXT NOT NULL,
        excerpt_zh TEXT,
        excerpt_en TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        featured_image TEXT,
        read_time INTEGER DEFAULT 5,
        published BOOLEAN DEFAULT false,
        author_id UUID REFERENCES blog_authors(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    
    await client.query(createPostsTable);
    console.log('✅ blog_posts表创建成功');
    
    // 4. 创建索引
    console.log('\n4️⃣ 创建索引...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published)',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category)',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id)'
    ];
    
    for (const indexSQL of indexes) {
      await client.query(indexSQL);
    }
    console.log('✅ 索引创建成功');
    
    // 5. 插入示例作者数据
    console.log('\n5️⃣ 插入示例作者数据...');
    const authors = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: '李医生',
        bio_zh: '资深生殖医学专家，拥有15年临床经验',
        bio_en: 'Senior reproductive medicine expert with 15 years of clinical experience',
        avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: '王教授',
        bio_zh: '国际知名的辅助生殖技术专家',
        bio_en: 'Internationally renowned expert in assisted reproductive technology',
        avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: '张主任',
        bio_zh: '妇产科主任医师，专注于不孕不育治疗',
        bio_en: 'Chief physician of obstetrics and gynecology, specializing in infertility treatment',
        avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'
      }
    ];
    
    for (const author of authors) {
      const insertAuthorSQL = `
        INSERT INTO blog_authors (id, name, bio_zh, bio_en, avatar_url, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          bio_zh = EXCLUDED.bio_zh,
          bio_en = EXCLUDED.bio_en,
          avatar_url = EXCLUDED.avatar_url,
          updated_at = EXCLUDED.updated_at
      `;
      
      await client.query(insertAuthorSQL, [
        author.id,
        author.name,
        author.bio_zh,
        author.bio_en,
        author.avatar_url
      ]);
    }
    
    console.log(`✅ 插入了 ${authors.length} 位作者`);
    
    // 6. 插入示例文章数据
    console.log('\n6️⃣ 插入示例文章数据...');
    const posts = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        title_zh: '试管婴儿技术的最新发展',
        title_en: 'Latest Developments in IVF Technology',
        content_zh: '试管婴儿技术（IVF）作为辅助生殖技术的重要组成部分，近年来取得了显著的进展。本文将详细介绍最新的技术发展，包括胚胎筛查技术、冷冻技术的改进以及个性化治疗方案的制定。',
        content_en: 'In vitro fertilization (IVF) technology, as an important component of assisted reproductive technology, has made significant progress in recent years.',
        excerpt_zh: '了解试管婴儿技术的最新发展，包括胚胎筛查、冷冻技术和个性化治疗方案。',
        excerpt_en: 'Learn about the latest developments in IVF technology, including embryo screening, freezing technology, and personalized treatment plans.',
        slug: 'latest-ivf-technology-developments',
        category: '技术进展',
        featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
        read_time: 8,
        published: true,
        author_id: '550e8400-e29b-41d4-a716-446655440001'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        title_zh: '海外医疗：选择合适的生殖中心',
        title_en: 'Overseas Medical Care: Choosing the Right Fertility Center',
        content_zh: '选择合适的海外生殖中心是成功治疗的关键。本文将为您提供详细的选择指南，帮助您做出明智的决定。',
        content_en: 'Choosing the right overseas fertility center is key to successful treatment.',
        excerpt_zh: '如何选择合适的海外生殖中心？本文提供详细的评估标准和选择指南。',
        excerpt_en: 'How to choose the right overseas fertility center? This article provides detailed evaluation criteria and selection guidelines.',
        slug: 'choosing-fertility-center-overseas',
        category: '医疗指南',
        featured_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
        read_time: 10,
        published: true,
        author_id: '550e8400-e29b-41d4-a716-446655440002'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        title_zh: '不孕不育的常见原因及预防',
        title_en: 'Common Causes of Infertility and Prevention',
        content_zh: '不孕不育问题日益受到关注，了解其常见原因和预防方法对于维护生殖健康至关重要。',
        content_en: 'Infertility issues are receiving increasing attention. Understanding common causes and prevention methods is crucial for maintaining reproductive health.',
        excerpt_zh: '了解不孕不育的常见原因，学习有效的预防方法，维护生殖健康。',
        excerpt_en: 'Understand common causes of infertility, learn effective prevention methods, and maintain reproductive health.',
        slug: 'infertility-causes-prevention',
        category: '健康科普',
        featured_image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
        read_time: 12,
        published: true,
        author_id: '550e8400-e29b-41d4-a716-446655440003'
      }
    ];
    
    for (const post of posts) {
      const insertPostSQL = `
        INSERT INTO blog_posts (id, title_zh, title_en, content_zh, content_en, excerpt_zh, excerpt_en, slug, category, featured_image, read_time, published, author_id, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          title_zh = EXCLUDED.title_zh,
          title_en = EXCLUDED.title_en,
          content_zh = EXCLUDED.content_zh,
          content_en = EXCLUDED.content_en,
          excerpt_zh = EXCLUDED.excerpt_zh,
          excerpt_en = EXCLUDED.excerpt_en,
          slug = EXCLUDED.slug,
          category = EXCLUDED.category,
          featured_image = EXCLUDED.featured_image,
          read_time = EXCLUDED.read_time,
          published = EXCLUDED.published,
          author_id = EXCLUDED.author_id,
          updated_at = EXCLUDED.updated_at
      `;
      
      await client.query(insertPostSQL, [
        post.id,
        post.title_zh,
        post.title_en,
        post.content_zh,
        post.content_en,
        post.excerpt_zh,
        post.excerpt_en,
        post.slug,
        post.category,
        post.featured_image,
        post.read_time,
        post.published,
        post.author_id
      ]);
    }
    
    console.log(`✅ 插入了 ${posts.length} 篇文章`);
    
    // 7. 验证数据
    console.log('\n7️⃣ 验证数据...');
    const authorsCount = await client.query('SELECT COUNT(*) as count FROM blog_authors');
    const postsCount = await client.query('SELECT COUNT(*) as count FROM blog_posts');
    const publishedCount = await client.query('SELECT COUNT(*) as count FROM blog_posts WHERE published = true');
    
    console.log('📊 数据统计:');
    console.log(`  - 作者数量: ${authorsCount.rows[0].count}`);
    console.log(`  - 文章总数: ${postsCount.rows[0].count}`);
    console.log(`  - 已发布文章: ${publishedCount.rows[0].count}`);
    
    // 显示示例数据
    console.log('\n📝 示例文章:');
    const samplePosts = await client.query(`
      SELECT p.title_zh, p.category, a.name as author_name, p.created_at
      FROM blog_posts p
      LEFT JOIN blog_authors a ON p.author_id = a.id
      WHERE p.published = true
      ORDER BY p.created_at DESC
      LIMIT 3
    `);
    
    samplePosts.rows.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.title_zh}`);
      console.log(`     作者: ${post.author_name || '未知'}`);
      console.log(`     分类: ${post.category}`);
      console.log(`     时间: ${new Date(post.created_at).toLocaleString()}`);
      console.log('');
    });
    
    console.log('🎉 PostgreSQL数据库迁移成功完成！');
    return true;
    
  } catch (error) {
    console.error('💥 迁移失败:', error.message);
    console.error('详细错误信息:', error);
    return false;
    
  } finally {
    try {
      await client.end();
      console.log('🔌 数据库连接已关闭');
    } catch (e) {
      // 忽略关闭连接时的错误
    }
  }
}

// 运行迁移
runSimpleMigration()
  .then(success => {
    if (success) {
      console.log('\n💡 下一步:');
      console.log('  1. 更新项目配置使用PostgreSQL');
      console.log('  2. 修改前端代码适配新数据库');
      console.log('  3. 测试博客功能');
      process.exit(0);
    } else {
      console.log('\n❌ 迁移失败，请检查错误信息');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 迁移过程中发生未处理的错误:', error);
    process.exit(1);
  });