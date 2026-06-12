"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import HeaderAuthButton from "@/components/HeaderAuthButton";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Notre mission", href: "#mission" },
  { label: "Comment ça marche", href: "#etapes" },
  { label: "Salons partenaires", href: "#temoignages" },
];

interface HeaderProps {
  isLoggedIn?: boolean;
}

export default function Header({ isLoggedIn = false }: HeaderProps) {
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
          {/* Desktop: Rejoindre ou Se déconnecter */}
          <div className="hidden sm:block">
            <HeaderAuthButton isLoggedIn={isLoggedIn} />
          </div>

          {/* Mobile hamburger */}
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
              <HeaderAuthButton isLoggedIn={isLoggedIn} className="inline-flex px-4 py-2 text-sm" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
