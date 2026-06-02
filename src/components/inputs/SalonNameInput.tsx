import React, { forwardRef, useId } from 'react'

type SalonNameInputProps = React.InputHTMLAttributes<HTMLInputElement>

export const SalonNameInput = forwardRef<HTMLInputElement, SalonNameInputProps>(
  ({ className = '', ...props }, ref) => {
    const id = useId()
    return (
      <div className={`flex flex-col gap-[16px] bg-white border border-[#E2E8F0] rounded-[5px] px-[13px] py-[24px] ${className}`}>
        
        {/* Header row */}
        <div className="flex flex-row items-center gap-[8px]">
          <div className="w-[24px] h-[24px] shrink-0">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7M4 7L12 3L20 7M4 7V11M20 7V11M9 21V14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14V21" stroke="#0738DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <label htmlFor={id} className="font-heading font-medium text-[15px] md:text-[16px] leading-[18.6px] md:leading-[19.84px] text-[#000000]">
            Nom du salon <span className="font-sans font-normal text-[15px] md:text-[16px] leading-[18.28px] md:leading-[19.5px] text-[#000000]">(auto rempli via SIRET )</span>
          </label>
        </div>

        {/* Input box */}
        <div className="flex flex-row items-center border-[0.5px] border-[#BDC5DF] rounded-[3px] bg-white">
          <input
            id={id}
            ref={ref}
            type="text"
            placeholder="Salon de coiffure exemple"
            className="w-full px-[14px] py-[10px] font-sans font-normal text-[15px] md:text-[16px] leading-[18.28px] md:leading-[19.5px] text-[#6E6E6E] outline-none bg-transparent"
            {...props}
          />
        </div>
      </div>
    )
  }
)

SalonNameInput.displayName = 'SalonNameInput'

