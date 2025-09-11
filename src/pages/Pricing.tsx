import { useTranslation } from 'react-i18next';
import { Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    name: 'pricing.basic.title',
    price: 'pricing.basic.price',
    features: 'pricing.basic.features',
    popular: false,
  },
  {
    name: 'pricing.premium.title',
    price: 'pricing.premium.price',
    features: 'pricing.premium.features',
    popular: true,
  },
  {
    name: 'pricing.vip.title',
    price: 'pricing.vip.price',
    features: 'pricing.vip.features',
    popular: false,
  },
];

const additionalServices = [
  {
    name: '基因筛查 (PGS/PGD)',
    price: '¥15,000',
    description: '胚胎植入前基因筛查，提高成功率',
  },
  {
    name: '卵子冷冻',
    price: '¥8,000',
    description: '保存生育能力，延缓生育时间',
  },
  {
    name: '精子冷冻',
    price: '¥3,000',
    description: '男性生育力保存服务',
  },
  {
    name: '胚胎冷冻',
    price: '¥5,000',
    description: '剩余胚胎冷冻保存服务',
  },
];

const paymentMethods = [
  {
    name: '银行转账',
    description: '支持国内外银行转账',
    icon: '🏦',
  },
  {
    name: '信用卡支付',
    description: 'Visa, MasterCard, 银联',
    icon: '💳',
  },
  {
    name: '分期付款',
    description: '支持3-12期分期付款',
    icon: '📊',
  },
  {
    name: '医疗贷款',
    description: '合作金融机构医疗贷款',
    icon: '🏥',
  },
];

export default function Pricing() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t('pricing.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {t('pricing.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => {
              const features = t(plan.features, { returnObjects: true }) as string[];
              return (
                <div
                  key={index}
                  className={`relative rounded-medical shadow-card bg-white p-8 ${
                    plan.popular
                      ? 'ring-2 ring-primary transform scale-105'
                      : 'border border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                        <Star className="h-4 w-4 mr-1" />
                        {t('pricing.premium.popular')}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground">
                      {t(plan.name)}
                    </h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-primary">
                        {t(plan.price)}
                      </span>
                    </div>
                  </div>
                  
                  <ul className="mt-8 space-y-4">
                    {features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8">
                    <Link
                      to="/contact"
                      className={`block w-full rounded-medical px-6 py-3 text-center text-sm font-medium transition-colors duration-200 ${
                        plan.popular
                          ? 'bg-primary text-white hover:bg-primary-600'
                          : 'bg-primary-100 text-primary hover:bg-primary-200'
                      }`}
                    >
                      {t('common.getStarted')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-muted py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              附加服务
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              根据个人需求选择的专业医疗服务
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-medical shadow-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {service.name}
                </h3>
                <div className="text-2xl font-bold text-primary mb-3">
                  {service.price}
                </div>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              支付方式
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              多种便捷的支付选择，让您无忧付款
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-100 text-3xl mb-4">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {method.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              准备开始您的生育之旅？
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              联系我们的专业顾问，获取个性化的治疗方案和报价
            </p>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center rounded-medical bg-white px-8 py-3 text-base font-medium text-primary shadow-medical hover:bg-gray-50 transition-colors duration-200"
              >
                {t('common.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}