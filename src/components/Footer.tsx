import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, MessageSquare, Send, Facebook, Twitter, Instagram } from 'lucide-react';

const navigation = {
  main: [
    { name: 'nav.home', href: '/' },
    { name: 'nav.services', href: '/services' },
    { name: 'nav.pricing', href: '/pricing' },
    { name: 'nav.process', href: '/process' },
  ],
  support: [
    { name: 'nav.contact', href: '/contact' },
    { name: 'nav.blog', href: '/blog' },
    { name: 'footer.privacy', href: '/privacy' },
    { name: 'footer.terms', href: '/terms' },
  ],
};

const socialLinks = [
  {
    name: 'WeChat',
    href: '#',
    icon: MessageSquare,
  },
  {
    name: 'WhatsApp',
    href: '#',
    icon: Send,
  },
  {
    name: 'Email',
    href: 'mailto:info@medical-fertility.com',
    icon: Mail,
  },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-large">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">
                  {t('footer.company')}
                </span>
                <p className="text-sm text-neutral-300 font-medium">
                  专业辅助生殖服务
                </p>
              </div>
            </div>
            
            <p className="text-body-lg text-neutral-300 mb-8 max-w-lg leading-relaxed">
              {t('footer.description')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="group flex items-center space-x-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center group-hover:bg-primary-600/30 transition-colors duration-200">
                  <Phone className="h-5 w-5 text-primary-400" />
                </div>
                <span className="text-body-md text-neutral-200">{t('contact.info.phone')}</span>
              </div>
              
              <div className="group flex items-center space-x-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="w-10 h-10 bg-secondary-600/20 rounded-lg flex items-center justify-center group-hover:bg-secondary-600/30 transition-colors duration-200">
                  <Mail className="h-5 w-5 text-secondary-400" />
                </div>
                <span className="text-body-md text-neutral-200">{t('contact.info.email')}</span>
              </div>
              
              <div className="group flex items-center space-x-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="w-10 h-10 bg-accent-600/20 rounded-lg flex items-center justify-center group-hover:bg-accent-600/30 transition-colors duration-200">
                  <MapPin className="h-5 w-5 text-accent-400" />
                </div>
                <span className="text-body-md text-neutral-200">{t('contact.info.address')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-title-lg font-bold text-white mb-6">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="group flex items-center text-body-md text-neutral-300 hover:text-white transition-all duration-200"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    {t(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-title-lg font-bold text-white mb-6">
              {t('footer.services')}
            </h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="group flex items-center text-body-md text-neutral-300 hover:text-white transition-all duration-200"
                  >
                    <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    {t(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-16 pt-8 border-t border-neutral-700/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-body-md font-semibold text-neutral-300 mr-2">关注我们：</span>
              {socialLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <IconComponent className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
                  </a>
                );
              })}
            </div>
            
            {/* Copyright */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-2 lg:space-y-0 text-body-md text-neutral-400">
              <p>
                &copy; {new Date().getFullYear()} {t('footer.company')}. {t('footer.copyright')}.
              </p>
              <div className="flex items-center space-x-4">
                <Link to="/privacy" className="hover:text-neutral-200 transition-colors duration-200">
                  隐私政策
                </Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-neutral-200 transition-colors duration-200">
                  服务条款
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}