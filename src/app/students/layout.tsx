import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Студенческие работы | Курсовые, дипломные, сайты — Codev",
  description: "Codev помогает студентам КР и стран СНГ: курсовые от 1 000 сом, дипломные от 10 000 сом, сайт для диплома от 25 000 сом. Уникальность 80–95%, сдача в срок, правки бесплатно.",
  openGraph: {
    title: "Студенческие работы | Курсовые, дипломные, сайты — Codev",
    description: "Курсовые от 1 000 сом · Дипломные от 10 000 сом · Сайт для диплома от 25 000 сом. Уникальность 80–95%, сдача в срок, правки бесплатно.",
    url: 'https://codev.kg/students',
    siteName: 'Codev',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Студенческие работы — Codev",
    description: "Курсовые от 1 000 сом, дипломные от 10 000 сом. Уникальность 80–95%, сдача в срок.",
  },
};

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
