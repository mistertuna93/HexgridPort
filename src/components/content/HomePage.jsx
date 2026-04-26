import React, { useState } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export const HomePage = () => {
    const triggerZoom = usePortfolioStore(state => state.triggerZoom)
    const [activeTab, setActiveTab] = useState('nav')

    return (
        /* The container fills the 85vh height of the ActivePageOverlay */
        <div className="flex flex-col gap-6 w-full h-full animate-in fade-in duration-1000">

            {/* TOP ROW: 88% Vertical Weight (flex-[88])
                Horizontal Split: 60% (col-span-6) / 40% (col-span-4)
            */}
            <div className="flex-[88] grid grid-cols-10 gap-6 min-h-0">

                {/* ABOUT SECTION (col-span-6) */}
                <div className="col-span-6 bg-white/5 ... flex flex-col p-12">

                    {/* Header: Fixed weight */}
                    <div className="flex-none mb-6">
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase">
                            Spatial <span className="text-blue-500 italic font-light">Portfolio</span>
                        </h1>
                    </div>

                    {/* Body: High weight - will expand to fill the 70% vertical slice */}
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                        <p className="text-lg md:text-2xl text-gray-400 leading-relaxed font-light">
                            Welcome to a digital environment showcasing the intersection of creative vision and robust engineering.
                            By giving this container flex-1, it absorbs all room within the 70% vertical weight.
                        </p>
                    </div>
                </div>

                {/* HELP SECTION: 40% Width */}
                <div className="col-span-4 bg-white/5 border border-white/10 rounded-[3rem] p-8 flex flex-col shadow-2xl backdrop-blur-md min-h-0">
                    <h2 className="text-white font-bold uppercase tracking-[0.2em] text-xs opacity-40 mb-4 border-l-4 border-blue-500 pl-6">
                        System Intelligence
                    </h2>

                    <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5 mb-6">
                        {['nav', 'interact'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {tab === 'nav' ? 'Navigation' : 'Interaction'}
                            </button>
                        ))}
                    </div>

                    <div className="text-gray-400 space-y-4 text-sm overflow-y-auto custom-scrollbar">
                        {activeTab === 'nav' ? (
                            <p>Move cursor to screen edges to pan the camera view.</p>
                        ) : (
                            <p>Click geometric indicators to zoom into project vaults.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: 12% Vertical Weight (flex-[12])
                Reduced padding and font size to accommodate 12% vertical slice
            */}
            <div className="flex-[12] w-full bg-gradient-to-br from-blue-600/20 via-purple-900/20 to-black/40 border border-white/20 rounded-[2.5rem] px-10 py-4 shadow-2xl relative overflow-hidden flex items-center shrink-0">
                <div className="flex flex-row items-center justify-between gap-8 w-full relative z-10">
                    <div className="flex flex-col text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Prospective Customers</h2>
                        <p className="text-sm text-gray-400 font-light leading-tight">
                            Inquire about technical implementation or spatial solutions.
                        </p>
                    </div>
                    <button
                        onClick={() => triggerZoom('contact')}
                        className="whitespace-nowrap px-8 py-3 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95 text-xs"
                    >
                        Become a VIP
                    </button>
                </div>
            </div>
        </div>
    )
}