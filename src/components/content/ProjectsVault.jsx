import React from 'react'

const projects = [
  { title: "Project Alpha", desc: "Quantum networking interface built exclusively on spatial grids.", color: "from-emerald-400 to-teal-500" },
  { title: "Project Beta", desc: "Automated neural routing array for instantaneous data propagation.", color: "from-cyan-400 to-blue-500" },
  { title: "Project Gamma", desc: "Dynamic memory allocation engine deployed in WebAssembely natively.", color: "from-green-400 to-emerald-500" },
  { title: "Project Delta", desc: "BFT Consensus protocol dashboard visualized via WebGL fragment shaders.", color: "from-teal-300 to-cyan-500" },
]

export const ProjectsVault = () => {
  return (
    <div className="flex flex-col h-full text-white">
      <div className="mb-10 flex justify-between items-end border-b border-white/10 pb-6">
        <div>
           <h1 className="text-7xl font-black uppercase tracking-tighter m-0 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
             Vault
           </h1>
           <p className="text-lg text-emerald-400 font-mono mt-2 opacity-80 tracking-widest">AUTHORIZED_ACCESS_ONLY</p>
        </div>
        <div className="hidden md:flex gap-2">
           <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
           <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
           <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full content-start">
         {projects.map((p, i) => (
            <div key={i} className="group relative rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 hover:bg-black/60 hover:border-white/30 backdrop-blur-md transition-all duration-500 cursor-pointer h-56 flex flex-col justify-end">
               {/* Hover Dynamic Glow Backdrop */}
               <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
               
               <div className="p-8 relative z-10 w-full h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-black mb-3">{p.title}</h3>
                    <p className="text-slate-300 font-mono text-sm leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="w-full flex justify-end">
                     <span className="text-white font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                        DECRYPT_ARCHIVE &rarr;
                     </span>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  )
}
