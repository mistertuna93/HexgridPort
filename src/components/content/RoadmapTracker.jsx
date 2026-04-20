import React from 'react'

const milestones = [
  { year: "Phase I", title: "Core Architecture Built", desc: "Established the Zustand routing store and basic matrix initialization.", status: "COMPLETED", active: false },
  { year: "Phase II", title: "Spatial Hex Grid Rendering", desc: "Deployed infinite WebGL procedural wave generation via fragment modification.", status: "COMPLETED", active: false },
  { year: "Phase III", title: "Dynamic Routing Execution", desc: "Inject asynchronous queue sequences and radial geometry expansion logic.", status: "IN PROGRESS", active: true },
  { year: "Phase IV", title: "Global Synchronization", desc: "Bind the dashboard configurations over the live network securely.", status: "PENDING", active: false },
]

export const RoadmapTracker = () => {
  return (
    <div className="flex flex-col h-full text-white">
      <div className="mb-12 text-center relative">
        <h1 className="text-7xl font-black uppercase tracking-tighter m-0 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
          Directives
        </h1>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-1rem] h-[2px] w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </div>

      <div className="relative flex-1 px-4 lg:px-12">
        {/* Timeline Core Path Engine */}
        <div className="absolute top-0 bottom-8 left-[3.3rem] lg:left-[5.3rem] w-[2px] bg-gradient-to-b from-amber-500 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
        
        <div className="space-y-12 pb-10">
           {milestones.map((m, i) => (
             <div key={i} className="relative pl-24 lg:pl-32 group">
                {/* Embedded Node Component */}
                <div className={`absolute left-[2.9rem] lg:left-[4.9rem] top-3 w-4 h-4 rounded-full border-4 ${m.active ? 'border-amber-400 bg-white shadow-[0_0_15px_rgba(245,158,11,1)] animate-ping' : 'border-amber-900 bg-black'} z-10`}></div>
                
                {/* Physical Node UI block Container */}
                <div className={`border ${m.active ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'bg-black/40 border-white/10'} p-8 rounded-3xl group-hover:bg-black/60 transition-all duration-500 backdrop-blur-md`}>
                   <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                      <span className="text-amber-500 font-mono text-sm tracking-widest bg-amber-500/10 px-4 py-1 rounded-full border border-amber-500/20">{m.year}</span>
                      <span className={`text-xs font-bold px-4 py-2 rounded-full tracking-widest ${m.active ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-white/5 text-slate-400 border border-white/10'}`}>{m.status}</span>
                   </div>
                   <h3 className={`text-3xl font-black mb-2 ${m.active ? 'text-white' : 'text-slate-200'}`}>{m.title}</h3>
                   <p className="text-slate-400 font-mono text-sm leading-relaxed max-w-xl">{m.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
