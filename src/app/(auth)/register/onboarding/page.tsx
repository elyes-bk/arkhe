'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import { AddressInput } from '@/components/inputs/AddressInput'
import { SiretInput } from '@/components/inputs/SiretInput'
import { SalonNameInput } from '@/components/inputs/SalonNameInput'
import { DocumentUpload } from '@/components/inputs/DocumentUpload'
import { Button } from '@/components/ui/Button'
import { register } from '@/actions/auth'

export default function RegisterPage() {
  const [siret, setSiret] = useState('')
  const [salonName, setSalonName] = useState('')
  const [address, setAddress] = useState('')
  const [isLoadingSiret, setIsLoadingSiret] = useState(false)
  const [isValidSiret, setIsValidSiret] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{name: string, size: string} | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSiretChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const digitsOnly = rawValue.replace(/\D/g, '')
    
    // Auto-format SIRET: 123 456 789 00012
    let formatted = digitsOnly
    if (digitsOnly.length > 9) {
      formatted = `${digitsOnly.slice(0,3)} ${digitsOnly.slice(3,6)} ${digitsOnly.slice(6,9)} ${digitsOnly.slice(9,14)}`
    } else if (digitsOnly.length > 6) {
      formatted = `${digitsOnly.slice(0,3)} ${digitsOnly.slice(3,6)} ${digitsOnly.slice(6)}`
    } else if (digitsOnly.length > 3) {
      formatted = `${digitsOnly.slice(0,3)} ${digitsOnly.slice(3)}`
    }
    setSiret(formatted)

    if (digitsOnly.length === 14) {
      setIsLoadingSiret(true)
      try {
        const response = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${digitsOnly}`)
        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
          const company = data.results[0]
          setSalonName(company.nom_complet || '')
          setAddress(company.siege?.adresse || '')
          setIsValidSiret(true)
        } else {
          setIsValidSiret(false)
        }
      } catch (error) {
        console.error("Erreur API SIRET:", error)
        setIsValidSiret(false)
      } finally {
        setIsLoadingSiret(false)
      }
    } else {
      setIsValidSiret(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const email = sessionStorage.getItem('arkhe_register_email')
    const password = sessionStorage.getItem('arkhe_register_password')

    if (!email || !password) {
      setSubmitError("Session expirée. Veuillez reprendre l'inscription depuis le début.")
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('nom_commerce', salonName)
    formData.append('siret', siret.replace(/\s/g, ''))
    formData.append('adresse', address)
    if (file) {
      formData.append('justificatif', file)
    }

    try {
      const result = await register(null, formData)
      
      if (result?.error) {
        setSubmitError(result.error)
      }
      // If successful, the server action calls redirect() which halts execution here
    } catch (err: unknown) {
      console.error(err)
      setSubmitError("Une erreur inattendue est survenue.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#04082E] md:bg-white overflow-x-hidden">
      <Header />

      <div className="flex-1 flex flex-col w-full">
        {/* Top blue banner with gradient */}
        <div className="w-full bg-gradient-to-r from-[#04082E] to-[#0D1A94] flex justify-center pt-[20px] pb-[60px] md:pt-[40px] md:pb-[86px] px-[25px] md:px-[50px] xl:px-[125px]">
          <div className="w-full max-w-[1231px] flex flex-col gap-[24px]">
            {/* Title and Progress */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-[8px] md:gap-[24px]">
              <div className="flex flex-col gap-[8px]">
                <h1 className="text-white text-[24px] leading-[29.76px] font-bold font-heading">
                  Commencer mon inscription
                </h1>
                <p className="text-white text-[15px] leading-[18.28px] font-sans font-normal">
                  Etape 1/1 - Documents obligatoires
                </p>
              </div>
              <span className="text-white text-[13px] leading-[15.85px] font-sans font-normal mb-0 md:mb-1 self-start md:self-auto order-last md:order-none mt-[8px] md:mt-0">
                50% complété
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-[5px] bg-[#273B4A] rounded-full overflow-hidden flex md:order-last order-3">
              <div className="w-1/2 h-full bg-white md:bg-[#0738DC]" />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full bg-white flex justify-center pb-[40px] md:pb-[86px] px-[15px] md:px-[50px] xl:px-[125px] rounded-t-[20px] md:rounded-none relative z-10">
          <div className="w-full max-w-[1238px] flex flex-col gap-[34px] md:gap-[48px] -mt-[30px] md:-mt-[50px]">
            
            {/* Info Banner */}
            <div className="w-full bg-[#E2E9FF] p-[16px] md:p-[32px] rounded-[5px] flex flex-col gap-[16px]">
              <div className="flex flex-row items-center gap-[10px]">
                <div className="w-[33px] h-[33px] bg-white rounded-full flex items-center justify-center border-[2px] border-[#0738DC]">
                  <span className="text-[#0738DC] text-[20px] font-bold font-heading">?</span>
                </div>
                <h2 className="text-[20px] leading-[25px] font-bold font-heading text-[#000000]">
                  Pourquoi ces informations ?
                </h2>
              </div>
              <p className="text-[14px] md:text-[16px] leading-[22.4px] md:leading-[25.6px] font-sans font-normal text-[#000000]">
                Le SIRET et vos informations professionnelles nous permettent de vérifier votre activité et de garantir une plateforme fiable et sécurisée.
              </p>
            </div>

            {submitError && (
              <div className="bg-red-50 text-red-500 p-[16px] rounded-[5px] text-[15px] font-medium">
                {submitError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] md:gap-[32px]">
              
              <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px]">
                {/* Left side: Address */}
                <div className="w-full md:flex-1 max-w-[609px]">
                  <AddressInput 
                    required 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                {/* Right side: Siret & Nom */}
                <div className="w-full md:flex-1 max-w-[609px] flex flex-col gap-[16px] md:gap-[24px]">
                  <SiretInput 
                    required 
                    value={siret}
                    onChange={handleSiretChange}
                    isValid={isValidSiret}
                    isLoading={isLoadingSiret}
                  />
                  <SalonNameInput 
                    required 
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                  />
                </div>
              </div>

              <DocumentUpload 
                onFileSelect={(selectedFile) => {
                  setFile(selectedFile)
                  const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' Mo'
                  setUploadedFile({ name: selectedFile.name, size: sizeMB })
                }}
                uploadedFile={uploadedFile}
                onRemoveFile={() => {
                  setFile(null)
                  setUploadedFile(null)
                }}
              />

              {/* Checkbox */}
              <div className="flex flex-row items-start gap-[16px] pt-[8px]">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-[2px] md:mt-[4px] w-[15px] h-[15px] md:w-[19px] md:h-[19px] border-[#BDC5DF] rounded-[3px] accent-[#0738DC] shrink-0" 
                  required 
                />
                <label htmlFor="terms" className="text-[14px] md:text-[16px] leading-[22.4px] md:leading-[25.6px] font-sans font-normal text-[#000000]">
                  J’accepte les conditions générales et autorise ARKHE à procéder à la collecte des cheveux. *
                </label>
              </div>

              {/* Submit button */}
              <div className="pt-[10px]">
                <Button 
                  type="submit" 
                  disabled={!termsAccepted || isSubmitting}
                  className="w-full md:w-max md:px-[50px] py-[10px] justify-center text-[16px]"
                >
                  {isSubmitting ? "Création du compte..." : "Soumettre mon dossier"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

