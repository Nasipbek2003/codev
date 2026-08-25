'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

/** Смещение карточки до появления, px (мягкое, без масштаба и блюра) */
const OFFSET = 40;
/** Запас, чтобы карточка не мерцала ровно на линии триггера */
const HYSTERESIS = 8;

const industries = [
  {
    title: 'Агентства недвижимости',
    description: 'Каталог объектов с фильтрами, карта, заявки на просмотр, личный кабинет риелтора.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    )
  },
  {
    title: 'Магазины техники и электроники',
    description: 'Витрина с характеристиками, сравнение товаров, корзина, онлайн-оплата, склад.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25" />
      </svg>
    )
  },
  {
    title: 'Строительные компании',
    description: 'Портфолио объектов, калькулятор смет, этапы работ, приём заявок с расчётом.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    )
  },
  {
    title: 'Магазины одежды и косметики',
    description: 'Каталог по категориям, размеры и варианты, акции, доставка и оплата онлайн.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    )
  },
  {
    title: 'Клиники и медцентры',
    description: 'Онлайн-запись к врачу, расписание приёмов, услуги и цены, история пациента.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    )
  },
  {
    title: 'Кафе и рестораны',
    description: 'Меню с фото, бронирование столиков, доставка, QR-меню для зала.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18a4.5 4.5 0 00-4.5 4.5v.75A2.25 2.25 0 009.75 10.5h4.5A2.25 2.25 0 0016.5 8.25V7.5A4.5 4.5 0 0012 3zM4.5 3v6.75a3 3 0 003 3M19.5 3v6.75a3 3 0 01-3 3" />
      </svg>
    )
  },
  {
    title: 'Автосалоны и автосервисы',
    description: 'Каталог авто и запчастей, запись на сервис, расчёт стоимости работ.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m0 0H2.25m19.5 0a1.125 1.125 0 00-.09-.44l-2.4-5.598A1.125 1.125 0 0018.226 7.5H5.774c-.45 0-.856.267-1.035.681l-2.4 5.599a1.125 1.125 0 00-.089.44" />
      </svg>
    )
  },
  {
    title: 'Онлайн-школы и курсы',
    description: 'Личный кабинет ученика, уроки и домашки, прогресс, оплата подписки.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    )
  },
  {
    title: 'Салоны красоты и фитнес',
    description: 'Онлайн-запись к мастеру, услуги и абонементы, напоминания клиентам.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    )
  },
  {
    title: 'Логистика и доставка',
    description: 'Приём заявок, трекинг заказов, расчёт маршрутов, панель диспетчера.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    )
  },
  {
    title: 'Опт и производство',
    description: 'B2B-каталог с прайсами, заявки от дилеров, интеграция со складом и 1С.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75" />
      </svg>
    )
  },
  {
    title: 'Услуги и частные мастера',
    description: 'Лендинг с портфолио, прайс, заявки в WhatsApp и Telegram, отзывы.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

/** Направление выезда карточки в зависимости от её места в строке */
function getHiddenTransform(
  indexInRow: number,
  rowLength: number,
  rowIndex: number
): string {
  // Одна колонка (мобильный): чередуем стороны — слева, справа, слева…
  if (rowLength === 1) {
    return rowIndex % 2 === 0
      ? `translate3d(-${OFFSET}px, 0, 0)`
      : `translate3d(${OFFSET}px, 0, 0)`;
  }

  if (indexInRow === 0) return `translate3d(-${OFFSET}px, 0, 0)`;
  if (indexInRow === rowLength - 1) return `translate3d(${OFFSET}px, 0, 0)`;
  return `translate3d(0, ${OFFSET}px, 0)`;
}

export default function IndustriesSection() {
  const { targetRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Количество колонок: 1 (моб.) / 2 (планшет) / 3 (десктоп).
  // Стартуем с 3 — совпадает с серверным рендером, уточняем после гидрации.
  const [columns, setColumns] = useState(3);
  const [activeRows, setActiveRows] = useState<Set<number>>(new Set());
  const [reducedMotion, setReducedMotion] = useState(false);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Разбиваем список на строки по текущему числу колонок
  const rows = useMemo(() => {
    const chunks: typeof industries[] = [];
    for (let i = 0; i < industries.length; i += columns) {
      chunks.push(industries.slice(i, i + columns));
    }
    return chunks;
  }, [columns]);

  // Отслеживаем брейкпоинты и prefers-reduced-motion
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener('change', syncMotion);

    const syncColumns = () => {
      const width = window.innerWidth;
      setColumns(width >= 1024 ? 3 : width >= 640 ? 2 : 1);
    };
    syncColumns();
    window.addEventListener('resize', syncColumns);

    return () => {
      motionQuery.removeEventListener('change', syncMotion);
      window.removeEventListener('resize', syncColumns);
    };
  }, []);

  // Строка активна, когда её верх поднялся выше центра экрана.
  // Обратное условие даёт симметричное скрытие при скролле вверх.
  useEffect(() => {
    if (reducedMotion) {
      setActiveRows(new Set(rows.map((_, i) => i)));
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight / 2;

      setActiveRows((prev) => {
        const next = new Set(prev);
        let changed = false;

        rowRefs.current.forEach((row, index) => {
          if (!row) return;
          const { top } = row.getBoundingClientRect();
          const wasActive = prev.has(index);
          // Гистерезис: порог включения и выключения слегка разнесён
          const shouldBeActive = wasActive
            ? top <= line + HYSTERESIS
            : top <= line;

          if (shouldBeActive && !wasActive) {
            next.add(index);
            changed = true;
          } else if (!shouldBeActive && wasActive) {
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
  }, [rows, reducedMotion]);

  return (
    <section
      ref={targetRef}
      className="py-12 sm:py-8 lg:py-12 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Заголовок секции */}
        <div className={`text-center mb-6 sm:mb-8 lg:mb-10 ${
          isVisible ? 'animate-section-slide-up' : 'opacity-0'
        }`}>
          <h2 className={`services-title text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-foreground mb-2 sm:mb-4 leading-tight ${
            isVisible ? 'animate-header-glow' : ''
          }`}>
            Для кого мы{" "}
            <span className="text-primary relative inline-block">
              разрабатываем
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-primary rounded-full"></div>
            </span>
          </h2>

          <p className={`text-sm sm:text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed ${
            isVisible ? 'animate-section-fade-scale delay-200' : 'opacity-0'
          }`}>
            Знаем специфику этих сфер — не начинаем с нуля, а сразу предлагаем работающие решения
          </p>
        </div>

        {/* Сетка сфер — построчное появление от центральной линии экрана */}
        <div className="grid gap-4 sm:gap-5 max-w-6xl mx-auto">
          {rows.map((row, rowIndex) => {
            const isRowActive = activeRows.has(rowIndex);

            return (
              <div
                key={`row-${rowIndex}`}
                ref={(el) => { rowRefs.current[rowIndex] = el; }}
                className="grid gap-4 sm:gap-5"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {row.map((industry, indexInRow) => (
                  <div
                    key={industry.title}
                    className="group flex gap-4 p-4 sm:p-5 rounded-xl border border-foreground/10 hover:border-primary/40 bg-background/80 hover:bg-primary/[0.03] will-change-transform"
                    style={{
                      opacity: isRowActive ? 1 : 0,
                      transform: isRowActive
                        ? 'translate3d(0, 0, 0)'
                        : getHiddenTransform(indexInRow, row.length, rowIndex),
                      transition:
                        'opacity 600ms ease-out, transform 600ms ease-out, border-color 300ms ease-out, background-color 300ms ease-out'
                    }}
                  >
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
                      {industry.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-300">
                        {industry.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed">
                        {industry.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* CTA для тех, кто не нашёл свою сферу */}
        <div className={`text-center mt-8 sm:mt-10 max-w-2xl mx-auto ${
          isVisible ? 'animate-section-slide-up delay-1000' : 'opacity-0'
        }`}>
          <p className="text-sm sm:text-base text-foreground/70 mb-4">
            Не нашли свою сферу? Мы работаем с любым бизнесом — опишите задачу, и ИИ-ассистент
            подберёт решение с расчётом стоимости.
          </p>

          <Link href="/calculator">
            <button className="bg-primary hover:bg-primary-dark text-background font-semibold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              Подобрать решение для моего бизнеса
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
