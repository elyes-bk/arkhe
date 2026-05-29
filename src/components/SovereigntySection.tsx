import Image from "next/image";
import { assets } from "@/lib/assets";

const stats = [
  {
    value: (
      <>
        30<span className="text-arkhe-blue">+</span>
      </>
    ),
    description:
      "Des professionnels pionniers engagés à nos côtés pour transformer leur activité en ressource.",
  },
  {
    value: (
      <>
        100<span className="font-medium text-arkhe-blue">%</span>
      </>
    ),
    description:
      "Origine France. Une chaîne de valeur souveraine, de la collecte de proximité à la transformation industrielle.",
  },
];

export function SovereigntySection() {
  return (
    <section className="section-container flex flex-col items-center gap-10 py-12 lg:flex-row lg:gap-12 lg:py-16">
      <div className="relative aspect-[538/450] w-full max-w-lg shrink-0 overflow-hidden rounded-[5px] lg:max-w-[538px] lg:aspect-auto lg:h-[450px]">
        <Image
          src={assets.carbon}
          alt="Laboratoire ARKHE — carbone français et sac industriel"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 538px"
        />
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col gap-8">
        <div>
          <h2 className="font-kumbh text-2xl font-semibold text-black md:text-[32px]">
            Une souveraineté française, une ambition européenne
          </h2>
          <p className="mt-4 font-montserrat text-base leading-relaxed text-black">
            ARKHE bâtit une filière d&apos;avenir indépendante. Nous collectons
            et revalorisons les cheveux exclusivement en France pour propulser
            l&apos;innovation industrielle et énergétique à l&apos;échelle
            européenne.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          {stats.map((stat) => (
            <div key={String(stat.value)} className="flex flex-col gap-2">
              <p className="font-kumbh text-3xl text-black">{stat.value}</p>
              <p className="max-w-xs font-montserrat text-base text-black">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
