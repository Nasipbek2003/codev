'use client';

import { useState } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const faqs = [
  {
    question: 'Сколько стоит разработка сайта/приложения?',
    answer: 'Стоимость зависит от сложности проекта. Простой лендинг - от 30 000 сом, интернет-магазин - от 80 000 сом, сложное веб-приложение - от 150 000 сом. Точную стоимость можно рассчитать через наш AI-калькулятор или при личной консультации.'
  },
  {
    question: 'Какие сроки разработки?',
    answer: 'Лендинг - 1-2 недели, интернет-магазин - 3-6 недель, сложное приложение - от 2 месяцев. Мы всегда согласовываем сроки заранее и придерживаемся их. 100% наших проектов сданы в срок.'
  },
  {
    question: 'Что если результат не понравится?',
    answer: 'Мы работаем итерациями - вы видите прогресс каждый день и можете вносить правки на любом этапе. Если на первом этапе дизайн не устраивает - переделываем бесплатно до полного согласования.'
  },
  {
    question: 'Вы предоставляете поддержку после запуска?',
    answer: 'Да, первый месяц технической поддержки включён бесплатно. Далее - по договорённости. Мы исправляем баги, помогаем с обновлениями и обучаем вашу команду работе с системой.'
  },
  {
    question: 'Как происходит оплата?',
    answer: 'Предоплата 50% перед началом работы, остальные 50% после сдачи готового проекта. Для крупных проектов возможна поэтапная оплата. Работаем по договору.'
  },
  {
    question: 'Можно ли посмотреть примеры ваших работ?',
    answer: 'Да, наши реализованные проекты представлены в разделе "Примеры решений" на этой странице. Каждый проект можно посмотреть вживую, перейдя по ссылке.'
  }
];

export default function FAQSection() {
  const { targetRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            Частые{" "}
            <span className="text-primary relative inline-block">
              вопросы
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-primary rounded-full"></div>
            </span>
          </h2>
          <p className={`text-sm sm:text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed ${
            isVisible ? 'animate-section-fade-scale delay-200' : 'opacity-0'
          }`}>
            Ответы на вопросы, которые задают чаще всего
          </p>
        </div>

        <div className={`max-w-3xl mx-auto space-y-3 ${
          isVisible ? 'animate-section-reveal-up delay-400' : 'opacity-0'
        }`}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border border-foreground/10 rounded-xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-primary/30 bg-primary/5' : 'hover:border-foreground/20'
                } ${isVisible ? 'animate-card-stagger' : 'opacity-0'}`}
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                >
                  <span className="font-medium text-sm sm:text-base text-foreground pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-primary transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm sm:text-base text-foreground/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
