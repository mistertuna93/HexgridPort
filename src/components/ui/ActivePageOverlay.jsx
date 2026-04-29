// src/components/ui/ActivePageOverlay.jsx

import React from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
// Import your new component
import { Construct } from '../content/Construct'

export const ActivePageOverlay = () => {
  // We keep these to maintain the structure, but we will override the logic
  const view = usePortfolioStore(state => state.view)
  const activePageId = usePortfolioStore(state => state.activePageId)

  // Force the overlay to always be active
  const isActive = true

  return (
    <div
      className={`fixed inset-0 z-[100] flex justify-center items-center transition-all duration-[1200ms] ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
    >
      {/* Background Blur Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div className="w-[90vw] h-[85vh] max-w-[1800px] relative pointer-events-auto scale-100">
        {/* We remove the Close button so users cannot exit the construction page */}

        <div className="w-full h-full overflow-hidden">
          <Construct />
        </div>
      </div>
    </div>
  )
}