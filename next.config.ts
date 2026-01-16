import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  // Указываем корневую директорию для трейсинга файлов
  outputFileTracingRoot: path.join(__dirname, '../../'),
  
  serverExternalPackages: ['puppeteer'],
  
  eslint: {
    // Отключаем ESLint во время продакшн сборки для Docker
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Отключаем проверку TypeScript во время продакшн сборки для Docker  
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ibb.co',
        port: '',
        pathname: '/**',
      },
      // Добавляем другие популярные хостинги изображений
      {
        protocol: 'https',
        hostname: 'imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
      // Добавляем домены для GitHub, если изображения хранятся там
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
