'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface SidebarAdminProps {
  collapsed?: boolean
  activeTab?: 'dashboard' | 'moderation' | 'map'
}

const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M3 6H21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M3 18H21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="white"/>
  </svg>
)

const ModerationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 12L12 22L22 12L12 2ZM12 4.8L19.2 12L12 19.2L4.8 12L12 4.8Z" fill="white"/>
    <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11Z" fill="white"/>
  </svg>
)

const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.5 3L14.5 5.5L9.5 3.5L2.5 6V21L8.5 18.5L13.5 20.5L20.5 18V3ZM15 18.5L10 16.5V5.5L15 7.5V18.5Z" fill="white"/>
  </svg>
)

export function SidebarAdmin({ collapsed = false, activeTab = 'dashboard' }: SidebarAdminProps) {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <DashboardIcon />, href: '/admin/dashboard' },
    { id: 'moderation', label: 'Modération salons', icon: <ModerationIcon />, href: '/admin/moderation' },
    { id: 'map', label: 'Carte logistique', icon: <MapIcon />, href: '/admin/map' }
  ]

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex flex-row items-center justify-between bg-[#04082E] px-[25px] py-[17px] w-full sticky top-0 z-40">
        <button onClick={() => setMobileMenuOpen(true)}>
          <HamburgerIcon />
        </button>
        <Image src="/logo.svg" alt="ARKHE" width={68} height={42} priority />
      </div>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="bg-[#04082E] w-[280px] h-full p-[24px] flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-[64px]">
              <div className="flex flex-row justify-between items-center">
                <Image src="/logo.svg" alt="ARKHE" width={100} height={60} priority />
                <button onClick={() => setMobileMenuOpen(false)}>
                  <CloseIcon />
                </button>
              </div>

              <div className="flex flex-col gap-[24px]">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id
                  return (
                    <Link 
                      key={item.id} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-row items-center gap-[16px] relative"
                    >
                      {isActive && (
                        <div className="absolute -left-[24px] top-1/2 -translate-y-1/2 w-[4px] h-[32px] bg-white rounded-r-full" />
                      )}
                      <div>{item.icon}</div>
                      <span className={`font-sans text-[16px] leading-[19.5px] text-white ${isActive ? 'font-bold' : 'font-normal opacity-80'}`}>
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* User Profile */}
            <div className="flex flex-row items-center gap-[14px] mt-[64px]">
              <div className="w-[40px] h-[40px] bg-[#D9D9D9] rounded-full shrink-0" />
              <div className="flex flex-col">
                <span className="font-sans font-normal text-[14px] text-white/80">Admin</span>
                <span className="font-sans font-semibold text-[16px] text-white">Quentin DANEL</span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col justify-between bg-[#04082E] min-h-screen relative transition-all duration-300 ${collapsed ? 'w-[100px]' : 'w-[280px]'} px-[24px] py-[32px]`}>
        
        <div className="flex flex-col gap-[64px]">
          {/* Header / Logo Area */}
          <div className={`flex flex-col ${collapsed ? 'gap-[41px]' : 'gap-[16px]'}`}>
            <div className="flex flex-col gap-[8px]">
              {/* Logo Image */}
              <div className="flex justify-center md:justify-start">
                {collapsed ? (
                  <div className="w-[42px] h-[42px] bg-white rounded-md flex items-center justify-center font-heading font-bold text-[#04082E]">
                    A
                  </div>
                ) : (
                  <Image src="/logo.svg" alt="ARKHE" width={100} height={60} priority />
                )}
              </div>
              
              {!collapsed && (
                <span className="font-sans font-normal text-[15px] leading-[18.28px] text-white">
                  Tour de Controle Logistique
                </span>
              )}
            </div>
            
            <div className="w-full h-px bg-white/20" />
          </div>

          {/* Navigation */}
          <div className={`flex flex-col gap-[24px] ${collapsed ? 'pl-[23px]' : ''}`}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <Link 
                  key={item.id} 
                  href={item.href}
                  className="flex flex-row items-center gap-[16px] relative group"
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <div className="absolute -left-[24px] top-1/2 -translate-y-1/2 w-[4px] h-[32px] bg-white rounded-r-full" />
                  )}
                  
                  <div className="flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.icon}
                  </div>
                  
                  {!collapsed && (
                    <span className={`font-sans text-[16px] leading-[19.5px] text-white ${isActive ? 'font-bold' : 'font-normal opacity-80 group-hover:opacity-100'}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* User Profile */}
        <div className="flex flex-row items-center gap-[14px]">
          <div className="w-[40px] h-[40px] bg-[#D9D9D9] rounded-full shrink-0" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-sans font-normal text-[14px] text-white/80">Admin</span>
              <span className="font-sans font-semibold text-[16px] text-white">Quentin DANEL</span>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
