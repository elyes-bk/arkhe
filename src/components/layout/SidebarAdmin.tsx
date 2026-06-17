'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { logout } from '@/actions/auth'

interface SidebarAdminProps {
  collapsed?: boolean
  activeTab?: 'dashboard' | 'moderation' | 'map'
}

const HamburgerIcon = () => (
  /* Figma: groupe 29.4×21 — 3 traits de largeurs décroissantes (29.4 / 21 / 12.6 px) */
  <svg width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 1H29.4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M0 11H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M0 21H12.6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="white"/>
  </svg>
)

const ModerationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4.5L19.5 12L12 19.5L4.5 12L12 4.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9V15M9 12H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6V19L9 16L15 19L20 16V3L15 6L9 3L4 6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 3V16M15 6V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function SidebarAdmin({ collapsed = false, activeTab = 'dashboard' }: SidebarAdminProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const isExpanded = !collapsed || isHovered

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <DashboardIcon />, href: '/admin' },
    { id: 'moderation', label: 'Modération salons', icon: <ModerationIcon />, href: '/admin/moderation', hasNotification: true },
    { id: 'map', label: 'Carte logistique', icon: <MapIcon />, href: '/admin/map' }
  ]

  return (
    <>
      {/* Mobile Top Header — caché quand le menu burger est ouvert (z-50 le couvre, mais on le masque proprement) */}
      <div className={`md:hidden flex flex-row items-center justify-between bg-[#04082E] px-[25px] py-[17px] w-full sticky top-0 z-40${mobileMenuOpen ? ' hidden' : ''}`}>
        <button onClick={() => setMobileMenuOpen(true)} className="flex items-center">
          <HamburgerIcon />
        </button>
        {/* Logo Figma : 62×42px */}
        <Image src="/logo.svg" alt="ARKHE" width={42} height={42} priority />
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu container */}
          <div className="md:hidden fixed inset-x-0 top-0 bg-[#04082E] z-50 px-[24px] pt-[24px] pb-[32px] flex flex-col gap-[28px] shadow-lg overflow-hidden">

            {/* Watermark logo — normal orientation, bottom-right, like the maquette */}
            <div
              className="absolute pointer-events-none select-none opacity-[0.06] text-white"
              style={{ right: '-70px', bottom: '0px', width: '347px', height: '214px' }}
            >
              <svg className="w-full h-full" viewBox="0 0 68 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M54.812 35.5221L54.6513 8.39138L54.6385 6.1909L54.6128 1.88616C54.6064 0.840453 53.7517 -0.00637919 52.6979 3.6212e-05L48.444 0.0256972L21.0702 0.186082H20.8517C20.6718 0.186082 20.4919 0.192498 20.312 0.192498C14.7408 0.352883 9.72227 2.68167 6.05957 6.36412V6.47959H5.9439C2.24908 10.2647 -0.0127971 15.4291 5.44748e-05 21.126C0.0193318 26.8613 2.35189 32.0578 6.1174 35.8172H6.23949V35.9391C10.0243 39.6665 15.2356 41.9632 20.9738 41.9439C22.2333 41.9439 23.467 41.8285 24.6686 41.6103C29.0317 40.8212 32.9258 38.6785 35.8881 35.6376C36.6527 34.8613 37.3467 34.0273 37.9764 33.142C38.1756 32.8661 38.362 32.5839 38.5419 32.3016L48.5469 17.4499L48.6561 35.5606L48.6946 41.8734L54.8505 41.8734L54.8505 41.8349L54.812 35.5221ZM41.3885 16.7891L33.594 28.3625C32.7266 29.7034 33.0864 29.158 32.4374 30.0819C29.9442 33.6488 25.5875 35.7146 20.8967 35.7274H20.8581C12.7617 35.7274 6.18166 29.1901 6.15596 21.0939C6.13025 13.2543 12.2733 6.83244 20.0228 6.39619H20.0549C20.2991 6.38336 20.5561 6.37695 20.8067 6.37695C20.9995 6.37695 21.1923 6.37695 21.3851 6.38978L35.7081 6.30638L48.4826 6.22939H48.5019L48.4826 6.26147L41.3885 16.7891Z" fill="currentColor"/>
              </svg>
            </div>

            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:opacity-80 transition-opacity p-1"
                aria-label="Fermer le menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col">
              {navItems.map((item, index) => {
                const isActive = activeTab === item.id
                return (
                  <div key={item.id} className="flex flex-col">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-row items-center gap-[16px] py-[16px] relative"
                    >
                      {isActive && (
                        <div className="absolute -left-[24px] top-1/2 -translate-y-1/2 w-[4px] h-[32px] bg-white rounded-r-full" />
                      )}
                      <div className="shrink-0">{item.icon}</div>
                      <span className="font-sans text-[16px] leading-[19.5px] text-white font-normal">
                        {item.label}
                      </span>
                    </Link>
                    {index < navItems.length - 1 && (
                      <div className="w-full h-px bg-white/20" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Logout CTA */}
            <div className="border-t border-white/20 pt-[16px]">
              <form action={logout}>
                <button
                  type="submit"
                  className="flex flex-row items-center gap-[16px] py-[14px] w-full text-white/60 hover:text-[#E14D5F] transition-colors duration-150 group"
                >
                  <svg className="w-5 h-5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  <span className="font-sans text-[15px] font-medium">Se déconnecter</span>
                </button>
              </form>
            </div>

            {/* User Profile */}
            <div className="flex flex-row items-center gap-[14px] pt-[20px] border-t border-white/20">
              <div className="relative w-[40px] h-[40px] rounded-[4px] overflow-hidden shrink-0 border border-slate-700">
                <Image
                  src="/quentin.png"
                  alt="Quentin DANEL"
                  fill
                  sizes="40px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-normal text-[14px] text-white/80">Admin</span>
                <span className="font-sans font-semibold text-[16px] text-white">Quentin DANEL</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="hidden md:flex flex-col justify-between bg-[#04082E] h-screen sticky top-0 relative transition-[width] duration-300 ease-out py-[32px] overflow-hidden"
        style={{ width: isExpanded ? '280px' : '100px' }}
      >
        <div className="flex flex-col gap-[64px]">
          {/* Header / Logo Area */}
          <div 
            className="flex flex-col" 
            style={{ 
              gap: '16px', 
              paddingLeft: '17px', 
              paddingRight: '24px'
            }}
          >
            <div className="flex flex-col gap-[8px]">
              {/* Logo Image — 17px du bord gauche (spec Figma) */}
              <div className="flex">
                <div style={{ width: '68px', height: '42px', flexShrink: 0 }}>
                  <Image src="/logo.svg" alt="ARKHE" width={68} height={42} priority />
                </div>
              </div>
              
              {/* Hauteur fixe : le texte est toujours présent dans le layout, seule l'opacité change. */}
              <div style={{ height: '18px' }}>
                <span 
                  className="font-sans font-normal text-[14px] leading-[18px] text-white block whitespace-nowrap"
                  style={{
                    opacity: !isExpanded ? 0 : 0.8,
                    transition: 'opacity 250ms cubic-bezier(0, 0, 0.2, 1)'
                  }}
                >
                  Tour de Controle Logistique
                </span>
              </div>
            </div>
            
            {/* Séparateur pleine largeur, plus visible */}
            <div className="h-px bg-white/40" style={{ marginLeft: '-17px', marginRight: '-24px' }} />
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-[12px] w-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <Link 
                  key={item.id} 
                  href={item.href}
                  className={`flex flex-row items-center gap-[16px] py-[14px] relative group w-full transition-colors duration-150
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#0738DC] to-[#0738DC]/10 border-l-[3px] border-[#0738DC]' 
                      : 'hover:bg-white/5 border-l-[3px] border-transparent'
                    }
                  `}
                  style={{ 
                    paddingLeft: isExpanded ? '21px' : '0px', 
                    paddingRight: isExpanded ? '21px' : '0px',
                    justifyContent: isExpanded ? 'flex-start' : 'center'
                  }}
                  title={!isExpanded ? item.label : undefined}
                >
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className={`${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'} transition-opacity`}>
                      {item.icon}
                    </div>
                    {item.hasNotification && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E14D5F] rounded-full border-2 border-[#04082E]" />
                    )}
                  </div>
                  
                  <div 
                    className="overflow-hidden" 
                    style={{ 
                      maxWidth: !isExpanded ? '0' : '200px', 
                      opacity: !isExpanded ? 0 : 1,
                      transition: 'max-width 300ms cubic-bezier(0, 0, 0.2, 1), opacity 300ms cubic-bezier(0, 0, 0.2, 1)'
                    }}
                  >
                    <span className={`font-sans text-[15px] font-semibold leading-[18.28px] text-white block whitespace-nowrap ${isActive ? 'font-bold' : 'font-normal opacity-80 group-hover:opacity-100'}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        <div>
          {/* Logout CTA */}
          <form action={logout} className="w-full z-10">
            <button
              type="submit"
              title={!isExpanded ? 'Se déconnecter' : undefined}
              className="flex flex-row items-center justify-center gap-[16px] w-full py-[12px] text-white/60 hover:text-[#E14D5F] transition-colors duration-150 group"
              style={{ 
                paddingLeft: isExpanded ? '24px' : '0px',
                paddingRight: isExpanded ? '24px' : '0px',
                justifyContent: isExpanded ? 'flex-start' : 'center'
              }}
            >
              {/* Logout icon */}
              <svg className="w-5 h-5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity justify-center" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <div 
                className="overflow-hidden" 
                style={{ 
                  maxWidth: !isExpanded ? '0' : '200px', 
                  opacity: !isExpanded ? 0 : 1,
                  transition: 'max-width 300ms cubic-bezier(0, 0, 0.2, 1), opacity 300ms cubic-bezier(0, 0, 0.2, 1)'
                }}
              >
                <span className="font-sans text-[13px] font-medium whitespace-nowrap">Se déconnecter</span>
              </div>
            </button>
          </form>

          {/* User Profile */}
          <div 
            className="flex flex-row items-center gap-[14px] overflow-hidden z-10"
            style={{ 
              paddingLeft: isExpanded ? '24px' : '0px',
              paddingRight: isExpanded ? '24px' : '0px',
              justifyContent: isExpanded ? 'flex-start' : 'center'
            }}
          >
            <div className="w-[40px] h-[40px] rounded-[4px] overflow-hidden shrink-0 relative border border-slate-700">
              <Image 
                src="/quentin.png" 
                alt="Profile Quentin"
                fill
                className="object-cover"
              />
            </div>
            <div 
              className="overflow-hidden" 
              style={{ 
                maxWidth: !isExpanded ? '0' : '200px', 
                opacity: !isExpanded ? 0 : 1,
                transition: 'max-width 300ms cubic-bezier(0, 0, 0.2, 1), opacity 300ms cubic-bezier(0, 0, 0.2, 1)'
              }}
            >
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-sans font-normal text-[14px] text-white/80">Admin</span>
                <span className="font-sans font-semibold text-[15px] text-white">Quentin DANEL</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Faded outline watermark symbols */}
        <div className="absolute inset-x-0 bottom-0 top-1/3 pointer-events-none select-none z-0 overflow-hidden">
          {/* Top Logo Watermark (inversé) */}
          <div 
            className="absolute opacity-[0.06] text-white rotate-180"
            style={{ left: '-67px', width: '347px', height: '214px', bottom: '214px' }}
          >
            <svg className="w-full h-full" viewBox="0 0 68 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M54.812 35.5221L54.6513 8.39138L54.6385 6.1909L54.6128 1.88616C54.6064 0.840453 53.7517 -0.00637919 52.6979 3.6212e-05L48.444 0.0256972L21.0702 0.186082H20.8517C20.6718 0.186082 20.4919 0.192498 20.312 0.192498C14.7408 0.352883 9.72227 2.68167 6.05957 6.36412V6.47959H5.9439C2.24908 10.2647 -0.0127971 15.4291 5.44748e-05 21.126C0.0193318 26.8613 2.35189 32.0578 6.1174 35.8172H6.23949V35.9391C10.0243 39.6665 15.2356 41.9632 20.9738 41.9439C22.2333 41.9439 23.467 41.8285 24.6686 41.6103C29.0317 40.8212 32.9258 38.6785 35.8881 35.6376C36.6527 34.8613 37.3467 34.0273 37.9764 33.142C38.1756 32.8661 38.362 32.5839 38.5419 32.3016L48.5469 17.4499L48.6561 35.5606L48.6946 41.8734L54.8505 41.8734L54.8505 41.8349L54.812 35.5221ZM41.3885 16.7891L33.594 28.3625C32.7266 29.7034 33.0864 29.158 32.4374 30.0819C29.9442 33.6488 25.5875 35.7146 20.8967 35.7274H20.8581C12.7617 35.7274 6.18166 29.1901 6.15596 21.0939C6.13025 13.2543 12.2733 6.83244 20.0228 6.39619H20.0549C20.2991 6.38336 20.5561 6.37695 20.8067 6.37695C20.9995 6.37695 21.1923 6.37695 21.3851 6.38978L35.7081 6.30638L48.4826 6.22939H48.5019L48.4826 6.26147L41.3885 16.7891Z" fill="currentColor"/>
            </svg>
          </div>
          
          {/* Bottom Logo Watermark (normal) */}
          <div 
            className="absolute opacity-[0.06] text-white"
            style={{ left: '0px', width: '347px', height: '214px', bottom: '0px' }}
          >
            <svg className="w-full h-full" viewBox="0 0 68 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M54.812 35.5221L54.6513 8.39138L54.6385 6.1909L54.6128 1.88616C54.6064 0.840453 53.7517 -0.00637919 52.6979 3.6212e-05L48.444 0.0256972L21.0702 0.186082H20.8517C20.6718 0.186082 20.4919 0.192498 20.312 0.192498C14.7408 0.352883 9.72227 2.68167 6.05957 6.36412V6.47959H5.9439C2.24908 10.2647 -0.0127971 15.4291 5.44748e-05 21.126C0.0193318 26.8613 2.35189 32.0578 6.1174 35.8172H6.23949V35.9391C10.0243 39.6665 15.2356 41.9632 20.9738 41.9439C22.2333 41.9439 23.467 41.8285 24.6686 41.6103C29.0317 40.8212 32.9258 38.6785 35.8881 35.6376C36.6527 34.8613 37.3467 34.0273 37.9764 33.142C38.1756 32.8661 38.362 32.5839 38.5419 32.3016L48.5469 17.4499L48.6561 35.5606L48.6946 41.8734L54.8505 41.8734L54.8505 41.8349L54.812 35.5221ZM41.3885 16.7891L33.594 28.3625C32.7266 29.7034 33.0864 29.158 32.4374 30.0819C29.9442 33.6488 25.5875 35.7146 20.8967 35.7274H20.8581C12.7617 35.7274 6.18166 29.1901 6.15596 21.0939C6.13025 13.2543 12.2733 6.83244 20.0228 6.39619H20.0549C20.2991 6.38336 20.5561 6.37695 20.8067 6.37695C20.9995 6.37695 21.1923 6.37695 21.3851 6.38978L35.7081 6.30638L48.4826 6.22939H48.5019L48.4826 6.26147L41.3885 16.7891Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}
