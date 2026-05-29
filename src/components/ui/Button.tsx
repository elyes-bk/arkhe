import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  children: React.ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  
  const baseClasses = "flex flex-row items-center justify-center gap-[10px] px-[50px] py-[10px] rounded-[4px] font-heading font-medium text-[16px] leading-[19.84px] transition-colors"
  
  const variants = {
    primary: "bg-[#0738dc] text-white hover:bg-[#8AB4F8] shadow-sm",
    outline: "bg-transparent border border-[#0738DC] text-[#0738DC] hover:bg-blue-50"
  }

  // Adjust padding if it's the smaller "Envoyer" or "Rejoindre" button which might have different padding,
  // but we can override via className.
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
