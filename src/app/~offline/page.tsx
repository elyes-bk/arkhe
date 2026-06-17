import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hors ligne — ARKHE",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-[#1B1B1D]">
      <Image
        src="/icons/icon-192.png"
        alt="ARKHE"
        width={96}
        height={96}
        className="mb-8"
        priority
      />
      <h1 className="font-kumbh text-2xl font-semibold md:text-3xl">
        Vous êtes hors ligne
      </h1>
      <p className="mt-4 max-w-md font-montserrat text-base text-[#6E6E6E]">
        Cette page n&apos;est pas disponible sans connexion internet.
        Reconnectez-vous pour accéder à l&apos;ensemble de la plateforme ARKHE.
      </p>
    </div>
  );
}
