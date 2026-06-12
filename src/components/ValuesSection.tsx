import Image from "next/image";
import { assets } from "@/lib/assets";

type ValueStat = {
  value: string;
  label: string;
};

type ValueCard = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  stats: [ValueStat, ValueStat];
  variant: "navy" | "blue" | "lavender";
};

const values: ValueCard[] = [
  {
    image: assets.valuesInnovation,
    imageAlt: "Poudre de graphite — matériau stratégique pour l'énergie",
    title: "Innovation souveraine",
    description:
      "Nous croyons qu'une transition énergétique durable ne peut exister sans maîtrise technologique locale. ARKHE développe en France des matériaux avancés issus de la science des matériaux et de l'électrochimie afin de renforcer l'autonomie industrielle et énergétique européenne. En transformant une ressource locale sous-exploitée en biomatériau à haute valeur ajoutée, nous participons à la relocalisation de chaînes de valeur stratégiques et à la réduction de la dépendance aux importations de matières premières critiques.",
    stats: [
      { value: "97 %", label: "Dépendance européenne au graphite" },
      { value: "x10", label: "Demande en matériaux d'ici 2030" },
    ],
    variant: "navy",
  },
  {
    image: assets.valuesCollecte,
    imageAlt: "Vélo cargo ARKHE devant un salon partenaire",
    title: "Collecte sans contrainte",
    description:
      "Valoriser l'engagement environnemental sans surcharger le quotidien des salons. ARKHE met en place une solution clé en main qui simplifie chaque étape de la collecte, du bac de lavage jusqu'à la revalorisation des cheveux. Grâce à un dispositif pensé pour s'intégrer naturellement aux pratiques existantes, les professionnels peuvent contribuer à une filière innovante sans modifier leur organisation, sans formation complexe et sans charge de travail supplémentaire. L'engagement environnemental devient ainsi simple, accessible et directement compatible avec les réalités du terrain.",
    stats: [
      { value: "80 %", label: "Déchets capillaires inexploités" },
      { value: "0 min", label: "Temps de traitement supplémentaire" },
    ],
    variant: "blue",
  },
  {
    image: assets.valuesScience,
    imageAlt: "Mèche de cheveux bruns ondulés sur fond blanc",
    title: "Rigueur scientifique",
    description:
      "Pas de compromis ni de greenwashing. Chez ARKHE, chaque étape de développement repose sur une démarche scientifique rigoureuse, de la caractérisation des matières premières jusqu'à l'évaluation des performances électrochimiques. Chaque résultat est mesuré, documenté et validé en laboratoire afin de garantir la fiabilité de nos matériaux. Nous privilégions les preuves aux promesses, avec une approche fondée sur des données mesurables et des protocoles reproductibles répondant aux exigences de la recherche et de l'industrie.",
    stats: [
      { value: "100 %", label: "Données vérifiables" },
      { value: "0 %", label: "Greenwashing" },
    ],
    variant: "lavender",
  },
];

const variantStyles = {
  navy: {
    card: "bg-arkhe-navy",
    title: "text-white",
    body: "text-white",
    statValue: "text-white",
    statLabel: "text-white",
  },
  blue: {
    card: "bg-arkhe-blue",
    title: "text-white",
    body: "text-white",
    statValue: "text-white",
    statLabel: "text-white",
  },
  lavender: {
    card: "bg-arkhe-lavender",
    title: "text-arkhe-navy",
    body: "text-arkhe-navy",
    statValue: "text-arkhe-navy",
    statLabel: "text-arkhe-navy",
  },
} as const;

function ValueCardBlock({
  image,
  imageAlt,
  title,
  description,
  stats,
  variant,
}: ValueCard) {
  const styles = variantStyles[variant];

  return (
    <article
      className={`mx-auto flex w-full max-w-[1240px] flex-col items-stretch gap-6 rounded-[5px] px-5 py-6 sm:px-8 sm:py-8 lg:min-h-[413px] lg:flex-row lg:items-center lg:gap-12 lg:px-[46px] lg:py-[40px] ${styles.card}`}
    >
      <div className="order-1 flex min-w-0 flex-1 flex-col gap-6 lg:order-2 lg:justify-between lg:self-stretch">
        <div className="flex flex-col gap-4">
          <h3
            className={`font-kumbh text-xl font-semibold sm:text-2xl ${styles.title}`}
          >
            {title}
          </h3>
          <p className={`font-montserrat text-sm leading-relaxed sm:text-base ${styles.body}`}>
            {description}
          </p>
        </div>

        <div className="flex flex-row gap-6 sm:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <p className={`font-kumbh text-3xl font-semibold sm:text-4xl ${styles.statValue}`}>
                {stat.value}
              </p>
              <p className={`max-w-[200px] font-montserrat text-sm sm:text-base ${styles.statLabel}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative order-2 aspect-[491/351] w-full shrink-0 overflow-hidden rounded-[5px] lg:order-1 lg:h-[351px] lg:w-[491px] lg:max-w-[491px]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 491px"
        />
      </div>
    </article>
  );
}

export function ValuesSection() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="section-container">
        <h2 className="font-kumbh text-2xl font-semibold text-black md:text-[32px]">
          Nos valeurs
        </h2>

        <div className="mt-8 flex flex-col gap-6 md:gap-8">
          {values.map((value) => (
            <ValueCardBlock key={value.title} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
}
