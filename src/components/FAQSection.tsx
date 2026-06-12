"use client";

import Image from "next/image";
import { useState } from "react";
import { assets } from "@/lib/assets";

const faqItems = [
  {
    question: "Quel type de cheveu peut être recyclé ?",
    answer:
      "Absolument tous les types de cheveux, qu'ils soient colorés, traités chimiquement ou naturels, sont acceptés. La structure carbonique de base reste exploitable quel que soit l'historique capillaire.",
  },
  {
    question: "Comment se passe la collecte concrètement ?",
    answer:
      "Une fois votre salon inscrit, nous vous fournissons des sacs de collecte. Lorsqu'ils sont pleins, vous signalez l'enlèvement via la plateforme et notre équipe logistique intervient.",
  },
  {
    question: "À quelle fréquence passez-vous récupérer les sacs ?",
    answer:
      "La fréquence s'adapte au volume de votre salon. En général, les enlèvements sont planifiés selon vos besoins, souvent toutes les deux à quatre semaines.",
  },
  {
    question: "Est-ce que ce service est payant pour mon salon ?",
    answer:
      "Le modèle ARKHE est conçu pour être accessible aux salons partenaires. Contactez notre équipe pour connaître les conditions adaptées à votre structure.",
  },
  {
    question: "Que devient le cheveu une fois récupéré par ARKHE ?",
    answer:
      "Les cheveux sont transformés en carbone technique activé, destiné aux applications industrielles de stockage d'énergie et de catalyse.",
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full bg-white py-12 md:py-16">
      <div className="section-container flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
        <div className="min-w-0 flex-1 lg:basis-[55%]">
          <h2 className="font-kumbh text-2xl font-semibold text-black md:text-[32px]">
            FAQ
          </h2>

          <div className="mt-6 flex flex-col">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.question}
                  className="border-b border-arkhe-border"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`font-kumbh text-base font-semibold sm:text-lg ${
                        isOpen ? "text-arkhe-blue" : "text-black"
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      className={
                        isOpen ? "text-arkhe-blue" : "text-black"
                      }
                    >
                      <ChevronIcon open={isOpen} />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pb-4 font-montserrat text-sm leading-relaxed text-black sm:text-base">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative aspect-[538/509] w-full shrink-0 overflow-hidden rounded-[5px] lg:basis-[45%]">
          <Image
            src={assets.faqSalon}
            alt="Salon partenaire ARKHE avec bac de collecte de cheveux"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
      </div>
    </section>
  );
}
