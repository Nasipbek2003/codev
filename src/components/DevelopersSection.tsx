'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DevelopersSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Наша команда
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Профессионалы, создающие инновационные решения
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/developer/nasipbek" className="group block">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 max-w-md">
                {/* Декоративный элемент */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full"></div>
                
                <div className="relative">
                  {/* Фото */}
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-white shadow-xl group-hover:ring-blue-500 transition-all duration-300">
                    <Image
                      src="/my_photo.jpg"
                      alt="Абдрахманов Насипбек"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Информация */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      Абдрахманов Насипбек
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">
                      Fullstack разработчик
                    </p>
                    
                    {/* Технологии */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL'].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Призыв к действию */}
                    <div className="flex items-center justify-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                      <span>Узнать больше</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
