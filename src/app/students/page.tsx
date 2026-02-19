'use client';

import React, { useState, useEffect } from 'react';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

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
    description: ''
  });

  const [phoneValidation, setPhoneValidation] = useState<{isValid: boolean, message: string, formattedNumber?: string}>({
    isValid: true, 
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const SERVICES = [
    'Курсовые',
    'ВКР (дипломная)',
    'СРС',
    'Реферат',
    'Презентация',
    'Создание сайта'
  ];

  // Валидация номера телефона
  const validatePhoneNumber = (phoneNumber: string): {isValid: boolean, message: string, formattedNumber?: string} => {
    if (!phoneNumber.trim()) {
      return {isValid: false, message: 'Номер телефона обязателен'};
    }

    try {
      const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
      
      if (cleanNumber.length < 7) {
        return {isValid: false, message: 'Номер слишком короткий'};
      }

      const isValid = isValidPhoneNumber(cleanNumber);
      
      if (!isValid) {
        return {isValid: false, message: 'Некорректный формат номера'};
      }

      try {
        const parsedNumber = parsePhoneNumber(cleanNumber);
        const formattedNumber = parsedNumber.formatInternational();
        return {isValid: true, message: 'Номер корректен', formattedNumber};
      } catch (error) {
        return {isValid: true, message: 'Номер корректен', formattedNumber: cleanNumber};
      }
    } catch (error) {
      return {isValid: false, message: 'Ошибка при проверке номера'};
    }
  };

  // Обработчик изменения номера WhatsApp
  const handleWhatsAppChange = (value: string) => {
    setFormData({...formData, whatsapp: value});
    const validation = validatePhoneNumber(value);
    setPhoneValidation(validation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!formData.fullName || !formData.whatsapp || !formData.institution || 
        !formData.direction || !formData.service || !formData.deadline || !formData.expectedPrice) {
      setToast('❌ Пожалуйста, заполните все обязательные поля');
      return;
    }

    const phoneValidationResult = validatePhoneNumber(formData.whatsapp);
    if (!phoneValidationResult.isValid) {
      setToast(`❌ Ошибка номера: ${phoneValidationResult.message}`);
      setPhoneValidation(phoneValidationResult);
      return;
    }

    try {
      setIsSubmitting(true);
      setToast('📤 Отправляем заявку...');

      const response = await fetch('/api/student-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast('🎉 Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        
        // Очищаем форму
        setFormData({
          fullName: '',
          whatsapp: '',
          institution: '',
          direction: '',
          service: '',
          deadline: '',
          expectedPrice: '',
          withWebsite: false,
          description: ''
        });
        setPhoneValidation({isValid: true, message: ''});
        
        // Перенаправляем на главную через 2 секунды
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setToast('❌ Ошибка при отправке заявки. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setToast('❌ Ошибка при отправке заявки. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Автоматическое скрытие toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-[60] bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md animate-slide-in">
          <div className="flex items-start gap-3">
            <p className="text-sm text-gray-800 flex-1">{toast}</p>
            <button 
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <a 
                href="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200"
                title="Вернуться на главную"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline text-sm">Назад</span>
              </a>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg sm:text-xl font-semibold text-black">Для студентов</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 sm:pt-24 p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-2">Заказ студенческих работ</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Заполните форму ниже, и мы свяжемся с вами для обсуждения деталей вашей работы
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Контактные данные */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ФИО <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Иванов Иван Иванович"
                    className="w-full p-3 rounded-lg border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleWhatsAppChange(e.target.value)}
                    placeholder="+996 XXX XXX XXX"
                    className={`w-full p-3 rounded-lg border ${!phoneValidation.isValid ? 'border-red-500' : 'border-gray-300'} text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                    required
                  />
                  {!phoneValidation.isValid && (
                    <p className="text-xs text-red-500 mt-1">{phoneValidation.message}</p>
                  )}
                </div>
              </div>

              {/* Учебное заведение и направление */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Учебное заведение <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    placeholder="Например: КГТУ им. Раззакова"
                    className="w-full p-3 rounded-lg border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Направление <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.direction}
                    onChange={(e) => setFormData({...formData, direction: e.target.value})}
                    placeholder="Например: Программная инженерия"
                    className="w-full p-3 rounded-lg border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Услуга */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Услуга <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICES.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => setFormData({...formData, service})}
                      className={`px-4 py-2 rounded-lg border transition-colors duration-200 text-sm ${
                        formData.service === service
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Срок и цена */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Срок сдачи <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full p-3 rounded-lg border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ожидаемая цена (KGS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({...formData, expectedPrice: e.target.value})}
                    placeholder="Например: 5000-10000"
                    className="w-full p-3 rounded-lg border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* С сайтом или без */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.withWebsite}
                    onChange={(e) => setFormData({...formData, withWebsite: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Требуется создание сайта</span>
                </label>
              </div>

              {/* Описание работы */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание работы (необязательно)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Опишите подробнее вашу работу, требования, особенности..."
                  rows={4}
                  className="w-full p-3 rounded-lg border border-gray-300 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
                />
              </div>

              {/* Кнопка отправки */}
              <div className="flex justify-end gap-3">
                <a
                  href="/"
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Отмена
                </a>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg text-white transition-colors duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
