import { useTranslation } from 'react-i18next';
import { MessageCircle, Stethoscope, FileText, Plane, Heart, CheckCircle, FileCheck, UserCheck, Clock } from 'lucide-react';

const processSteps = [
  {
    icon: MessageCircle,
    title: 'process.steps.consultation.title',
    description: 'process.steps.consultation.description',
    duration: '1-2天',
    color: 'bg-blue-500',
  },
  {
    icon: Stethoscope,
    title: 'process.steps.evaluation.title',
    description: 'process.steps.evaluation.description',
    duration: '3-5天',
    color: 'bg-green-500',
  },
  {
    icon: FileText,
    title: 'process.steps.planning.title',
    description: 'process.steps.planning.description',
    duration: '2-3天',
    color: 'bg-purple-500',
  },
  {
    icon: Plane,
    title: 'process.steps.treatment.title',
    description: 'process.steps.treatment.description',
    duration: '2-4周',
    color: 'bg-orange-500',
  },
  {
    icon: Heart,
    title: 'process.steps.followup.title',
    description: 'process.steps.followup.description',
    duration: '持续跟进',
    color: 'bg-red-500',
  },
];

const timeline = [
  {
    phase: '准备阶段',
    duration: '1-2周',
    activities: [
      '初步咨询和评估',
      '医疗检查和报告',
      '签署治疗协议',
      '办理签证手续',
    ],
  },
  {
    phase: '治疗前期',
    duration: '2-3周',
    activities: [
      '抵达目的地国家',
      '医院复查和确认',
      '开始促排卵治疗',
      '定期监测和调整',
    ],
  },
  {
    phase: '治疗阶段',
    duration: '1-2周',
    activities: [
      '取卵手术',
      '精子处理和受精',
      '胚胎培养和筛查',
      '胚胎移植手术',
    ],
  },
  {
    phase: '康复期',
    duration: '2-3周',
    activities: [
      '术后休息和观察',
      '药物支持治疗',
      '妊娠检测',
      '返回国内',
    ],
  },
];

export default function Process() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t('process.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {t('process.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200 hidden lg:block"></div>
            
            <div className="space-y-12">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className="relative">
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex lg:items-center">
                      <div className={`flex-1 ${isEven ? 'pr-8 text-right' : 'pl-8 order-2'}`}>
                        <div className="bg-white rounded-medical shadow-card p-6">
                          <div className="flex items-center mb-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step.color} text-white mr-3`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {t(step.title)}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {step.duration}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">
                            {t(step.description)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Center Circle */}
                      <div className="relative flex h-8 w-8 items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-primary border-4 border-white shadow"></div>
                        <div className="absolute h-8 w-8 rounded-full bg-primary opacity-20 animate-pulse"></div>
                      </div>
                      
                      <div className={`flex-1 ${isEven ? 'pl-8 order-2' : 'pr-8'}`}></div>
                    </div>
                    
                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                      <div className="bg-white rounded-medical shadow-card p-6">
                        <div className="flex items-center mb-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step.color} text-white mr-3`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {t(step.title)}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {step.duration}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">
                          {t(step.description)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-muted py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              详细时间安排
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              完整的治疗周期时间规划
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((phase, index) => (
              <div key={index} className="bg-white rounded-medical shadow-card p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-lg font-bold mb-2">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {phase.phase}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {phase.duration}
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {phase.activities.map((activity, activityIndex) => (
                    <li key={activityIndex} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preparation Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {t('process.preparation.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Documents */}
            <div className="bg-white rounded-medical shadow-card p-8">
              <div className="flex items-center mb-6">
                <FileCheck className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold text-foreground">
                  {t('process.preparation.documents.title')}
                </h3>
              </div>
              
              <ul className="space-y-4">
                {(t('process.preparation.documents.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Medical Preparation */}
            <div className="bg-white rounded-medical shadow-card p-8">
              <div className="flex items-center mb-6">
                <UserCheck className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold text-foreground">
                  {t('process.preparation.medical.title')}
                </h3>
              </div>
              
              <ul className="space-y-4">
                {(t('process.preparation.medical.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              准备好开始您的治疗之旅了吗？
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              我们的专业团队将全程陪伴，确保您的治疗顺利进行
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-medical bg-white px-8 py-3 text-base font-medium text-primary shadow-medical hover:bg-gray-50 transition-colors duration-200"
              >
                {t('common.contactUs')}
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center rounded-medical border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-white hover:text-primary transition-colors duration-200"
              >
                {t('common.learnMore')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}