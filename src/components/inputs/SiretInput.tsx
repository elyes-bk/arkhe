import React, { forwardRef } from 'react'

interface SiretInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isValid?: boolean
}

const BusinessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 21H20" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 21V5C6 4.44772 6.44772 4 7 4H17C17.5523 4 18 4.44772 18 5V21" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 8H10" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 8H15" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12H10" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 12H15" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 16H10" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 16H15" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckBadgeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.6663 7.39334V8.00001C14.6655 9.43763 14.2014 10.8365 13.3392 12.0019C12.4771 13.1673 11.2601 14.0416 9.85699 14.5057C8.45385 14.9697 6.93297 14.9996 5.5015 14.591C4.07002 14.1824 2.79727 13.3551 1.85633 12.2227C0.915383 11.0903 0.353383 9.70817 0.248386 8.26732C0.143389 6.82648 0.499878 5.39855 1.26627 4.18349C2.03265 2.96843 3.16912 2.02672 4.51591 1.49051C5.86269 0.954302 7.35246 0.849767 8.77967 1.19334M14.6663 2.66667L7.99967 9.34001L5.99967 7.34001" stroke="#59A769" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const SiretInput = forwardRef<HTMLInputElement, SiretInputProps>(
  ({ isValid = false, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-[16px] bg-white border-[0.75px] border-[#BDC5DF] rounded-[5px] px-[13px] py-[24px] ${className}`}>
        
        {/* Header row */}
        <div className="flex flex-row items-center gap-[11px] flex-wrap">
          <div className="flex flex-row items-center gap-[8px]">
            <BusinessIcon />
            <span className="font-sans font-normal text-[15px] md:text-[16px] leading-[18.28px] md:leading-[19.5px] text-[#000000]">
              Numéro SIRET *
            </span>
          </div>
          
          {isValid && (
            <div className="flex flex-row items-center gap-[5px] bg-[#EAF7ED] rounded-[3px] px-[6px] py-[3px]">
              <CheckBadgeIcon />
              <span className="font-sans font-normal text-[11px] md:text-[12px] leading-[13.41px] md:leading-[14.63px] text-[#59A769]">
                Vérification automatique
              </span>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="flex flex-row items-center border-[0.5px] border-[#BDC5DF] rounded-[3px] bg-white">
          <input
            ref={ref}
            type="text"
            placeholder="000 000 000 0000"
            className="w-full px-[14px] py-[10px] font-sans font-normal text-[16px] leading-[19.5px] text-[#6E6E6E] outline-none bg-transparent"
            {...props}
          />
        </div>
      </div>
    )
  }
)

SiretInput.displayName = 'SiretInput'
