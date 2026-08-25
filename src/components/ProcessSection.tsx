'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const processSteps = [
  {
    id: 1,
    title: "Расскажите нам о своём проекте",
    description: "В любом формате: краткий текст, список функций или даже голосовое сообщение.",
  },
  {
    id: 2,
    title: "Мы готовим прозрачное предложение",
    description: "Детальное КП с функциями, сроками и стоимостью. Без «подводных камней».",
  },
  {
    id: 3,
    title: "Договор и старт",
    description: "Подписываем соглашение, вы вносите предоплату, и мы начинаем разработку.",
  },
  {
    id: 4,
    title: "Разработка в реальном времени",
    description: "Вы получаете доступ к тестовой версии проекта и видите прогресс вживую.",
  },
  {
    id: 5,
    title: "Готовое решение",
    description: "Передача проекта, обучение команды и техническая поддержка.",
  }
];

export default function ProcessSection() {
  const { targetRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Прогресс линии = самый дальний открытый шаг
  const lineProgress = visibleSteps.size === 0
    ? 0
    : (Math.max(...visibleSteps) + 1) / processSteps.length;

  // Шаг открывается, когда его верх поднялся выше центра экрана,
  // и остаётся открытым при дальнейшем скролле вниз.
  // Скрывается только на обратном пути, когда снова опускается ниже линии.
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (motionQuery.matches) {
      setVisibleSteps(new Set(processSteps.map((_, i) => i)));
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight / 2;

      setVisibleSteps((prev) => {
        const next = new Set(prev);
        let changed = false;

        stepRefs.current.forEach((step, index) => {
          if (!step) return;
          const { top } = step.getBoundingClientRect();
          const wasVisible = prev.has(index);
          // Гистерезис, чтобы шаг не мерцал ровно на линии триггера
          const shouldBeVisible = wasVisible ? top <= line + 8 : top <= line;

          if (shouldBeVisible && !wasVisible) {
            next.add(index);
            changed = true;
          } else if (!shouldBeVisible && wasVisible) {
            next.delete(index);
            changed = true;
          }
        });

        return changed ? next : prev;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section 
      ref={targetRef}
      className="py-12 sm:py-8 lg:py-12 bg-background relative overflow-hidden"
    >
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Заголовок секции */}
        <div className={`text-center mb-6 sm:mb-8 lg:mb-10 ${isVisible ? 'animate-section-slide-up' : 'opacity-0'}`}>
          <h2 className={`services-title text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-foreground mb-2 sm:mb-4 leading-tight ${
            isVisible ? 'animate-header-glow' : ''
          }`}>
            Как из идеи рождается{" "}
            <span className="text-primary relative inline-block">
              готовый продукт
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-primary rounded-full"></div>
            </span>
          </h2>
          
          <p className={`text-sm sm:text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed ${
            isVisible ? 'animate-section-fade-scale delay-200' : 'opacity-0'
          }`}>
            Прозрачный процесс разработки без сюрпризов и скрытых платежей
          </p>
        </div>

        {/* Timeline Process Steps */}
        <div className={`max-w-2xl mx-auto relative ${
          isVisible ? 'animate-section-reveal-up delay-400' : 'opacity-0'
        }`}>
          {/* Вертикальная линия — фон */}
          <div className="absolute left-[15px] top-4 bottom-4 w-0.5 rounded-full bg-foreground/10" />

          {/* Вертикальная линия — прогресс по скроллу */}
          <div
            className="absolute left-[15px] top-4 w-0.5 rounded-full bg-primary/50 origin-top"
            style={{
              bottom: 16,
              transform: `scaleY(${lineProgress})`,
              transition: 'transform 0.6s ease-out',
              boxShadow: '0 0 8px rgba(174, 239, 16, 0.5)'
            }}
          />

          {/* Шаги процесса */}
          <ol className="relative space-y-8 sm:space-y-12 lg:space-y-16">
            {processSteps.map((step, index) => {
              const isStepVisible = visibleSteps.has(index);

              return (
                <li
                  key={step.id}
                  ref={(el) => { stepRefs.current[index] = el; }}
                  className="relative pl-12 sm:pl-16"
                >
                  {/* Точка на линии — выровнена по центру номера шага */}
                  <span
                    className="absolute left-[10px] top-[10px] flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span
                      className={`absolute w-4 h-4 rounded-full bg-primary transition-all duration-500 ${
                        isStepVisible ? 'opacity-20 scale-100' : 'opacity-0 scale-50'
                      }`}
                    />
                    <span
                      className={`w-3 h-3 rounded-full bg-primary transition-all duration-500 ${
                        isStepVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                      }`}
                    />
                    <span
                      className={`absolute w-1 h-1 rounded-full bg-white transition-opacity duration-500 delay-100 ${
                        isStepVisible ? 'opacity-80' : 'opacity-0'
                      }`}
                    />
                  </span>

                  {/* Контент шага */}
                  <div
                    className={`transition-all duration-700 ease-out ${
                      isStepVisible
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-8'
                    }`}
                  >
                    {/* Номер шага */}
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm transition-transform duration-500 ${
                      isStepVisible ? 'scale-100' : 'scale-75'
                    }`}>
                      {step.id}
                    </div>

                    <h3 className="mt-2 text-base sm:text-lg lg:text-xl font-bold text-foreground mb-2">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm lg:text-base text-foreground/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* CTA внизу секции */}
        <div className={`text-center mt-8 sm:mt-10 lg:mt-12 ${
          isVisible ? 'animate-section-slide-up delay-1000' : 'opacity-0'
        }`}>
          <Link href="/calculator">
            <button className="bg-primary hover:bg-primary-dark text-background font-semibold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
              Начать проект прямо сейчас
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
