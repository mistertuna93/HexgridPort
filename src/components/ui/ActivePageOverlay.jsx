import React, { useEffect, useState } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { BioCard } from '../content/BioCard'
import { ProjectsVault } from '../content/ProjectsVault'
import { HomePage } from '../content/HomePage'

export const ActivePageOverlay = () => {
  const view = usePortfolioStore(state => state.view)
  const activePageId = usePortfolioStore(state => state.activePageId)
  const resetView = usePortfolioStore(state => state.resetView)

  // Local state to handle unmounting transitions smoothly
  const [mountedPageId, setMountedPageId] = useState(null)

  // Control visibility based on store state
  const isActive = (view === 'ZOOMED' || view === 'GROWING' || activePageId === 'home') && activePageId !== null

  useEffect(() => {
    if (activePageId) {
      setMountedPageId(activePageId)
    }
  }, [activePageId])

  const renderContent = () => {
    switch (mountedPageId) {
      case 'home': return <HomePage />
      case 'bio': return <BioCard />
      case 'projects': return <ProjectsVault />
      default: return null
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex justify-center items-center pointer-events-none transition-all duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Background Blur Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl pointer-events-none" />

      {/* MAIN VIEWPORT CONTAINER 
        Constrained to 90vw and 85vh to ensure the 'Close' button and 
        bottom content are always visible on all screen aspect ratios.
      */}
      <div className={`w-[90vw] h-[85vh] max-w-[1800px] relative transition-transform duration-1000 ${isActive ? 'pointer-events-auto scale-100' : 'pointer-events-none scale-95'
        }`}>

        {/* Uniform Pill Close Button */}
        <div className="absolute -top-6 right-0 md:-right-4 z-[130]">
          <button
            onClick={(e) => { e.stopPropagation(); resetView(); }}
            className="py-3 px-8 text-xl font-bold rounded-full bg-black/60 backdrop-blur-xl hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer uppercase tracking-wider shadow-2xl active:scale-95"
          >
            Close
          </button>
        </div>

        {/* CONTENT AREA 
          'overflow-hidden' is critical here to prevent the whole overlay from scrolling.
          The individual page components (like HomePage) will handle internal scrolling if needed.
        */}
        <div className="w-full h-full overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}