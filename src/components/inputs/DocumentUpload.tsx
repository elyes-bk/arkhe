import React, { forwardRef } from 'react'

interface DocumentUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect?: (file: File) => void
  onRemoveFile?: () => void
  uploadedFile?: { name: string, size: string } | null
}

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18V12M12 12L9 15M12 12L15 15" stroke="#0738DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#686464" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const DocumentUpload = forwardRef<HTMLInputElement, DocumentUploadProps>(
  ({ onFileSelect, onRemoveFile, uploadedFile = null, className = '', ...props }, ref) => {
    const hiddenFileInput = React.useRef<HTMLInputElement | null>(null)
    
    const handleClick = () => {
      if (hiddenFileInput.current) {
        hiddenFileInput.current.click()
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        if (onFileSelect) onFileSelect(file)
      }
    }

    return (
      <div className={`flex flex-col gap-[10px] ${className}`}>
        
        {/* Upload box */}
        {!uploadedFile && (
          <div className="flex flex-col gap-[24px] bg-white border-[0.75px] border-[#BDC5DF] rounded-[5px] px-[13px] py-[24px]">
            
            <div className="flex justify-center items-center w-max bg-[#E2E9FF] p-[8px] rounded-[2px]">
              <DocumentIcon />
            </div>
            
            <div className="flex flex-col gap-[8px]">
              <span className="font-heading font-medium text-[15px] leading-[18.6px] text-[#000000]">
                Déposer le justificatif de locaux
              </span>
              <span className="font-sans font-normal text-[14px] leading-[17.07px] text-[#000000]">
                PDF, JPG, PNG · Max 5 Mo · Bail ou titre de propriété
              </span>
            </div>
            
            <button
              type="button"
              onClick={handleClick}
              className="w-max bg-transparent border border-[#0738DC] rounded-[3px] px-[27px] py-[10px] font-sans font-normal text-[14px] leading-[17.07px] text-[#0738DC] transition-colors hover:bg-blue-50"
            >
              Parcourir mes fichiers
            </button>
            
            <input 
              type="file"
              ref={(node) => {
                hiddenFileInput.current = node
                if (typeof ref === 'function') ref(node)
                else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
              }}
              className="hidden"
              onChange={handleChange}
              {...props}
            />

          </div>
        )}

        {/* Success badge */}
        {uploadedFile && (
          <div className="flex flex-row items-center justify-between bg-[#EAF7ED] rounded-[6px] px-[10px] py-[11px]">
            <div className="flex flex-row items-center gap-[24px]">
              <div className="flex items-center justify-center bg-[#59A769] rounded-[3px] p-[2px]">
                <CheckIcon />
              </div>
              <div className="flex flex-col gap-[8px]">
                <span className="font-heading font-medium text-[15px] leading-[18.6px] tracking-[-0.6px] text-[#1C4624]">
                  {uploadedFile.name}
                </span>
                <span className="font-sans font-normal text-[13px] leading-[19.5px] tracking-[-0.52px] text-[#59A769]">
                  {uploadedFile.size} · Upload réussi
                </span>
              </div>
            </div>
            
            <button type="button" onClick={onRemoveFile} className="p-[4px]">
              <CloseIcon />
            </button>
          </div>
        )}

      </div>
    )
  }
)

DocumentUpload.displayName = 'DocumentUpload'
