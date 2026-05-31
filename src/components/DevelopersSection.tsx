'use client';

import Image from 'next/image';
import Link from 'next/link';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

export default function DevelopersSection() {
  const { targetRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  return (
    <section
      ref={targetRef}
      className="py-12 sm:py-8 lg:py-12 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-6 sm:mb-8 lg:mb-10 ${
          isVisible ? 'animate-section-slide-up' : 'opacity-0'
        }`}>
          <h2 className={`services-title text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-foreground mb-2 sm:mb-4 leading-tight ${
            isVisible ? 'animate-header-glow' : ''
          }`}>
            Наша{" "}
            <span className="text-primary relative inline-block">
              команда
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-primary rounded-full"></div>
            </span>
          </h2>
          <p className={`text-sm sm:text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed ${
            isVisible ? 'animate-section-fade-scale delay-200' : 'opacity-0'
          }`}>
            Профессионалы, создающие инновационные решения
          </p>
        </div>

        <div className={`flex justify-center ${
          isVisible ? 'animate-section-reveal-up delay-400' : 'opacity-0'
        }`}>
          <Link href="/developer/nasipbek" className="group block">
            <div className="relative bg-background/80 border border-foreground/10 hover:border-primary/30 rounded-2xl p-8 transition-all duration-300 max-w-md hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>

              <div className="relative">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-foreground/10 shadow-xl group-hover:ring-primary/40 transition-all duration-300">
                  <Image
                    src="/my_photo.jpg"
                    alt="Абдрахманов Насипбек"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Абдрахманов Насипбек
                  </h3>
                  <p className="text-lg text-foreground/60 mb-4">
                    Fullstack разработчик
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL'].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary/10 rounded-full text-sm text-foreground/70 border border-foreground/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    <span>Узнать больше</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
