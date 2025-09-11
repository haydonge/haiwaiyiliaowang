-- 创建博客作者表
CREATE TABLE IF NOT EXISTS blog_authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bio_zh TEXT,
  bio_en TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建博客文章表
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_zh VARCHAR(200) NOT NULL,
  title_en VARCHAR(200) NOT NULL,
  content_zh TEXT NOT NULL,
  content_en TEXT NOT NULL,
  excerpt_zh TEXT,
  excerpt_en TEXT,
  slug VARCHAR(200) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取已发布的文章
CREATE POLICY "Allow public read access to published posts" ON blog_posts
  FOR SELECT USING (published = true);

-- 创建策略：允许所有人读取作者信息
CREATE POLICY "Allow public read access to authors" ON blog_authors
  FOR SELECT USING (true);

-- 授权给匿名用户和认证用户
GRANT SELECT ON blog_posts TO anon, authenticated;
GRANT SELECT ON blog_authors TO anon, authenticated;

-- 插入示例作者
INSERT INTO blog_authors (name, bio_zh, bio_en, avatar_url) VALUES 
('Dr. 张医生', '资深医疗专家，专注于医疗健康领域研究', 'Senior medical expert focusing on healthcare research', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'),
('李护士长', '拥有15年临床护理经验的专业护士', 'Professional nurse with 15 years of clinical experience', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face')
ON CONFLICT DO NOTHING;

-- 插入示例文章
INSERT INTO blog_posts (
  title_zh, title_en, 
  content_zh, content_en,
  excerpt_zh, excerpt_en,
  slug, category, featured_image, read_time, published, author_id
) VALUES 
(
  '海外试管婴儿成功率解析',
  'Analysis of Overseas IVF Success Rates',
  '<h2>海外试管婴儿技术优势</h2><p>海外试管婴儿技术在成功率方面具有显著优势，主要体现在以下几个方面：</p><h3>1. 先进的医疗设备</h3><p>海外生殖医学中心普遍配备了最新一代的医疗设备，包括高精度的胚胎培养箱、先进的显微操作系统等，这些设备能够为胚胎提供最佳的培养环境。</p><h3>2. 个性化治疗方案</h3><p>根据每位患者的具体情况，制定个性化的促排卵方案和治疗计划，大大提高了成功率。</p><h3>3. 第三代试管婴儿技术</h3><p>PGS/PGD技术的应用，能够在胚胎移植前进行基因筛查，选择最健康的胚胎进行移植，显著提高妊娠成功率。</p><h3>4. 经验丰富的医疗团队</h3><p>海外生殖医学专家拥有丰富的临床经验，能够处理各种复杂的不孕不育情况。</p>',
  '<h2>Advantages of Overseas IVF Technology</h2><p>Overseas IVF technology has significant advantages in success rates, mainly reflected in the following aspects:</p><h3>1. Advanced Medical Equipment</h3><p>Overseas reproductive medical centers are generally equipped with the latest generation of medical equipment, including high-precision embryo incubators and advanced micromanipulation systems.</p><h3>2. Personalized Treatment Plans</h3><p>Customized ovulation stimulation protocols and treatment plans are developed based on each patient\'s specific situation, greatly improving success rates.</p><h3>3. Third-Generation IVF Technology</h3><p>The application of PGS/PGD technology enables genetic screening before embryo transfer, selecting the healthiest embryos for implantation.</p><h3>4. Experienced Medical Teams</h3><p>Overseas reproductive medicine specialists have extensive clinical experience in handling various complex infertility cases.</p>',
  '深入分析海外试管婴儿技术的成功率优势，为您的生育之路提供专业指导',
  'In-depth analysis of the success rate advantages of overseas IVF technology',
  'overseas-ivf-success-rates',
  'medical',
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20medical%20laboratory%20IVF%20equipment%20professional%20healthcare%20facility&image_size=landscape_4_3',
  12,
  true,
  (SELECT id FROM blog_authors WHERE name = 'Dr. 张医生' LIMIT 1)
),
(
  '选择海外辅助生殖的优势',
  'Advantages of Choosing Overseas Assisted Reproduction',
  '<h2>为什么选择海外辅助生殖？</h2><p>越来越多的家庭选择海外辅助生殖服务，这背后有着充分的理由和优势：</p><h3>1. 技术水平领先</h3><p>海外发达国家在辅助生殖技术方面起步较早，技术相对成熟，成功率普遍较高。特别是在胚胎培养、基因筛查等关键技术方面具有明显优势。</p><h3>2. 法律法规完善</h3><p>海外许多国家对辅助生殖技术有着完善的法律保障，能够更好地保护患者的合法权益。</p><h3>3. 服务质量优异</h3><p>海外医疗机构注重患者体验，提供一对一的专业服务，从咨询到治疗全程跟踪。</p><h3>4. 隐私保护严格</h3><p>严格的隐私保护制度，确保患者信息安全，让您安心接受治疗。</p><h3>5. 成功率统计透明</h3><p>海外医疗机构会定期公布真实的成功率数据，让患者能够做出明智的选择。</p>',
  '<h2>Why Choose Overseas Assisted Reproduction?</h2><p>More and more families are choosing overseas assisted reproduction services for good reasons:</p><h3>1. Leading Technology</h3><p>Developed countries started earlier in assisted reproduction technology, with relatively mature techniques and generally higher success rates.</p><h3>2. Complete Legal Framework</h3><p>Many overseas countries have comprehensive legal protections for assisted reproduction technology, better protecting patients\' rights.</p><h3>3. Excellent Service Quality</h3><p>Overseas medical institutions focus on patient experience, providing one-on-one professional services throughout the consultation and treatment process.</p><h3>4. Strict Privacy Protection</h3><p>Strict privacy protection systems ensure patient information security, allowing you to receive treatment with peace of mind.</p><h3>5. Transparent Success Rate Statistics</h3><p>Overseas medical institutions regularly publish real success rate data, enabling patients to make informed choices.</p>',
  '全面解析选择海外辅助生殖的各项优势，帮助您做出最佳决策',
  'Comprehensive analysis of the advantages of choosing overseas assisted reproduction',
  'overseas-assisted-reproduction-advantages',
  'medical',
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=international%20medical%20center%20modern%20hospital%20building%20healthcare%20excellence&image_size=landscape_4_3',
  10,
  true,
  (SELECT id FROM blog_authors WHERE name = 'Dr. 张医生' LIMIT 1)
),
(
  '张女士的成功案例分享',
  'Ms. Zhang\'s Success Story',
  '<h2>一个真实的成功故事</h2><p>张女士，35岁，来自北京，经过两年的努力，终于通过海外试管婴儿技术成功怀孕。以下是她的完整经历分享：</p><h3>背景情况</h3><p>张女士结婚5年，一直未能自然怀孕。在国内经过多次检查和治疗后，医生建议考虑试管婴儿技术。经过深入了解和比较，张女士选择了海外试管婴儿服务。</p><h3>治疗过程</h3><p><strong>第一阶段：前期准备</strong></p><ul><li>完成全面的身体检查</li><li>调整生活习惯和饮食结构</li><li>心理咨询和准备</li></ul><p><strong>第二阶段：促排卵治疗</strong></p><ul><li>个性化促排卵方案</li><li>定期监测卵泡发育</li><li>适时调整药物剂量</li></ul><p><strong>第三阶段：取卵和胚胎培养</strong></p><ul><li>成功取卵15个</li><li>受精成功12个</li><li>培养出8个优质胚胎</li></ul><p><strong>第四阶段：胚胎移植</strong></p><ul><li>选择2个最优质胚胎移植</li><li>移植过程顺利</li><li>14天后确认怀孕</li></ul><h3>成功的关键因素</h3><p>1. 选择了经验丰富的医疗团队<br>2. 严格遵循医生的治疗方案<br>3. 保持积极乐观的心态<br>4. 家人的全力支持</p>',
  '<h2>A Real Success Story</h2><p>Ms. Zhang, 35 years old from Beijing, successfully became pregnant through overseas IVF technology after two years of effort. Here is her complete experience:</p><h3>Background</h3><p>Ms. Zhang had been married for 5 years without natural conception. After multiple examinations and treatments in China, doctors recommended IVF technology. After thorough research and comparison, she chose overseas IVF services.</p><h3>Treatment Process</h3><p><strong>Phase 1: Preparation</strong></p><ul><li>Comprehensive physical examination</li><li>Lifestyle and dietary adjustments</li><li>Psychological counseling and preparation</li></ul><p><strong>Phase 2: Ovulation Stimulation</strong></p><ul><li>Personalized stimulation protocol</li><li>Regular follicle monitoring</li><li>Timely medication adjustments</li></ul><p><strong>Phase 3: Egg Retrieval and Embryo Culture</strong></p><ul><li>Successfully retrieved 15 eggs</li><li>12 successful fertilizations</li><li>8 high-quality embryos developed</li></ul><p><strong>Phase 4: Embryo Transfer</strong></p><ul><li>Selected 2 best quality embryos for transfer</li><li>Smooth transfer process</li><li>Pregnancy confirmed after 14 days</li></ul>',
  '真实的成功案例分享，为正在考虑海外试管婴儿的家庭提供参考和鼓励',
  'Real success story sharing to provide reference and encouragement for families considering overseas IVF',
  'zhang-success-story',
  'success',
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20asian%20woman%20portrait%20smiling%20confident%20professional%20headshot&image_size=landscape_4_3',
  8,
  true,
  (SELECT id FROM blog_authors WHERE name = '李护士长' LIMIT 1)
),
(
  '试管婴儿前的准备工作',
  'Preparation Work Before IVF',
  '<h2>试管婴儿前的全面准备</h2><p>充分的准备工作是试管婴儿成功的重要基础。以下是详细的准备指南：</p><h3>1. 身体准备</h3><p><strong>女方准备：</strong></p><ul><li>全面体检：包括妇科检查、内分泌检查、免疫检查等</li><li>生活方式调整：戒烟戒酒、规律作息、适量运动</li><li>营养补充：叶酸、维生素D、辅酶Q10等</li><li>体重管理：保持适当的BMI指数</li></ul><p><strong>男方准备：</strong></p><ul><li>精液检查：评估精子质量和数量</li><li>生活习惯改善：避免高温环境、减少压力</li><li>营养补充：锌、硒、维生素E等</li></ul><h3>2. 心理准备</h3><ul><li>了解试管婴儿流程和可能的风险</li><li>建立合理的期望值</li><li>寻求专业心理咨询支持</li><li>与伴侣充分沟通</li></ul><h3>3. 经济准备</h3><ul><li>了解治疗费用构成</li><li>准备充足的资金</li><li>了解保险覆盖情况</li></ul><h3>4. 时间安排</h3><ul><li>合理安排工作和治疗时间</li><li>预留足够的休息时间</li><li>考虑多次尝试的可能性</li></ul>',
  '<h2>Comprehensive Preparation Before IVF</h2><p>Adequate preparation is an important foundation for IVF success. Here is a detailed preparation guide:</p><h3>1. Physical Preparation</h3><p><strong>For Women:</strong></p><ul><li>Comprehensive examination: gynecological, endocrine, immune tests</li><li>Lifestyle adjustments: quit smoking and drinking, regular schedule, moderate exercise</li><li>Nutritional supplements: folic acid, vitamin D, coenzyme Q10</li><li>Weight management: maintain appropriate BMI</li></ul><p><strong>For Men:</strong></p><ul><li>Semen analysis: assess sperm quality and quantity</li><li>Lifestyle improvements: avoid high temperatures, reduce stress</li><li>Nutritional supplements: zinc, selenium, vitamin E</li></ul><h3>2. Psychological Preparation</h3><ul><li>Understand IVF process and possible risks</li><li>Establish reasonable expectations</li><li>Seek professional psychological counseling</li><li>Communicate fully with partner</li></ul><h3>3. Financial Preparation</h3><ul><li>Understand treatment cost structure</li><li>Prepare sufficient funds</li><li>Understand insurance coverage</li></ul>',
  '详细的试管婴儿前准备指南，帮助您做好充分准备提高成功率',
  'Detailed pre-IVF preparation guide to help you prepare thoroughly and improve success rates',
  'ivf-preparation-guide',
  'medical',
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20consultation%20preparation%20checklist%20healthcare%20planning&image_size=landscape_4_3',
  15,
  true,
  (SELECT id FROM blog_authors WHERE name = 'Dr. 张医生' LIMIT 1)
),
(
  '胚胎移植后的注意事项',
  'Precautions After Embryo Transfer',
  '<h2>胚胎移植后的关键护理</h2><p>胚胎移植后的护理对于提高着床成功率至关重要。以下是详细的注意事项：</p><h3>1. 休息和活动</h3><ul><li><strong>适度休息：</strong>移植后可以正常活动，但避免剧烈运动</li><li><strong>避免长时间卧床：</strong>长期卧床反而不利于血液循环</li><li><strong>轻度活动：</strong>可以进行散步等轻度活动</li><li><strong>避免提重物：</strong>避免提超过5公斤的重物</li></ul><h3>2. 饮食调理</h3><ul><li><strong>均衡营养：</strong>多吃富含蛋白质的食物</li><li><strong>新鲜蔬果：</strong>补充维生素和纤维素</li><li><strong>充足水分：</strong>每天饮水2000ml以上</li><li><strong>避免刺激性食物：</strong>辛辣、生冷、咖啡因等</li></ul><h3>3. 药物管理</h3><ul><li><strong>按时用药：</strong>严格按照医生处方用药</li><li><strong>黄体支持：</strong>按时使用黄体酮等支持药物</li><li><strong>记录用药：</strong>做好用药记录和身体反应</li></ul><h3>4. 心理调节</h3><ul><li><strong>保持乐观：</strong>避免过度焦虑和紧张</li><li><strong>适当放松：</strong>听音乐、阅读等放松活动</li><li><strong>避免压力：</strong>减少工作和生活压力</li></ul><h3>5. 监测和复查</h3><ul><li><strong>定期复查：</strong>按时进行血检和B超检查</li><li><strong>观察症状：</strong>注意观察身体变化</li><li><strong>及时就医：</strong>出现异常症状及时联系医生</li></ul>',
  '<h2>Key Care After Embryo Transfer</h2><p>Post-transfer care is crucial for improving implantation success rates. Here are detailed precautions:</p><h3>1. Rest and Activity</h3><ul><li><strong>Moderate rest:</strong> Normal activities are fine after transfer, but avoid strenuous exercise</li><li><strong>Avoid prolonged bed rest:</strong> Long-term bed rest is actually detrimental to blood circulation</li><li><strong>Light activities:</strong> Walking and other light activities are acceptable</li><li><strong>Avoid heavy lifting:</strong> Avoid lifting more than 5kg</li></ul><h3>2. Dietary Care</h3><ul><li><strong>Balanced nutrition:</strong> Eat more protein-rich foods</li><li><strong>Fresh fruits and vegetables:</strong> Supplement vitamins and fiber</li><li><strong>Adequate hydration:</strong> Drink more than 2000ml of water daily</li><li><strong>Avoid irritating foods:</strong> Spicy, cold, caffeinated foods</li></ul><h3>3. Medication Management</h3><ul><li><strong>Take medications on time:</strong> Strictly follow doctor\'s prescriptions</li><li><strong>Luteal support:</strong> Use progesterone and other support medications on schedule</li><li><strong>Record medications:</strong> Keep records of medications and physical reactions</li></ul>',
  '胚胎移植后的详细护理指南，帮助您提高着床成功率',
  'Detailed post-embryo transfer care guide to help improve implantation success rates',
  'post-transfer-care',
  'medical',
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20care%20recovery%20rest%20healthcare%20guidance&image_size=landscape_4_3',
  12,
  true,
  (SELECT id FROM blog_authors WHERE name = '李护士长' LIMIT 1)
),
(
  '海外医疗保险指南',
  'Overseas Medical Insurance Guide',
  '<h2>海外医疗保险全面指南</h2><p>选择海外医疗服务时，合适的医疗保险是重要保障。以下是详细的保险指南：</p><h3>1. 保险类型选择</h3><p><strong>国际医疗保险：</strong></p><ul><li>覆盖范围广，包括多个国家和地区</li><li>保障额度高，适合长期海外医疗</li><li>保费相对较高，但保障全面</li></ul><p><strong>旅行医疗保险：</strong></p><ul><li>适合短期海外医疗</li><li>保费相对便宜</li><li>保障范围有限，需仔细查看条款</li></ul><p><strong>专项医疗保险：</strong></p><ul><li>针对特定医疗项目的保险</li><li>如试管婴儿专项保险</li><li>保障更有针对性</li></ul><h3>2. 保险条款重点</h3><ul><li><strong>保障范围：</strong>明确哪些医疗项目在保障范围内</li><li><strong>免赔额：</strong>了解需要自付的部分</li><li><strong>赔付比例：</strong>保险公司承担的比例</li><li><strong>等待期：</strong>保险生效前的等待时间</li><li><strong>既往病史：</strong>是否覆盖既往疾病</li></ul><h3>3. 理赔流程</h3><ol><li>及时报案：发生医疗费用后及时通知保险公司</li><li>收集资料：保留所有医疗单据和证明</li><li>填写申请：完整填写理赔申请表</li><li>提交材料：按要求提交所有必要材料</li><li>跟进处理：主动跟进理赔进度</li></ol><h3>4. 注意事项</h3><ul><li>仔细阅读保险条款，了解免责条款</li><li>选择信誉良好的保险公司</li><li>根据实际需求选择合适的保障额度</li><li>及时续保，避免保障中断</li></ul>',
  '<h2>Comprehensive Overseas Medical Insurance Guide</h2><p>When choosing overseas medical services, appropriate medical insurance is important protection. Here is a detailed insurance guide:</p><h3>1. Insurance Type Selection</h3><p><strong>International Medical Insurance:</strong></p><ul><li>Wide coverage including multiple countries and regions</li><li>High coverage limits, suitable for long-term overseas medical care</li><li>Relatively high premiums but comprehensive coverage</li></ul><p><strong>Travel Medical Insurance:</strong></p><ul><li>Suitable for short-term overseas medical care</li><li>Relatively cheaper premiums</li><li>Limited coverage, need to carefully review terms</li></ul><p><strong>Specialized Medical Insurance:</strong></p><ul><li>Insurance for specific medical procedures</li><li>Such as IVF-specific insurance</li><li>More targeted coverage</li></ul><h3>2. Key Insurance Terms</h3><ul><li><strong>Coverage scope:</strong> Clarify which medical procedures are covered</li><li><strong>Deductible:</strong> Understand the self-pay portion</li><li><strong>Reimbursement ratio:</strong> The percentage covered by insurance</li><li><strong>Waiting period:</strong> Waiting time before insurance takes effect</li><li><strong>Pre-existing conditions:</strong> Whether pre-existing diseases are covered</li></ul>',
  '全面的海外医疗保险指南，帮助您选择合适的医疗保障',
  'Comprehensive overseas medical insurance guide to help you choose appropriate medical coverage',
  'overseas-medical-insurance',
  'faq',
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20insurance%20documents%20healthcare%20coverage%20protection&image_size=landscape_4_3',
  18,
  true,
  (SELECT id FROM blog_authors WHERE name = 'Dr. 张医生' LIMIT 1)
)
ON CONFLICT (slug) DO NOTHING;