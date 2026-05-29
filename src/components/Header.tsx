'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/* ─────────────────────────────────────────────────────────────
   SVG Icons
   ───────────────────────────────────────────────────────────────*/
const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Notre mission', href: '#' },
    { label: 'Comment ça marche', href: '#' },
    { label: 'Salons partenaires', href: '#' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#04082e] h-[72px] w-full flex items-center justify-between px-[25px] md:pl-[34px] md:pr-[69px]">
          
          {/* Mobile Left: Hamburger Icon */}
          <button 
            className="md:hidden text-white flex items-center justify-center w-[30px] h-[27px]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg width="30" height="27" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="29.4" height="2" fill="white" rx="1"/>
              <rect x="0" y="12.5" width="21" height="2" fill="white" rx="1"/>
              <rect x="0" y="25" width="12.6" height="2" fill="white" rx="1"/>
            </svg>
          </button>

          {/* Logo */}
          <div className="md:static">
            <Link href="/" className="block">
              <Image 
                src="/logo.svg" 
                alt="ARKHE" 
                width={62} 
                height={42} 
                priority 
                className="w-[62px] h-[42px] object-contain" 
              />
            </Link>
          </div>

          {/* Desktop Right: Navigation & Button */}
          <div className="hidden md:flex flex-row items-center gap-[87px]">
            <nav className="flex items-center gap-[54px]">
              {navLinks.map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.href} 
                  className="text-[18px] leading-[21.94px] font-sans font-normal text-white hover:text-gray-200 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link 
              href="#" 
              className="
                bg-[#0738dc] hover:bg-blue-700 
                text-white px-[15px] py-[7px]
                font-heading font-medium text-[16px] leading-[19.84px]
                transition-colors duration-200
              "
            >
              Rejoindre
            </Link>
          </div>

      </header>

      {/* ────────────────── MOBILE SLIDE-IN MENU ────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-[#04082e] p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <Image src="/logo.svg" alt="ARKHE" width={68} height={42} />
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-gray-300 p-1 focus:outline-none"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-sans text-white hover:text-gray-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-6">
              <Link 
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-[#0738dc] text-white font-heading font-medium py-3 text-[16px]"
              >
                Rejoindre
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
