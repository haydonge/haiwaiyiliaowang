import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Stethoscope, UserCheck, Shield, ArrowRight, CheckCircle, Star, Phone, Mail, Activity, Microscope, Target, Users, Calendar, Building2 } from 'lucide-react';

const services = [
  {
    icon: Microscope,
    title: 'home.services.ivf.title',
    description: 'home.services.ivf.description',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20medical%20laboratory%20IVF%20equipment%20clean%20sterile%20environment%20fertility%20treatment&image_size=square',
  },
  {
    icon: Stethoscope,
    title: 'home.services.consultation.title',
    description: 'home.services.consultation.description',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20medical%20consultation%20doctor%20patient%20meeting%20healthcare%20advice&image_size=square',
  },
  {
    icon: Shield,
    title: 'home.services.support.title',
    description: 'home.services.support.description',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=caring%20medical%20support%20team%20healthcare%20professionals%20patient%20care&image_size=square',
  },
];

const stats = [
  {
    number: '85%',
    label: 'home.stats.successRate',
    icon: Target,
  },
  {
    number: '2000+',
    label: 'home.stats.clients',
    icon: Users,
  },
  {
    number: '10+',
    label: 'home.stats.experience',
    icon: Calendar,
  },
  {
    number: '50+',
    label: 'home.stats.hospitals',
    icon: Building2,
  },
];

const testimonials = [
  {
    name: '张女士',
    age: 35,
    location: '北京',
    content: '经过两年的努力，终于在海外成功怀孕。整个过程中，医疗团队非常专业，服务也很贴心。感谢他们帮我实现了做妈妈的梦想。',
    rating: 5,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20asian%20woman%20portrait%20smiling%20confident%20professional%20headshot&image_size=square',
  },
  {
    name: '李先生夫妇',
    age: 38,
    location: '上海',
    content: '选择海外试管婴儿是我们做过最正确的决定。先进的技术和个性化的服务让我们很快就成功了。现在我们的宝宝已经一岁了，非常健康。',
    rating: 5,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20asian%20couple%20portrait%20smiling%20together%20professional%20photo&image_size=square',
  },
  {
    name: '王女士',
    age: 32,
    location: '深圳',
    content: '从咨询到治疗，再到后续的跟进，每一个环节都让我感受到了专业和温暖。虽然过程有些辛苦，但结果非常值得。',
    rating: 5,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20woman%20portrait%20warm%20smile%20confident%20expression&image_size=square',
  },
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-secondary-600/5"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="flex flex-col justify-center animate-fade-in">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-body-md font-medium bg-primary-100 text-primary-700 border border-primary-200">
                  ✨ 专业海外医疗服务
                </span>
              </div>
              
              <h1 className="text-display-lg font-bold tracking-tight text-foreground lg:text-display-xl">
                {t('home.hero.title')}
              </h1>
              
              <p className="mt-8 text-body-xl text-neutral-600 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center px-8 py-4 text-body-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-medical shadow-medical hover:shadow-large hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {t('home.hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-8 py-4 text-body-lg font-semibold text-primary-700 bg-white border-2 border-primary-200 rounded-medical hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
                >
                  {t('common.learnMore')}
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="flex text-accent-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-body-md font-semibold text-neutral-700">4.9/5</span>
                  <span className="text-body-md text-neutral-500">2000+ 客户评价</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="relative">
                <img
                  src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20fertility%20clinic%20professional%20medical%20team%20clean%20bright%20environment%20healthcare%20professionals&image_size=portrait_4_3"
                  alt="Professional Medical Team"
                  className="w-full rounded-2xl shadow-large"
                />
                
                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-medium p-4 animate-scale-in">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-body-md font-semibold text-neutral-800">85% 成功率</p>
                      <p className="text-body-sm text-neutral-500">行业领先</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-medium p-4 animate-scale-in animation-delay-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-accent-600" />
                    </div>
                    <div>
                      <p className="text-body-md font-semibold text-neutral-800">10+ 年经验</p>
                      <p className="text-body-sm text-neutral-500">专业团队</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display-md font-bold text-white mb-4">
              {t('home.stats.title')}
            </h2>
            <p className="text-body-xl text-primary-100 max-w-2xl mx-auto">
              用数据说话，见证我们的专业实力与服务品质
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="text-display-sm font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-body-lg text-primary-100 font-medium">
                      {t(stat.label)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-body-md font-medium bg-secondary-100 text-secondary-700 border border-secondary-200">
                💎 核心服务
              </span>
            </div>
            <h2 className="text-display-md font-bold text-foreground mb-6">
              {t('home.services.title')}
            </h2>
            <p className="text-body-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              {t('home.services.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="group relative bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 transform hover:-translate-y-3 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={t(service.title)}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-medium group-hover:shadow-glow transition-all duration-300">
                        <IconComponent className="h-7 w-7" />
                      </div>
                      <h3 className="ml-4 text-title-xl font-bold text-foreground group-hover:text-primary-600 transition-colors duration-300">
                        {t(service.title)}
                      </h3>
                    </div>
                    
                    <p className="text-body-lg text-neutral-600 mb-8 leading-relaxed">
                      {t(service.description)}
                    </p>
                    
                    <Link
                      to="/services"
                      className="inline-flex items-center text-body-lg font-semibold text-primary-600 hover:text-primary-700 group-hover:translate-x-2 transition-all duration-300"
                    >
                      {t('common.learnMore')}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-body-md font-medium bg-accent-100 text-accent-700 border border-accent-200">
                💬 客户见证
              </span>
            </div>
            <h2 className="text-display-md font-bold text-foreground mb-6">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-body-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              {t('home.testimonials.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-neutral-50 rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 transform hover:-translate-y-2 p-8 border border-neutral-100">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center opacity-60">
                  <span className="text-2xl text-primary-600">"</span>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-medium"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-title-lg font-bold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-body-md text-neutral-500">
                      {testimonial.age}岁 · {testimonial.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent-500 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-body-lg text-neutral-700 leading-relaxed italic relative">
                  "{testimonial.content}"
                </blockquote>
                
                {/* Decorative gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-400 rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-body-lg font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                🚀 开启您的生育之旅
              </span>
            </div>
            
            <h2 className="text-display-lg font-bold text-white mb-6 lg:text-display-xl">
              准备开始您的生育之旅？
            </h2>
            
            <p className="text-body-xl text-primary-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              联系我们的专业顾问，获取免费咨询和个性化治疗方案。我们将为您提供最专业的海外医疗服务支持。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center px-10 py-5 text-body-lg font-bold text-primary-700 bg-white rounded-2xl shadow-large hover:shadow-glow hover:bg-neutral-50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <Phone className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                {t('common.contactUs')}
              </Link>
              
              <a
                href="mailto:info@medical-fertility.com"
                className="group inline-flex items-center justify-center px-10 py-5 text-body-lg font-bold text-white bg-white/20 border-2 border-white/40 rounded-2xl backdrop-blur-sm hover:bg-white/30 hover:border-white/60 transition-all duration-300"
              >
                <Mail className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                发送邮件
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12">
              <div className="flex items-center space-x-3 text-white/90">
                <CheckCircle className="h-6 w-6 text-secondary-300" />
                <span className="text-body-lg font-medium">免费咨询</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <CheckCircle className="h-6 w-6 text-secondary-300" />
                <span className="text-body-lg font-medium">专业团队</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <CheckCircle className="h-6 w-6 text-secondary-300" />
                <span className="text-body-lg font-medium">全程服务</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}