// 执行PostgreSQL数据库迁移
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL连接配置
const EXTERNAL_CONNECTION = 'postgresql://postgres:79nsrfotjvzdmgwp@107.173.35.13:2346/donorlib';
const INTERNAL_CONNECTION = 'postgresql://postgres:79nsrfotjvzdmgwp@donorlib-ecqf39:5432/donorlib';

async function runMigration() {
  console.log('🚀 开始PostgreSQL数据库迁移...');
  console.log('=' .repeat(60));
  
  // 读取迁移脚本
  const migrationPath = path.join(__dirname, 'postgresql-migration.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ 迁移脚本不存在:', migrationPath);
    return false;
  }
  
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  console.log('✅ 迁移脚本已读取');
  
  // 尝试连接数据库（优先使用外部连接）
  let connectionString = EXTERNAL_CONNECTION;
  let connectionType = '外部';
  
  const client = new Client({
    connectionString: connectionString,
    ssl: false
  });
  
  try {
    console.log(`\n🔗 连接到PostgreSQL数据库 (${connectionType})...`);
    await client.connect();
    console.log('✅ 数据库连接成功！');
    
    // 执行迁移脚本
    console.log('\n📝 执行迁移脚本...');
    
    // 分割SQL语句并逐个执行
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📊 共 ${statements.length} 条SQL语句需要执行`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // 跳过注释和空语句
        if (statement.startsWith('--') || statement.trim() === '') {
          continue;
        }
        
        console.log(`\n执行语句 ${i + 1}/${statements.length}...`);
        
        const result = await client.query(statement);
        
        // 如果是SELECT语句，显示结果
        if (statement.toUpperCase().trim().startsWith('SELECT')) {
          if (result.rows && result.rows.length > 0) {
            console.log('查询结果:');
            result.rows.forEach(row => {
              console.log('  ', row);
            });
          }
        } else {
          console.log(`✅ 执行成功 (影响行数: ${result.rowCount || 0})`);
        }
        
        successCount++;
        
      } catch (error) {
        console.error(`❌ 执行失败:`, error.message);
        
        // 某些错误可以忽略（如表已存在、扩展已安装等）
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist') ||
            error.message.includes('duplicate key')) {
          console.log('⚠️  忽略此错误，继续执行...');
          successCount++;
        } else {
          errorCount++;
          console.log('❌ 严重错误，停止执行');
          break;
        }
      }
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎯 迁移执行结果:');
    console.log(`  成功: ${successCount} 条语句`);
    console.log(`  失败: ${errorCount} 条语句`);
    
    if (errorCount === 0) {
      console.log('\n🎉 数据库迁移完成！');
      
      // 验证迁移结果
      console.log('\n🔍 验证迁移结果...');
      
      try {
        // 检查表是否创建成功
        const tablesResult = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('blog_authors', 'blog_posts')
          ORDER BY table_name
        `);
        
        console.log(`✅ 创建的表: ${tablesResult.rows.map(r => r.table_name).join(', ')}`);
        
        // 检查数据是否插入成功
        const authorsCount = await client.query('SELECT COUNT(*) as count FROM blog_authors');
        const postsCount = await client.query('SELECT COUNT(*) as count FROM blog_posts');
        const publishedCount = await client.query('SELECT COUNT(*) as count FROM blog_posts WHERE published = true');
        
        console.log(`📊 数据统计:`);
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
        
        return true;
        
      } catch (verifyError) {
        console.error('❌ 验证迁移结果时出错:', verifyError.message);
        return false;
      }
      
    } else {
      console.log('\n❌ 迁移过程中出现错误，请检查日志');
      return false;
    }
    
  } catch (error) {
    console.error('💥 数据库连接或迁移失败:', error.message);
    console.error('详细错误信息:', error);
    return false;
    
  } finally {
    try {
      await client.end();
      console.log('\n🔌 数据库连接已关闭');
    } catch (e) {
      // 忽略关闭连接时的错误
    }
  }
}

// 运行迁移
runMigration()
  .then(success => {
    if (success) {
      console.log('\n🎉 PostgreSQL数据库迁移成功完成！');
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