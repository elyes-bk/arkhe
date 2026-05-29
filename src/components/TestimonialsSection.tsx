"use client";

import { useRef, useState } from "react";
import { assets } from "@/lib/assets";

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
    <section id="temoignages" className="section-container overflow-hidden py-12 md:py-16">
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assets.carouselPrev}
              alt=""
              className="size-8 rotate-90"
            />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex size-10 items-center justify-center disabled:opacity-40"
            aria-label="Témoignage suivant"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assets.carouselNext}
              alt=""
              className="-rotate-90 -scale-y-100 size-8"
            />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="-mx-4 mt-8 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <article
            key={t.name}
            className="relative w-[min(100%,320px)] shrink-0 sm:w-[340px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assets.quote}
              alt=""
              className="absolute left-0 top-0 z-10 size-8"
            />
            <div className="card-gradient ml-4 mt-4 rounded-[5px] border border-arkhe-border p-5">
              <p className="font-montserrat text-sm leading-relaxed text-white sm:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-arkhe-lavender">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assets.avatar} alt="" className="size-5" />
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
    </section>
  );
}
