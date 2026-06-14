'use client'

import { useState, useTransition } from 'react'
import { approveSalon, rejectSalon, regeocodeSalon, reconsiderSalon } from '@/actions/admin'
import { formatSalonLocation } from '@/lib/geo'
import Image from 'next/image'
import { ActionModal } from './modals/ActionModal'

interface Salon {
  id: string
  nom_commerce: string
  siret: string
  statut_validation: 'waiting' | 'approved' | 'rejected' | string
  url_justificatif_local: string | null
  emplacement: unknown
  adresse?: string | null
  users?: {
    created_at: string
  } | null
}

interface AdminModerationClientProps {
  initialSalons: Salon[] | null
  }

export default function AdminModerationClient({ initialSalons = [], }: AdminModerationClientProps) {
  const [salons, setSalons] = useState<Salon[]>(initialSalons || [])
  const [activeTab, setActiveTab] = useState<'waiting' | 'approved' | 'rejected' | 'all'>('all')
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'reconsider'; salonId: string } | null>(null)
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [rejectedSalonId, setRejectedSalonId] = useState<string | null>(null)

  // Actions réelles déclenchées après confirmation (pour approve et reconsider)
  function executePendingAction() {
    if (!pendingAction) return
    const { type, salonId } = pendingAction
    setPendingAction(null)

    startTransition(async () => {
      try {
        if (type === 'approve') {
          await approveSalon(salonId)
          setSalons((prev) =>
            prev.map((s) => (s.id === salonId ? { ...s, statut_validation: 'approved' } : s))
          )
          if (selectedSalon?.id === salonId) {
            setSelectedSalon((prev) => prev ? { ...prev, statut_validation: 'approved' } : null)
          }
        } else if (type === 'reconsider') {
          await reconsiderSalon(salonId)
          setSalons((prev) =>
            prev.map((s) => (s.id === salonId ? { ...s, statut_validation: 'waiting' } : s))
          )
          if (selectedSalon?.id === salonId) {
            setSelectedSalon((prev) => prev ? { ...prev, statut_validation: 'waiting' } : null)
          }
        }
      } catch (err) {
        console.error(err)
        alert('Erreur lors du changement de statut.')
      }
    })
  }

  // Intercepte les clics pour afficher le modal de confirmation
  function handleApprove(salonId: string) {
    setPendingAction({ type: 'approve', salonId })
  }

  function handleReject(salonId: string) {
    setRejectedSalonId(salonId)
    setIsRefuseModalOpen(true)
  }

  function handleReconsider(salonId: string) {
    setPendingAction({ type: 'reconsider', salonId })
  }

  // Action réelle de refus déclenchée depuis le modal de motif
  function handleRefuseSubmit({ motif, comment }: { motif: string; comment: string }) {
    if (!rejectedSalonId) return
    const salonId = rejectedSalonId
    setIsRefuseModalOpen(false)

    startTransition(async () => {
      try {
        await rejectSalon(salonId, motif, comment)
        setSalons((prev) =>
          prev.map((s) => (s.id === salonId ? { ...s, statut_validation: 'rejected' } : s))
        )
        if (selectedSalon?.id === salonId) {
          setSelectedSalon((prev) => prev ? { ...prev, statut_validation: 'rejected' } : null)
        }
        setIsSuccessModalOpen(true)
      } catch (err) {
        console.error(err)
        alert('Erreur lors du rejet du salon.')
      }
    })
  }

  // Filtrage des salons selon l'onglet actif, la recherche et le statut de validation
  const filteredSalons = salons.filter((salon) => {
    // 1. Filtre par onglet statut
    if (activeTab !== 'all' && salon.statut_validation !== activeTab) {
      return false
    }
    // 2. Filtre par terme de recherche (nom ou SIRET)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      const matchesName = salon.nom_commerce.toLowerCase().includes(term)
      const matchesSiret = salon.siret.includes(term)
      return matchesName || matchesSiret
    }
    return true
  })

  // Compteurs pour les badges d'onglets
  const countWaiting = salons.filter((s) => s.statut_validation === 'waiting').length
  const countApproved = salons.filter((s) => s.statut_validation === 'approved').length
  const countRejected = salons.filter((s) => s.statut_validation === 'rejected').length
  const countAll = salons.length

  // Pagination (8 salons par page comme sur la maquette Figma)
  const itemsPerPage = 8
  const totalPages = Math.max(1, Math.ceil(filteredSalons.length / itemsPerPage))
  const paginatedSalons = filteredSalons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Formatter pour la date d'inscription
  function formatDate(dateString?: string) {
    if (!dateString) return "22 mai 2026" // Fallback propre de la maquette
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // Parse le justificatif pour n'afficher que le nom du fichier
  function getJustificatifLabel(url: string | null) {
    if (!url) return 'Bail.pdf'
    const parts = url.split('/')
    const filename = parts[parts.length - 1]
    if (filename.includes('.')) {
      return filename
    }
    return 'Justificatif.pdf'
  }

  function getSalonLocation(salon: Salon) {
    return formatSalonLocation(salon.adresse, salon.emplacement)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-slate-800 font-sans w-full">
      
      {/* ────────────────── Main Area ────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Main Content Body (Responsive spacings: px-4 py-6 md:pl-[61px] md:pr-[54px] md:py-10) */}
        <main className="flex-1 px-4 py-6 md:pl-[61px] md:pr-[54px] md:py-10 flex flex-col gap-6 md:gap-8 w-full">
          
          {/* Page Header (Title + Subtitle) */}
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-[32px] leading-tight text-[#04082E] tracking-tight">
              Modération des Salons
            </h1>
            <p className="font-sans text-xs md:text-[15px] text-[#6E6E6E] mt-1 font-normal">
              Vérification et validation des dossiers professionnels
            </p>
          </div>

          {/* Inline Tabs and Search Bar (100% Figma layout, responsive re-ordering) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 w-full gap-4 md:gap-0 pb-0.5">
            {/* Tabs (Under search bar on mobile, left on desktop) */}
            <div className="order-2 md:order-1 flex gap-6 md:gap-8 overflow-x-auto md:overflow-visible scrollbar-none pb-1 md:pb-0 w-full md:w-auto">
              {[
                { id: 'waiting', label: 'En attente', count: countWaiting },
                { id: 'approved', label: 'Valides', count: countApproved },
                { id: 'rejected', label: 'Rejetés', count: countRejected },
                { id: 'all', label: 'Tous', count: countAll }
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as 'waiting' | 'approved' | 'rejected' | 'all')
                      setCurrentPage(1)
                    }}
                    className={`pb-3 font-heading font-medium text-[16px] leading-[19.84px] transition-all relative flex items-center select-none flex-shrink-0
                      ${isActive 
                        ? 'text-[#0738dc] border-b-2 border-[#0738dc] font-semibold' 
                        : 'text-[#6E6E6E] hover:text-[#000000]'
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                    <span className={`ml-2 px-1.5 py-0.5 text-[11px] font-bold rounded-[3px] leading-none transition-colors
                      ${isActive 
                        ? 'bg-[#0738dc] text-white' 
                        : 'bg-[#E2EAFE] text-[#0738dc]'
                      }
                    `}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>
            
            {/* Inline search bar (Figma bottom line style, full-width on mobile) */}
            <div className="order-1 md:order-2 pb-2.5 flex items-center gap-2 border-b border-slate-300 md:border-black w-full md:w-60">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Rechercher"
                className="bg-transparent outline-none border-none text-sm placeholder:text-[#6E6E6E] text-slate-800 w-full"
              />
            </div>
          </div>

          {/* ────────────────── Desktop View (Table Layout) ────────────────── */}
          <div className="hidden md:flex border border-[#E2E8F0] rounded-[8px] bg-white shadow-sm overflow-hidden flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                
                {/* Table Header (Pastel Blue bg) */}
                <thead>
                  <tr className="bg-[#E2EAFE] border-b border-[#E2E8F0] text-[#04082E] text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 font-heading">SALON (NOM / VILLE)</th>
                    <th className="px-6 py-4 font-heading">SIRET</th>
                    <th className="px-6 py-4 font-heading">DATE INSCRIPTION</th>
                    <th className="px-6 py-4 font-heading">JUSTIFICATIF</th>
                    <th className="px-6 py-4 font-heading">ACTIONS</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-[#E2E8F0] text-[14px]">
                  {paginatedSalons.map((salon) => {
                    return (
                      <tr 
                        key={salon.id} 
                        onClick={() => setSelectedSalon(salon)}
                        className="hover:bg-slate-50/60 transition-colors duration-150 cursor-pointer bg-white"
                      >
                        {/* Column: SALON (NOM / VILLE) */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-[#04082e]">
                            {salon.nom_commerce} - {getSalonLocation(salon)}
                          </span>
                        </td>

                        {/* Column: SIRET */}
                        <td className="px-6 py-4 text-[#04082e] font-sans">
                          {salon.siret}
                        </td>

                        {/* Column: DATE INSCRIPTION */}
                        <td className="px-6 py-4 text-[#04082e] font-sans">
                          {formatDate(salon.users?.created_at)}
                        </td>

                        {/* Column: JUSTIFICATIF (Figma flat gray/blue pill) */}
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          {salon.url_justificatif_local ? (
                            <a
                              href={salon.url_justificatif_local}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-1.5 bg-[#E2EAFE]/70 hover:bg-[#E2EAFE] text-[#0738dc] rounded-[4px] text-xs font-bold transition duration-150"
                            >
                              <span>{getJustificatifLabel(salon.url_justificatif_local)}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Aucun fichier</span>
                          )}
                        </td>

                        {/* Column: ACTIONS */}
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-3">
                            {salon.statut_validation === 'waiting' && (
                              <>
                                <button
                                  onClick={() => handleApprove(salon.id)}
                                  disabled={isPending}
                                  className="px-5 py-2 bg-[#0738dc] hover:bg-blue-700 text-white rounded-[4px] text-xs font-bold transition active:scale-95 flex items-center justify-center"
                                >
                                  Valider
                                </button>
                                <button
                                  onClick={() => handleReject(salon.id)}
                                  disabled={isPending}
                                  className="px-5 py-2 border border-[#FF8A8A] text-[#FF5A5A] hover:bg-red-50 rounded-[4px] text-xs font-bold transition active:scale-95 flex items-center justify-center"
                                >
                                  Rejeter
                                </button>
                              </>
                            )}
                            {salon.statut_validation === 'approved' && (
                              <button
                                onClick={() => handleReject(salon.id)}
                                disabled={isPending}
                                className="px-5 py-2 border border-[#FF8A8A] text-[#FF5A5A] hover:bg-red-50 rounded-[4px] text-xs font-bold transition active:scale-95 flex items-center justify-center"
                              >
                                Révoquer
                              </button>
                            )}
                            {salon.statut_validation === 'rejected' && (
                              <button
                                onClick={() => handleReconsider(salon.id)}
                                disabled={isPending}
                                className="px-5 py-2 bg-[#0738dc] hover:bg-blue-700 text-white rounded-[4px] text-xs font-bold transition active:scale-95 flex items-center justify-center"
                              >
                                Reconsidérer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {/* Empty state */}
                  {filteredSalons.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                        Aucun salon trouvé dans cette catégorie.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-white px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="font-sans font-normal text-[#6E6E6E]">
                {countWaiting} salons en attente - Page {currentPage} sur {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center border border-[#E2E8F0] bg-white hover:bg-blue-50 text-[#0738dc] rounded-[4px] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition select-none"
                >
                  &lt;
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center bg-[#0738dc] hover:bg-blue-700 text-white rounded-[4px] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition select-none"
                >
                  &gt;
                </button>
              </div>
            </div>

          </div>

          {/* ────────────────── Mobile View (Cards List Layout) ────────────────── */}
          <div className="md:hidden flex flex-col gap-4">
            {paginatedSalons.map((salon) => {
              return (
                <div 
                  key={salon.id} 
                  onClick={() => setSelectedSalon(salon)}
                  className="border border-[#E2E8F0] rounded-[8px] p-4 bg-white flex flex-col gap-4 active:bg-slate-50 transition duration-150 cursor-pointer"
                >
                  {/* Card Title */}
                  <h3 className="font-bold text-base text-[#04082e] leading-snug">
                    {salon.nom_commerce} - {getSalonLocation(salon)}
                  </h3>
                  
                  {/* Card Metadata info row */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#04082e] text-xs font-semibold">
                    {/* Document Icon & SIRET */}
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#0738dc]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span>SIRET : {salon.siret}</span>
                    </div>
                    {/* Clock Icon & Date */}
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#0738dc]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatDate(salon.users?.created_at)}</span>
                    </div>
                  </div>

                  {/* Justificatif Outlined Blue Button */}
                  <div onClick={(e) => e.stopPropagation()} className="w-full">
                    {salon.url_justificatif_local ? (
                      <a
                        href={salon.url_justificatif_local}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full border border-[#0738dc] hover:bg-blue-50 text-[#0738dc] rounded-[4px] py-2 text-center font-bold text-xs flex items-center justify-center gap-2 transition duration-150"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span>{getJustificatifLabel(salon.url_justificatif_local)}</span>
                      </a>
                    ) : (
                      <div className="w-full border border-dashed border-slate-200 text-slate-400 rounded-[4px] py-2.5 text-center font-semibold text-xs">
                        Aucun fichier
                      </div>
                    )}
                  </div>

                  {/* Mobile Actions Container */}
                  <div onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-3">
                    {salon.statut_validation === 'waiting' && (
                      <>
                        <button
                          onClick={() => handleApprove(salon.id)}
                          disabled={isPending}
                          className="flex-1 py-2.5 bg-[#0738dc] hover:bg-blue-700 text-white rounded-[4px] text-xs font-bold transition active:scale-95 flex items-center justify-center"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => handleReject(salon.id)}
                          disabled={isPending}
                          className="flex-1 py-2.5 border border-[#FF8A8A] text-[#FF5A5A] hover:bg-red-50 rounded-[4px] text-xs font-bold transition active:scale-95 flex items-center justify-center"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                    {salon.statut_validation === 'approved' && (
                      <button
                        onClick={() => handleReject(salon.id)}
                        disabled={isPending}
                        className="w-full py-2.5 bg-[#E14D5F] hover:bg-red-600 text-white rounded-[4px] text-xs font-bold transition active:scale-95 flex items-center justify-center"
                      >
                        Révoquer
                      </button>
                    )}
                    {salon.statut_validation === 'rejected' && (
                      <button
                        onClick={() => handleReconsider(salon.id)}
                        disabled={isPending}
                        className="w-full py-2.5 bg-[#0738dc] hover:bg-blue-700 text-white rounded-[4px] text-xs font-bold transition active:scale-95 flex items-center justify-center"
                      >
                        Reconsidérer
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Mobile Empty State */}
            {filteredSalons.length === 0 && (
              <div className="border border-dashed border-slate-200 rounded-[8px] py-12 text-center text-slate-400 font-medium bg-white">
                Aucun salon trouvé dans cette catégorie.
              </div>
            )}

            {/* Mobile Pagination controls */}
            {totalPages > 1 && (
              <div className="bg-white p-4 border border-[#E2E8F0] rounded-[8px] flex items-center justify-between text-xs text-slate-500 font-semibold shadow-sm">
                <span className="font-sans font-normal text-[#6E6E6E]">
                  Page {currentPage} sur {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-[#E2E8F0] bg-white hover:bg-blue-50 text-[#0738dc] rounded-[4px] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition select-none"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center bg-[#0738dc] hover:bg-blue-700 text-white rounded-[4px] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition select-none"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ────────────────── Detail Panel Slide-over Drawer ────────────────── */}
      {selectedSalon && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Overlay backdrop */}
          <div 
            onClick={() => setSelectedSalon(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Drawer body */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out border-l border-slate-200 z-10 animate-slide-in">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs uppercase font-bold text-[#0738dc] tracking-widest">
                Détail de la demande
              </span>
              <button 
                onClick={() => setSelectedSalon(null)}
                className="p-2 hover:bg-slate-200/60 rounded-full transition text-slate-500 hover:text-slate-800"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Salon Title and location */}
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                  {selectedSalon.nom_commerce}
                </h2>
                <div className="flex items-start gap-2 mt-2 text-slate-500 text-sm font-medium">
                  <svg className="w-4 h-4 text-[#0738dc] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>{getSalonLocation(selectedSalon)}</span>
                </div>
                {selectedSalon.adresse && (
                  <p className="mt-2 font-sans text-sm text-[#6E6E6E]">
                    {selectedSalon.adresse}
                  </p>
                )}
                {selectedSalon.adresse && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const result = await regeocodeSalon(selectedSalon.id)
                        if (result.ok) {
                          alert('Position GPS recalculée depuis l\'adresse.')
                        } else {
                          alert(result.error ?? 'Échec du géocodage.')
                        }
                      })
                    }}
                    className="mt-2 font-sans text-xs text-[#0738DC] underline hover:no-underline disabled:opacity-50"
                  >
                    Recalculer la position sur la carte
                  </button>
                )}
              </div>

              {/* Technical fields */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SIRET</span>
                  <span className="text-sm font-mono font-bold text-slate-700 tracking-wide mt-1">
                    {selectedSalon.siret}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Inscription</span>
                  <span className="text-sm font-semibold text-slate-700 mt-1">
                    {formatDate(selectedSalon.users?.created_at)}
                  </span>
                </div>
              </div>

              {/* Document Preview Area */}
              <div className="flex-1 flex flex-col gap-2 min-h-[220px]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Justificatif de locaux
                </span>
                
                {selectedSalon.url_justificatif_local ? (
                  <div className="flex-1 flex flex-col border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 shadow-inner relative group">
                    {selectedSalon.url_justificatif_local.endsWith('.pdf') ? (
                      <iframe 
                        src={selectedSalon.url_justificatif_local}
                        className="w-full h-full border-none min-h-[200px]"
                        title="Document justificatif"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white p-4 relative min-h-[200px]">
                        <Image
                          src={selectedSalon.url_justificatif_local}
                          alt="Justificatif de locaux"
                          fill
                          unoptimized
                          className="object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <a
                      href={selectedSalon.url_justificatif_local}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 bg-black/75 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition opacity-90 hover:opacity-100 shadow-md"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0V7.56L12.28 11.8a.75.75 0 11-1.06-1.06l4.24-4.24h-1.21a.75.75 0 01-.75-.75z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6A2.25 2.25 0 016.75 3.75h5.25a.75.75 0 010 1.5H6.75A.75.75 0 006 6v12a.75.75 0 00.75.75h12a.75.75 0 00.75-.75v-5.25a.75.75 0 011.5 0v5.25A2.25 2.25 0 0118 20.25H6.75A2.25 2.25 0 014.5 18V6z" />
                      </svg>
                      Plein écran
                    </a>
                  </div>
                ) : (
                  <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 bg-slate-50/50">
                    <svg className="w-10 h-10 mb-2 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-xs font-semibold">Aucun justificatif fourni pour ce dossier</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer / Actions panel */}
            <div className="p-6 border-t border-slate-100 flex items-center gap-4 bg-slate-50/50">
              {selectedSalon.statut_validation === 'waiting' ? (
                <>
                  <button
                    onClick={() => handleReject(selectedSalon.id)}
                    disabled={isPending}
                    className="flex-1 py-3 bg-red-50 hover:bg-red-150 text-red-600 border border-red-200 hover:border-red-300 rounded-xl text-sm font-bold transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    Rejeter
                  </button>
                  <button
                    onClick={() => handleApprove(selectedSalon.id)}
                    disabled={isPending}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    Valider le salon
                  </button>
                </>
              ) : (
                <div className="w-full flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
                  <span>Dossier déjà traité</span>
                  <span className={`px-3 py-1 rounded-full border shadow-sm font-bold
                    ${selectedSalon.statut_validation === 'approved' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-red-50 text-red-700 border-red-100'
                    }
                  `}>
                    {selectedSalon.statut_validation === 'approved' ? 'Validé' : 'Rejeté'}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ────────────────── Confirmation Modal ("Are you sure?") ────────────────── */}
      {pendingAction && (
        <div className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <div 
            onClick={() => setPendingAction(null)}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300"
          />

          {/* Modal box */}
          <div className="relative w-full max-w-[450px] bg-white rounded-[16px] shadow-2xl p-6 flex flex-col items-center border border-slate-100 z-10 animate-fade-in-scale">
            {/* Close cross button */}
            <button 
              onClick={() => setPendingAction(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-700"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Blue icon square with question mark */}
            <div className="w-14 h-14 bg-[#E2EAFE] rounded-[10px] flex items-center justify-center mt-4 mb-5 text-[#0738dc] font-heading font-black text-2xl">
              ?
            </div>

            {/* Text details */}
            <h3 className="font-heading font-bold text-[20px] text-[#04082e] leading-snug text-center mb-2">
              Modifier le statut de ce salon ?
            </h3>
            <p className="font-sans text-sm text-[#6E6E6E] text-center leading-relaxed max-w-[320px] mb-8">
              Vous êtes sur le point de changer l&apos;état de cette candidature.
            </p>

            {/* Actions: side by side on desktop, stacked on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <button
                onClick={executePendingAction}
                className="flex-1 py-3.5 bg-[#0738dc] hover:bg-blue-700 text-white font-bold rounded-[6px] text-sm transition active:scale-[0.98]"
              >
                Oui
              </button>
              <button
                onClick={() => setPendingAction(null)}
                className="flex-1 py-3.5 border border-[#0738dc] hover:bg-blue-50 text-[#0738dc] font-bold rounded-[6px] text-sm transition active:scale-[0.98]"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── Refusal Modal (Motif & Comment) ────────────────── */}
      {isRefuseModalOpen && (
        <ActionModal
          variant="refuse"
          onClose={() => {
            setIsRefuseModalOpen(false)
            setRejectedSalonId(null)
          }}
          onSubmit={handleRefuseSubmit}
        />
      )}

      {/* ────────────────── Success Refusal Modal ────────────────── */}
      {isSuccessModalOpen && (
        <ActionModal
          variant="success"
          onClose={() => setIsSuccessModalOpen(false)}
        />
      )}

      {/* Slide-in custom drawer animation styling */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out forwards;
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.25s ease-out forwards;
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

