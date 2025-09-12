-- PostgreSQL数据库迁移脚本
-- 海外医疗辅助生殖网站博客系统
-- 生成时间: 2025-01-16

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建blog_authors表
CREATE TABLE IF NOT EXISTS blog_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  bio_zh TEXT,
  bio_en TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建blog_posts表
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
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);

-- 插入示例作者数据
INSERT INTO blog_authors (id, name, bio_zh, bio_en, avatar_url, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '李医生', '资深生殖医学专家，拥有15年临床经验', 'Senior reproductive medicine expert with 15 years of clinical experience', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', '王教授', '国际知名的辅助生殖技术专家', 'Internationally renowned expert in assisted reproductive technology', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '张主任', '妇产科主任医师，专注于不孕不育治疗', 'Chief physician of obstetrics and gynecology, specializing in infertility treatment', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bio_zh = EXCLUDED.bio_zh,
  bio_en = EXCLUDED.bio_en,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = EXCLUDED.updated_at;

-- 插入示例博客文章数据
INSERT INTO blog_posts (id, title_zh, title_en, content_zh, content_en, excerpt_zh, excerpt_en, slug, category, featured_image, read_time, published, author_id, created_at, updated_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 
   '试管婴儿技术的最新发展', 
   'Latest Developments in IVF Technology',
   '试管婴儿技术（IVF）作为辅助生殖技术的重要组成部分，近年来取得了显著的进展。本文将详细介绍最新的技术发展，包括胚胎筛查技术、冷冻技术的改进以及个性化治疗方案的制定。\n\n## 胚胎筛查技术的进步\n\n现代胚胎筛查技术，特别是PGT-A（胚胎植入前遗传学筛查）技术，能够在胚胎移植前检测染色体异常，大大提高了成功率。这项技术的应用使得单胚胎移植成为可能，既提高了成功率，又降低了多胎妊娠的风险。\n\n## 冷冻技术的革新\n\n玻璃化冷冻技术的应用是近年来的一大突破。相比传统的慢速冷冻方法，玻璃化冷冻能够更好地保护胚胎和卵子的结构完整性，解冻后的存活率显著提高。\n\n## 个性化治疗方案\n\n基于患者的具体情况制定个性化的治疗方案已成为趋势。通过基因检测、激素水平监测等手段，医生能够为每位患者量身定制最适合的治疗计划。',
   'In vitro fertilization (IVF) technology, as an important component of assisted reproductive technology, has made significant progress in recent years. This article will detail the latest technological developments, including embryo screening technology, improvements in freezing technology, and the development of personalized treatment plans.\n\n## Advances in Embryo Screening Technology\n\nModern embryo screening technology, particularly PGT-A (Preimplantation Genetic Testing for Aneuploidy), can detect chromosomal abnormalities before embryo transfer, greatly improving success rates. The application of this technology makes single embryo transfer possible, both improving success rates and reducing the risk of multiple pregnancies.\n\n## Innovation in Freezing Technology\n\nThe application of vitrification freezing technology is a major breakthrough in recent years. Compared to traditional slow freezing methods, vitrification can better protect the structural integrity of embryos and eggs, with significantly improved survival rates after thawing.\n\n## Personalized Treatment Plans\n\nDeveloping personalized treatment plans based on patients'' specific conditions has become a trend. Through genetic testing, hormone level monitoring, and other means, doctors can tailor the most suitable treatment plan for each patient.',
   '了解试管婴儿技术的最新发展，包括胚胎筛查、冷冻技术和个性化治疗方案。',
   'Learn about the latest developments in IVF technology, including embryo screening, freezing technology, and personalized treatment plans.',
   'latest-ivf-technology-developments',
   '技术进展',
   'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
   8,
   true,
   '550e8400-e29b-41d4-a716-446655440001',
   NOW() - INTERVAL '7 days',
   NOW() - INTERVAL '7 days'),

  ('660e8400-e29b-41d4-a716-446655440002',
   '海外医疗：选择合适的生殖中心',
   'Overseas Medical Care: Choosing the Right Fertility Center',
   '选择合适的海外生殖中心是成功治疗的关键。本文将为您提供详细的选择指南，帮助您做出明智的决定。\n\n## 评估标准\n\n### 1. 成功率统计\n选择生殖中心时，成功率是最重要的考量因素之一。但需要注意的是，不同中心的统计方法可能不同，应该关注：\n- 活产率而非仅仅是妊娠率\n- 按年龄段分类的成功率\n- 单胚胎移植的成功率\n\n### 2. 技术水平\n先进的技术设备和经验丰富的医疗团队是成功的保障：\n- 实验室设备的先进程度\n- 医生的专业资质和经验\n- 是否提供最新的辅助生殖技术\n\n### 3. 服务质量\n良好的服务体验对治疗过程同样重要：\n- 医患沟通的质量\n- 护理团队的专业水平\n- 心理支持服务的提供\n\n## 地区选择\n\n不同国家和地区在辅助生殖技术方面各有优势，需要根据个人情况选择最适合的目的地。',
   'Choosing the right overseas fertility center is key to successful treatment. This article will provide you with a detailed selection guide to help you make an informed decision.\n\n## Evaluation Criteria\n\n### 1. Success Rate Statistics\nWhen choosing a fertility center, success rates are one of the most important considerations. However, it should be noted that different centers may use different statistical methods, so you should focus on:\n- Live birth rates rather than just pregnancy rates\n- Success rates categorized by age group\n- Success rates for single embryo transfer\n\n### 2. Technical Level\nAdvanced technical equipment and experienced medical teams are guarantees of success:\n- The advancement of laboratory equipment\n- Doctors'' professional qualifications and experience\n- Whether the latest assisted reproductive technologies are provided\n\n### 3. Service Quality\nGood service experience is equally important for the treatment process:\n- Quality of doctor-patient communication\n- Professional level of the nursing team\n- Provision of psychological support services\n\n## Regional Selection\n\nDifferent countries and regions have their own advantages in assisted reproductive technology, and you need to choose the most suitable destination based on your personal situation.',
   '如何选择合适的海外生殖中心？本文提供详细的评估标准和选择指南。',
   'How to choose the right overseas fertility center? This article provides detailed evaluation criteria and selection guidelines.',
   'choosing-fertility-center-overseas',
   '医疗指南',
   'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
   10,
   true,
   '550e8400-e29b-41d4-a716-446655440002',
   NOW() - INTERVAL '5 days',
   NOW() - INTERVAL '5 days'),

  ('660e8400-e29b-41d4-a716-446655440003',
   '不孕不育的常见原因及预防',
   'Common Causes of Infertility and Prevention',
   '不孕不育问题日益受到关注，了解其常见原因和预防方法对于维护生殖健康至关重要。\n\n## 女性不孕的常见原因\n\n### 1. 排卵障碍\n排卵障碍是女性不孕的主要原因之一，包括：\n- 多囊卵巢综合征（PCOS）\n- 卵巢功能早衰\n- 甲状腺功能异常\n- 高泌乳素血症\n\n### 2. 输卵管因素\n输卵管堵塞或功能异常会影响受精和胚胎运输：\n- 盆腔炎症导致的粘连\n- 子宫内膜异位症\n- 先天性输卵管异常\n\n### 3. 子宫因素\n子宫结构或功能异常：\n- 子宫肌瘤\n- 子宫内膜息肉\n- 宫腔粘连\n- 子宫畸形\n\n## 男性不育的常见原因\n\n### 1. 精子质量问题\n- 精子数量不足\n- 精子活力低下\n- 精子形态异常\n\n### 2. 生殖道异常\n- 输精管堵塞\n- 精索静脉曲张\n- 隐睾症\n\n## 预防措施\n\n### 生活方式调整\n- 保持健康的体重\n- 规律运动\n- 戒烟限酒\n- 减少压力\n- 避免接触有害物质\n\n### 定期检查\n- 定期妇科检查\n- 男性生殖健康检查\n- 及时治疗生殖系统疾病',
   'Infertility issues are receiving increasing attention. Understanding common causes and prevention methods is crucial for maintaining reproductive health.\n\n## Common Causes of Female Infertility\n\n### 1. Ovulation Disorders\nOvulation disorders are one of the main causes of female infertility, including:\n- Polycystic Ovary Syndrome (PCOS)\n- Premature Ovarian Failure\n- Thyroid dysfunction\n- Hyperprolactinemia\n\n### 2. Tubal Factors\nFallopian tube blockage or dysfunction affects fertilization and embryo transport:\n- Adhesions caused by pelvic inflammation\n- Endometriosis\n- Congenital tubal abnormalities\n\n### 3. Uterine Factors\nUterine structural or functional abnormalities:\n- Uterine fibroids\n- Endometrial polyps\n- Intrauterine adhesions\n- Uterine malformations\n\n## Common Causes of Male Infertility\n\n### 1. Sperm Quality Issues\n- Insufficient sperm count\n- Low sperm motility\n- Abnormal sperm morphology\n\n### 2. Reproductive Tract Abnormalities\n- Vas deferens blockage\n- Varicocele\n- Cryptorchidism\n\n## Prevention Measures\n\n### Lifestyle Adjustments\n- Maintain a healthy weight\n- Regular exercise\n- Quit smoking and limit alcohol\n- Reduce stress\n- Avoid exposure to harmful substances\n\n### Regular Check-ups\n- Regular gynecological examinations\n- Male reproductive health check-ups\n- Timely treatment of reproductive system diseases',
   '了解不孕不育的常见原因，学习有效的预防方法，维护生殖健康。',
   'Understand common causes of infertility, learn effective prevention methods, and maintain reproductive health.',
   'infertility-causes-prevention',
   '健康科普',
   'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
   12,
   true,
   '550e8400-e29b-41d4-a716-446655440003',
   NOW() - INTERVAL '3 days',
   NOW() - INTERVAL '3 days'),

  ('660e8400-e29b-41d4-a716-446655440004',
   '辅助生殖技术的心理准备',
   'Psychological Preparation for Assisted Reproductive Technology',
   '接受辅助生殖技术治疗不仅是身体上的挑战，更是心理上的考验。做好充分的心理准备对治疗成功至关重要。\n\n## 常见的心理反应\n\n### 1. 焦虑和担忧\n- 对治疗结果的不确定性\n- 经济压力\n- 时间安排的困扰\n- 对副作用的担心\n\n### 2. 情绪波动\n- 希望与失望的交替\n- 愤怒和沮丧\n- 自责和内疚\n- 孤独感\n\n## 心理调适策略\n\n### 1. 建立现实期望\n- 了解治疗的成功率\n- 接受可能需要多次尝试\n- 制定备选方案\n\n### 2. 寻求支持\n- 与伴侣开诚布公地沟通\n- 寻求专业心理咨询\n- 加入支持小组\n- 与家人朋友分享\n\n### 3. 压力管理\n- 学习放松技巧\n- 保持规律的作息\n- 适度运动\n- 培养兴趣爱好\n\n### 4. 积极思维\n- 关注治疗过程中的积极方面\n- 庆祝小的进步\n- 保持希望但不过度乐观\n\n## 伴侣关系的维护\n\n治疗过程中，夫妻关系可能面临挑战：\n- 保持开放的沟通\n- 相互支持和理解\n- 寻求专业的夫妻咨询\n- 安排质量时间\n\n## 何时寻求专业帮助\n\n如果出现以下情况，建议寻求专业心理帮助：\n- 持续的抑郁或焦虑\n- 睡眠或食欲问题\n- 社交回避\n- 夫妻关系严重紧张',
   'Undergoing assisted reproductive technology treatment is not only a physical challenge but also a psychological test. Adequate psychological preparation is crucial for treatment success.\n\n## Common Psychological Reactions\n\n### 1. Anxiety and Worry\n- Uncertainty about treatment outcomes\n- Financial pressure\n- Time management concerns\n- Worry about side effects\n\n### 2. Emotional Fluctuations\n- Alternating hope and disappointment\n- Anger and frustration\n- Self-blame and guilt\n- Feelings of loneliness\n\n## Psychological Adjustment Strategies\n\n### 1. Establish Realistic Expectations\n- Understand treatment success rates\n- Accept that multiple attempts may be needed\n- Develop alternative plans\n\n### 2. Seek Support\n- Communicate openly with your partner\n- Seek professional psychological counseling\n- Join support groups\n- Share with family and friends\n\n### 3. Stress Management\n- Learn relaxation techniques\n- Maintain regular sleep schedules\n- Exercise moderately\n- Cultivate hobbies\n\n### 4. Positive Thinking\n- Focus on positive aspects of the treatment process\n- Celebrate small progress\n- Maintain hope but avoid excessive optimism\n\n## Maintaining Partner Relationships\n\nDuring treatment, marital relationships may face challenges:\n- Maintain open communication\n- Support and understand each other\n- Seek professional couples counseling\n- Schedule quality time together\n\n## When to Seek Professional Help\n\nIf the following situations occur, it is recommended to seek professional psychological help:\n- Persistent depression or anxiety\n- Sleep or appetite problems\n- Social avoidance\n- Severe marital tension',
   '辅助生殖技术治疗的心理准备指南，帮助您更好地应对治疗过程中的心理挑战。',
   'A psychological preparation guide for assisted reproductive technology treatment to help you better cope with psychological challenges during treatment.',
   'psychological-preparation-art',
   '心理健康',
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
   15,
   true,
   '550e8400-e29b-41d4-a716-446655440001',
   NOW() - INTERVAL '1 day',
   NOW() - INTERVAL '1 day'),

  ('660e8400-e29b-41d4-a716-446655440005',
   '营养与生育力的关系',
   'The Relationship Between Nutrition and Fertility',
   '营养状况对生育力有着重要影响。合理的饮食不仅能提高自然受孕的几率，也能改善辅助生殖技术的成功率。\n\n## 关键营养素\n\n### 1. 叶酸\n叶酸对女性生育力至关重要：\n- 预防神经管缺陷\n- 改善卵子质量\n- 建议每日摄入400-800微克\n- 富含叶酸的食物：绿叶蔬菜、豆类、坚果\n\n### 2. 维生素D\n维生素D缺乏与不孕不育相关：\n- 影响卵巢功能\n- 影响子宫内膜容受性\n- 建议检测血清维生素D水平\n- 适当日晒和补充维生素D\n\n### 3. 欧米伽-3脂肪酸\n- 改善卵子和精子质量\n- 减少炎症\n- 来源：深海鱼类、亚麻籽、核桃\n\n### 4. 抗氧化剂\n- 维生素C、E\n- 硒、锌\n- 辅酶Q10\n- 保护生殖细胞免受氧化损伤\n\n## 饮食建议\n\n### 女性饮食指导\n- 多吃新鲜蔬果\n- 选择全谷物\n- 适量优质蛋白质\n- 限制加工食品\n- 控制咖啡因摄入\n\n### 男性饮食指导\n- 增加抗氧化食物\n- 适量坚果和种子\n- 减少反式脂肪\n- 限制酒精摄入\n\n## 体重管理\n\n### 体重对生育力的影响\n- 过重或过轻都会影响生育力\n- BMI在18.5-24.9为理想范围\n- 体重减轻5-10%可显著改善生育力\n\n### 健康减重策略\n- 均衡饮食\n- 规律运动\n- 避免极端节食\n- 寻求专业指导\n\n## 需要避免的食物\n\n- 高汞鱼类\n- 生肉和未煮熟的蛋类\n- 过量咖啡因\n- 酒精\n- 高糖和高度加工食品',
   'Nutritional status has an important impact on fertility. A reasonable diet can not only improve the chances of natural conception but also improve the success rate of assisted reproductive technology.\n\n## Key Nutrients\n\n### 1. Folic Acid\nFolic acid is crucial for female fertility:\n- Prevents neural tube defects\n- Improves egg quality\n- Recommended daily intake of 400-800 micrograms\n- Foods rich in folic acid: green leafy vegetables, legumes, nuts\n\n### 2. Vitamin D\nVitamin D deficiency is associated with infertility:\n- Affects ovarian function\n- Affects endometrial receptivity\n- Recommended to test serum vitamin D levels\n- Appropriate sun exposure and vitamin D supplementation\n\n### 3. Omega-3 Fatty Acids\n- Improve egg and sperm quality\n- Reduce inflammation\n- Sources: deep-sea fish, flaxseed, walnuts\n\n### 4. Antioxidants\n- Vitamins C and E\n- Selenium and zinc\n- Coenzyme Q10\n- Protect reproductive cells from oxidative damage\n\n## Dietary Recommendations\n\n### Female Dietary Guidance\n- Eat more fresh fruits and vegetables\n- Choose whole grains\n- Moderate high-quality protein\n- Limit processed foods\n- Control caffeine intake\n\n### Male Dietary Guidance\n- Increase antioxidant foods\n- Moderate nuts and seeds\n- Reduce trans fats\n- Limit alcohol intake\n\n## Weight Management\n\n### Impact of Weight on Fertility\n- Being overweight or underweight affects fertility\n- BMI of 18.5-24.9 is the ideal range\n- Weight loss of 5-10% can significantly improve fertility\n\n### Healthy Weight Loss Strategies\n- Balanced diet\n- Regular exercise\n- Avoid extreme dieting\n- Seek professional guidance\n\n## Foods to Avoid\n\n- High-mercury fish\n- Raw meat and undercooked eggs\n- Excessive caffeine\n- Alcohol\n- High-sugar and highly processed foods',
   '了解营养与生育力的关系，通过合理饮食提高受孕几率和治疗成功率。',
   'Understand the relationship between nutrition and fertility, and improve conception chances and treatment success rates through proper diet.',
   'nutrition-fertility-relationship',
   '营养健康',
   'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
   11,
   true,
   '550e8400-e29b-41d4-a716-446655440003',
   NOW() - INTERVAL '2 hours',
   NOW() - INTERVAL '2 hours')
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
  updated_at = EXCLUDED.updated_at;

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为blog_authors表创建更新时间触发器
DROP TRIGGER IF EXISTS update_blog_authors_updated_at ON blog_authors;
CREATE TRIGGER update_blog_authors_updated_at
    BEFORE UPDATE ON blog_authors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为blog_posts表创建更新时间触发器
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 验证数据插入
SELECT 'Authors count:' as info, COUNT(*) as count FROM blog_authors
UNION ALL
SELECT 'Posts count:' as info, COUNT(*) as count FROM blog_posts
UNION ALL
SELECT 'Published posts:' as info, COUNT(*) as count FROM blog_posts WHERE published = true;

-- 显示插入的数据
SELECT 'Blog Authors:' as table_name, name, created_at FROM blog_authors ORDER BY created_at;
SELECT 'Blog Posts:' as table_name, title_zh, category, published, created_at FROM blog_posts ORDER BY created_at;