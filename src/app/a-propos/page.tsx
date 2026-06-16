import { AboutPageContent } from "@/components/about/AboutPageContent";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "À propos — ARKHE",
  description:
    "Du salon de coiffure aux technologies énergétiques : découvrez la mission d'ARKHE.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />
      <main className="flex-1">
        <AboutPageContent />
      </main>
      <Footer />
    </div>
  );
}
