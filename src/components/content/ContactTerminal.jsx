import React from 'react'

export const ContactTerminal = () => {
  return (
    <div className="flex flex-col h-full text-white font-mono">
      <div className="mb-8 flex items-center justify-between border-b border-red-500/20 pb-6">
         <div className="flex items-center gap-4">
            <div className="w-5 h-5 bg-red-500 rounded-sm animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
            <h1 className="text-6xl font-black uppercase tracking-widest text-red-500 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300 m-0">
              Uplink
            </h1>
         </div>
         <div className="text-red-500/50 tracking-widest">PORT_OPEN</div>
      </div>

      <div className="flex-1 bg-black/80 border border-red-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-center">
         {/* Internal Terminal Grid Texture mapped securely via pure CSS */}
         <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
         
         <div className="relative z-10 w-full max-w-3xl mx-auto space-y-8">
            <div className="space-y-3 group">
               <label className="text-red-400 text-sm tracking-widest flex items-center gap-2">
                 <span className="text-red-600 font-black">{'> '}</span>ENTER_SECURE_ID_
               </label>
               <input type="text" className="w-full bg-red-950/20 border-b-2 border-red-900/50 px-4 py-4 text-white focus:outline-none focus:border-red-500 focus:bg-red-900/20 transition-all placeholder:text-red-900/50 font-bold" placeholder="Identity hash :: [Name]..." />
            </div>
            
            <div className="space-y-3 group">
               <label className="text-red-400 text-sm tracking-widest flex items-center gap-2">
                 <span className="text-red-600 font-black">{'> '}</span>TRANSMIT_PAYLOAD_
               </label>
               <textarea rows="6" className="w-full bg-red-950/20 border-2 border-red-900/50 px-4 py-4 text-white focus:outline-none focus:border-red-500 focus:bg-red-900/20 transition-all placeholder:text-red-900/50 custom-scrollbar resize-none font-bold" placeholder="Encrypted message package..."></textarea>
            </div>
            
            <div className="flex justify-between items-center pt-6">
               <div className="text-red-700 text-sm font-bold tracking-widest animate-pulse">
                  STATUS :: WAITING_FOR_INPUT
               </div>
               <button className="bg-red-600/20 border border-red-500 hover:bg-red-600 text-white font-black tracking-widest px-10 py-4 uppercase transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] cursor-pointer">
                 Execute_Send  [ENTER]
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
