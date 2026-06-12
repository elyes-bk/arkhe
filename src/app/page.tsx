import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { Hero } from "@/components/Hero";
import { IntroSection } from "@/components/IntroSection";
import { MaterialSection } from "@/components/MaterialSection";
import { SovereigntySection } from "@/components/SovereigntySection";
import { StepsSection } from "@/components/StepsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ValuesSection } from "@/components/ValuesSection";

export default function Home() {
  return (
    <div className="w-full">
      <Header />
      <main className="flex w-full flex-col">
        <div className="flex flex-col gap-12 md:gap-16">
          <Hero />
          <IntroSection />
          <StepsSection />
          <SovereigntySection />
          <MaterialSection />
        </div>
        <ValuesSection />
        <TestimonialsSection />
        <div className="flex flex-col gap-12 md:gap-16">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

