'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { EmailInput } from '@/components/inputs/EmailInput'
import { PasswordInput } from '@/components/inputs/PasswordInput'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function SimpleRegisterPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to onboarding (the complex form)
    router.push('/register/onboarding')
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <Header />

      {/* 
        ========================================================================
        MAIN CONTENT
        ========================================================================
      */}
      <div className="flex-1 flex flex-col items-center justify-center px-[20px] py-[40px] md:py-[80px]">
        <div className="w-full max-w-[698px] flex flex-col gap-[40px]">
          
          <div className="flex flex-col items-center text-center gap-[8px] md:gap-[16px]">
            <h1 className="font-heading font-semibold text-[30px] md:text-[60px] leading-tight text-[#04082E]">
              Inscrivez-vous
            </h1>
            <p className="font-sans font-normal text-[15px] md:text-[16px] text-[#6E6E6E] md:text-[#000000]">
              Créez votre espace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[32px] md:gap-[56px] w-full">
            
            <div className="flex flex-col gap-[20px] w-full">
              <EmailInput required />
              <PasswordInput label="Mot de passe" required />
              <PasswordInput label="Confirmez votre mot de passe" placeholder="Confirmer votre mot de passe" required />
            </div>

            <Button type="submit" className="w-full justify-center py-[15px] text-[18px] md:text-[20px]">
              Créer mon compte
            </Button>

          </form>

          <div className="flex flex-col gap-[32px] items-center w-full mt-[-16px]">
            <div className="flex flex-row items-center gap-[31px] w-full justify-center">
              <div className="h-px bg-[#E5E5E5] flex-1 max-w-[100px]" />
              <span className="font-heading font-medium text-[15px] md:text-[16px] text-[#000000]">Ou</span>
              <div className="h-px bg-[#E5E5E5] flex-1 max-w-[100px]" />
            </div>

            <p className="font-sans font-normal text-[15px] md:text-[16px] text-[#000000] text-center">
              Vous avez un compte ? <Link href="/login" className="text-[#0738DC] hover:underline font-medium">Connectez vous</Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
