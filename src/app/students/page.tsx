'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

// ─── данные ──────────────────────────────────────────────────────────────────

// современные line-иконки
const IconDoc = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const IconCap = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);
const IconPencil = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
const IconText = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
  </svg>
);
const IconPresent = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
  </svg>
);
const IconGlobe = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const SERVICES = [
  { id: 'Курсовые',        icon: IconDoc,     desc: 'С расчётами, чертежами и защитой' },
  { id: 'ВКР (дипломная)', icon: IconCap,     desc: 'Полный пакет: пояснительная + код' },
  { id: 'СРС',             icon: IconPencil,  desc: 'Самостоятельные работы любой сложности' },
  { id: 'Реферат',         icon: IconText,    desc: 'Быстро, грамотно, уникально' },
  { id: 'Презентация',     icon: IconPresent, desc: 'PowerPoint / Google Slides под защиту' },
  { id: 'Создание сайта',  icon: IconGlobe,   desc: 'Сайт как часть дипломного проекта' },
];

const WHY_US = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Уникальность 80-95%',
    desc: 'Проверяем каждую работу перед сдачей через Antiplagiat.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Сдаём в срок',
    desc: 'Работаем с дедлайнами от 1 дня. Ни одной задержки.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
    title: 'Правки бесплатно',
    desc: 'Вносим изменения по замечаниям преподавателя без доплат.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.847-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: 'ИИ-контент меньше 10%',
    desc: 'Пишем вручную, как живой автор. Проверка на нейросети покажет менее 10%.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    title: 'На связи 24/7',
    desc: 'Отвечаем в WhatsApp и Telegram в любое время суток.',
  },
];

const PRICES = [
  { type: 'Реферат / СРС',      price: 'от 500 сом',    time: '1-3 дня' },
  { type: 'Курсовая работа',    price: 'от 1 000 сом',  time: '3-7 дней' },
  { type: 'Дипломная (ВКР)',    price: 'от 10 000 сом', time: '7-21 день' },
  { type: 'Сайт для диплома',   price: 'от 25 000 сом', time: '7-14 дней' },
];

const HOW = [
  { n: '01', title: 'Оставьте заявку', desc: 'Заполните форму ниже - это займёт 2 минуты.' },
  { n: '02', title: 'Обсуждаем детали', desc: 'Свяжемся в WhatsApp, уточним требования и согласуем цену.' },
  { n: '03', title: 'Работаем',         desc: 'Пишем, вы видите прогресс и можете вносить пожелания.' },
  { n: '04', title: 'Сдаёте на 5',     desc: 'Получаете готовую работу и консультацию по защите.' },
];

// ─── компонент ───────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    institution: '',
    direction: '',
    service: '',
    deadline: '',
    expectedPrice: '',
    withWebsite: false,
    description: '',
  });
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const validatePhone = (v: string) => {
    if (!v.trim()) return 'Укажите номер WhatsApp';
    try {
      if (!isValidPhoneNumber(v.replace(/[^\d+]/g, ''))) return 'Некорректный номер';
    } catch { return 'Некорректный номер'; }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pErr = validatePhone(formData.whatsapp);
    if (pErr) { setPhoneError(pErr); return; }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/student-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setToast({ msg: 'Заявка отправлена! Свяжемся с вами в ближайшее время.', ok: true });
        setFormData({ fullName:'', whatsapp:'', institution:'', direction:'', service:'', deadline:'', expectedPrice:'', withWebsite:false, description:'' });
        setTimeout(() => { window.location.href = '/'; }, 3000);
      } else {
        setToast({ msg: 'Ошибка при отправке. Попробуйте ещё раз.', ok: false });
      }
    } catch {
      setToast({ msg: 'Ошибка сети. Попробуйте ещё раз.', ok: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-6 right-4 z-[60] flex items-start gap-3 max-w-sm px-5 py-4 rounded-xl shadow-2xl border transition-all
          ${toast.ok
            ? 'bg-primary/10 border-primary/40 text-primary'
            : 'bg-red-500/10 border-red-500/40 text-red-400'}`}>
          <span className="text-sm font-medium flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 backdrop-blur-xl bg-background/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            На главную
          </Link>
          <span className="codev-logo-text font-bold text-lg text-primary">Codev</span>
          <a href="#order"
            className="text-sm font-semibold px-4 py-2 rounded-full bg-primary text-background hover:bg-primary/90 transition-colors">
            Заказать
          </a>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Для студентов КР и стран СНГ
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            Курсовые, дипломные,<br />
            <span className="text-primary">сайты для диплома</span>
          </h1>
          <p className="text-lg text-foreground/65 max-w-xl mx-auto mb-8 leading-relaxed">
            Помогаем студентам сдавать работы на отлично. Уникальность, соблюдение
            требований и сдача в срок - гарантированно.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#order"
              className="px-8 py-3.5 rounded-full bg-primary text-background font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20">
              Оставить заявку
            </a>
            <a href="#services"
              className="px-8 py-3.5 rounded-full border border-foreground/20 text-foreground hover:border-primary hover:text-primary transition-all">
              Что делаем?
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-10 border-y border-white/8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { v: '300+',   l: 'работ выполнено' },
            { v: '100%',   l: 'сдано в срок' },
            { v: '80-95%', l: 'уникальность' },
            { v: '<10%',   l: 'ИИ-контент' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-2xl sm:text-3xl font-bold text-primary">{s.v}</div>
              <div className="text-sm text-foreground/50 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── УСЛУГИ ────────────────────────────────────────────────────────── */}
      <section id="services" className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Что мы <span className="text-primary">делаем</span></h2>
          <p className="text-center text-foreground/55 mb-10">Полный список учебных работ</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(s => (
              <div key={s.id} className="flex gap-4 p-5 rounded-xl border border-foreground/10 bg-background/60 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/25 hover:scale-125 hover:-rotate-6 transition-all duration-300">
                  {s.icon}
                </div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{s.id}</div>
                  <div className="text-sm text-foreground/50 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПОЧЕМУ МЫ ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-white/[0.02] border-y border-white/8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Почему выбирают <span className="text-primary">нас</span></h2>
          <p className="text-center text-foreground/55 mb-10">Не просто слова - конкретные обязательства</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map(w => (
              <div key={w.title} className="flex gap-4 p-5 rounded-xl border border-foreground/10 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/25 hover:scale-125 hover:-rotate-6 transition-all duration-300">
                  {w.icon}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{w.title}</div>
                  <div className="text-sm text-foreground/55 mt-1 leading-relaxed">{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЦЕНЫ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Примерные <span className="text-primary">цены</span></h2>
          <p className="text-center text-foreground/55 mb-10">Точная стоимость - после обсуждения деталей</p>
          <div className="overflow-hidden rounded-xl border border-foreground/10">
            {PRICES.map((p, i) => (
              <div key={p.type} className={`flex items-center justify-between px-5 sm:px-7 py-4 gap-4 ${i !== PRICES.length - 1 ? 'border-b border-foreground/8' : ''} hover:bg-primary/5 transition-colors`}>
                <span className="font-medium text-foreground">{p.type}</span>
                <div className="flex items-center gap-5 flex-shrink-0">
                  <span className="text-foreground/50 text-sm hidden sm:block">⏱ {p.time}</span>
                  <span className="font-bold text-primary">{p.price}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-foreground/40 mt-4">
            * Цены ориентировочные. Точная стоимость зависит от объёма и сложности работы.
          </p>
        </div>
      </section>

      {/* ── КАК РАБОТАЕМ ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-white/[0.02] border-y border-white/8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Как это <span className="text-primary">работает</span></h2>
          <p className="text-center text-foreground/55 mb-10">4 простых шага от заявки до готовой работы</p>
          <ol className="relative space-y-5 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20 before:rounded-full">
            {HOW.map(h => (
              <li key={h.n} className="flex gap-5 items-start relative">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm z-10">
                  {h.n}
                </div>
                <div className="pt-1.5">
                  <div className="font-semibold text-foreground">{h.title}</div>
                  <div className="text-sm text-foreground/55 mt-0.5">{h.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── ФОРМА ЗАКАЗА ──────────────────────────────────────────────────── */}
      <section id="order" className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Оставить <span className="text-primary">заявку</span></h2>
          <p className="text-center text-foreground/55 mb-10">Заполните форму - свяжемся в течение 30 минут</p>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white/[0.03] border border-foreground/10 rounded-2xl p-6 sm:p-8">

            {/* ФИО + WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">ФИО <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Иванов Иван"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/15 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">WhatsApp <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={e => { setFormData({...formData, whatsapp: e.target.value}); setPhoneError(''); }}
                  onBlur={e => setPhoneError(validatePhone(e.target.value))}
                  placeholder="+996 700 000 000"
                  className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-foreground/30 focus:outline-none transition-colors ${phoneError ? 'border-red-400 focus:border-red-400' : 'border-foreground/15 focus:border-primary'}`}
                />
                {phoneError && <p className="text-xs text-red-400 mt-1">{phoneError}</p>}
              </div>
            </div>

            {/* Учебное заведение + направление */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">Учебное заведение <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={e => setFormData({...formData, institution: e.target.value})}
                  placeholder="КГТУ им. Раззакова"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/15 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">Направление <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.direction}
                  onChange={e => setFormData({...formData, direction: e.target.value})}
                  placeholder="Программная инженерия"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/15 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Услуга */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Тип работы <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SERVICES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({...formData, service: s.id})}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      formData.service === s.id
                        ? 'bg-primary text-background border-primary'
                        : 'border-foreground/15 text-foreground/70 hover:border-primary/40'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Срок + цена */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">Срок сдачи <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/15 text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">Ожидаемый бюджет (сом) <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.expectedPrice}
                  onChange={e => setFormData({...formData, expectedPrice: e.target.value})}
                  placeholder="Например: 3000-5000"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/15 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Чекбокс сайт */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.withWebsite ? 'bg-primary border-primary' : 'border-foreground/25 group-hover:border-primary/50'}`}
                onClick={() => setFormData({...formData, withWebsite: !formData.withWebsite})}>
                {formData.withWebsite && (
                  <svg className="w-3 h-3 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
              <input type="checkbox" className="sr-only" checked={formData.withWebsite} onChange={e => setFormData({...formData, withWebsite: e.target.checked})} />
              <span className="text-sm text-foreground/70">Нужен сайт как часть дипломного проекта</span>
            </label>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">Дополнительные требования</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Тема работы, особые требования преподавателя, стандарты оформления..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/15 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors resize-y"
              />
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-1">
              <Link href="/" className="px-5 py-3 rounded-lg border border-foreground/15 text-foreground/60 hover:border-foreground/30 hover:text-foreground transition-colors text-sm font-medium">
                Отмена
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-lg bg-primary text-background font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20"
              >
                {isSubmitting ? 'Отправляем...' : 'Отправить заявку →'}
              </button>
            </div>

          </form>

          {/* Альтернатива - написать напрямую */}
          <p className="text-center text-sm text-foreground/40 mt-6">
            Или напишите напрямую в{' '}
            <a href="https://t.me/nnbek03" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Telegram</a>
            {' '}/ {' '}
            <a href="https://wa.me/996501306722" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp</a>
          </p>
        </div>
      </section>

    </div>
  );
}
