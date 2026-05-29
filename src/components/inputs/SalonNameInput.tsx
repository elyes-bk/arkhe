import React, { forwardRef } from 'react'

interface SalonNameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

const ShopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L4 21H20L21 9.5" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 9.5C3 11.433 4.567 13 6.5 13C8.433 13 10 11.433 10 9.5V3H3V9.5Z" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9.5C10 11.433 11.567 13 13.5 13C15.433 13 17 11.433 17 9.5V3H10V9.5Z" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 9.5C17 11.433 18.567 13 20.5 13C22.433 13 24 11.433 24 9.5V3H17V9.5Z" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const SalonNameInput = forwardRef<HTMLInputElement, SalonNameInputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-[10px] bg-white border-[0.75px] border-[#BDC5DF] rounded-[5px] px-[13px] py-[24px] ${className}`}>
        
        <div className="flex flex-col gap-[16px]">
          {/* Header row */}
          <div className="flex flex-row items-center gap-[8px]">
            <ShopIcon />
            <span className="font-heading font-medium text-[15px] leading-[18.6px] text-[#000000]">
              Nom du salon (auto rempli via SIRET ) 
            </span>
          </div>

          {/* Input box */}
          <div className="flex flex-row items-center border-[0.5px] border-[#BDC5DF] rounded-[3px] bg-white">
            <input
              ref={ref}
              type="text"
              placeholder="Salon de coiffure exemple"
              className="w-full px-[14px] py-[10px] font-sans font-normal text-[15px] leading-[18.28px] text-[#6E6E6E] outline-none bg-transparent"
              {...props}
            />
          </div>
        </div>

      </div>
    )
  }
)

SalonNameInput.displayName = 'SalonNameInput'
