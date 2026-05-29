'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { AddressInput } from '@/components/inputs/AddressInput'
import { SiretInput } from '@/components/inputs/SiretInput'
import { SalonNameInput } from '@/components/inputs/SalonNameInput'
import { DocumentUpload } from '@/components/inputs/DocumentUpload'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated submission, then redirect to success
    router.push('/register/success')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#04082E] md:bg-white overflow-x-hidden">
      
      {/* 
        ========================================================================
        MOBILE LAYOUT
        ========================================================================
      */}
      <div className="md:hidden flex flex-col w-full">
        {/* Mobile Header Logo */}
        <div className="flex justify-start px-[25px] py-[25px] w-full bg-[#04082E]">
          <Image src="/logo.svg" alt="ARKHE" width={68} height={42} priority />
        </div>

        {/* Mobile Title Area */}
        <div className="flex flex-col gap-[24px] px-[25px] pt-[20px] pb-[34px] bg-[#04082E]">
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-heading font-bold text-[24px] leading-[29.76px] text-white">
              Commencer mon inscription
            </h1>
            <p className="font-sans font-normal text-[15px] leading-[18.28px] text-white">
              Etape 1/1 - Documents obligatoires
            </p>
          </div>
          
          <div className="flex flex-col gap-[8px]">
            <div className="w-full h-[6px] bg-[#273B4A] rounded-full overflow-hidden">
              <div className="h-full bg-white w-1/2" />
            </div>
            <span className="font-sans font-normal text-[13px] leading-[15.85px] text-white">
              50% complété
            </span>
          </div>
        </div>

        {/* Mobile Form Area */}
        <div className="flex flex-col gap-[34px] px-[15px] py-[40px] bg-white rounded-t-[20px]">
          {/* Info Banner */}
          <div className="flex flex-col gap-[10px] bg-[#F2F5FF] p-[16px] rounded-[5px]">
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-row items-center gap-[10px]">
                <div className="w-[42px] h-[42px] rounded-full bg-[#E2E9FF] border-[2px] border-[#0738DC] flex flex-row items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-[20px] text-[#0738DC]">?</span>
                </div>
                <span className="font-heading font-bold text-[20px] leading-[24.8px] text-[#000000]">
                  Pourquoi ces informations ?
                </span>
              </div>
              <p className="font-sans font-normal text-[14px] leading-[22.4px] text-[#000000]">
                Le SIRET et vos informations professionnelles nous permettent de vérifier votre activité et de garantir une plateforme fiable et sécurisée.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
            <SiretInput required />
            <SalonNameInput required />
            <AddressInput required />
            <DocumentUpload />

            <div className="flex flex-row items-start gap-[16px] mt-[16px]">
              <input type="checkbox" id="terms-mobile" className="mt-[4px] w-[20px] h-[20px] border-[#BDC5DF] rounded-[3px] accent-[#0738DC]" required />
              <label htmlFor="terms-mobile" className="font-sans font-normal text-[14px] leading-[22.4px] text-[#000000]">
                J’accepte les conditions générales et autorise ARKHE à procéder à la collecte des cheveux. *
              </label>
            </div>

            <div className="mt-[24px]">
              <Button type="submit" className="w-full justify-center py-[15px]">
                Soumettre mon dossier
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* 
        ========================================================================
        DESKTOP LAYOUT
        ========================================================================
      */}
      <div className="hidden md:flex flex-row w-full min-h-screen">
        
        {/* Left Side (Dark Blue) */}
        <div className="w-[40%] min-h-screen bg-[#04082E] flex flex-col pt-[38px] pb-[86px]">
          <div className="px-[50px] xl:px-[125px]">
            <Image src="/logo.svg" alt="ARKHE" width={100} height={60} priority />
          </div>
          
          <div className="flex-1 flex flex-col justify-center px-[50px] xl:px-[125px]">
            <div className="flex flex-col gap-[24px] max-w-[400px]">
              <div className="flex flex-row items-end gap-[24px] justify-between">
                <div className="flex flex-col gap-[8px]">
                  <h1 className="font-heading font-bold text-[24px] leading-[29.76px] text-white">
                    Commencer mon inscription
                  </h1>
                  <p className="font-sans font-normal text-[15px] leading-[18.28px] text-white">
                    Etape 1/1 - Documents obligatoires
                  </p>
                </div>
                <span className="font-sans font-normal text-[13px] leading-[15.85px] text-white whitespace-nowrap mb-1">
                  50% complété
                </span>
              </div>
              
              <div className="w-full h-[6px] bg-[#273B4A] rounded-full overflow-hidden">
                <div className="h-full bg-white w-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (White Form) */}
        <div className="w-[60%] bg-white flex flex-col min-h-screen relative">
          
          {/* Header Navigation */}
          <div className="absolute top-[38px] right-[50px] xl:right-[125px] flex flex-row items-center gap-[87px]">
            <div className="flex flex-row gap-[54px]">
              <Link href="/" className="font-sans font-normal text-[18px] text-[#04082E] hover:text-[#0738DC] transition-colors">Accueil</Link>
              <Link href="#" className="font-sans font-normal text-[18px] text-[#04082E] hover:text-[#0738DC] transition-colors">Notre mission</Link>
              <Link href="#" className="font-sans font-normal text-[18px] text-[#04082E] hover:text-[#0738DC] transition-colors">Comment ça marche</Link>
              <Link href="#" className="font-sans font-normal text-[18px] text-[#04082E] hover:text-[#0738DC] transition-colors">Salons partenaires</Link>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center px-[50px] xl:px-[125px] pt-[120px] pb-[86px]">
            <div className="flex flex-col gap-[48px] max-w-[800px]">
              
              {/* Info Banner */}
              <div className="flex flex-col gap-[10px] bg-[#F2F5FF] p-[32px] rounded-[5px]">
                <div className="flex flex-col gap-[16px]">
                  <div className="flex flex-row items-center gap-[10px]">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#E2E9FF] border-[2px] border-[#0738DC] flex flex-row items-center justify-center shrink-0">
                      <span className="font-heading font-bold text-[20px] text-[#0738DC]">?</span>
                    </div>
                    <span className="font-heading font-bold text-[20px] leading-[24.8px] text-[#000000]">
                      Pourquoi ces informations ?
                    </span>
                  </div>
                  <p className="font-sans font-normal text-[16px] leading-[25.6px] text-[#000000]">
                    Le SIRET et vos informations professionnelles nous permettent de vérifier votre activité et de garantir une plateforme fiable et sécurisée.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-[32px]">
                
                <div className="flex flex-row gap-[20px]">
                  <div className="flex-1">
                    <AddressInput required />
                  </div>
                  <div className="flex-1 flex flex-col gap-[24px]">
                    <SiretInput required />
                    <SalonNameInput required />
                  </div>
                </div>

                <DocumentUpload />

                <div className="flex flex-row items-start gap-[16px]">
                  <input type="checkbox" id="terms-desktop" className="mt-[4px] w-[20px] h-[20px] border-[#BDC5DF] rounded-[3px] accent-[#0738DC]" required />
                  <label htmlFor="terms-desktop" className="font-sans font-normal text-[16px] leading-[25.6px] text-[#000000]">
                    J’accepte les conditions générales et autorise ARKHE à procéder à la collecte des cheveux. *
                  </label>
                </div>

                <div className="mt-[16px]">
                  <Button type="submit" className="px-[30px] py-[15px]">
                    Soumettre mon dossier
                  </Button>
                </div>
              </form>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
