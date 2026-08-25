import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import ServicesSection from '@/components/ServicesSection';
import IndustriesSection from '@/components/IndustriesSection';
import ProcessSection from '@/components/ProcessSection';
import PortfolioSection from '@/components/PortfolioSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import RequirementsSection from '@/components/RequirementsSection';
import PricingSection from '@/components/PricingSection';
import GuaranteesSection from '@/components/GuaranteesSection';
import FAQSection from '@/components/FAQSection';
import DevelopersSection from '@/components/DevelopersSection';
import GradientGlow from '@/components/GradientGlow';
import SectionSeparator from '@/components/SectionSeparator';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {/* Статистика — социальное доказательство сразу после hero */}
      <StatsSection />

      <SectionSeparator />

      <div id="services" className="relative">
        <GradientGlow />
        <ServicesSection />
      </div>

      <SectionSeparator />

      {/* Для кого разрабатываем — клиент узнаёт свой бизнес */}
      <div id="industries" className="relative">
        <GradientGlow intensity="medium" />
        <IndustriesSection />
      </div>

      <SectionSeparator />

      <div id="process" className="relative">
        <GradientGlow intensity="light" />
        <ProcessSection />
      </div>

      <SectionSeparator />

      <div id="requirements" className="relative">
        <GradientGlow intensity="medium" />
        <RequirementsSection />
      </div>

      <SectionSeparator />

      <div id="pricing" className="relative">
        <GradientGlow intensity="strong" />
        <PricingSection />
      </div>

      <SectionSeparator />

      <div id="portfolio" className="relative">
        <GradientGlow intensity="light" />
        <PortfolioSection />
      </div>

      <SectionSeparator />

      {/* Отзывы клиентов — ключевой элемент доверия */}
      <div id="testimonials" className="relative">
        <GradientGlow intensity="medium" />
        <TestimonialsSection />
      </div>

      <SectionSeparator />

      {/* Гарантии — снимают страхи клиента */}
      <div id="guarantees" className="relative">
        <GradientGlow intensity="light" />
        <GuaranteesSection />
      </div>

      <SectionSeparator />

      {/* FAQ — снимают последние вопросы перед заказом */}
      <div id="faq" className="relative">
        <GradientGlow intensity="medium" />
        <FAQSection />
      </div>

      <SectionSeparator />

      <div id="developers" className="relative">
        <GradientGlow intensity="light" />
        <DevelopersSection />
      </div>

      <div id="contact">
        <Footer />
      </div>
    </main>
  );
}
