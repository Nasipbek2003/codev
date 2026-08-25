'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import useRowReveal, {
  getSideRevealTransform,
  REVEAL_TRANSITION
} from '@/hooks/useRowReveal';

// Принципы прозрачности
const transparencyPrinciples = [
  {
    number: "01",
    title: "Почасовая оплата",
    description: "Считаем время разработки и опыт команды. Без накруток на «бренд».",
    detail: "₽2500-5000/час в зависимости от сложности"
  },
  {
    number: "02", 
    title: "Видите прогресс",
    description: "Ежедневные отчеты о потраченном времени. Знаете, за что платите.",
    detail: "Отчеты каждые 24 часа"
  },
  {
    number: "03",
    title: "Без скрытых платежей", 
    description: "Никаких «дополнительных модулей» или неожиданных доплат.",
    detail: "Только согласованные изменения"
  },
  {
    number: "04",
    title: "Максимум за минимум",
    description: "Используем готовые решения там, где это разумно. Экономим ваш бюджет.", 
    detail: "Экономия до 40% времени"
  }
];

export default function PricingSection() {
  const { targetRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  const [isMobile, setIsMobile] = useState(false);

  // Количество колонок: 1 (моб.) / 2 (планшет и десктоп)
  const { columns, rows, activeRows, setRowRef } = useRowReveal(
    transparencyPrinciples,
    { columns: { base: 1, sm: 2, lg: 2 } }
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section 
      ref={targetRef}
      className="py-12 sm:py-8 lg:py-12 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Заголовок секции */}
        <div
          className={`text-center mb-6 sm:mb-8 lg:mb-10 ${
            isVisible ? 'animate-section-slide-up' : 'opacity-0'
          }`}
        >
          <h2 className={`services-title text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-foreground mb-2 sm:mb-4 leading-tight ${
            isVisible ? 'animate-header-glow' : ''
          }`}>
            Прозрачная стоимость{" "}
            <span className="text-primary relative inline-block">
              без лишних трат
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-primary rounded-full"></div>
            </span>
          </h2>
          
          <p className={`text-sm sm:text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed ${
            isVisible ? 'animate-section-fade-scale delay-200' : 'opacity-0'
          }`}>
            Мы считаем стоимость по времени и опыту разработчиков
          </p>
        </div>

        {/* Принципы - построчное появление с боков от центральной линии экрана */}
        <div className="grid gap-4 sm:gap-6 max-w-6xl mx-auto">
          {rows.map((row, rowIndex) => {
            const isRowActive = activeRows.has(rowIndex);

            return (
              <div
                key={`row-${rowIndex}`}
                ref={setRowRef(rowIndex)}
                className="grid gap-4 sm:gap-6"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {row.map((principle, indexInRow) => (
                  <div
                    key={principle.number}
                    className="group flex flex-col items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg border-l-4 border-primary/30 hover:border-primary/60 bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 will-change-transform"
                    style={{
                      opacity: isRowActive ? 1 : 0,
                      transform: isRowActive
                        ? 'translate3d(0, 0, 0)'
                        : getSideRevealTransform(indexInRow, row.length, rowIndex),
                      transition: REVEAL_TRANSITION
                    }}
                  >
                    {/* Номер и заголовок */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                          <span className="text-base sm:text-lg font-bold text-primary">
                            {principle.number}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {principle.title}
                      </h3>
                    </div>

                    {/* Контент */}
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        {principle.description}
                      </p>
                      <div className="text-xs text-primary/80 font-medium">
                        {principle.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Итоговое сообщение */}
        <div
          className={`text-center mt-5 sm:mt-6 max-w-2xl mx-auto ${
            isVisible ? 'animate-section-slide-up delay-1000' : 'opacity-0'
          }`}
        >
          <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed mb-3">
            Вы платите только за реальную работу без переплат за "престиж" агентства
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/students" className="w-full sm:w-auto">
              <button className={`
                    w-full sm:w-auto
                    border-2 border-primary/50 hover:border-primary
                    text-foreground hover:text-background hover:bg-primary
                    bg-primary/8
                    font-semibold text-base sm:text-lg lg:text-xl
                    px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5
                    rounded-full transition-all duration-300
                    hover:shadow-lg hover:shadow-primary/20
                    ${isMobile ? 'active:scale-95' : 'hover:scale-105'}
                    relative overflow-hidden group
                  `}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Для студентов
                      <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-primary text-background group-hover:bg-background group-hover:text-primary rounded transition-colors duration-300 leading-none">
                        NEW
                      </span>
                    </span>
                  </button>
            </Link>
            
            <Link href="/calculator" className="w-full sm:w-auto">
              <button className={`
                    w-full sm:w-auto
                    bg-primary hover:bg-primary-dark text-background 
                    font-semibold text-base sm:text-lg lg:text-xl 
                    px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 
                    rounded-full transition-all duration-300 
                    shadow-lg hover:shadow-xl 
                    ${isMobile ? 'active:scale-95' : 'hover:scale-105'}
                    relative overflow-hidden group
                  `}>
                    <span className="relative z-10">Калькулятор стоимости</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/0 via-white/10 to-primary-dark/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                  </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
