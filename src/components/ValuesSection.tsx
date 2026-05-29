import { assets } from "@/lib/assets";

const values = [
  {
    icon: assets.iconInnovation,
    title: "Innovation souveraine",
    description:
      "Développer en France des technologies de pointe en s'appuyant sur l'électrochimie et la science des matériaux pour garantir l'indépendance énergétique européenne.",
  },
  {
    icon: assets.iconCollecte,
    title: "Collecte sans contrainte",
    description:
      "Valoriser l'engagement environnemental sans surcharger les salons. Nous créons un écosystème logistique fluide et clé en main, du bac de lavage à la revalorisation.",
  },
  {
    icon: assets.iconScience,
    title: "Rigueur scientifique",
    description:
      "Pas de compromis ni de greenwashing. Chaque performance de notre carbone premium est validée, mesurée et certifiée en laboratoire pour répondre aux exigences de la R&D.",
  },
];

export function ValuesSection() {
  return (
    <section className="w-full overflow-hidden bg-arkhe-lavender py-10 md:py-12">
      <div className="section-container">
        <h2 className="font-kumbh text-2xl font-semibold text-black md:text-3xl">
          Nos valeurs
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="flex flex-col gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value.icon}
                alt=""
                className="h-6 w-7 object-contain"
              />
              <h3 className="font-montserrat text-lg font-semibold text-arkhe-navy sm:text-xl">
                {value.title}
              </h3>
              <p className="font-montserrat text-sm text-arkhe-navy sm:text-base">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
