import React, { useMemo } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export const Minimap = () => {
    // 1. ALL HOOKS MUST BE AT THE TOP
    const pages = usePortfolioStore(state => state.pages)
    const currentPos = usePortfolioStore(state => state.lastCameraPos)
    const view = usePortfolioStore(state => state.view)
    const hexSize = usePortfolioStore(state => state.hexSize) || 1.5

    const triggerManualPan = usePortfolioStore(state => state.triggerManualPan)
    const triggerManualZoom = usePortfolioStore(state => state.triggerManualZoom)

    // Move useMemo ABOVE the early return!
    const mapData = useMemo(() => {
        const hexWidth = Math.sqrt(3) * hexSize

        const worldPages = pages.map(p => {
            const modRow = ((p.vCoord.y % 2) + 2) % 2
            const worldX = (p.vCoord.x + modRow * 0.5) * hexWidth
            const worldZ = p.vCoord.y * 1.5 * hexSize
            return { ...p, worldX, worldZ }
        })

        const xs = worldPages.map(p => p.worldX)
        const zs = worldPages.map(p => p.worldZ)

        const minX = Math.min(...xs) - 30
        const maxX = Math.max(...xs) + 30
        const minZ = Math.min(...zs) - 30
        const maxZ = Math.max(...zs) + 30

        return { worldPages, minX, maxX, minZ, maxZ }
    }, [pages, hexSize])

    // 2. NOW WE CAN SAFELY RETURN EARLY
    if (view !== 'GRID') return null

    // 3. THE REST OF THE RENDER LOGIC
    const MIN_Y = 15
    const MAX_Y = 36
    const currentY = currentPos?.y || 22

    const getPercent = (val, min, max) => ((val - min) / (max - min)) * 100

    // Interaction Handlers
    const handleMapClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const clickY = e.clientY - rect.top

        const percentX = clickX / rect.width
        const percentY = clickY / rect.height

        const targetX = mapData.minX + percentX * (mapData.maxX - mapData.minX)
        const targetZ = mapData.minZ + percentY * (mapData.maxZ - mapData.minZ)

        triggerManualPan(targetX, targetZ)
    }

    const handleZoomClick = (e) => {
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        const clickY = e.clientY - rect.top

        const percentFromBottom = 1 - (clickY / rect.height)
        const targetY = MAX_Y - (percentFromBottom * (MAX_Y - MIN_Y))

        triggerManualZoom(Math.max(MIN_Y, Math.min(MAX_Y, targetY)))
    }

    // Scroll to zoom handler
    const handleWheel = (e) => {
        e.stopPropagation()
        const sensitivity = 0.05
        const targetY = currentY + (e.deltaY * sensitivity)

        triggerManualZoom(Math.max(MIN_Y, Math.min(MAX_Y, targetY)))
    }

    // Visual scaling factors
    const zoomFactor = Math.max(0, Math.min(1, (currentY - MIN_Y) / (MAX_Y - MIN_Y)))
    const indicatorSize = 12 + (zoomFactor * 24)
    const zoomPercent = Math.max(0, Math.min(100, ((MAX_Y - currentY) / (MAX_Y - MIN_Y)) * 100))

    return (
        <div
            className="fixed top-10 left-10 z-50 w-28 h-24 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-2 opacity-60 hover:opacity-100 hover:scale-[1.5] origin-top-left transition-all duration-300 group hover:bg-black/60 flex flex-row"
            title="Minimap Navigation"
            onWheel={handleWheel}
        >

            {/* 2D Panning Map Area */}
            <div
                className="h-full relative cursor-crosshair flex-grow mr-3"
                onClick={handleMapClick}
            >
                {mapData.worldPages.map(p => (
                    <div
                        key={p.id}
                        className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_currentColor] transition-transform duration-300 group-hover:scale-[1.5]"
                        style={{
                            left: `${getPercent(p.worldX, mapData.minX, mapData.maxX)}%`,
                            top: `${getPercent(p.worldZ, mapData.minZ, mapData.maxZ)}%`,
                            backgroundColor: p.theme || '#ffffff',
                            color: p.theme || '#ffffff'
                        }}
                    />
                ))}

                {currentPos && (
                    <div
                        className="absolute border border-white/70 rounded-sm -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-75 bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)] pointer-events-none"
                        style={{
                            left: `${getPercent(currentPos.x, mapData.minX, mapData.maxX)}%`,
                            top: `${getPercent(currentPos.z, mapData.minZ, mapData.maxZ)}%`,
                            width: `${indicatorSize * 0.75}px`,
                            height: `${indicatorSize * 0.75}px`
                        }}
                    >
                        <div className="w-0.5 h-0.5 bg-white rounded-full" />
                    </div>
                )}
            </div>

            {/* Vertical Altitude Track */}
            <div
                className="relative h-full w-1.5 bg-white/10 rounded-full cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                onClick={handleZoomClick}
                title="Adjust Altitude"
            >
                <div
                    className="absolute bottom-0 w-full bg-blue-500/50 rounded-full transition-all duration-100 pointer-events-none"
                    style={{ height: `${zoomPercent}%` }}
                />
                <div
                    className="absolute w-2 h-2 bg-blue-300 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-all duration-100 left-1/2 -translate-x-1/2 pointer-events-none"
                    style={{ bottom: `calc(${zoomPercent}% - 4px)` }}
                />
            </div>

            <p className="text-center text-white/50 text-[8px] mt-2 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute -bottom-4 w-full left-0">
                Pan & Zoom
            </p>

        </div>
    )
}