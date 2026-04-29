import React, { useState, useEffect } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import constructionImg from '../../assets/constuna.png' // Ensure path matches your project structure

const injectFonts = () => {
    if (document.getElementById('mt-fonts')) return
    const link = document.createElement('link')
    link.id = 'mt-fonts'
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=DM+Mono:wght@300;400;500&display=swap'
    document.head.appendChild(link)
}

const VerticalLabel = ({ children }) => (
    <div className="flex-1 flex items-center justify-center overflow-hidden">
        <span
            style={{
                fontFamily: "'Syne', sans-serif",
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                letterSpacing: '0.22em',
                whiteSpace: 'nowrap',
            }}
            className="text-sm font-extrabold uppercase text-white/20 tracking-widest select-none"
        >
            {children}
        </span>
    </div>
)

export const HomePage = () => {
    useEffect(() => { injectFonts() }, [])

    const triggerZoom = usePortfolioStore(state => state.triggerZoom)
    const [featureTab, setFeatureTab] = useState('nav')
    const [hoveredPanel, setHoveredPanel] = useState('image')
    const [bottomHovered, setBottomHovered] = useState(false)

    const isHelp = hoveredPanel === 'help'
    const constraintStyles = { maxWidth: 'calc(100vh - 200px + 320px)' }

    return (
        <div className="flex flex-col gap-2 w-full h-full items-center justify-center animate-in fade-in duration-1000 p-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* TOP TITLE BAR */}
            <div style={constraintStyles} className="flex-none w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-2 backdrop-blur-sm shadow-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)] pointer-events-none" />
                <div className="flex flex-col items-center relative z-10">
                    <h1 style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '0.04em' }} className="text-xl md:text-2xl font-extrabold text-white leading-none">
                        mister<span className="text-blue-400">tuna</span><span className="font-light text-white/25" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7em' }}>.dev</span>
                    </h1>
                </div>
            </div>

            {/* MAIN CONTENT ROW */}
            <div style={constraintStyles} className="flex flex-row gap-3 min-h-0 flex-1 items-center justify-center w-full">

                {/* CENTRAL IMAGE PANEL (CONSTRUCTION MODE) */}
                <div
                    onMouseEnter={() => setHoveredPanel('image')}
                    className="flex-1 aspect-square h-full bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden backdrop-blur-sm shadow-2xl relative group shrink-0"
                >
                    <img src={constructionImg} alt="Construction" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />

                    <div className="relative z-10 text-center p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl mx-6">
                        <div className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.3em] mb-2 animate-pulse">System Status: Deploying</div>
                        <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-black text-white uppercase leading-none mb-4">Under <br /><span className="text-blue-400">Construction</span></h2>
                        <p className="text-xs text-gray-300 font-light leading-relaxed">The spatial grid is currently being optimized. The full portfolio environment will be public shortly.</p>
                    </div>
                </div>

                {/* FEATURES PANEL */}
                <div
                    onMouseEnter={() => setHoveredPanel('help')}
                    onMouseLeave={() => setHoveredPanel('image')}
                    style={{ width: isHelp ? '320px' : '52px', transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }}
                    className="h-full bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl shrink-0"
                >
                    {!isHelp && <VerticalLabel>Site Features</VerticalLabel>}
                    {isHelp && (
                        <div className="flex flex-col h-full p-4 w-80">
                            <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-sm font-extrabold text-white uppercase mb-3 text-center">Site <span className="text-blue-400">Features</span></h2>
                            <div className="flex gap-1 mb-3 justify-center">
                                {['nav', 'interact', 'tools'].map((key) => (
                                    <button key={key} onClick={() => setFeatureTab(key)}
                                        className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all ${featureTab === key ? 'text-white bg-blue-600 font-bold' : 'text-gray-500 hover:text-white bg-white/5'}`}
                                    >{key}</button>
                                ))}
                            </div>
                            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
                                {featureTab === 'nav' && (
                                    <div className="space-y-2">
                                        <div className="bg-black/40 rounded-lg border border-white/10 p-2">
                                            <div className="text-[8px] font-black text-blue-400 uppercase mb-1">Architecture</div>
                                            <p className="text-[9px] text-gray-200 leading-tight">A spatial data environment built on an infinite hexagonal coordinate system where content is housed in "Parent Hex" containers.</p>
                                        </div>
                                        <div className="bg-black/40 rounded-lg border border-white/10 p-2">
                                            <div className="text-[8px] font-black text-blue-400 uppercase mb-1">Movement</div>
                                            <p className="text-[9px] text-gray-200 leading-tight">• Hover screen edges to auto-pan.</p>
                                            <p className="text-[9px] text-gray-200 leading-tight">• Click and drag the grid to move manually.</p>
                                            <p className="text-[9px] text-gray-200 leading-tight">• Use indicators or hexes to warp/open pages.</p>
                                        </div>
                                    </div>
                                )}
                                {featureTab === 'interact' && (
                                    <div className="bg-black/40 rounded-lg border border-white/10 p-3">
                                        <div className="text-[8px] font-black text-blue-400 uppercase mb-1">Interaction Suite</div>
                                        <p className="text-[10px] text-gray-200 leading-relaxed">Customize the simulation via the Settings panel:</p>
                                        <ul className="text-[9px] text-gray-400 mt-2 space-y-1">
                                            <li>• <span className="text-white">Physics:</span> Modify wave speed and magnitude.</li>
                                            <li>• <span className="text-white">Themes:</span> Shift visual color modes in real-time.</li>
                                        </ul>
                                    </div>
                                )}
                                {featureTab === 'tools' && (
                                    <div className="space-y-2">
                                        <div className="bg-black/40 rounded-lg border border-white/10 p-2">
                                            <div className="text-[8px] font-black text-blue-400 uppercase mb-1">Minimap Projection</div>
                                            <p className="text-[9px] text-gray-200 leading-tight">Live coordinate tracking relative to content nodes.</p>
                                        </div>
                                        <div className="bg-black/40 rounded-lg border border-white/10 p-2">
                                            <div className="text-[8px] font-black text-blue-400 uppercase mb-1">Zoom Engine</div>
                                            <p className="text-[9px] text-gray-200 leading-tight">Altitude controls for Grid Mode vs Page Mode perspectives.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div
                onMouseEnter={() => setBottomHovered(true)}
                onMouseLeave={() => setBottomHovered(false)}
                style={{ ...constraintStyles, height: bottomHovered ? '80px' : '28px', transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)' }}
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
                    <button onClick={() => triggerZoom('contact')} className="px-5 py-1.5 bg-white text-black font-black rounded-lg uppercase text-[9px] shadow-lg hover:bg-blue-500 hover:text-white transition-all">Contact</button>
                </div>
            </div>
        </div>
    )
}