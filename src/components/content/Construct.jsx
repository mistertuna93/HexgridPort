import React, { useState, useEffect } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import constructionImg from '../../assets/constuna.png'

const injectFonts = () => {
    if (document.getElementById('mt-fonts')) return
    const link = document.createElement('link')
    link.id = 'mt-fonts'
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=DM+Mono:wght@300;400;500&display=swap'
    document.head.appendChild(link)
}

export const Construct = () => {
    useEffect(() => { injectFonts() }, [])

    const triggerZoom = usePortfolioStore(state => state.triggerZoom)
    const [bottomHovered, setBottomHovered] = useState(false)

    // Using the width constraint from your backup to keep bars aligned
    const constraintStyles = { maxWidth: 'calc(100vh - 200px + 320px)' }

    return (
        <div className="flex flex-col gap-3 w-full h-full items-center justify-center animate-in fade-in duration-1000 p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* TOP TITLE BAR */}
            <div style={constraintStyles} className="flex-none w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-2 backdrop-blur-sm shadow-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)] pointer-events-none" />
                <div className="flex flex-col items-center relative z-10">
                    <h1 style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '0.04em' }} className="text-xl md:text-2xl font-extrabold text-white leading-none">
                        mister<span className="text-blue-400">tuna</span><span className="font-light text-white/25" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7em' }}>.dev</span>
                    </h1>
                </div>
            </div>

            {/* MAIN CONTENT AREA: Centered Image and Text */}
            <div style={constraintStyles} className="flex flex-col md:flex-row gap-8 min-h-0 flex-1 items-center justify-center w-full">

                {/* Image Section */}
                <div className="aspect-square h-3/4 max-h-[400px] bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0">
                    <img
                        src={constructionImg}
                        alt="Construction"
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>

                {/* Construction Text Section */}
                <div className="flex flex-col items-start justify-center text-left max-w-sm">
                    <div className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.3em] mb-2 animate-pulse">
                        Status: System Optimization
                    </div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-4xl font-black text-white uppercase leading-none mb-4">
                        Under <br />
                        <span className="text-blue-400">Construction</span>
                    </h2>
                    <p className="text-sm text-gray-300 font-light leading-relaxed mb-6">
                        The hexagonal grid is currently being recalibrated. High-performance digital environments and portfolio content will be accessible here shortly.
                    </p>
                    <div className="w-full h-px bg-gradient-to-r from-blue-500/50 to-transparent mb-4" />
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                        deploy_init_v0.1.0
                    </p>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div
                onMouseEnter={() => setBottomHovered(true)}
                onMouseLeave={() => setBottomHovered(false)}
                style={{
                    ...constraintStyles,
                    height: bottomHovered ? '80px' : '32px',
                    transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)'
                }}
                className="w-full bg-gradient-to-br from-blue-600/20 via-purple-900/20 to-black/40 border border-white/15 rounded-[1.5rem] px-8 shadow-2xl relative overflow-hidden flex items-center shrink-0 cursor-pointer"
            >
                <div style={{ opacity: bottomHovered ? 0 : 1, transition: 'opacity 0.2s ease' }} className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] uppercase text-white/30 tracking-[0.25em] font-black">Looking to work with us?</span>
                </div>
                <div style={{ opacity: bottomHovered ? 1 : 0, transition: 'opacity 0.3s ease 0.1s' }} className="flex flex-row items-center justify-between w-full relative z-10">
                    <div className="text-left">
                        <h2 className="text-sm font-black text-white leading-none">Ready to start?</h2>
                        <p className="text-[9px] text-blue-300/70 mt-1 uppercase tracking-tight">Inquire about architecture or engineering</p>
                    </div>
                    <button
                        onClick={() => triggerZoom('contact')}
                        className="px-5 py-1.5 bg-white text-black font-black rounded-lg uppercase text-[9px] shadow-lg hover:bg-blue-500 hover:text-white transition-all"
                    >
                        Contact
                    </button>
                </div>
            </div>
        </div>
    )
}