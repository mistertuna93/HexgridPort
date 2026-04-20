import React from 'react'

const techs = [
  { name: 'React Three Fiber', category: 'WebGL' },
  { name: 'Tailwind CSS v4', category: 'Styling' },
  { name: 'Zustand', category: 'State' },
  { name: 'GSAP', category: 'Animation' },
  { name: 'Rust', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Database' },
]

export const ArsenalStack = () => {
  return (
    <div className="flex flex-col h-full text-white">
      <div className="mb-10 border-b border-white/20 pb-6">
        <h1 className="text-7xl font-black uppercase tracking-tighter m-0 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-300">
          Arsenal
        </h1>
        <p className="text-xl text-gray-400 font-mono mt-2">TECHNICAL_DEPENDENCIES_LOADED</p>
      </div>

      <div className="grid grid-cols-3 gap-4 h-full">
        {techs.map((tech, i) => (
          <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-[2rem] flex flex-col justify-center items-center hover:bg-white/10 hover:border-purple-500/50 transition-colors cursor-crosshair">
            <span className="text-purple-400 font-mono text-xs mb-2 tracking-widest uppercase">{tech.category}</span>
            <span className="text-xl font-bold text-center px-4">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
