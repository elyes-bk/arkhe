'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { login } from '@/actions/auth'
import Link from 'next/link'
import Header from '@/components/Header'
import { EmailInput } from '@/components/inputs/EmailInput'
import { PasswordInput } from '@/components/inputs/PasswordInput'
import { Button } from '@/components/ui/Button'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full justify-center py-[15px] text-[18px] md:text-[20px]"
    >
      {pending ? 'Connexion en cours...' : 'Se connecter'}
    </Button>
  )
}

export default function LoginPage() {
  const [state, action] = useFormState(login, null)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Premium Header */}
      <Header />

      {/* Main Content Container matching register page */}
      <div className="flex-1 flex flex-col items-center justify-center px-[20px] py-[40px] md:py-[80px]">
        <div className="w-full max-w-[698px] flex flex-col gap-[40px]">
          
          {/* Header Title Section */}
          <div className="flex flex-col items-center text-center gap-[8px] md:gap-[16px]">
            <h1 className="font-heading font-semibold text-[30px] md:text-[60px] leading-tight text-[#04082E]">
              Connexion
            </h1>
            <p className="font-sans font-normal text-[15px] md:text-[16px] text-[#6E6E6E] md:text-[#000000]">
              Accédez à votre espace partenaire ARKHE
            </p>
          </div>

          {/* Form Action */}
          <form action={action} className="flex flex-col gap-[32px] md:gap-[56px] w-full">
            
            <div className="flex flex-col gap-[20px] w-full">
              {state?.error && (
                <div className="bg-red-50 text-red-600 border border-red-100 p-[12px] rounded-[4px] text-[14px]">
                  {state.error}
                </div>
              )}
              
              <EmailInput 
                id="email"
                name="email"
                required 
              />
              
              <PasswordInput 
                id="password"
                name="password"
                label="Mot de passe" 
                required 
              />
            </div>

            <SubmitButton />

          </form>

          {/* Separation and Alternate CTA */}
          <div className="flex flex-col gap-[32px] items-center w-full mt-[-16px]">
            <div className="flex flex-row items-center gap-[31px] w-full justify-center">
              <div className="h-px bg-[#E5E5E5] flex-1 max-w-[100px]" />
              <span className="font-heading font-medium text-[15px] md:text-[16px] text-[#000000]">Ou</span>
              <div className="h-px bg-[#E5E5E5] flex-1 max-w-[100px]" />
            </div>

            <p className="font-sans font-normal text-[15px] md:text-[16px] text-[#000000] text-center">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[#0738DC] hover:underline font-medium">
                Créer un compte
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

