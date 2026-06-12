"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import HeaderAuthButton from "@/components/HeaderAuthButton";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/#aPropos" },
];

interface HeaderProps {
  isLoggedIn?: boolean;
}

export default function Header({ isLoggedIn = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-arkhe-navy">
      <div className="mx-auto flex w-full max-w-content items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="ARKHE — Accueil">
          <Image
            src="/images/logo-nav.png"
            alt="Arkhe"
            width={120}
            height={36}
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Desktop : nav + Contact + CTA groupés ensemble */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap font-montserrat text-sm text-white transition-opacity hover:opacity-80 lg:text-base"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="whitespace-nowrap rounded font-montserrat text-sm text-white border border-white px-4 py-1.5 transition-opacity hover:opacity-80 lg:text-base"
          >
            Contact
          </Link>
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
          <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
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
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="block font-montserrat text-base text-white"
              >
                Contact
              </Link>
            </li>
            <li>
              <HeaderAuthButton isLoggedIn={isLoggedIn} className="inline-flex px-4 py-2 text-sm" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
