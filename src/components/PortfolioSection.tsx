'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

interface Project {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  projectUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectDisplay {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  category: string;
  stack: string[];
}

const fallbackProjects: ProjectDisplay[] = [
  {
    id: 1,
    name: 'Gold Elegance',
    description: 'Компания по декорированию мероприятий. Создаём незабываемую атмосферу с премиальными материалами',
    image: '/gold_elegance.png',
    link: 'https://price-list-goldelegance.vercel.app/',
    category: 'Лендинг',
    stack: ['Next.js', 'Tailwind CSS']
  },
  {
    id: 2,
    name: 'Say Yes',
    description: 'Креативный сайт-приглашение на свидание с интерактивными элементами и анимацией',
    image: '/sayyes.png',
    link: 'https://say-yes-or8y.vercel.app/',
    category: 'Веб-приложение',
    stack: ['React', 'Framer Motion', 'Tailwind CSS']
  },
  {
    id: 3,
    name: 'Diplomat',
    description: 'Агентство недвижимости полного цикла - продажа, покупка и аренда жилой и коммерческой недвижимости',
    image: '/agent.png',
    link: 'https://www.diplomat.kg',
    category: 'Недвижимость',
    stack: ['Next.js', 'PostgreSQL', 'Maps API', 'Prisma']
  },
  {
    id: 4,
    name: 'Apakai',
    description: 'Магазин уходовой косметики и мыломоющих средств с быстрой доставкой',
    image: '/apakai.png',
    link: 'https://apakai.vercel.app/',
    category: 'E-commerce',
    stack: ['React', 'Node.js', 'MongoDB', 'Stripe']
  },
  {
    id: 5,
    name: 'Kelkel Store',
    description: 'Магазин современной бытовой техники с доставкой по Кыргызстану',
    image: '/kelkel_store.png',
    link: 'https://kelkel.store/',
    category: 'Интернет-магазин',
    stack: ['Next.js', 'PostgreSQL', 'Prisma', 'Stripe']
  },
  {
    id: 6,
    name: 'Trade AI Analyzer',
    description: 'Сервис для анализа торговых сделок с использованием искусственного интеллекта',
    image: '/trade.png',
    link: 'https://trade-analyzer.vercel.app/',
    category: 'AI / Аналитика',
    stack: ['Python', 'FastAPI', 'OpenAI', 'React', 'PostgreSQL', 'Docker']
  },
  {
    id: 7,
    name: 'Bilimpoz',
    description: 'Образовательная платформа для онлайн-курсов и вебинаров',
    image: '/bilimpoz.png',
    link: 'https://bilimpoz.kg/',
    category: 'EdTech',
    stack: ['React', 'Firebase', 'WebRTC', 'Socket.io']
  },
  {
    id: 8,
    name: 'Unimark',
    description: 'Система маркетинговой аналитики для университетов',
    image: '/unimark.png',
    link: 'https://unimark.edu/',
    category: 'Аналитика',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Chart.js']
  },
  {
    id: 9,
    name: 'Lenging Platform',
    description: 'Платформа для дистанционного обучения английскому языку',
    image: '/lenging.png',
    link: 'https://lenging.com/',
    category: 'Образование',
    stack: ['Next.js', 'Socket.io', 'Redis', 'AWS S3']
  },
  {
    id: 10,
    name: 'MasterServic',
    description: 'Платформа для поиска мастеров и заказа услуг по ремонту',
    image: '/MasterServic.png',
    link: 'https://masterservic.kg/',
    category: 'Маркетплейс',
    stack: ['React', 'Node.js', 'MongoDB', 'WebSocket', 'Docker']
  },
  {
    id: 11,
    name: 'Kupi.kg',
    description: 'Интернет-магазин техники и электроники с каталогом, корзиной и доставкой по Кыргызстану',
    image: '/kupi.png',
    link: 'https://kupi.kg',
    category: 'Интернет-магазин',
    stack: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS']
  },
  {
    id: 12,
    name: 'Alatoo Building',
    description: 'Сайт строительной компании: услуги, реализованные объекты и приём заявок на проекты',
    image: '/stroykomp.png',
    link: 'https://www.alatoobuilding.kg/ru',
    category: 'Строительство',
    stack: ['Next.js', 'Tailwind CSS', 'PostgreSQL', 'Prisma']
  },
  {
    id: 13,
    name: 'DNS Shop KG',
    description: 'Компьютерный магазин с каталогом комплектующих, фильтрами и онлайн-заказом',
    image: '/komp.png',
    link: 'https://dns-shop.kg/',
    category: 'E-commerce',
    stack: ['Next.js', 'PostgreSQL', 'Prisma', 'Redis']
  }
];

function PortfolioCard({ project, index }: { project: ProjectDisplay; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a
      href={project.link !== '#' ? project.link : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-xl overflow-hidden bg-[#0a0a0a] border border-foreground/10 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
        {/* Project Screenshot */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-foreground/5 to-foreground/10">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className={`object-cover object-top transition-all duration-700 ${
              isHovered ? 'scale-110 brightness-75' : 'scale-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const t = e.currentTarget;
              if (!t.src.endsWith('/placeholder-project.svg')) t.src = '/placeholder-project.svg';
            }}
          />
          
          {/* Overlay градиент */}
          <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-80' : 'opacity-60'
          }`} />
          
          {/* Иконка внешней ссылки */}
          <div className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}>
            <svg className="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          
          {/* Категория (badge) */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">{project.category}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {project.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2">
            {project.description}
          </p>
          
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.stack.map((tech, i) => (
              <span 
                key={i} 
                className="text-xs px-2 py-1 rounded bg-foreground/5 text-foreground/70 border border-foreground/10"
              >
                {tech}
              </span>
            ))}
          </div>
          
          {/* View Project Link */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary pt-2">
            <span>Посмотреть проект</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function PortfolioSection() {
  const { targetRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        // Если в БД есть проекты И их больше чем в fallback - используем их
        if (data.success && data.projects?.length > fallbackProjects.length) {
          // Разные стеки только известные технологии
          const stackVariations = [
            ['Next.js', 'Tailwind CSS'], // Лендинг
            ['React', 'Framer Motion', 'Tailwind CSS'], // Say Yes
            ['Next.js', 'PostgreSQL', 'Maps API', 'Prisma'], // Недвижимость
            ['React', 'Node.js', 'MongoDB', 'Stripe'], // E-commerce
            ['Next.js', 'PostgreSQL', 'Prisma', 'Stripe'], // Интернет-магазин
            ['Python', 'FastAPI', 'OpenAI', 'React', 'PostgreSQL', 'Docker'], // AI сервис
            ['React', 'Firebase', 'WebRTC', 'Socket.io'], // EdTech
            ['React', 'Node.js', 'PostgreSQL', 'Chart.js'], // Аналитика
            ['Next.js', 'Socket.io', 'Redis', 'AWS S3'], // Образование
            ['React', 'Node.js', 'MongoDB', 'WebSocket', 'Docker'], // Маркетплейс
            ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS'], // Kupi.kg
            ['Next.js', 'Tailwind CSS', 'PostgreSQL', 'Prisma'], // Alatoo Building
            ['Next.js', 'PostgreSQL', 'Prisma', 'Redis'], // DNS Shop KG
          ];
          
          const categoryVariations = [
            'Лендинг',
            'Веб-приложение',
            'Недвижимость',
            'E-commerce',
            'Интернет-магазин',
            'AI / Аналитика',
            'EdTech',
            'Аналитика',
            'Образование',
            'Маркетплейс',
            'Интернет-магазин',
            'Строительство',
            'E-commerce',
          ];
          
          setProjects(data.projects.map((p: Project, idx: number) => ({
            id: p.id,
            name: p.title,
            description: p.description || '',
            image: p.imageUrl || '/placeholder-project.svg',
            link: p.projectUrl || '#',
            category: categoryVariations[idx % categoryVariations.length],
            stack: stackVariations[idx % stackVariations.length]
          })));
        } else {
          // Иначе показываем fallback проекты
          setProjects(fallbackProjects);
        }
      })
      .catch(() => setProjects(fallbackProjects))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      ref={targetRef}
      className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden"
    >
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 ${isVisible ? 'animate-section-slide-up' : 'opacity-0'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-medium text-primary">// projects</span>
          </div>
          
          <h2 className={`services-title text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-foreground mb-4 leading-tight ${isVisible ? 'animate-header-glow' : ''}`}>
            Наши{' '}
            <span className="text-primary relative inline-block">
              проекты
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 bg-primary rounded-full" />
            </span>
          </h2>
          
          <p className={`text-base sm:text-lg lg:text-xl text-foreground/60 max-w-3xl mx-auto font-light leading-relaxed ${isVisible ? 'animate-section-fade-scale delay-200' : 'opacity-0'}`}>
            Реальные продукты, которые работают прямо сейчас - проверьте их функциональность, скорость, дизайн
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ${
            isVisible ? 'animate-section-reveal-up delay-400' : 'opacity-0'
          }`}>
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`${isVisible ? 'animate-card-stagger' : 'opacity-0'}`}
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <PortfolioCard project={project} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className={`text-center mt-16 sm:mt-20 ${isVisible ? 'animate-section-slide-up delay-1000' : 'opacity-0'}`}>
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Сколько будет стоить{' '}
              <span className="text-primary">ваш проект?</span>
            </h3>
            
            <p className="text-base sm:text-lg text-foreground/60">
              Опишите идею нашему AI-ассистенту - получите расчет стоимости за минуту
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/calculator"
                className="group relative inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-background font-semibold text-base sm:text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Рассчитать стоимость
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700" />
              </a>
              
              <a
                href="https://t.me/codevai_team"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-foreground/20 hover:border-primary text-foreground hover:text-primary font-semibold text-base sm:text-lg px-8 py-4 rounded-full transition-all duration-300 hover:bg-primary/5 hover:scale-105"
              >
                Обсудить проект
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
