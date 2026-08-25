'use client';

import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import useRowReveal, {
  getSideRevealTransform,
  REVEAL_TRANSITION
} from '@/hooks/useRowReveal';

const guarantees = [
  {
    title: 'Договор и юридическая защита',
    description: 'Работаем по официальному договору. Все условия, сроки и стоимость зафиксированы документально.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    )
  },
  {
    title: 'Бесплатные правки на этапе дизайна',
    description: 'Не понравился макет? Переделаем бесплатно, пока не будете полностью довольны результатом.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    )
  },
  {
    title: '1 месяц бесплатной поддержки',
    description: 'После запуска проекта мы бесплатно исправляем баги и помогаем с любыми вопросами в течение 30 дней.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  },
  {
    title: 'Полная передача исходного кода',
    description: 'Вы получаете все исходники, доступы и документацию. Проект полностью ваш - никакой привязки к нам.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    )
  }
];

export default function GuaranteesSection() {
  const { targetRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Количество колонок: 1 (моб.) / 2 (планшет и десктоп)
  const { columns, rows, activeRows, setRowRef } = useRowReveal(guarantees, {
    columns: { base: 1, sm: 2, lg: 2 }
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
            Наши{" "}
            <span className="text-primary relative inline-block">
              гарантии
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-primary rounded-full"></div>
            </span>
          </h2>
          <p className={`text-sm sm:text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed ${
            isVisible ? 'animate-section-fade-scale delay-200' : 'opacity-0'
          }`}>
            Мы отвечаем за качество и результат
          </p>
        </div>

        {/* Сетка гарантий - построчное появление с боков от центральной линии экрана */}
        <div className="grid gap-4 sm:gap-6 max-w-4xl mx-auto">
          {rows.map((row, rowIndex) => {
            const isRowActive = activeRows.has(rowIndex);

            return (
              <div
                key={`row-${rowIndex}`}
                ref={setRowRef(rowIndex)}
                className="grid gap-4 sm:gap-6"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {row.map((guarantee, indexInRow) => (
                  <div
                    key={guarantee.title}
                    className="flex gap-4 p-5 sm:p-6 rounded-xl border border-foreground/10 hover:border-primary/30 bg-background/80 group will-change-transform"
                    style={{
                      opacity: isRowActive ? 1 : 0,
                      transform: isRowActive
                        ? 'translate3d(0, 0, 0)'
                        : getSideRevealTransform(indexInRow, row.length, rowIndex),
                      transition: REVEAL_TRANSITION
                    }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
                      {guarantee.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-300">
                        {guarantee.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed">
                        {guarantee.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
