import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Stethoscope, Heart } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const navigation = [
  { name: 'nav.home', href: '/' },
  { name: 'nav.services', href: '/services' },
  { name: 'nav.pricing', href: '/pricing' },
  { name: 'nav.process', href: '/process' },
  { name: 'nav.contact', href: '/contact' },
  { name: 'nav.blog', href: '/blog' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-neutral-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-medium group-hover:shadow-glow transition-all duration-300">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground group-hover:text-primary-600 transition-colors duration-200">
                  海外医疗
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  专业辅助生殖服务
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-body-md font-semibold rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-700 bg-primary-50 shadow-soft'
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                {t(item.name)}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right side - Language Switcher & CTA */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <LanguageSwitcher />
            <Link
              to="/contact"
              className="group inline-flex items-center px-6 py-3 text-body-md font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-medium hover:shadow-large hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {t('common.contactUs')}
              <div className="ml-2 w-2 h-2 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors duration-200"></div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md border-t border-neutral-100 shadow-soft rounded-b-2xl mx-4 mb-4">
              <div className="space-y-2 p-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block rounded-xl px-4 py-3 text-body-md font-semibold transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 shadow-soft'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      {t(item.name)}
                      {isActive(item.href) && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-neutral-100">
                  <Link
                    to="/contact"
                    className="block w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 text-center text-body-md font-bold text-white shadow-medium hover:shadow-large hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('common.contactUs')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}