import Link from "next/link";
import { assets } from "@/lib/assets";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden hero-gradient pt-14 md:pt-16">
      <div className="section-container relative flex min-h-[420px] flex-col justify-center py-12 sm:min-h-[500px] sm:py-16 lg:min-h-[560px] lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-kumbh text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            <span className="font-normal">Transformez vos cheveux en </span>
            carbone haute performance
          </h1>
          <p className="mt-4 font-montserrat text-base text-white sm:mt-6 sm:text-lg lg:text-xl">
            Chaque sac de cheveux collectés devient un matériau carbone activé (&gt;2000
            m²/g) vendu aux industriels de demain.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
            <Link
              id="rejoindre"
              href="/register"
              className="inline-flex rounded bg-white px-6 py-2 font-kumbh text-base font-medium text-arkhe-blue transition-opacity hover:opacity-90 sm:px-8 sm:py-2.5 sm:text-lg"
            >
              Rejoindre ARKHE
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded border border-white bg-transparent px-6 py-2 font-kumbh text-base font-medium text-white transition-opacity hover:opacity-90 sm:px-8 sm:py-2.5 sm:text-lg"
            >
              Contactez-nous
            </Link>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assets.heroLogo}
          alt=""
          width={535}
          height={409}
          className="pointer-events-none absolute bottom-0 right-0 hidden h-[409px] w-[535px] max-w-none object-contain opacity-80 lg:block"
          aria-hidden
        />
      </div>
    </section>
  );
}
