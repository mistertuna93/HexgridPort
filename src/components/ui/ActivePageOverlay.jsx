import React, { useEffect, useState } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { BioCard } from '../content/BioCard'
import { ProjectsVault } from '../content/ProjectsVault'
import { RoadmapTracker } from '../content/RoadmapTracker'
import { ArsenalStack } from '../content/ArsenalStack'
import { ContactTerminal } from '../content/ContactTerminal'

export const ActivePageOverlay = () => {
  const view = usePortfolioStore(state => state.view)
  const activePageId = usePortfolioStore(state => state.activePageId)
  const resetView = usePortfolioStore(state => state.resetView)

  // Track the previously active page so we can safely fade it out without unmounting instantly
  const [mountedPageId, setMountedPageId] = useState(null)
  
  const isActive = (view === 'ZOOMED' || view === 'GROWING') && activePageId !== null

  useEffect(() => {
    if (activePageId) {
      setMountedPageId(activePageId)
    }
  }, [activePageId])

  const renderContent = () => {
    switch (mountedPageId) {
      case 'bio': return <BioCard />
      case 'projects': return <ProjectsVault />
      case 'roadmap': return <RoadmapTracker />
      case 'arsenal': return <ArsenalStack />
      case 'contact': return <ContactTerminal />
      default: return null
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-[100] flex justify-center items-center pointer-events-none transition-all duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${isActive ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-[0.97] invisible'}`}
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <div className={`w-[90vw] h-[90vh] max-w-[1800px] relative mt-[5vh] ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        
        {/* Abstracted Close Anchor overlay mapping explicitly mapped cleanly independent of 3D grids */}
        <button 
           onClick={(e) => { e.stopPropagation(); resetView(); }} 
           className="absolute -top-4 right-0 md:-right-4 z-[110] py-3 px-8 text-xl font-bold rounded-full bg-black/60 backdrop-blur-xl hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer uppercase tracking-wider shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        >
           Close
        </button>
        
        {/* Dynamic Transparent Container - Sub components draw their own native glass panels seamlessly */}
        <div className="w-full h-full p-4 relative z-10 text-white drop-shadow-2xl overflow-hidden">
            {renderContent()}
        </div>
      </div>
    </div>
  )
}
