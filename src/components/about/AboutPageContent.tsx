import Link from "next/link";
import Image from "next/image";
import { assets } from "@/lib/assets";

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="#0738DC" />
      <path
        d="M6 10l2.5 2.5L14 7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImpactIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-10 items-center justify-center text-white">{children}</div>
  );
}

export function AboutPageContent() {
  const { about } = assets;

  return (
    <>
      {/* Hero */}
      <section className="relative w-full overflow-hidden about-hero-gradient pt-14 md:pt-16">
        <div className="pointer-events-none absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={about.heroMap}
            alt=""
            className="absolute right-0 top-0 h-full w-[min(100%,720px)] object-contain object-right opacity-90 mix-blend-screen"
            aria-hidden
          />
        </div>
        <div className="section-container relative z-10 flex min-h-[380px] flex-col justify-center py-12 sm:min-h-[440px] sm:py-16 lg:min-h-[500px]">
          <p className="font-montserrat text-sm text-white/90 sm:text-base">
            À propos de ARKHE
          </p>
          <h1 className="mt-3 max-w-3xl font-kumbh text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Du Salon de Coiffure aux Technologies Énergétiques
          </h1>
          <p className="mt-4 max-w-2xl font-montserrat text-base text-white/95 sm:text-lg">
            Transformer une biomasse collectée localement en matériaux stratégiques
            pour contribuer à la souveraineté énergétique européenne.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex rounded border border-white bg-transparent px-8 py-2.5 font-kumbh text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>

      {/* Souveraineté */}
      <section className="w-full bg-white py-14 md:py-20">
        <div className="section-container">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
            <div className="flex flex-1 flex-col gap-5">
              <h2 className="font-kumbh text-2xl font-semibold text-arkhe-navy sm:text-3xl lg:text-[32px]">
                Une Contribution à la Souveraineté Énergétique Européenne
              </h2>
              <p className="font-montserrat text-base leading-relaxed text-black">
                Le stockage d&apos;énergie ne sera ni viable ni soutenable sans
                alternatives biosourcées performantes.
              </p>
              <p className="font-montserrat text-base leading-relaxed text-black">
                ARKHE s&apos;engage dans le développement de carbones actifs à partir de
                ressources collectées en France, destinés aux applications
                électrochimiques de pointe.
              </p>
              <p className="font-montserrat text-base leading-relaxed text-black">
                En valorisant une ressource collectée en France et transformée sur le
                territoire, nous participons à la construction d&apos;une filière plus
                résiliente, plus circulaire et moins dépendante des importations de
                matériaux stratégiques.
              </p>
            </div>

            <div className="flex flex-1 gap-4 sm:gap-5">
              <div className="flex w-[52%] flex-col gap-4">
                <div className="relative aspect-square overflow-hidden rounded-[5px]">
                  <Image
                    src={about.charcoal}
                    alt="Carbone poreux ARKHE"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 45vw, 280px"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-arkhe-blue" aria-hidden />
                  <div>
                    <p className="font-kumbh text-sm font-semibold text-arkhe-navy">
                      Biomasse locale
                    </p>
                    <p className="font-montserrat text-xs text-[#6E6E6E]">
                      Origine française et traçable
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-[5px] sm:min-h-[360px]">
                <Image
                  src={about.hair}
                  alt="Cheveux — biomasse locale"
                  fill
                  unoptimized
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 45vw, 320px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performances électrochimiques */}
      <section className="w-full bg-arkhe-lavender py-14 md:py-20">
        <div className="section-container">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <div className="flex flex-1 flex-col gap-5">
              <h2 className="font-kumbh text-2xl font-semibold text-arkhe-navy sm:text-3xl lg:text-[32px]">
                Des Performances Électrochimiques Validées
              </h2>
              <p className="font-montserrat text-base leading-relaxed text-black">
                Chaque lot de carbone développé par ARKHE fait l&apos;objet d&apos;une
                caractérisation physico-chimique et électrochimique approfondie. Cette
                démarche permet de valider les propriétés du matériau, d&apos;assurer sa
                reproductibilité et d&apos;évaluer son potentiel pour les applications de
                stockage d&apos;énergie. Les résultats obtenus mettent en évidence la
                capacité de nos carbones poreux à combiner performance, puissance de
                restitution et stabilité sur le long terme.
              </p>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-6 sm:gap-8">
              {[
                { value: "53,3", unit: "Wh/kg", label: "Densité énergétique" },
                { value: "408,5", unit: "W/kg", label: "Densité de puissance" },
                { value: "340", unit: "F/g", label: "Capacité spécifique maximale" },
                {
                  value: "97",
                  unit: "%",
                  label: "Rétention de capacité après 10 000 cycles",
                },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <p className="font-kumbh text-3xl font-bold text-arkhe-blue sm:text-4xl">
                    {stat.value}
                    <span className="text-2xl sm:text-3xl"> {stat.unit}</span>
                  </p>
                  <p className="font-montserrat text-sm text-black">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture poreuse */}
      <section className="w-full bg-white py-14 md:py-20">
        <div className="section-container">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            <div className="relative aspect-square w-full overflow-hidden rounded-[5px] lg:max-w-[480px] lg:shrink-0">
              <Image
                src={about.sem}
                alt="Microstructure poreuse du carbone ARKHE"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>

            <div className="flex flex-1 flex-col gap-6">
              <h2 className="font-kumbh text-2xl font-semibold text-arkhe-navy sm:text-3xl lg:text-[32px]">
                Une Architecture Conçue pour la Performance
              </h2>
              <p className="font-montserrat text-base leading-relaxed text-black">
                La valeur d&apos;un carbone ne réside pas uniquement dans sa composition
                chimique, mais dans l&apos;organisation de ses pores. C&apos;est cette
                architecture interne qui conditionne la capacité du matériau à stocker
                l&apos;énergie et à la restituer rapidement.
              </p>
              <p className="font-montserrat text-base leading-relaxed text-black">
                Chez ARKHE, nous maîtrisons la structuration de ce réseau poreux afin
                d&apos;optimiser les échanges électrochimiques et de faciliter la circulation
                des ions au sein du matériau.
              </p>

              <div>
                <h3 className="font-kumbh text-lg font-semibold text-arkhe-navy">
                  Résultats obtenus
                </h3>
                <ul className="mt-4 flex flex-col gap-4">
                  {[
                    {
                      title: "Surface spécifique élevée",
                      text: "Une architecture poreuse optimisée offrant davantage de sites actifs pour le stockage électrochimique.",
                    },
                    {
                      title: "Diffusion ionique facilitée",
                      text: "Un réseau de pores interconnectés favorisant la circulation rapide des ions au sein du matériau.",
                    },
                    {
                      title: "Stabilité structurelle renforcée",
                      text: "Une porosité conçue pour préserver l'intégrité du matériau et maintenir ses performances au fil des cycles.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <CheckIcon />
                      <div>
                        <p className="font-kumbh text-sm font-semibold text-arkhe-navy">
                          {item.title}
                        </p>
                        <p className="mt-0.5 font-montserrat text-sm text-[#6E6E6E]">
                          {item.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="w-full bg-white py-14 md:py-20">
        <div className="section-container">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-kumbh text-2xl font-semibold text-arkhe-navy sm:text-3xl lg:text-[32px]">
              Un matériau destiné à accélérer la recherche et le développement
              industriel.
            </h2>
            <p className="mt-4 font-montserrat text-base text-[#6E6E6E]">
              Les carbones poreux sont aujourd&apos;hui étudiés et utilisés dans de
              nombreux domaines liés à l&apos;énergie.
            </p>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <div className="flex flex-1 flex-col gap-6">
              {[
                {
                  title: "Supercondensateurs",
                  text: "Grâce à leur très grande surface spécifique, ils peuvent être intégrés dans des électrodes destinées aux supercondensateurs, utilisés pour délivrer ou récupérer rapidement de l'énergie.",
                  highlight: true,
                },
                {
                  title: "Batteries de nouvelle génération",
                  text: "Ils constituent également des matériaux d'intérêt pour le développement des batteries Sodium-Ion et d'autres technologies émergentes de stockage électrochimique.",
                  highlight: false,
                },
                {
                  title: "Recherche & Développement",
                  text: "Laboratoires, universités et industriels utilisent ces matériaux pour explorer de nouvelles architectures d'électrodes et améliorer les performances des systèmes énergétiques de demain.",
                  highlight: false,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`border-l-2 pl-5 ${
                    item.highlight ? "border-arkhe-blue" : "border-transparent"
                  }`}
                >
                  <h3
                    className={`font-kumbh text-lg font-semibold ${
                      item.highlight ? "text-arkhe-blue" : "text-arkhe-navy"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 font-montserrat text-sm leading-relaxed text-black sm:text-base">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[5px] lg:max-w-[420px] lg:shrink-0">
              <Image
                src={about.molecule}
                alt="Structure moléculaire — applications énergétiques"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* De la matière à l'impact */}
      <section className="w-full bg-arkhe-navy py-14 md:py-20">
        <div className="section-container">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-kumbh text-2xl font-semibold text-white sm:text-3xl lg:text-[32px]">
              De la Matière à l&apos;Impact
            </h2>
            <p className="mt-4 font-montserrat text-base text-white/85">
              Derrière chaque gramme de carbone se cache un potentiel d&apos;innovation
              capable d&apos;accélérer le développement des technologies énergétiques de
              demain.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ),
                title: "Accélérer la Recherche",
                text: "Fournir aux laboratoires un matériau caractérisé et reproductible pour tester de nouvelles architectures électrochimiques.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 17l6-6 4 4 8-10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 5h4v4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "Améliorer les Performances",
                text: "Développer des matériaux capables d'optimiser le stockage, la puissance et la durabilité des dispositifs énergétiques.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 21s-7-4.5-7-10a7 7 0 1114 0c0 5.5-7 10-7 10z" />
                    <circle cx="12" cy="11" r="2.5" />
                  </svg>
                ),
                title: "Renforcer la Souveraineté",
                text: "Construire une filière locale de matériaux stratégiques afin de réduire la dépendance aux ressources importées.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-4">
                <ImpactIcon>{item.icon}</ImpactIcon>
                <h3 className="font-kumbh text-lg font-semibold text-white">{item.title}</h3>
                <p className="font-montserrat text-sm leading-relaxed text-white/80">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que nous voulons changer */}
      <section className="w-full bg-white py-14 md:py-20">
        <div className="section-container flex flex-col gap-10 md:gap-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="flex max-w-xl flex-col gap-5">
              <h2 className="font-kumbh text-2xl font-semibold text-arkhe-navy sm:text-3xl lg:text-[32px]">
                Ce que nous voulons changer
              </h2>
              <p className="font-kumbh text-xl font-medium text-arkhe-navy">
                Reprendre la main sur les matériaux critiques du stockage d&apos;énergie.
              </p>
              <p className="font-montserrat text-base leading-relaxed text-black">
                Laboratoires, universités et industriels utilisent ces matériaux pour
                explorer de nouvelles architectures d&apos;électrodes et améliorer les
                performances des systèmes énergétiques de demain.
              </p>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-8 sm:gap-12 lg:pt-2">
              <div>
                <p className="font-kumbh text-4xl font-bold text-arkhe-blue sm:text-5xl">
                  85 %
                </p>
                <p className="mt-2 font-montserrat text-sm text-black">
                  du graphite naturel est produit en Asie
                </p>
              </div>
              <div>
                <p className="font-kumbh text-4xl font-bold text-arkhe-navy sm:text-5xl">
                  1 <span className="text-2xl font-semibold sm:text-3xl">alternative</span>
                </p>
                <p className="mt-2 font-montserrat text-sm text-black">
                  une ressource locale transformée en France
                </p>
              </div>
            </div>
          </div>

          {/* Carte Europe */}
          <div className="mx-auto w-full max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={about.worldMap}
              alt="Carte européenne — réseau ARKHE depuis la France"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative min-h-[300px] w-full overflow-hidden py-20 md:min-h-[380px] md:py-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={about.ctaBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
        <div className="section-container relative z-10 flex flex-col items-center text-center">
          <h2 className="max-w-2xl font-kumbh text-3xl font-bold text-white sm:text-4xl">
            Entrez dans l&apos;univers ARKHE.
          </h2>
          <p className="mt-4 max-w-xl font-montserrat text-base text-white/90 sm:text-lg">
            Découvrez une innovation française qui transforme un déchet du quotidien en
            ressource stratégique pour la transition énergétique.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded border border-white bg-transparent px-8 py-2.5 font-kumbh text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </>
  );
}
