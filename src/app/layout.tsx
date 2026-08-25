import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codev - IT компания | Разработка и оцифровка бизнеса",
  description: "Codev - IT компания, которая занимается разработкой, оцифровкой бизнеса, созданием сайтов и веб-приложений. Получите расчёт стоимости проекта за минуту с нашим AI-помощником.",
  metadataBase: new URL('https://codev.kg'),
  openGraph: {
    title: "Codev - IT компания | Разработка и оцифровка бизнеса",
    description: "Codev - IT компания: разработка сайтов, веб-приложений, мобильных приложений и оцифровка бизнеса. Прозрачные цены, сроки - гарантированно.",
    url: 'https://codev.kg',
    siteName: 'Codev',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Codev - IT компания | Разработка и оцифровка бизнеса",
    description: "Разработка сайтов, приложений и оцифровка бизнеса. Прозрачные цены, сдача в срок.",
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#aeef10" />
        <link
          rel="preload"
          href="/GetVoIP_Grotesque.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/KanitCyrillic.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/preline@2.0.3/dist/preline.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/preline@2.0.3/dist/preline.min.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
