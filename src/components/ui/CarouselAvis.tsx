import React, { useState } from 'react'
import Image from 'next/image'

interface Testimonial {
  id: string
  quote: string
  authorName: string
  authorRole: string
  avatarUrl?: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "Rejoindre ARKHE a donné un sens nouveau à notre métier. Au-delà de la coupe, nous participons activement à la création de matériaux industriels du futur. La logistique est d'une simplicité désarmante.",
    authorName: 'Marc Antoine',
    authorRole: "Fondateur, Atelier Ciseaux d'Or"
  },
  {
    id: '2',
    quote: "Mes clients adorent l'initiative. Pouvoir leur dire que leurs cheveux coupés vont servir à créer du carbone pour les technologies de demain. C’est un geste zéro contrainte pour l’équipe qui change tout.",
    authorName: 'Élodie Martin',
    authorRole: "Fondatrice, Maison Nuance Coiffure"
  },
  {
    id: '3',
    quote: "Avec plus de 80 clients par jour, nous générons une quantité de cheveux impressionnante. ARKHE a transformé ce déchet encombrant en une ressource précieuse.",
    authorName: 'Thomas Roussel',
    authorRole: "Directeur, L'Atelier Capillaire"
  },
  {
    id: '4',
    quote: "Une plateforme robuste et transparente. Nous recevons des rapports d'impact précis que nos clients adorent consulter. C'est le partenaire RSE idéal pour un salon moderne.",
    authorName: 'Elena Rossi',
    authorRole: 'Gérante, Green Salon'
  }
]

const QuoteIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 35H12.5V25H20V17.5C20 13.3579 16.6421 10 12.5 10V5C19.4036 5 25 10.5964 25 17.5V35ZM47.5 35H37.5V25H45V17.5C45 13.3579 41.6421 10 37.5 10V5C44.4036 5 50 10.5964 50 17.5V35Z" fill="#E2E9FF"/>
  </svg>
)

const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg 
    width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={direction === 'left' ? 'rotate-180' : ''}
  >
    <circle cx="24" cy="24" r="23" stroke="#04082E" strokeWidth="2"/>
    <path d="M20 14L30 24L20 34" stroke="#04082E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function CarouselAvis() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // To show multiple items, we create an array of visible items based on currentIndex
  const visibleItems = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length]
  ]

  return (
    <div className="flex flex-col gap-[43px] w-full overflow-hidden">
      
      {/* Controls */}
      <div className="flex flex-row justify-end items-center gap-[11px] px-[20px]">
        <button onClick={prevSlide} className="hover:opacity-80 transition-opacity">
          <ArrowIcon direction="left" />
        </button>
        <button onClick={nextSlide} className="hover:opacity-80 transition-opacity">
          <ArrowIcon direction="right" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-row gap-[34px] transition-transform duration-500 ease-in-out">
        {visibleItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="relative flex-1 min-w-[350px]">
            
            <div className="absolute -top-[15px] -right-[15px] z-10">
              <QuoteIcon />
            </div>

            <div className="flex flex-col justify-between h-full gap-[10px] bg-[#0738DC] p-[22px] rounded-[5px] border border-[#BDC5DF] relative z-20">
              <div className="flex flex-col gap-[32px] h-full">
                <p className="font-sans font-normal text-[16px] leading-[24px] text-white">
                  "{item.quote}"
                </p>
                
                <div className="flex flex-row items-center gap-[16px] mt-auto">
                  <div className="w-[50px] h-[50px] bg-[#E2E9FF] rounded-[2px] border border-[#0738DC] shrink-0" />
                  <div className="flex flex-col gap-[4px]">
                    <span className="font-heading font-semibold text-[20px] leading-[24.8px] text-white">
                      {item.authorName}
                    </span>
                    <span className="font-sans font-normal text-[16px] leading-[19.5px] text-white">
                      {item.authorRole}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
