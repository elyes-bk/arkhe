import Image from "next/image";
import { assets } from "@/lib/assets";

const statCards = [
  {
    image: assets.stat97,
    value: "97%",
    text: "Une efficacité intacte même après 10 000 recharges rapides.",
    alt: "Coupe de cheveux en salon",
  },
  {
    image: assets.stat95,
    value: "95%",
    text: "Les cheveux sont gorgés d'une matière première unique : la kératine.",
    alt: "Cheveux bruns ondulés",
  },
];

function StatCard({
  image,
  value,
  text,
  alt,
}: {
  image: string;
  value: string;
  text: string;
  alt: string;
}) {
  return (
    <div className="relative aspect-[295/281] w-full overflow-hidden rounded-[5px] sm:aspect-auto sm:min-h-[240px]">
      <Image src={image} alt={alt} fill className="object-cover" sizes="295px" />
      <div className="absolute inset-0 bg-gradient-to-t from-arkhe-navy to-[rgba(5,9,49,0.21)]" />
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <p className="font-kumbh text-3xl font-bold sm:text-4xl">{value}</p>
        <p className="mt-1 font-montserrat text-sm sm:text-base">{text}</p>
      </div>
    </div>
  );
}

export function MaterialSection() {
  return (
    <section className="section-container py-12 md:py-16">
      <h2 className="font-kumbh text-2xl font-semibold text-black md:text-[32px]">
        Le secret de notre matériau
      </h2>
      <p className="mt-4 max-w-3xl font-montserrat text-base text-black">
        Grâce à un procédé unique, nous libérons l&apos;énergie cachée au cœur
        des cheveux pour créer une technologie propre et inusable.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div className="rounded-[5px] bg-arkhe-navy p-5 sm:p-6">
            <h3 className="font-kumbh text-xl font-semibold text-white sm:text-2xl">
              La performance scientifique
            </h3>
            <p className="mt-4 font-montserrat text-sm text-white sm:text-base">
              ARKHE synthétise un carbone technique issu de précurseurs
              capillaires recyclés, conçu spécifiquement pour les applications de
              stockage d&apos;énergie et de catalyse.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {statCards.map((card) => (
              <StatCard key={card.value} {...card} />
            ))}
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[5px] sm:min-h-[400px] lg:min-h-full">
          <Image
            src={assets.stat85}
            alt="Diversité capillaire — trois femmes de dos"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 609px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-arkhe-navy to-[rgba(5,9,49,0.21)]" />
          <div className="absolute bottom-6 left-4 right-4 text-white sm:left-6">
            <p className="font-kumbh text-3xl font-bold sm:text-4xl">-85%</p>
            <p className="mt-1 font-montserrat text-sm sm:text-base">
              Réduction des émissions de CO₂ par rapport à la production de
              carbone synthétique ou fossile traditionnel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
