import React, { forwardRef } from 'react'

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  rightIcon?: React.ReactNode
}


export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ label = 'Email', rightIcon, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-[8px] ${className}`}>
        {/* Label */}
        {label && (
          <div className="flex flex-row gap-[4px]">
            <label 
              htmlFor={props.id || 'email'} 
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
              type="email"
              id={props.id || 'email'}
              placeholder="exemple@exemple"
              className="w-full font-sans font-normal text-[13px] md:text-[16px] leading-[15.85px] md:leading-[19.5px] md:tracking-[-0.64px] text-[#04082e] placeholder:text-[#9EA1A8] outline-none bg-transparent"
              {...props}
            />
          </div>

          {/* Right Icon Container (Optional for Email) */}
          {rightIcon && (
            <div className="flex flex-row gap-[10px] p-[8px]">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
    )
  }
)

EmailInput.displayName = 'EmailInput'
