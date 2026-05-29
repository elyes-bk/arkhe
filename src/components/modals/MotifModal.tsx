import React, { useState, useRef, useEffect } from 'react'

interface MotifModalProps {
  label?: string
  placeholder?: string
  options?: string[]
  value?: string
  onChange?: (val: string) => void
}

const ArrowDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10L12 15L17 10" stroke="#1D1B20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ArrowUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 14L12 9L7 14" stroke="#1D1B20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function MotifModal({ 
  label = 'Veuillez sélectionner un motif', 
  placeholder = 'Veuillez sélectionner un motif', 
  options = [
    'SIRET invalide ou introuvable',
    'Informations professionnelles incomplètes',
    'Activité non liée à la coiffure',
    'Établissement non vérifiable',
    'Documents justificatifs non conformes',
    'Doublon de compte détecté',
    'Informations incohérentes ou erronées',
    'Inscription hors zone ou réseau actuellement desservi'
  ],
  value,
  onChange 
}: MotifModalProps) {
  
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div 
      ref={dropdownRef}
      className={`flex flex-col gap-[14px] bg-white border border-[#C9C9C9] rounded-[5px] py-[8px] md:py-[17px] w-full relative`}
    >
      <span className="font-heading font-medium text-[16px] md:text-[18px] leading-[19.84px] md:leading-[22.32px] text-[#000000] px-[17px]">
        {label}
      </span>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="mx-[17px] flex flex-row items-center justify-between border border-[#BDBDBD] rounded-[4px] py-[10px] md:py-[14px] pl-[12px] pr-[29px] cursor-pointer"
      >
        <span className="font-heading font-normal text-[14px] md:text-[16px] leading-[17.36px] md:leading-[19.84px] text-[#000000]">
          {value || placeholder}
        </span>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>

      {isOpen && (
        <div className="flex flex-col gap-[13px] md:gap-[16px] px-[17px] pt-[10px] pb-[13px] bg-white absolute top-full left-0 w-full z-10 border border-[#C9C9C9] border-t-0 rounded-b-[5px] shadow-lg">
          {options.map((option, idx) => (
            <div 
              key={idx}
              onClick={() => {
                if (onChange) onChange(option)
                setIsOpen(false)
              }}
              className="font-sans font-normal text-[14px] md:text-[13px] leading-[17.07px] md:leading-[15.85px] text-[#000000] cursor-pointer hover:text-[#0738dc]"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
