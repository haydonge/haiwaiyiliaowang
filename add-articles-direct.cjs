const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 文章数据
const articles = [
  {
    title_zh: '海外试管婴儿流程详解',
    title_en: 'Comprehensive Guide to Overseas IVF Process',
    content_zh: '<h2>海外试管婴儿完整流程</h2><p>海外试管婴儿治疗是一个系统性的过程，需要患者充分了解每个步骤。以下是详细的流程指南：</p><h3>第一阶段：前期咨询与评估（1-2周）</h3><ul><li><strong>初步咨询：</strong>与生殖专家进行详细沟通，了解病史和需求</li><li><strong>医学检查：</strong>全面的生育力评估，包括激素检测、超声检查等</li><li><strong>个性化方案：</strong>根据检查结果制定专属治疗方案</li><li><strong>费用预算：</strong>详细的治疗费用说明和支付安排</li></ul><h3>第二阶段：促排卵治疗（10-14天）</h3><ul><li><strong>药物治疗：</strong>使用促排卵药物刺激卵巢产生多个卵子</li><li><strong>监测跟踪：</strong>定期超声检查和血液检测监控卵泡发育</li><li><strong>剂量调整：</strong>根据反应情况及时调整药物剂量</li><li><strong>时机把握：</strong>确定最佳取卵时间</li></ul><h3>第三阶段：取卵与受精（1-3天）</h3><ul><li><strong>取卵手术：</strong>在轻度麻醉下进行，通常30分钟内完成</li><li><strong>精子处理：</strong>同时进行精子采集和优化处理</li><li><strong>体外受精：</strong>在实验室环境下完成卵子和精子的结合</li><li><strong>胚胎培养：</strong>受精卵在培养箱中发育3-5天</li></ul><h3>第四阶段：胚胎移植（1天）</h3><ul><li><strong>胚胎选择：</strong>选择最优质的胚胎进行移植</li><li><strong>移植手术：</strong>无痛手术，将胚胎植入子宫</li><li><strong>术后休息：</strong>短暂休息后即可正常活动</li><li><strong>药物支持：</strong>使用黄体酮等药物支持着床</li></ul><h3>第五阶段：妊娠确认与随访（2-4周）</h3><ul><li><strong>血检确认：</strong>移植后14天进行血液HCG检测</li><li><strong>超声检查：</strong>确认胚胎着床和发育情况</li><li><strong>持续监测：</strong>定期检查确保妊娠进展顺利</li><li><strong>后续护理：</strong>提供孕期指导和支持</li></ul>',
    content_en: '<h2>Complete Overseas IVF Process</h2><p>Overseas IVF treatment is a systematic process that requires patients to fully understand each step. Here is a detailed process guide:</p><h3>Phase 1: Initial Consultation and Assessment (1-2 weeks)</h3><ul><li><strong>Initial Consultation:</strong> Detailed communication with reproductive specialists to understand medical history and needs</li><li><strong>Medical Examination:</strong> Comprehensive fertility assessment including hormone testing and ultrasound examination</li><li><strong>Personalized Plan:</strong> Develop a customized treatment plan based on examination results</li><li><strong>Cost Budget:</strong> Detailed treatment cost explanation and payment arrangements</li></ul><h3>Phase 2: Ovarian Stimulation (10-14 days)</h3><ul><li><strong>Medication Treatment:</strong> Use ovulation-stimulating drugs to stimulate ovaries to produce multiple eggs</li><li><strong>Monitoring:</strong> Regular ultrasound and blood tests to monitor follicle development</li><li><strong>Dose Adjustment:</strong> Timely adjustment of medication dosage based on response</li><li><strong>Timing:</strong> Determine optimal egg retrieval timing</li></ul><h3>Phase 3: Egg Retrieval and Fertilization (1-3 days)</h3><ul><li><strong>Egg Retrieval Surgery:</strong> Performed under mild anesthesia, usually completed within 30 minutes</li><li><strong>Sperm Processing:</strong> Simultaneous sperm collection and optimization</li><li><strong>In Vitro Fertilization:</strong> Egg and sperm combination in laboratory environment</li><li><strong>Embryo Culture:</strong> Fertilized eggs develop in incubators for 3-5 days</li></ul><h3>Phase 4: Embryo Transfer (1 day)</h3><ul><li><strong>Embryo Selection:</strong> Select the highest quality embryos for transfer</li><li><strong>Transfer Surgery:</strong> Painless procedure to implant embryos into uterus</li><li><strong>Post-operative Rest:</strong> Brief rest followed by normal activities</li><li><strong>Medication Support:</strong> Use progesterone and other medications to support implantation</li></ul><h3>Phase 5: Pregnancy Confirmation and Follow-up (2-4 weeks)</h3><ul><li><strong>Blood Test Confirmation:</strong> HCG blood test 14 days after transfer</li><li><strong>Ultrasound Examination:</strong> Confirm embryo implantation and development</li><li><strong>Continuous Monitoring:</strong> Regular checks to ensure smooth pregnancy progress</li><li><strong>Follow-up Care:</strong> Provide pregnancy guidance and support</li></ul>',
    excerpt_zh: '详细解析海外试管婴儿治疗的完整流程，帮助您了解每个阶段的具体安排',
    excerpt_en: 'Detailed analysis of the complete overseas IVF treatment process to help you understand the specific arrangements for each stage',
    slug: 'overseas-ivf-process-guide',
    category: 'medical',
    featured_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20laboratory%20ivf%20process%20embryo%20culture%20modern%20fertility%20clinic&image_size=landscape_4_3',
    read_time: 18,
    published: true
  },
  {
    title_zh: '卵子冷冻技术介绍',
    title_en: 'Introduction to Egg Freezing Technology',
    content_zh: '<h2>卵子冷冻技术全面解析</h2><p>卵子冷冻技术为女性提供了保存生育力的重要选择，特别适合希望推迟生育或面临医疗治疗的女性。</p><h3>什么是卵子冷冻？</h3><p>卵子冷冻是一种生育力保存技术，通过超低温冷冻保存女性的卵子，以备将来使用。这项技术使用玻璃化冷冻法，能够最大程度保持卵子的活性。</p><h3>适合人群</h3><ul><li><strong>职业女性：</strong>希望专注事业发展，推迟生育计划</li><li><strong>医疗需要：</strong>即将接受化疗、放疗等可能影响生育力的治疗</li><li><strong>遗传风险：</strong>家族有早期绝经史的女性</li><li><strong>单身女性：</strong>暂未找到合适伴侣但希望保存生育选择</li><li><strong>卵巢功能下降：</strong>AMH值偏低或卵巢储备功能减退</li></ul><h3>冷冻流程</h3><ol><li><strong>初步评估：</strong>全面的生育力检查和咨询</li><li><strong>促排卵：</strong>使用药物刺激卵巢产生多个成熟卵子</li><li><strong>监测跟踪：</strong>定期超声和血检监控卵泡发育</li><li><strong>取卵手术：</strong>在麻醉下进行，通常20-30分钟</li><li><strong>卵子评估：</strong>实验室评估卵子质量和成熟度</li><li><strong>冷冻保存：</strong>使用玻璃化技术快速冷冻</li></ol><h3>技术优势</h3><ul><li><strong>高存活率：</strong>玻璃化冷冻技术存活率可达90%以上</li><li><strong>长期保存：</strong>理论上可以无限期保存</li><li><strong>灵活性：</strong>可以根据个人计划选择使用时间</li><li><strong>安全性：</strong>成熟的技术，风险极低</li></ul><h3>注意事项</h3><ul><li><strong>年龄因素：</strong>35岁前冷冻效果最佳</li><li><strong>数量建议：</strong>建议冷冻15-20个成熟卵子</li><li><strong>费用考虑：</strong>包括促排、取卵、冷冻和年度保存费用</li><li><strong>心理准备：</strong>了解成功率和可能的风险</li></ul>',
    content_en: '<h2>Comprehensive Analysis of Egg Freezing Technology</h2><p>Egg freezing technology provides women with an important option for fertility preservation, especially suitable for women who wish to delay childbearing or face medical treatments.</p><h3>What is Egg Freezing?</h3><p>Egg freezing is a fertility preservation technique that preserves womens eggs through ultra-low temperature freezing for future use. This technology uses vitrification freezing to maximize egg viability.</p><h3>Suitable Candidates</h3><ul><li><strong>Career Women:</strong> Want to focus on career development and delay childbearing plans</li><li><strong>Medical Needs:</strong> About to receive chemotherapy, radiotherapy or other treatments that may affect fertility</li><li><strong>Genetic Risk:</strong> Women with family history of early menopause</li><li><strong>Single Women:</strong> Have not found suitable partners but want to preserve fertility options</li><li><strong>Declining Ovarian Function:</strong> Low AMH levels or diminished ovarian reserve</li></ul><h3>Freezing Process</h3><ol><li><strong>Initial Assessment:</strong> Comprehensive fertility examination and consultation</li><li><strong>Ovarian Stimulation:</strong> Use medications to stimulate ovaries to produce multiple mature eggs</li><li><strong>Monitoring:</strong> Regular ultrasound and blood tests to monitor follicle development</li><li><strong>Egg Retrieval Surgery:</strong> Performed under anesthesia, usually 20-30 minutes</li><li><strong>Egg Assessment:</strong> Laboratory evaluation of egg quality and maturity</li><li><strong>Cryopreservation:</strong> Rapid freezing using vitrification technology</li></ol><h3>Technical Advantages</h3><ul><li><strong>High Survival Rate:</strong> Vitrification technology achieves over 90% survival rate</li><li><strong>Long-term Storage:</strong> Theoretically can be preserved indefinitely</li><li><strong>Flexibility:</strong> Can choose timing of use according to personal plans</li><li><strong>Safety:</strong> Mature technology with extremely low risks</li></ul><h3>Important Considerations</h3><ul><li><strong>Age Factor:</strong> Best results when frozen before age 35</li><li><strong>Quantity Recommendation:</strong> Recommend freezing 15-20 mature eggs</li><li><strong>Cost Considerations:</strong> Including stimulation, retrieval, freezing and annual storage fees</li><li><strong>Psychological Preparation:</strong> Understanding success rates and possible risks</li></ul>',
    excerpt_zh: '全面介绍卵子冷冻技术的原理、适用人群、流程和注意事项',
    excerpt_en: 'Comprehensive introduction to egg freezing technology principles, suitable candidates, process and considerations',
    slug: 'egg-freezing-technology-guide',
    category: 'medical',
    featured_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20laboratory%20egg%20freezing%20cryopreservation%20fertility%20preservation%20technology&image_size=landscape_4_3',
    read_time: 15,
    published: true
  },
  {
    title_zh: '第三代试管婴儿技术',
    title_en: 'Third Generation IVF Technology (PGT)',
    content_zh: '<h2>第三代试管婴儿技术详解</h2><p>第三代试管婴儿技术，也称为胚胎植入前遗传学检测（PGT），是目前最先进的辅助生殖技术，能够在胚胎移植前检测遗传疾病。</p><h3>技术原理</h3><p>PGT技术通过在胚胎发育到囊胚期（第5-6天）时，取出几个细胞进行遗传学分析，检测染色体异常和单基因疾病，选择健康的胚胎进行移植。</p><h3>技术分类</h3><ul><li><strong>PGT-A（非整倍体筛查）：</strong>检测染色体数目异常，如21三体综合征</li><li><strong>PGT-M（单基因病检测）：</strong>检测特定的遗传疾病，如地中海贫血</li><li><strong>PGT-SR（结构重排检测）：</strong>检测染色体结构异常</li></ul><h3>适用人群</h3><ul><li><strong>高龄产妇：</strong>35岁以上女性，染色体异常风险增加</li><li><strong>反复流产：</strong>有多次自然流产史的夫妇</li><li><strong>遗传病史：</strong>夫妇一方或双方携带遗传疾病基因</li><li><strong>反复失败：</strong>多次试管婴儿失败的患者</li><li><strong>男性因素：</strong>严重的男性不育症</li></ul><h3>技术优势</h3><ul><li><strong>提高成功率：</strong>选择健康胚胎，显著提高妊娠率</li><li><strong>降低流产率：</strong>减少因染色体异常导致的流产</li><li><strong>预防遗传病：</strong>避免遗传疾病传递给下一代</li><li><strong>减少多胎：</strong>可以安全进行单胚胎移植</li><li><strong>心理安慰：</strong>增加患者信心和安全感</li></ul>',
    content_en: '<h2>Third Generation IVF Technology Explained</h2><p>Third-generation IVF technology, also known as Preimplantation Genetic Testing (PGT), is currently the most advanced assisted reproductive technology that can detect genetic diseases before embryo transfer.</p><h3>Technical Principles</h3><p>PGT technology performs genetic analysis by removing several cells when embryos develop to the blastocyst stage (days 5-6), detecting chromosomal abnormalities and single gene diseases, and selecting healthy embryos for transfer.</p><h3>Technology Classification</h3><ul><li><strong>PGT-A (Aneuploidy Screening):</strong> Detects chromosomal number abnormalities such as trisomy 21</li><li><strong>PGT-M (Monogenic Disease Detection):</strong> Detects specific genetic diseases such as thalassemia</li><li><strong>PGT-SR (Structural Rearrangement Detection):</strong> Detects chromosomal structural abnormalities</li></ul><h3>Suitable Candidates</h3><ul><li><strong>Advanced Maternal Age:</strong> Women over 35 with increased risk of chromosomal abnormalities</li><li><strong>Recurrent Miscarriage:</strong> Couples with multiple spontaneous abortion history</li><li><strong>Genetic Disease History:</strong> One or both partners carry genetic disease genes</li><li><strong>Repeated Failures:</strong> Patients with multiple IVF failures</li><li><strong>Male Factors:</strong> Severe male infertility</li></ul><h3>Technical Advantages</h3><ul><li><strong>Improved Success Rate:</strong> Selecting healthy embryos significantly improves pregnancy rates</li><li><strong>Reduced Miscarriage Rate:</strong> Reduces miscarriages due to chromosomal abnormalities</li><li><strong>Genetic Disease Prevention:</strong> Prevents transmission of genetic diseases to next generation</li><li><strong>Reduced Multiple Pregnancies:</strong> Enables safe single embryo transfer</li><li><strong>Psychological Comfort:</strong> Increases patient confidence and security</li></ul>',
    excerpt_zh: '深入解析第三代试管婴儿技术的原理、分类、优势和适用人群',
    excerpt_en: 'In-depth analysis of third-generation IVF technology principles, classification, advantages and suitable candidates',
    slug: 'third-generation-ivf-pgt-technology',
    category: 'medical',
    featured_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20genetic%20laboratory%20embryo%20testing%20pgt%20technology%20microscope%20analysis&image_size=landscape_4_3',
    read_time: 20,
    published: true
  },
  {
    title_zh: '男性不育症治疗方案',
    title_en: 'Male Infertility Treatment Options',
    content_zh: '<h2>男性不育症综合治疗指南</h2><p>男性不育症影响约15%的夫妇，是导致不孕不育的重要原因。现代医学提供了多种有效的治疗方案。</p><h3>常见原因分析</h3><ul><li><strong>精子异常：</strong>精子数量少、活力差、形态异常</li><li><strong>输精管阻塞：</strong>先天性或后天性输精管梗阻</li><li><strong>激素异常：</strong>睾酮、FSH、LH等激素水平异常</li><li><strong>遗传因素：</strong>染色体异常、基因缺陷</li><li><strong>环境因素：</strong>高温、辐射、化学物质暴露</li><li><strong>生活方式：</strong>吸烟、酗酒、压力过大</li></ul><h3>诊断检查</h3><ol><li><strong>精液分析：</strong>评估精子浓度、活力、形态</li><li><strong>激素检测：</strong>测定相关生殖激素水平</li><li><strong>遗传学检查：</strong>染色体核型分析、基因检测</li><li><strong>影像学检查：</strong>超声、MRI等检查生殖器官</li><li><strong>免疫学检查：</strong>抗精子抗体检测</li></ol><h3>治疗方案</h3><h4>1. 药物治疗</h4><ul><li><strong>激素治疗：</strong>针对激素异常的患者</li><li><strong>抗氧化剂：</strong>改善精子质量，如维生素E、辅酶Q10</li><li><strong>抗感染治疗：</strong>针对生殖道感染</li><li><strong>中医药治疗：</strong>补肾壮阳、活血化瘀</li></ul><h4>2. 手术治疗</h4><ul><li><strong>精索静脉曲张手术：</strong>改善睾丸血液循环</li><li><strong>输精管复通术：</strong>恢复输精管通畅</li><li><strong>附睾管吻合术：</strong>解决附睾梗阻</li><li><strong>睾丸活检取精：</strong>获取精子进行辅助生殖</li></ul>',
    content_en: '<h2>Comprehensive Male Infertility Treatment Guide</h2><p>Male infertility affects approximately 15% of couples and is an important cause of infertility. Modern medicine provides various effective treatment options.</p><h3>Common Cause Analysis</h3><ul><li><strong>Sperm Abnormalities:</strong> Low sperm count, poor motility, abnormal morphology</li><li><strong>Vas Deferens Obstruction:</strong> Congenital or acquired vas deferens blockage</li><li><strong>Hormonal Abnormalities:</strong> Abnormal levels of testosterone, FSH, LH and other hormones</li><li><strong>Genetic Factors:</strong> Chromosomal abnormalities, gene defects</li><li><strong>Environmental Factors:</strong> High temperature, radiation, chemical exposure</li><li><strong>Lifestyle:</strong> Smoking, alcohol abuse, excessive stress</li></ul><h3>Diagnostic Tests</h3><ol><li><strong>Semen Analysis:</strong> Assess sperm concentration, motility, morphology</li><li><strong>Hormone Testing:</strong> Measure relevant reproductive hormone levels</li><li><strong>Genetic Testing:</strong> Chromosomal karyotype analysis, gene testing</li><li><strong>Imaging Studies:</strong> Ultrasound, MRI examination of reproductive organs</li><li><strong>Immunological Tests:</strong> Anti-sperm antibody detection</li></ol><h3>Treatment Options</h3><h4>1. Medical Treatment</h4><ul><li><strong>Hormone Therapy:</strong> For patients with hormonal abnormalities</li><li><strong>Antioxidants:</strong> Improve sperm quality, such as vitamin E, coenzyme Q10</li><li><strong>Anti-infection Treatment:</strong> For reproductive tract infections</li><li><strong>Traditional Chinese Medicine:</strong> Kidney tonification, blood circulation promotion</li></ul><h4>2. Surgical Treatment</h4><ul><li><strong>Varicocele Surgery:</strong> Improve testicular blood circulation</li><li><strong>Vasovasostomy:</strong> Restore vas deferens patency</li><li><strong>Epididymovasostomy:</strong> Resolve epididymal obstruction</li><li><strong>Testicular Sperm Extraction:</strong> Obtain sperm for assisted reproduction</li></ul>',
    excerpt_zh: '全面介绍男性不育症的原因、诊断方法和多种治疗方案',
    excerpt_en: 'Comprehensive introduction to causes, diagnostic methods and various treatment options for male infertility',
    slug: 'male-infertility-treatment-options',
    category: 'medical',
    featured_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=male%20fertility%20medical%20consultation%20doctor%20patient%20healthcare%20treatment&image_size=landscape_4_3',
    read_time: 16,
    published: true
  },
  {
    title_zh: '女性生育力评估指南',
    title_en: 'Female Fertility Assessment Guide',
    content_zh: '<h2>女性生育力全面评估</h2><p>生育力评估是制定个性化治疗方案的重要基础，帮助女性了解自己的生育潜力和最佳生育时机。</p><h3>评估的重要性</h3><ul><li><strong>早期发现问题：</strong>及时识别可能影响生育的因素</li><li><strong>制定治疗计划：</strong>为个性化治疗提供科学依据</li><li><strong>时间规划：</strong>帮助制定合理的生育时间表</li><li><strong>心理准备：</strong>减少不确定性，缓解焦虑</li></ul><h3>评估项目</h3><h4>1. 基础检查</h4><ul><li><strong>病史询问：</strong>月经史、生育史、手术史、家族史</li><li><strong>体格检查：</strong>身高体重、血压、妇科检查</li><li><strong>基础体温：</strong>监测排卵功能</li></ul><h4>2. 激素检查</h4><ul><li><strong>AMH（抗缪勒氏管激素）：</strong>评估卵巢储备功能</li><li><strong>FSH（促卵泡激素）：</strong>反映卵巢功能状态</li><li><strong>LH（黄体生成素）：</strong>评估排卵功能</li><li><strong>雌二醇（E2）：</strong>了解卵巢功能</li><li><strong>泌乳素（PRL）：</strong>排除高泌乳素血症</li><li><strong>甲状腺功能：</strong>TSH、T3、T4检测</li></ul><h4>3. 影像学检查</h4><ul><li><strong>经阴道超声：</strong>评估子宫、卵巢形态和卵泡数量</li><li><strong>输卵管造影：</strong>检查输卵管通畅性</li><li><strong>宫腔镜检查：</strong>评估宫腔内环境</li></ul><h4>4. 遗传学检查</h4><ul><li><strong>染色体核型分析：</strong>排除染色体异常</li><li><strong>基因检测：</strong>筛查遗传性疾病</li></ul><h3>结果解读</h3><ul><li><strong>优秀：</strong>各项指标正常，生育力良好</li><li><strong>良好：</strong>轻微异常，建议定期监测</li><li><strong>一般：</strong>存在影响因素，需要治疗干预</li><li><strong>较差：</strong>多项异常，建议积极治疗</li></ul>',
    content_en: '<h2>Comprehensive Female Fertility Assessment</h2><p>Fertility assessment is an important foundation for developing personalized treatment plans, helping women understand their fertility potential and optimal timing for conception.</p><h3>Importance of Assessment</h3><ul><li><strong>Early Problem Detection:</strong> Timely identification of factors that may affect fertility</li><li><strong>Treatment Planning:</strong> Provide scientific basis for personalized treatment</li><li><strong>Time Planning:</strong> Help develop reasonable fertility timeline</li><li><strong>Psychological Preparation:</strong> Reduce uncertainty and alleviate anxiety</li></ul><h3>Assessment Items</h3><h4>1. Basic Examination</h4><ul><li><strong>Medical History:</strong> Menstrual history, reproductive history, surgical history, family history</li><li><strong>Physical Examination:</strong> Height, weight, blood pressure, gynecological examination</li><li><strong>Basal Body Temperature:</strong> Monitor ovulation function</li></ul><h4>2. Hormone Testing</h4><ul><li><strong>AMH (Anti-Müllerian Hormone):</strong> Assess ovarian reserve function</li><li><strong>FSH (Follicle Stimulating Hormone):</strong> Reflect ovarian function status</li><li><strong>LH (Luteinizing Hormone):</strong> Evaluate ovulation function</li><li><strong>Estradiol (E2):</strong> Understand ovarian function</li><li><strong>Prolactin (PRL):</strong> Rule out hyperprolactinemia</li><li><strong>Thyroid Function:</strong> TSH, T3, T4 testing</li></ul><h4>3. Imaging Studies</h4><ul><li><strong>Transvaginal Ultrasound:</strong> Assess uterine and ovarian morphology and follicle count</li><li><strong>Hysterosalpingography:</strong> Check fallopian tube patency</li><li><strong>Hysteroscopy:</strong> Evaluate intrauterine environment</li></ul><h4>4. Genetic Testing</h4><ul><li><strong>Chromosomal Karyotype Analysis:</strong> Rule out chromosomal abnormalities</li><li><strong>Genetic Testing:</strong> Screen for hereditary diseases</li></ul><h3>Result Interpretation</h3><ul><li><strong>Excellent:</strong> All indicators normal, good fertility</li><li><strong>Good:</strong> Minor abnormalities, regular monitoring recommended</li><li><strong>Fair:</strong> Influencing factors present, treatment intervention needed</li><li><strong>Poor:</strong> Multiple abnormalities, active treatment recommended</li></ul>',
    excerpt_zh: '详细介绍女性生育力评估的项目、方法和结果解读',
    excerpt_en: 'Detailed introduction to female fertility assessment items, methods and result interpretation',
    slug: 'female-fertility-assessment-guide',
    category: 'medical',
    featured_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=female%20fertility%20assessment%20medical%20examination%20ultrasound%20healthcare&image_size=landscape_4_3',
    read_time: 14,
    published: true
  },
  {
    title_zh: '试管婴儿费用详解',
    title_en: 'IVF Cost Breakdown',
    content_zh: '<h2>试管婴儿费用全面解析</h2><p>了解试管婴儿的费用构成有助于患者做好经济准备和合理规划。费用因地区、医院、个人情况而异。</p><h3>费用构成</h3><h4>1. 前期检查费用</h4><ul><li><strong>女方检查：</strong>激素检查、超声检查、输卵管造影等（5000-8000元）</li><li><strong>男方检查：</strong>精液分析、激素检查、遗传学检查等（3000-5000元）</li><li><strong>特殊检查：</strong>染色体检查、免疫学检查等（2000-4000元）</li></ul><h4>2. 药物费用</h4><ul><li><strong>促排卵药物：</strong>根据方案和剂量不同（8000-15000元）</li><li><strong>降调节药物：</strong>长方案需要（2000-4000元）</li><li><strong>黄体支持药物：</strong>移植后使用（1000-2000元）</li></ul><h4>3. 手术费用</h4><ul><li><strong>取卵手术：</strong>包括麻醉费用（3000-5000元）</li><li><strong>胚胎培养：</strong>实验室费用（3000-6000元）</li><li><strong>胚胎移植：</strong>移植手术费用（2000-3000元）</li></ul><h4>4. 特殊技术费用</h4><ul><li><strong>ICSI技术：</strong>单精子注射（3000-5000元）</li><li><strong>胚胎冷冻：</strong>保存费用（2000-3000元/年）</li><li><strong>PGT检测：</strong>遗传学筛查（8000-15000元）</li></ul><h3>总费用估算</h3><ul><li><strong>常规试管婴儿：</strong>3-5万元/周期</li><li><strong>二代试管婴儿：</strong>4-6万元/周期</li><li><strong>三代试管婴儿：</strong>8-12万元/周期</li></ul><h3>费用节省建议</h3><ul><li><strong>选择合适时机：</strong>年龄越小成功率越高，总费用越低</li><li><strong>充分准备：</strong>做好身体调理，提高一次成功率</li><li><strong>合理选择：</strong>根据自身情况选择合适的技术</li><li><strong>保险咨询：</strong>了解医疗保险覆盖情况</li></ul>',
    content_en: '<h2>Comprehensive IVF Cost Analysis</h2><p>Understanding the cost structure of IVF helps patients prepare financially and plan reasonably. Costs vary by region, hospital, and individual circumstances.</p><h3>Cost Components</h3><h4>1. Pre-treatment Examination Costs</h4><ul><li><strong>Female Examinations:</strong> Hormone tests, ultrasound, hysterosalpingography ($800-1200)</li><li><strong>Male Examinations:</strong> Semen analysis, hormone tests, genetic testing ($500-800)</li><li><strong>Special Tests:</strong> Chromosome testing, immunological tests ($300-600)</li></ul><h4>2. Medication Costs</h4><ul><li><strong>Ovulation Stimulation Drugs:</strong> Varies by protocol and dosage ($1200-2400)</li><li><strong>Down-regulation Drugs:</strong> Required for long protocols ($300-600)</li><li><strong>Luteal Support Drugs:</strong> Used after transfer ($150-300)</li></ul><h4>3. Surgical Costs</h4><ul><li><strong>Egg Retrieval Surgery:</strong> Including anesthesia ($500-800)</li><li><strong>Embryo Culture:</strong> Laboratory fees ($500-900)</li><li><strong>Embryo Transfer:</strong> Transfer procedure ($300-500)</li></ul><h4>4. Special Technology Costs</h4><ul><li><strong>ICSI Technology:</strong> Intracytoplasmic sperm injection ($500-800)</li><li><strong>Embryo Freezing:</strong> Storage fees ($300-500/year)</li><li><strong>PGT Testing:</strong> Genetic screening ($1200-2400)</li></ul><h3>Total Cost Estimates</h3><ul><li><strong>Conventional IVF:</strong> $5000-8000/cycle</li><li><strong>ICSI (Second Generation):</strong> $6000-9000/cycle</li><li><strong>PGT (Third Generation):</strong> $12000-18000/cycle</li></ul><h3>Cost-Saving Suggestions</h3><ul><li><strong>Choose Right Timing:</strong> Younger age means higher success rate and lower total cost</li><li><strong>Adequate Preparation:</strong> Good physical conditioning improves first-time success rate</li><li><strong>Reasonable Selection:</strong> Choose appropriate technology based on individual circumstances</li><li><strong>Insurance Consultation:</strong> Understand medical insurance coverage</li></ul>',
    excerpt_zh: '详细分析试管婴儿治疗的各项费用构成和节省建议',
    excerpt_en: 'Detailed analysis of IVF treatment cost components and money-saving suggestions',
    slug: 'ivf-cost-breakdown-guide',
    category: 'guide',
    featured_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20cost%20planning%20healthcare%20budget%20financial%20consultation&image_size=landscape_4_3',
    read_time: 12,
    published: true
  },
  {
    title_zh: '辅助生殖心理准备',
    title_en: 'Psychological Preparation for Assisted Reproduction',
    content_zh: '<h2>辅助生殖治疗的心理准备</h2><p>辅助生殖治疗不仅是身体上的挑战，更是心理上的考验。良好的心理准备有助于提高治疗成功率和生活质量。</p><h3>常见心理反应</h3><ul><li><strong>焦虑情绪：</strong>对治疗结果的担忧和不确定性</li><li><strong>抑郁情绪：</strong>长期治疗带来的情绪低落</li><li><strong>压力感：</strong>来自家庭、社会的期望压力</li><li><strong>自责情绪：</strong>认为不孕是自己的错误</li><li><strong>关系紧张：</strong>夫妻关系因治疗而产生摩擦</li></ul><h3>心理调适方法</h3><h4>1. 认知调整</h4><ul><li><strong>正确认识：</strong>不孕症是医学问题，不是个人缺陷</li><li><strong>合理期望：</strong>了解治疗成功率，设定现实目标</li><li><strong>积极思维：</strong>关注治疗的积极方面</li></ul><h4>2. 情绪管理</h4><ul><li><strong>放松训练：</strong>深呼吸、冥想、瑜伽等</li><li><strong>运动锻炼：</strong>适度运动释放压力</li><li><strong>兴趣爱好：</strong>培养其他兴趣转移注意力</li></ul><h4>3. 社会支持</h4><ul><li><strong>夫妻沟通：</strong>开诚布公地交流感受</li><li><strong>家庭支持：</strong>获得家人的理解和支持</li><li><strong>朋友陪伴：</strong>与信任的朋友分享</li><li><strong>专业帮助：</strong>寻求心理咨询师的帮助</li></ul><h3>治疗期间的心理护理</h3><ul><li><strong>保持规律作息：</strong>充足睡眠，规律饮食</li><li><strong>避免过度关注：</strong>不要过分关注每个细节</li><li><strong>准备应对方案：</strong>为可能的结果做好心理准备</li><li><strong>寻求专业支持：</strong>参加支持小组或心理咨询</li></ul><h3>伴侣关系维护</h3><ul><li><strong>共同面对：</strong>将治疗视为共同的挑战</li><li><strong>分工合作：</strong>合理分配治疗相关的任务</li><li><strong>保持亲密：</strong>维持除生育外的亲密关系</li><li><strong>未来规划：</strong>讨论各种可能的未来计划</li></ul>',
    content_en: '<h2>Psychological Preparation for Assisted Reproduction Treatment</h2><p>Assisted reproduction treatment is not only a physical challenge but also a psychological test. Good psychological preparation helps improve treatment success rates and quality of life.</p><h3>Common Psychological Reactions</h3><ul><li><strong>Anxiety:</strong> Worry and uncertainty about treatment outcomes</li><li><strong>Depression:</strong> Emotional low caused by long-term treatment</li><li><strong>Stress:</strong> Pressure from family and social expectations</li><li><strong>Self-blame:</strong> Believing infertility is ones own fault</li><li><strong>Relationship Tension:</strong> Marital friction caused by treatment</li></ul><h3>Psychological Adjustment Methods</h3><h4>1. Cognitive Adjustment</h4><ul><li><strong>Correct Understanding:</strong> Infertility is a medical problem, not a personal defect</li><li><strong>Realistic Expectations:</strong> Understand treatment success rates, set realistic goals</li><li><strong>Positive Thinking:</strong> Focus on positive aspects of treatment</li></ul><h4>2. Emotional Management</h4><ul><li><strong>Relaxation Training:</strong> Deep breathing, meditation, yoga, etc.</li><li><strong>Exercise:</strong> Moderate exercise to release stress</li><li><strong>Hobbies:</strong> Develop other interests to divert attention</li></ul><h4>3. Social Support</h4><ul><li><strong>Couple Communication:</strong> Openly communicate feelings</li><li><strong>Family Support:</strong> Gain understanding and support from family</li><li><strong>Friend Companionship:</strong> Share with trusted friends</li><li><strong>Professional Help:</strong> Seek help from psychological counselors</li></ul><h3>Psychological Care During Treatment</h3><ul><li><strong>Maintain Regular Schedule:</strong> Adequate sleep, regular diet</li><li><strong>Avoid Over-focusing:</strong> Dont pay excessive attention to every detail</li><li><strong>Prepare Coping Strategies:</strong> Be psychologically prepared for possible outcomes</li><li><strong>Seek Professional Support:</strong> Join support groups or psychological counseling</li></ul><h3>Partner Relationship Maintenance</h3><ul><li><strong>Face Together:</strong> View treatment as a shared challenge</li><li><strong>Divide and Cooperate:</strong> Reasonably allocate treatment-related tasks</li><li><strong>Maintain Intimacy:</strong> Preserve intimate relationships beyond fertility</li><li><strong>Future Planning:</strong> Discuss various possible future plans</li></ul>',
    excerpt_zh: '全面指导辅助生殖治疗过程中的心理调适和情绪管理',
    excerpt_en: 'Comprehensive guidance on psychological adjustment and emotional management during assisted reproduction treatment',
    slug: 'psychological-preparation-assisted-reproduction',
    category: 'guide',
    featured_image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=psychological%20counseling%20mental%20health%20support%20therapy%20wellness&image_size=landscape_4_3',
    read_time: 13,
    published: true
  }
];

async function addArticles() {
  try {
    // 读取环境变量
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ 缺少Supabase环境变量');
      return;
    }

    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('🚀 开始添加7篇辅助生殖文章...');
    
    // 首先添加作者
    console.log('👨‍⚕️ 添加作者数据...');
    
    // 检查作者是否已存在
    const { data: existingAuthors } = await supabase
      .from('blog_authors')
      .select('name')
      .in('name', ['Dr. 李医生', '王护士长']);
    
    const authorsToAdd = [];
    if (!existingAuthors.find(a => a.name === 'Dr. 李医生')) {
      authorsToAdd.push({
        name: 'Dr. 李医生',
        bio_zh: '生殖医学专家，拥有20年临床经验',
        bio_en: 'Reproductive medicine specialist with 20 years of clinical experience',
        avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
      });
    }
    if (!existingAuthors.find(a => a.name === '王护士长')) {
      authorsToAdd.push({
        name: '王护士长',
        bio_zh: '资深护理专家，专注于辅助生殖护理',
        bio_en: 'Senior nursing expert specializing in assisted reproductive care',
        avatar_url: 'https://images.unsplash.com/photo-1594824475317-29bb4b71e0dc?w=150&h=150&fit=crop&crop=face'
      });
    }
    
    let authorError = null;
    if (authorsToAdd.length > 0) {
      const { error } = await supabase
        .from('blog_authors')
        .insert(authorsToAdd);
      authorError = error;
    }
    
    if (authorError) {
      console.error('❌ 添加作者失败:', authorError.message);
      return;
    }
    console.log('✅ 作者数据添加成功');
    
    // 获取作者ID
    const { data: authors } = await supabase
      .from('blog_authors')
      .select('id, name');
    
    const drLi = authors.find(a => a.name === 'Dr. 李医生');
    const nurseWang = authors.find(a => a.name === '王护士长');
    
    // 为文章分配作者
    const articlesWithAuthors = articles.map((article, index) => ({
      ...article,
      author_id: index % 2 === 0 ? drLi.id : nurseWang.id
    }));
    
    // 添加文章
    console.log('📝 添加文章数据...');
    for (let i = 0; i < articlesWithAuthors.length; i++) {
      const article = articlesWithAuthors[i];
      console.log(`📄 添加文章 ${i + 1}/7: ${article.title_zh}`);
      
      // 检查文章是否已存在
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('slug', article.slug)
        .single();
      
      let error = null;
      if (!existingPost) {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([article]);
        error = insertError;
      } else {
        console.log(`⚠️  文章已存在，跳过: ${article.title_zh}`);
      }
      
      if (error) {
        console.error(`❌ 添加文章失败: ${article.title_zh}`, error.message);
      } else {
        console.log(`✅ 文章添加成功: ${article.title_zh}`);
      }
    }
    
    // 验证数据
    console.log('\n🔍 验证数据...');
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('title_zh, category, published, created_at')
      .order('created_at', { ascending: false });
    
    if (postsError) {
      console.error('❌ 查询文章失败:', postsError.message);
    } else {
      console.log(`\n📊 数据库中共有 ${posts.length} 篇文章:`);
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title_zh} (${post.category}) - ${post.published ? '已发布' : '草稿'}`);
      });
    }
    
    console.log('\n🎉 7篇辅助生殖文章添加完成！');
    console.log('💡 现在您可以在管理页面 http://localhost:5173/admin/blog 查看和管理这些文章');
    
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
  }
}

// 执行脚本
addArticles();