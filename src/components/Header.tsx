"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Notre mission", href: "#mission" },
  { label: "Comment ça marche", href: "#etapes" },
  { label: "Salons partenaires", href: "#temoignages" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-arkhe-navy">
      <div className="mx-auto flex w-full max-w-content items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="ARKHE — Accueil">
          <Logo className="h-9 w-auto" />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 sm:flex md:gap-5 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap font-montserrat text-xs text-white transition-opacity hover:opacity-80 md:text-sm lg:text-base"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/register"
            className="hidden rounded bg-arkhe-blue px-3 py-1.5 font-kumbh text-xs font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex sm:text-sm"
          >
            Rejoindre
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-center gap-1.5 p-2 sm:hidden"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 bg-arkhe-navy px-4 py-4 sm:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-montserrat text-base text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="inline-flex rounded bg-arkhe-blue px-4 py-2 font-kumbh text-sm font-medium text-white"
              >
                Rejoindre
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
