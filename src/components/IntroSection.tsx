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
    <article className="flex w-full min-w-0 flex-1 flex-col gap-4 rounded-[5px] border border-solid border-[#bdc5df] px-[13px] py-[14px] md:max-w-none">
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
        <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          <div className="flex w-full min-w-0 flex-1 flex-col gap-6 lg:basis-[55%]">
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col gap-4">
                <h2 className="font-kumbh text-2xl font-semibold leading-normal text-black sm:text-3xl lg:text-[32px]">
                  Réinventer la valeur du cheveu
                </h2>
                <p className="font-kumbh text-xl font-normal leading-normal text-black sm:text-2xl">
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

            <div className="flex w-full flex-col gap-6 md:flex-row md:items-stretch md:gap-8 lg:gap-10">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>

          <div className="relative aspect-[538/415] w-full shrink-0 overflow-hidden rounded-[5px] lg:basis-[45%]">
            <Image
              src={assets.bike}
              alt="Vélo de collecte ARKHE devant un salon partenaire"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
