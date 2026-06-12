"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

const STACK_GAP = 16;
const STACK_SCALE_STEP = 0.04;
const STICKY_TOP_MOBILE = 64;
const STICKY_TOP_TABLET = 76;
const STICKY_TOP_DESKTOP = 88;
const DESKTOP_BREAKPOINT = 1280;
const TABLET_BREAKPOINT = 768;

type ViewportMode = "mobile" | "tablet" | "desktop";

function getViewportMode(width: number): ViewportMode {
  if (width >= DESKTOP_BREAKPOINT) return "desktop";
  if (width >= TABLET_BREAKPOINT) return "tablet";
  return "mobile";
}

function getStickyTop(mode: ViewportMode): number {
  if (mode === "desktop") return STICKY_TOP_DESKTOP;
  if (mode === "tablet") return STICKY_TOP_TABLET;
  return STICKY_TOP_MOBILE;
}

function computeSectionHeight(
  cardHeight: number,
  viewportHeight: number,
  stickyTop: number,
  isCompact: boolean,
  cardCount: number
): number {
  const titleZone = isCompact ? 96 : 112;
  const transitions = cardCount - 1;
  const scrollPerTransition = isCompact
    ? Math.min(viewportHeight * 0.38, cardHeight * 0.55)
    : viewportHeight * 0.68;
  const tail = isCompact ? 16 : viewportHeight * 0.06;

  return (
    titleZone +
    stickyTop +
    cardHeight +
    transitions * scrollPerTransition +
    tail
  );
}

const tallestCardIndex = values.reduce(
  (max, value, index, arr) =>
    value.description.length > arr[max].description.length ? index : max,
  0
);

function getCardStackStyle(
  index: number,
  progress: number,
  total: number,
  collapseAtEnd = false
): React.CSSProperties {
  if (collapseAtEnd && progress >= 0.99) {
    if (index === total - 1) {
      return { transform: "translateY(0) scale(1)", zIndex: 3 };
    }
    return {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    };
  }

  const phase = progress * (total - 1);
  const activeIndex = Math.floor(phase);
  const transition = phase - activeIndex;

  if (index > activeIndex + 1) {
    return {
      transform: "translateY(100%)",
      zIndex: index + 1,
    };
  }

  if (index === activeIndex + 1 && activeIndex < total - 1) {
    return {
      transform: `translateY(${(1 - transition) * 100}%)`,
      zIndex: total + 2,
    };
  }

  if (index <= activeIndex) {
    const depth = activeIndex - index;
    const pushBack =
      index === activeIndex && activeIndex < total - 1
        ? -STACK_GAP * transition
        : 0;
    const scalePenalty =
      depth * STACK_SCALE_STEP +
      (index === activeIndex && activeIndex < total - 1
        ? transition * STACK_SCALE_STEP
        : 0);

    return {
      transform: `translateY(${-STACK_GAP * depth + pushBack}px) scale(${1 - scalePenalty})`,
      zIndex: index + 1,
    };
  }

  return {
    transform: "translateY(100%)",
    zIndex: index + 1,
  };
}

function ValueCardBlock({
  image,
  imageAlt,
  title,
  description,
  stats,
  variant,
  stackStyle,
  isStacked = false,
}: ValueCard & {
  stackStyle?: React.CSSProperties;
  isStacked?: boolean;
}) {
  const styles = variantStyles[variant];

  return (
    <article
      className={`flex w-full flex-col items-stretch gap-6 rounded-[5px] px-5 py-6 shadow-[0_12px_40px_rgba(4,8,46,0.2)] sm:px-8 sm:py-8 lg:min-h-[413px] lg:flex-row lg:items-center lg:gap-12 lg:px-10 lg:py-10 xl:px-12 ${styles.card} ${isStacked ? "absolute inset-x-0 top-0 will-change-transform" : ""}`}
      style={stackStyle}
    >
      <div className="order-1 flex min-w-0 flex-1 flex-col gap-6 lg:order-2 lg:justify-between lg:self-stretch">
        <div className="flex flex-col gap-4">
          <h3
            className={`font-kumbh text-xl font-semibold sm:text-2xl ${styles.title}`}
          >
            {title}
          </h3>
          <p
            className={`font-montserrat text-sm leading-relaxed sm:text-base ${styles.body}`}
          >
            {description}
          </p>
        </div>

        <div className="flex flex-row gap-6 sm:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <p
                className={`font-kumbh text-3xl font-semibold sm:text-4xl ${styles.statValue}`}
              >
                {stat.value}
              </p>
              <p
                className={`max-w-[200px] font-montserrat text-sm sm:text-base ${styles.statLabel}`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative order-2 aspect-[491/351] w-full shrink-0 overflow-hidden rounded-[5px] lg:order-1 lg:w-[40%] lg:shrink-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
      </div>
    </article>
  );
}

export function ValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [stickyTop, setStickyTop] = useState(STICKY_TOP_MOBILE);
  const [collapseAtEnd, setCollapseAtEnd] = useState(true);
  const [exitOpacity, setExitOpacity] = useState(1);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateSectionHeight = () => {
      const mode = getViewportMode(window.innerWidth);
      const top = getStickyTop(mode);
      const isCompact = mode !== "desktop";
      const vh = window.innerHeight;
      const cardH =
        measureRef.current?.offsetHeight ?? (isCompact ? 620 : 413);

      setSectionHeight(
        computeSectionHeight(cardH, vh, top, isCompact, values.length)
      );
    };

    const update = () => {
      const section = sectionRef.current;
      const mode = getViewportMode(window.innerWidth);
      const top = getStickyTop(mode);
      const isCompact = mode !== "desktop";

      setStickyTop(top);
      setCollapseAtEnd(isCompact);
      updateSectionHeight();

      if (!section) {
        setProgress(0);
        setExitOpacity(1);
        return;
      }

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollable = section.offsetHeight - window.innerHeight;

      if (scrollable <= 0) {
        setProgress(0);
        setExitOpacity(1);
        return;
      }

      const nextProgress = Math.max(
        0,
        Math.min(1, (window.scrollY - sectionTop) / scrollable)
      );
      setProgress(nextProgress);

      if (isCompact) {
        setExitOpacity(1);
        return;
      }

      const fadeStart = window.innerHeight * 0.92;
      const nextExitOpacity =
        rect.bottom >= fadeStart
          ? 1
          : Math.max(0, (rect.bottom - top) / (fadeStart - top));
      setExitOpacity(nextExitOpacity);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const observer = new ResizeObserver(updateSectionHeight);
    if (measureRef.current) observer.observe(measureRef.current);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="valeurs"
      className="relative z-10 isolate w-full bg-white"
      style={sectionHeight ? { height: `${sectionHeight}px` } : undefined}
    >
      <div className="section-container pt-12 md:pt-16">
        <h2 className="font-kumbh text-2xl font-semibold text-black md:text-[32px]">
          Nos valeurs
        </h2>
      </div>

      <div
        className="sticky flex items-start"
        style={{
          top: stickyTop,
          ...(collapseAtEnd
            ? {}
            : {
                height: `calc(100vh - ${stickyTop}px)`,
                minHeight: `calc(100vh - ${stickyTop}px)`,
              }),
          opacity: exitOpacity,
          pointerEvents: exitOpacity < 0.05 ? "none" : "auto",
        }}
      >
        <div className="section-container relative isolate mt-8 w-full pb-2 sm:pb-4">
          <div className="relative w-full">
            <div
              ref={measureRef}
              className="invisible pointer-events-none"
              aria-hidden
            >
              <ValueCardBlock {...values[tallestCardIndex]} />
            </div>

            {values.map((value, index) => (
              <ValueCardBlock
                key={value.title}
                {...value}
                isStacked
                stackStyle={getCardStackStyle(
                  index,
                  progress,
                  values.length,
                  collapseAtEnd
                )}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
