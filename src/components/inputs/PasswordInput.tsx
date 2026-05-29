import React, { forwardRef, useState } from 'react'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  infoText?: string
}

/* ─────────────────────────────────────────────────────────────
   Icons
   ───────────────────────────────────────────────────────────────*/
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke="#121A2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 20L16 16" stroke="#121A2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const VisibilityOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#4C4A53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const VisibilityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#4C4A53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const InfoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#121A2C" strokeWidth="1.5"/>
    <path d="M12 16V12" stroke="#121A2C" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="1" fill="#121A2C"/>
  </svg>
)

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = 'Mot de passe', infoText, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className={`flex flex-col gap-[8px] ${className}`}>
        {/* Label */}
        {label && (
          <div className="flex flex-row gap-[4px]">
            <label 
              htmlFor={props.id || 'password'} 
              className="font-heading font-semibold md:font-medium text-[16px] md:text-[24px] leading-[19.84px] md:leading-[29.77px] tracking-[-0.96px] text-[#121A2C]"
            >
              {label}
            </label>
          </div>
        )}

        {/* Input Text */}
        <div className="flex flex-row items-center gap-[4px] px-[12px] h-[48px] bg-white border border-[#9EA1A8] rounded-[5px] focus-within:border-[#0738dc] transition-colors">
          {/* Input field */}
          <div className="flex flex-row gap-[10px] py-[4px] px-[8px] flex-1">
            <input
              ref={ref}
              type={showPassword ? "text" : "password"}
              id={props.id || 'password'}
              placeholder="Entrez votre mot de passe"
              className="w-full font-sans font-normal text-[13px] md:text-[16px] leading-[15.85px] md:leading-[19.5px] md:tracking-[-0.64px] text-[#121A2C] placeholder:text-[#9EA1A8] outline-none bg-transparent"
              {...props}
            />
          </div>

          {/* Right Icon Container */}
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex flex-row items-center justify-center gap-[10px] p-[8px] hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
            aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </button>
        </div>

        {/* Info Text */}
        {infoText && (
          <div className="flex flex-row items-start gap-[4px] mt-[4px]">
            <div className="flex flex-row gap-[10px] pt-[4px]">
              <InfoIcon />
            </div>
            <p className="font-sans font-normal text-[14px] leading-[22.4px] text-[#121A2C]">
              {infoText}
            </p>
          </div>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
