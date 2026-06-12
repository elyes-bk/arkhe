"use client";

import { useRef, useState } from "react";

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 18c0-4.4 2.2-8 6-10.4L12 4C5.6 7.2 2 12.8 2 19v5h10v-6H8zm16 0c0-4.4 2.2-8 6-10.4L28 4c-6.4 3.2-10 8.8-10 15v5h10v-6h-4z"
        fill="#45DBE4"
      />
    </svg>
  );
}

function AvatarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="10" cy="7" r="3.5" stroke="#0738DC" strokeWidth="1.5" />
      <path
        d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="#0738DC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CarouselArrow({ direction }: { direction: "left" | "right" }) {
  const rotated = direction === "left";
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={rotated ? "rotate-180" : ""}
      aria-hidden
    >
      <circle
        cx="16"
        cy="16"
        r="15"
        stroke={direction === "right" ? "#04082E" : "#BDC5DF"}
        strokeWidth="1.5"
        fill={direction === "right" ? "#04082E" : "none"}
      />
      <path
        d="M14 11l5 5-5 5"
        stroke={direction === "right" ? "#FFFFFF" : "#04082E"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const testimonials = [
  {
    quote:
      "Rejoindre ARKHE a donné un sens nouveau à notre métier. Au-delà de la coupe, nous participons activement à la création de matériaux industriels du futur. La logistique est d'une simplicité désarmante.",
    name: "Marc Antoine",
    role: "Fondateur, Atelier Ciseaux d'Or",
  },
  {
    quote:
      "Mes clients adorent l'initiative. Pouvoir leur dire que leurs cheveux coupés vont servir à créer du carbone pour les technologies de demain. C'est un geste zéro contrainte pour l'équipe qui change tout.",
    name: "Élodie Martin",
    role: "Fondatrice, Maison Nuance",
  },
  {
    quote:
      "Avec plus de 80 clients par jour, nous générons une quantité de cheveux impressionnante. ARKHE a transformé ce déchet encombrant en une ressource précieuse.",
    name: "Thomas Roussel",
    role: "Directeur, L'Atelier Capillaire",
  },
  {
    quote:
      "Une plateforme robuste et transparente. Nous recevons des rapports d'impact précis que nos clients adorent consulter. C'est le partenaire RSE idéal pour un salon moderne.",
    name: "Elena Rossi",
    role: "Gérante, Green Salon",
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -el.clientWidth * 0.85 : el.clientWidth * 0.85,
      behavior: "smooth",
    });
    setTimeout(updateScrollState, 300);
  };

  return (
    <section id="temoignages" className="relative z-20 w-full overflow-hidden bg-white pb-12 pt-6 md:pb-16 md:pt-8">
      <div className="section-container">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-kumbh text-2xl font-semibold text-black md:text-3xl">
          Ils nous font confiance
        </h2>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flex size-10 items-center justify-center disabled:opacity-40"
            aria-label="Témoignage précédent"
          >
            <CarouselArrow direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex size-10 items-center justify-center disabled:opacity-40"
            aria-label="Témoignage suivant"
          >
            <CarouselArrow direction="right" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="mt-8 flex w-full gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <article
            key={t.name}
            className="relative w-[min(100%,320px)] shrink-0 sm:w-[340px]"
          >
            <QuoteIcon className="absolute left-0 top-0 z-10 size-8" />
            <div className="card-gradient ml-4 mt-4 rounded-[5px] border border-arkhe-border p-5">
              <p className="font-montserrat text-sm leading-relaxed text-white sm:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-arkhe-lavender">
                  <AvatarIcon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-kumbh text-lg font-semibold text-white">
                    {t.name}
                  </p>
                  <p className="truncate font-montserrat text-sm text-white">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
