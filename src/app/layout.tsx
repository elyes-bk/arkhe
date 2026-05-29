import { Kumbh_Sans, Montserrat } from 'next/font/google';
import './globals.css';

// Configuration de Kumbh Sans (Titres / UI active)
const kumbhSans = Kumbh_Sans({
  subsets: ['latin'],
  variable: '--font-kumbh',
  weight: ['300', '400', '500', '600', '700', '900'],
});

// Configuration de Montserrat (Texte / Formulaires)
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${kumbhSans.variable} ${montserrat.variable}`}>
      <body className="bg-white text-[#1B1B1D] antialiased">
        {children}
      </body>
    </html>
  );
}