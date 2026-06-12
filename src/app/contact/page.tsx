import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Contact — ARKHE",
  description:
    "Échangez avec nos experts pour intégrer la valorisation des cheveux à vos projets.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
