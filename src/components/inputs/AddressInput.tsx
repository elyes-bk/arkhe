import React, { forwardRef } from 'react'

interface AddressInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'results'> {
  results?: string[]
}

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C16 16.8 19 12.8667 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.8667 8 16.8 12 21Z" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="3" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ results = [], className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-[10px] bg-white border-[0.75px] border-[#BDC5DF] rounded-[5px] px-[13px] py-[24px] h-full ${className}`}>
        
        <div className="flex flex-col gap-[16px] h-full">
          {/* Header row */}
          <div className="flex flex-row items-center gap-[8px]">
            <LocationIcon />
            <span className="font-heading font-medium text-[15px] md:text-[16px] leading-[18.6px] md:leading-[19.84px] text-[#000000]">
              Adresse du salon de coiffure
            </span>
          </div>

          {/* Input box */}
          <div className="flex flex-row items-center border-[0.5px] border-[#BDC5DF] rounded-[3px] bg-white">
            <input
              ref={ref}
              type="text"
              placeholder="Adresse du salon de coiffure"
              className="w-full px-[14px] py-[10px] font-sans font-normal text-[15px] md:text-[16px] leading-[18.28px] md:leading-[19.5px] text-[#6E6E6E] outline-none bg-transparent"
              {...props}
            />
          </div>
        </div>

        {/* Results dropdown (if any) */}
        {results.length > 0 && (
          <div className="flex flex-col gap-[10px] mt-[6px] p-[13px] border-[0.5px] border-[#BDC5DF] rounded-[4px] bg-white">
            {results.map((result, idx) => (
              <React.Fragment key={idx}>
                <div className="font-sans font-normal text-[14px] md:text-[16px] leading-[17.07px] md:leading-[19.5px] text-[#000000] cursor-pointer hover:text-[#0738dc]">
                  {result}
                </div>
                {idx < results.length - 1 && (
                  <div className="h-px w-full bg-[#C7C7C7] border-t-[0.5px] border-[#C7C7C7]" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

      </div>
    )
  }
)

AddressInput.displayName = 'AddressInput'
