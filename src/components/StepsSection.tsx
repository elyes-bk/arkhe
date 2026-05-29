import Image from "next/image";
import { assets } from "@/lib/assets";

const steps = [
  {
    image: assets.step1,
    title: "Rejoignez le réseau",
    description:
      "Renseignez vos infos pro. Notre équipe valide votre salon sous 48h.",
    alt: "Salon partenaire ARKHE avec bac de collecte",
  },
  {
    image: assets.step2,
    title: "Signalez vos sacs pleins",
    description:
      "Votre sac est plein ? Un clic suffit pour synchroniser l'enlèvement.",
    alt: "Coupe de cheveux en salon",
  },
  {
    image: assets.step3,
    title: "Collecte & Valorisation",
    description:
      "Nous collectons vos récoltes pour les transformer en carbone premium.",
    alt: "Vélo de collecte ARKHE",
  },
];

export function StepsSection() {
  return (
    <section
      id="etapes"
      className="w-full overflow-hidden bg-arkhe-lavender py-12 md:py-16"
    >
      <div className="section-container">
        <h2 className="font-kumbh text-2xl font-semibold text-black md:text-[32px]">
          Valorisez vos volumes de cheveux en 3 étapes
        </h2>

        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center"
            >
              <div className="relative aspect-[4/3] w-full max-w-[320px] overflow-hidden rounded-[5px]">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
              <h3 className="mt-4 font-kumbh text-lg font-bold text-[#0d0d0d] sm:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 font-montserrat text-sm text-black sm:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
