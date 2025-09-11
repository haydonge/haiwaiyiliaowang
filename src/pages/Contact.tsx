import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Headphones, Calendar } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const contactMethods = [
  {
    icon: Headphones,
    title: '电话咨询',
    description: '专业医疗顾问为您答疑',
    contact: '+86 400-123-4567',
    available: '周一至周日 9:00-18:00',
  },
  {
    icon: MessageSquare,
    title: '微信咨询',
    description: '扫码添加专属顾问微信',
    contact: 'MedicalFertility2024',
    available: '24小时在线服务',
  },
  {
    icon: Send,
    title: '邮件咨询',
    description: '详细咨询请发送邮件',
    contact: 'info@medical-fertility.com',
    available: '24小时内回复',
  },
];

const offices = [
  {
    city: '北京总部',
    address: '北京市朝阳区建国门外大街1号',
    phone: '+86 10-8888-9999',
    hours: '周一至周五 9:00-18:00',
  },
  {
    city: '上海分部',
    address: '上海市浦东新区陆家嘴环路1000号',
    phone: '+86 21-6666-7777',
    hours: '周一至周五 9:00-18:00',
  },
  {
    city: '深圳分部',
    address: '深圳市南山区深南大道9999号',
    phone: '+86 755-3333-4444',
    hours: '周一至周五 9:00-18:00',
  },
];

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 这里应该调用实际的API
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t('contact.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="bg-white rounded-medical shadow-card p-8 text-center">
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-100 mb-6">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {method.description}
                  </p>
                  <div className="text-primary font-medium mb-2">
                    {method.contact}
                  </div>
                  <div className="text-sm text-gray-500">
                    {method.available}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="bg-muted py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="bg-white rounded-medical shadow-card p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t('contact.form.title')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-medical focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="请输入您的姓名"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-medical focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="请输入您的邮箱地址"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-medical focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="请输入您的联系电话"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-medical focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="请详细描述您的咨询需求..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-medical shadow-medical text-base font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  {isSubmitting ? t('common.loading') : t('contact.form.submit')}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-medical">
                    <p className="text-green-800">{t('contact.form.success')}</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-medical">
                    <p className="text-red-800">{t('contact.form.error')}</p>
                  </div>
                )}
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-medical shadow-card p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  联系信息
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700">{t('contact.info.phone')}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700">{t('contact.info.email')}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-gray-700">{t('contact.info.address')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700">{t('contact.info.hours')}</span>
                  </div>
                </div>
              </div>
              
              {/* Office Locations */}
              <div className="bg-white rounded-medical shadow-card p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  办公地点
                </h3>
                
                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="font-medium text-foreground mb-2">
                        {office.city}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{office.address}</p>
                        <p>{office.phone}</p>
                        <p>{office.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}