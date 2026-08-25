'use client';

import { useState } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const testimonials = [
  {
    id: 1,
    name: 'Айгуль М.',
    role: 'Владелица магазина косметики',
    text: 'Заказали интернет-магазин и остались очень довольны. Ребята вникли в специфику нашего бизнеса, предложили функции, о которых мы сами не думали. Сдали точно в срок, поддержка на связи 24/7.',
    project: 'Apakai',
    rating: 5
  },
  {
    id: 2,
    name: 'Бекжан Т.',
    role: 'Предприниматель',
    text: 'Нужен был сайт для бизнеса по декору мероприятий. Codev сделали стильный каталог с расчётом стоимости. Клиенты теперь сами выбирают и считают - нагрузка на менеджеров упала в разы.',
    project: 'Gold Elegance',
    rating: 5
  },
  {
    id: 3,
    name: 'Нурлан К.',
    role: 'Директор магазина техники',
    text: 'Сделали полноценный интернет-магазин с интеграцией складского учёта. Процесс был полностью прозрачным - видели прогресс каждый день. Рекомендую всем, кто хочет качество без переплаты.',
    project: 'Kelkel Store',
    rating: 5
  }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-foreground/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
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
            Что говорят{" "}
            <span className="text-primary relative inline-block">
              наши клиенты
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-primary rounded-full"></div>
            </span>
          </h2>
          <p className={`text-sm sm:text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed ${
            isVisible ? 'animate-section-fade-scale delay-200' : 'opacity-0'
          }`}>
            Реальные отзывы от реальных людей
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto ${
          isVisible ? 'animate-section-reveal-up delay-400' : 'opacity-0'
        }`}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`relative p-6 rounded-xl border border-foreground/10 bg-background/80 hover:border-primary/30 transition-all duration-300 group ${
                isVisible ? 'animate-card-stagger' : 'opacity-0'
              }`}
              style={{ animationDelay: `${0.5 + index * 0.15}s` }}
            >
              <svg className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <StarRating rating={testimonial.rating} />

              <p className="mt-4 text-sm sm:text-base text-foreground/80 leading-relaxed">
                {testimonial.text}
              </p>

              <div className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-xs text-foreground/50">{testimonial.role}</p>
                </div>
                <span className="text-xs font-medium text-primary/70 bg-primary/10 px-2 py-1 rounded-full">
                  {testimonial.project}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
