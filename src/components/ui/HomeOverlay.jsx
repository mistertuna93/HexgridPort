import React from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export const HomeOverlay = () => {
  const view = usePortfolioStore(state => state.view)
  const isHomeOpen = usePortfolioStore(state => state.isHomeOpen)
  const closeHome = usePortfolioStore(state => state.closeHome)
  const triggerZoom = usePortfolioStore(state => state.triggerZoom)

  const isVisible = view === 'GRID' && isHomeOpen

  return (
    <div 
      className={`fixed inset-0 z-50 pointer-events-none flex flex-col justify-center items-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none" />

      <div className={`relative z-10 max-w-4xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-transform duration-1000 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-8'}`}>
        
        {/* Main Intro Panel */}
        <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              closeHome()
            }}
            className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            title="Dismiss Welcome View"
          >
            ✕
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight pr-8">
            Spatial Portfolio
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Welcome. This environment was built as a place to view my work, learn about my abilities, and to showcase the result of the blending of my creative and technical skills.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-2">
            <h3 className="text-white font-bold mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Navigation
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explore the expanse by moving your cursor to the edges of the screen to pan the camera. Click on any of the floating page indicators or their underlying geometric nodes to dive into that section.
            </p>
          </div>
        </div>

        {/* VIP CTA Panel */}
        <div className={`bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-colors duration-300 group ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
            Initiate Project 
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-8">
            Inquire about utilizing my services without any hassle. Click below to become our newest VIP, brief us on your vision and goals, and learn how we can become the conduit between idea and reality.
          </p>
          <button 
            onClick={() => triggerZoom('contact')}
            className="w-full py-4 px-6 bg-white text-black font-bold rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
          >
            Become a VIP
          </button>
        </div>

      </div>
    </div>
  )
}
