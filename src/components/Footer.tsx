import Link from "next/link";
import { Logo } from "@/components/Logo";

const footerLinks = [
  { label: "Mentions légales", href: "#" },
  { label: "CGU", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Politique RSE", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative w-full min-h-[140px] bg-[#0738DC] overflow-hidden flex flex-col justify-center">

      {/* Logo pleine hauteur, collé à gauche, semi-transparent */}
      <div className="absolute left-0 top-0 h-full flex items-center pointer-events-none select-none">
        <Logo className="h-full w-auto opacity-20 object-contain object-left" />
      </div>

      {/* Contenu */}
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-24 py-5 lg:py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">

        {/* Baseline */}
        <p className="text-white/80 text-xs">
          2026 ARKHE – Économie Circulaire B2B.
        </p>

        {/* Liens */}
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/70 text-xs hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

      </div>
    </footer>
  );
}
