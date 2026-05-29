import Image from "next/image";
import { assets } from "@/lib/assets";

const features = [
  {
    icon: assets.iconLeaf,
    iconClass: "left-1 top-[5px] h-6 w-6",
    title: "Éviter le gaspillage, agir simplement",
    description:
      "Participez à une collecte responsable et transformez une matière jetée en ressource valorisée.",
  },
  {
    icon: assets.iconMatter,
    iconClass: "left-px top-0.5 h-[30px] w-[30px]",
    title: "Accéder à une matière revalorisée",
    description:
      "Une ressource collectée et préparée pour accompagner les usages professionnels et les projets d'innovation.",
  },
];

function FeatureCard({
  icon,
  iconClass,
  title,
  description,
}: {
  icon: string;
  iconClass: string;
  title: string;
  description: string;
}) {
  return (
    <article className="flex w-full max-w-[296px] flex-col gap-4 rounded-[5px] border border-solid border-[#bdc5df] px-[13px] py-[14px] min-[630px]:w-[296px] min-[630px]:shrink-0">
      <div className="relative size-[33px] shrink-0 overflow-hidden rounded-[2px] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={icon}
          alt=""
          className={`absolute object-contain ${iconClass}`}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-montserrat text-lg font-medium leading-normal text-black">
          {title}
        </h3>
        <p className="font-montserrat text-[15px] leading-normal text-black">
          {description}
        </p>
      </div>
    </article>
  );
}

export function IntroSection() {
  return (
    <section id="mission" className="w-full overflow-hidden bg-white py-16 lg:py-20">
      <div className="section-container">
        {/* Figma 228:774 — flex row, justify-between, items-start */}
        <div className="intro-mission-row mx-auto flex w-full max-w-[1238px] flex-col gap-10 min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:justify-between min-[1100px]:gap-[71px]">
          {/* Colonne gauche 631px */}
          <div className="flex w-full min-w-0 flex-col gap-6 min-[1100px]:w-[631px] min-[1100px]:shrink-0">
            {/* Bloc texte — gap 24px entre titre-groupe et paragraphe */}
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col gap-4">
                <h2 className="font-kumbh text-[32px] font-semibold leading-normal text-black">
                  Réinventer la valeur du cheveu
                </h2>
                <p className="font-kumbh text-2xl font-normal leading-normal text-black">
                  Collecter, revaloriser, transformer.
                </p>
              </div>
              <p className="font-montserrat text-base font-normal leading-normal text-black">
                ARKHE accompagne les salons dans une nouvelle approche du cheveu,
                où expertise capillaire, innovation scientifique et engagement
                durable se rencontrent. Notre plateforme transforme le geste
                professionnel en expérience enrichie et crée une nouvelle valeur
                autour de la matière capillaire.
              </p>
            </div>

            {/* Cartes côte à côte — gap 38px */}
            <div className="flex w-full flex-col gap-[38px] min-[630px]:flex-row min-[630px]:items-stretch">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>

          {/* Image 538×415 — alignée en haut à droite */}
          <div className="relative mx-auto h-[240px] w-full max-w-[538px] shrink-0 overflow-hidden rounded-[5px] min-[1100px]:mx-0 min-[1100px]:h-[415px] min-[1100px]:w-[538px]">
            <Image
              src={assets.bike}
              alt="Vélo de collecte ARKHE devant un salon partenaire"
              fill
              className="object-cover"
              sizes="538px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
