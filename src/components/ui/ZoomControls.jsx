import React from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export const ZoomControls = () => {
    const triggerManualZoom = usePortfolioStore(state => state.triggerManualZoom)

    const MIN_Y = 15
    const MAX_Y = 32
    const MID_Y = (MAX_Y + MIN_Y) / 2 // Now dynamically calculates the perfect center (23.5)

    const currentY = usePortfolioStore(state => state.lastCameraPos?.y || MID_Y)
    const view = usePortfolioStore(state => state.view)

    if (view !== 'GRID') return null

    const zoomPercent = Math.max(0, Math.min(100, ((MAX_Y - currentY) / (MAX_Y - MIN_Y)) * 100))

    // Helper function to safely trigger zoom while blocking background clicks
    const handleSafeZoom = (e, targetY) => {
        e.stopPropagation() // Stops React tree bubbling
        if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation() // Stops the global window listener in PageContainer
        triggerManualZoom(targetY)
    }

    return (
        <div className="fixed left-10 bottom-10 z-50 group flex items-center h-14 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-2xl transition-all duration-500 ease-out w-16 hover:w-[320px] overflow-hidden cursor-pointer hover:cursor-default">

            {/* Default State: Magnifying Glass Icon + Current Zoom Level */}
            <div className="absolute left-0 w-16 h-14 flex flex-col items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <svg className="w-4 h-4 text-white/80 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-[9px] font-bold text-white/80 tracking-wider">
                    {Math.round(zoomPercent)}%
                </span>
            </div>

            {/* Expanded State: The full track UI wrapped to fit the max width */}
            <div className="absolute left-0 w-[320px] h-full flex flex-row items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">

                <button
                    onClick={(e) => handleSafeZoom(e, MAX_Y)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 text-white font-bold transition-all duration-200 hover:scale-110 text-[10px] tracking-widest"
                >
                    FAR
                </button>

                <div className="w-32 relative flex items-center h-10">
                    <div className="absolute left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500/30 transition-all duration-100" style={{ width: `${zoomPercent}%` }} />
                    </div>

                    <button
                        onClick={(e) => handleSafeZoom(e, MID_Y)}
                        className="absolute top-1/2 w-14 h-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-blue-900/60 border border-white/20 hover:border-blue-400 backdrop-blur-xl text-white font-bold transition-all duration-200 shadow-[0_0_15px_rgba(96,165,250,0.3)] hover:scale-110 overflow-hidden z-10 cursor-pointer"
                        style={{ left: `${zoomPercent}%`, transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="group/btn relative w-full h-full flex items-center justify-center">
                            <span className="group-hover/btn:opacity-0 transition-opacity duration-300 absolute text-[10px] tracking-widest flex items-center justify-center w-full h-full pointer-events-none">
                                {Math.round(zoomPercent)}%
                            </span>
                            <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 absolute text-[9px] tracking-widest text-blue-300 flex items-center justify-center w-full h-full pointer-events-none">
                                RESET
                            </span>
                        </div>
                    </button>
                </div>

                <button
                    onClick={(e) => handleSafeZoom(e, MIN_Y)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 text-white font-bold transition-all duration-200 hover:scale-110 text-[10px] tracking-widest"
                >
                    NEAR
                </button>

            </div>
        </div>
    )
}