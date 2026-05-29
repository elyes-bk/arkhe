import React from 'react'
import { MotifModal } from './MotifModal'
import { Button } from '../ui/Button'

interface ActionModalProps {
  variant: 'refuse' | 'success' | 'confirm'
  onClose?: () => void
  onConfirm?: () => void
  onCancel?: () => void
  onSubmit?: (data: { motif: string, comment: string }) => void
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#1D1B20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#0738DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function ActionModal({ variant, onClose, onConfirm, onCancel, onSubmit }: ActionModalProps) {
  
  const [motif, setMotif] = React.useState('')
  const [comment, setComment] = React.useState('')

  if (variant === 'refuse') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white px-[15px] md:px-[29px] py-[24px] md:py-[40px] flex flex-row gap-0 relative shadow-xl w-full max-w-xl mx-[15px] md:mx-0 rounded-[5px] md:rounded-none">
          <button onClick={onClose} className="absolute top-[24px] md:top-[40px] right-[15px] md:right-[29px]">
            <CloseIcon />
          </button>
          
          <div className="flex flex-col gap-[24px] md:gap-[32px] w-full mt-[20px]">
            <h2 className="font-heading font-semibold text-[20px] md:text-[24px] leading-[24.8px] md:leading-[29.77px] text-[#000000]">
              Motif du refus
            </h2>
            
            <div className="flex flex-col gap-[16px] md:gap-[25px]">
              <MotifModal value={motif} onChange={setMotif} />
              
              <div className="flex flex-col gap-[9px]">
                <label className="font-heading font-medium text-[16px] md:text-[18px] leading-[19.84px] md:leading-[22.32px] text-[#000000]">
                  Écrivez un commentaire (optionnel)
                </label>
                <div className="border border-[#C9C9C9] rounded-[5px] bg-white">
                  <textarea 
                    className="w-full bg-transparent outline-none p-[14px] font-sans font-normal text-[12px] md:text-[15px] leading-[14.63px] md:leading-[18.28px] text-[#000000] placeholder:text-[#C9C9C9]"
                    placeholder="Écrivez un commentaire..."
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-max px-[15px] py-[4px] md:py-[7px]" 
              onClick={() => onSubmit && onSubmit({ motif, comment })}
            >
              Envoyer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white px-[15px] md:px-[29px] pt-[80px] md:pt-[106px] pb-[24px] md:pb-[74px] flex flex-row relative shadow-xl w-full max-w-xl mx-[15px] md:mx-0 rounded-[5px] md:rounded-none">
          <button onClick={onClose} className="absolute top-[24px] md:top-[40px] right-[15px] md:right-[29px]">
            <CloseIcon />
          </button>

          <div className="flex flex-col items-center gap-[47px] md:gap-[80px] w-full">
            <div className="flex flex-col items-center gap-[48px]">
              <div className="bg-[#E2E9FF] p-[9px] rounded-[4px]">
                <div className="bg-white border-[2px] border-[#0738DC] rounded-full flex items-center justify-center w-[54px] h-[54px]">
                  <CheckIcon />
                </div>
              </div>

              <div className="flex flex-col items-center gap-[16px] text-center">
                <h2 className="font-heading font-bold text-[20px] md:text-[24px] leading-[24.8px] md:leading-[29.77px] text-[#303336]">
                  Votre refus a bien été envoyé
                </h2>
                <p className="font-sans font-normal text-[14px] md:text-[16px] leading-[17.07px] md:leading-[19.5px] text-[#303336]">
                  Un mail leur sera envoyé très prochainement
                </p>
              </div>
            </div>

            <Button onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'confirm') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white px-[15px] md:px-[29px] pt-[37px] md:pt-[106px] pb-[24px] md:pb-[74px] flex flex-row relative shadow-xl w-full max-w-xl mx-[15px] md:mx-0 rounded-[5px] md:rounded-none">
          <button onClick={onClose} className="absolute top-[24px] md:top-[40px] right-[15px] md:right-[29px]">
            <CloseIcon />
          </button>

          <div className="flex flex-col items-center gap-[32px] md:gap-[80px] w-full">
            <div className="flex flex-col items-center gap-[48px]">
              <div className="bg-[#E2E9FF] p-[9px] rounded-[4px] w-[60px] h-[60px] flex items-center justify-center">
                <span className="font-heading font-bold text-[40px] leading-[49.61px] text-[#0738DC]">
                  ?
                </span>
              </div>

              <div className="flex flex-col items-center gap-[16px] text-center">
                <h2 className="font-heading font-bold text-[20px] md:text-[24px] leading-[24.8px] md:leading-[29.77px] text-[#303336]">
                  Modifier le statut de ce salon ?
                </h2>
                <p className="font-sans font-normal text-[13px] md:text-[16px] leading-[15.85px] md:leading-[19.5px] text-[#303336]">
                  Vous êtes sur le point de changer l'état de cette candidature.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-[10px] md:gap-[31px]">
              <Button onClick={onConfirm}>
                Oui
              </Button>
              <Button variant="outline" onClick={onCancel || onClose}>
                Non
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
