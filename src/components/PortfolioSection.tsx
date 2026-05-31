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
}

const fallbackProjects: ProjectDisplay[] = [
  {
    id: 1,
    name: 'Gold Elegance',
    description: 'Компания по декорированию мероприятий. Создаём незабываемую атмосферу с премиальными материалами',
    image: '/gold_elegance.png',
    link: 'https://price-list-goldelegance.vercel.app/'
  },
  {
    id: 2,
    name: 'Apakai',
    description: 'Магазин уходовой косметики и мыломоющих средств с быстрой доставкой',
    image: '/apakai.png',
    link: 'https://apakai.vercel.app/'
  },
  {
    id: 3,
    name: 'Kelkel Store',
    description: 'Магазин современной бытовой техники с доставкой по Кыргызстану',
    image: '/kelkel_store.png',
    link: 'https://kelkel.store/'
  }
];

function PortfolioCard({ project }: { project: ProjectDisplay }) {
  const domain = project.link.replace(/^https?:\/\//, '').split('/')[0];
  return (
    <a
      href={project.link !== '#' ? project.link : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="group block flex-shrink-0 w-[300px] sm:w-[400px] lg:w-[460px]"
    >
      <div className="rounded-xl overflow-hidden border border-foreground/10 shadow-xl group-hover:border-primary/40 group-hover:shadow-primary/10 group-hover:shadow-2xl transition-all duration-500">
        {/* Chrome bar */}
        <div className="bg-[#1c1c1c] border-b border-white/10 px-3 py-2 flex items-center gap-2 select-none">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-2">
            <div className="bg-[#2c2c2c] rounded-md px-3 py-1 flex items-center gap-2 max-w-[260px] mx-auto">
              <svg className="w-2.5 h-2.5 text-foreground/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[10px] text-foreground/40 truncate font-mono">{domain}</span>
            </div>
          </div>
        </div>
        {/* Screenshot */}
        <div className="relative w-full h-48 sm:h-60 lg:h-64 overflow-hidden bg-white">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 300px, 460px"
            onError={(e) => {
              const t = e.currentTarget;
              if (!t.src.endsWith('/placeholder-project.svg')) t.src = '/placeholder-project.svg';
            }}
          />
        </div>
      </div>

      <div className="mt-4 px-1 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-foreground/60 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>
        <svg className="w-5 h-5 text-foreground/20 group-hover:text-primary mt-1 flex-shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
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
        if (data.success && data.projects?.length) {
          setProjects(data.projects.map((p: Project) => ({
            id: p.id,
            name: p.title,
            description: p.description || '',
            image: p.imageUrl || '/placeholder-project.svg',
            link: p.projectUrl || '#'
          })));
        } else {
          setProjects(fallbackProjects);
        }
      })
      .catch(() => setProjects(fallbackProjects))
      .finally(() => setLoading(false));
  }, []);

  // Утраиваем массив для бесшовной прокрутки (keyframes едет до -33.333%)
  const track = [...projects, ...projects, ...projects];

  return (
    <section
      ref={targetRef}
      className="py-12 sm:py-8 lg:py-12 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-10 ${isVisible ? 'animate-section-slide-up' : 'opacity-0'}`}>
          <h2 className={`services-title text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-foreground mb-2 sm:mb-4 leading-tight ${isVisible ? 'animate-header-glow' : ''}`}>
            Примеры{' '}
            <span className="text-primary relative inline-block">
              решений
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-primary rounded-full" />
            </span>
          </h2>
          <p className={`text-sm sm:text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed ${isVisible ? 'animate-section-fade-scale delay-200' : 'opacity-0'}`}>
            Проекты, которые мы создали для наших клиентов
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
      </div>

      {/* Бесконечная горизонтальная лента (на всю ширину экрана) */}
      {!loading && projects.length > 0 && (
        <div className={`relative ${isVisible ? 'animate-section-reveal-up delay-400' : 'opacity-0'}`}>
          <div
            className="group overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgb(0,0,0) 8%, rgb(0,0,0) 92%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgb(0,0,0) 8%, rgb(0,0,0) 92%, transparent 100%)',
            }}
          >
            <div
              className="flex gap-6 sm:gap-8 animate-marquee-left group-hover:pause w-max px-4"
              style={{
                ['--desktop-duration' as string]: '40s',
                ['--tablet-duration' as string]: '32s',
                ['--mobile-duration' as string]: '24s',
              }}
            >
              {track.map((project, i) => (
                <PortfolioCard key={`${project.id}-${i}`} project={project} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* CTA */}
        <div className={`text-center mt-10 sm:mt-12 ${isVisible ? 'animate-section-slide-up delay-1000' : 'opacity-0'}`}>
          <p className="text-xs sm:text-sm text-foreground/70 mb-4">
            Готовы создать свой проект? Расскажите о задачах
          </p>
          <a
            href="https://t.me/codevai_team"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-semibold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Начать проект
          </a>
        </div>
      </div>
    </section>
  );
}
