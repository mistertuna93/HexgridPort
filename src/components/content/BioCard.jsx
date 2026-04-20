import React from 'react'

export const BioCard = () => {
  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex flex-col lg:flex-row gap-12 items-center justify-center h-full">
        {/* Glowing Profile Avatar Placeholder */}
        <div className="relative group w-72 h-72 shrink-0">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[40px] opacity-40 group-hover:opacity-80 transition-opacity duration-700 animate-pulse"></div>
          <div className="w-full h-full relative z-10 rounded-full border border-white/20 bg-gradient-to-br from-blue-900/40 to-black/80 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-[inset_0_0_30px_rgba(59,130,246,0.3)]">
             <div className="text-7xl text-blue-400 font-black tracking-tighter opacity-80">INIT</div>
          </div>
        </div>
        
        {/* Content Block */}
        <div className="flex-1 space-y-6 pt-4 lg:pt-0">
          <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter m-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-200 drop-shadow-lg">
            SysAdmin
          </h1>
          <h2 className="text-xl lg:text-2xl font-mono text-blue-300 tracking-widest uppercase border-l-4 border-blue-500 pl-4">Operator Level 5</h2>
          <p className="text-lg lg:text-xl text-gray-300 leading-relaxed font-light max-w-2xl bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            Specializing in high-performance spatial interfaces, distributed systems, and next-generation web architecture. Deploying robust physical simulations directly within the browser matrix.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <button className="px-8 py-4 rounded-full bg-blue-500/20 border border-blue-400/50 hover:bg-blue-500 hover:text-white transition-all duration-300 font-bold tracking-wide shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] cursor-pointer">
               ACCESS LOGS
             </button>
             <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition-all font-bold tracking-wide cursor-pointer">
               TRANSMIT PING
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
