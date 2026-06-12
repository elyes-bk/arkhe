"use client";

import Link from "next/link";
import { useState } from "react";
import HeaderAuthButton from "@/components/HeaderAuthButton";

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuButtonProps {
  navLinks: NavLink[];
  isLoggedIn: boolean;
}

export default function MobileMenuButton({ navLinks, isLoggedIn }: MobileMenuButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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

      {menuOpen && (
        <nav className="fixed inset-x-0 top-[53px] z-50 border-t border-white/10 bg-arkhe-navy px-4 py-4 sm:hidden">
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
              <HeaderAuthButton
                isLoggedIn={isLoggedIn}
                className="inline-flex px-4 py-2 text-sm"
              />
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
