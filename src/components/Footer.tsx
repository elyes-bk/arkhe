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
    <footer className="w-full overflow-hidden bg-arkhe-blue py-8">
      <div className="section-container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-auto" />
          <p className="text-xs text-white">
            2026 ARKHE - Economie Circulaire B2B.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-white transition-opacity hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
