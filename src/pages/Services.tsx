import { useTranslation } from 'react-i18next';
import { Microscope, Users, Building2, Shield, CheckCircle, MapPin } from 'lucide-react';

const services = [
  {
    icon: Microscope,
    title: 'services.ivf.title',
    description: 'services.ivf.description',
    features: [
      '先进的第三代试管婴儿技术',
      '个性化促排卵方案',
      '胚胎基因筛查(PGS/PGD)',
      '冷冻胚胎技术',
    ],
  },
];

const team = [
  {
    name: 'Dr. Sarah Johnson',
    title: '生殖医学专家',
    experience: '15年经验',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20doctor%20in%20white%20coat%20smiling%20confidently%20medical%20portrait%20photography&image_size=portrait_4_3',
  },
  {
    name: 'Dr. Michael Chen',
    title: '胚胎学专家',
    experience: '12年经验',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20doctor%20in%20white%20coat%20friendly%20smile%20medical%20portrait%20photography&image_size=portrait_4_3',
  },
  {
    name: 'Dr. Emily Wang',
    title: '遗传学顾问',
    experience: '10年经验',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20genetic%20counselor%20in%20medical%20attire%20warm%20smile%20portrait&image_size=portrait_4_3',
  },
];

const hospitals = [
  {
    name: 'Singapore Fertility Center',
    location: '新加坡',
    accreditation: 'JCI认证',
    specialties: ['IVF', 'ICSI', 'PGD'],
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20medical%20hospital%20building%20exterior%20clean%20architecture%20healthcare%20facility&image_size=landscape_4_3',
  },
  {
    name: 'Bangkok IVF Center',
    location: '泰国曼谷',
    accreditation: 'ISO认证',
    specialties: ['IVF', '卵子冷冻', '第三方辅助'],
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20medical%20center%20building%20modern%20glass%20facade%20healthcare%20architecture&image_size=landscape_4_3',
  },
  {
    name: 'Los Angeles Reproductive Center',
    location: '美国洛杉矶',
    accreditation: 'ASRM认证',
    specialties: ['IVF', 'PGS', '卵子捐赠'],
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=state%20of%20the%20art%20medical%20facility%20contemporary%20design%20fertility%20clinic&image_size=landscape_4_3',
  },
];

export default function Services() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t('services.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {t('services.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="flex flex-col lg:flex-row lg:items-center">
                  <div className="lg:w-1/2">
                    <div className="flex items-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-medical bg-primary text-white">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h2 className="ml-4 text-2xl font-bold text-foreground">
                        {t(service.title)}
                      </h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                      {t(service.description)}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-success mr-3" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 lg:mt-0 lg:w-1/2 lg:pl-8">
                    <img
                      src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20medical%20laboratory%20IVF%20equipment%20clean%20sterile%20environment%20fertility%20treatment&image_size=landscape_4_3"
                      alt="IVF Laboratory"
                      className="rounded-medical shadow-card w-full h-64 object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-muted py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {t('services.team.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('services.team.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-medical shadow-card overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-1">
                    {member.title}
                  </p>
                  <p className="text-gray-600">
                    {member.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hospitals Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {t('services.hospitals.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('services.hospitals.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {hospitals.map((hospital, index) => (
              <div key={index} className="bg-white rounded-medical shadow-card overflow-hidden">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{hospital.location}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Shield className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm text-primary font-medium">
                      {hospital.accreditation}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((specialty, specialtyIndex) => (
                      <span
                        key={specialtyIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}