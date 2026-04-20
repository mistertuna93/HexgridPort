import React, { useState } from 'react'
import { usePortfolioStore, presets } from '../../store/usePortfolioStore'

export const SettingsDashboard = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  const hexSize = usePortfolioStore((s) => s.hexSize)
  const gridSpacing = usePortfolioStore((s) => s.gridSpacing)
  const thickness = usePortfolioStore((s) => s.thickness)
  const waveFrequency = usePortfolioStore((s) => s.waveFrequency)
  const waveMagnitude = usePortfolioStore((s) => s.waveMagnitude)
  const waveDirection = usePortfolioStore((s) => s.waveDirection)
  const mouseInteraction = usePortfolioStore((s) => s.mouseInteraction)
  const theme = usePortfolioStore((s) => s.theme)
  
  const setParam = usePortfolioStore((s) => s.setParam)
  const setThemeParam = usePortfolioStore((s) => s.setThemeParam)
  const applyPreset = usePortfolioStore((s) => s.applyPreset)

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[999] bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full cursor-pointer backdrop-blur-md text-base font-bold shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-colors duration-200"
      >
        ❖ Config
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-black/40 backdrop-blur-xl border border-white/15 rounded-3xl p-6 w-[360px] text-white font-sans max-h-[85vh] overflow-y-auto shadow-[0_25px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4 custom-scrollbar">
      <div className="flex justify-between items-center mb-2">
        <h3 className="m-0 text-xl font-bold">System Config</h3>
        <button 
          onClick={() => setIsOpen(false)} 
          className="bg-transparent border-none text-white cursor-pointer text-lg opacity-70 hover:opacity-100 transition-opacity"
        >✕</button>
      </div>

      <div className="flex gap-2">
        {Object.keys(presets).map((p) => (
          <button 
            key={p} 
            onClick={() => applyPreset(p)}
            className="flex-1 py-2 px-2 rounded-xl cursor-pointer bg-white/5 hover:bg-white/20 text-white border border-white/20 capitalize text-sm font-bold transition-colors duration-200"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {[
          { label: 'Hex Size', key: 'hexSize', val: hexSize, min: 0.3, max: 2.5, step: 0.1 },
          { label: 'Grid Margin', key: 'gridSpacing', val: gridSpacing, min: 0.6, max: 1.0, step: 0.01 },
          { label: 'Thickness', key: 'thickness', val: thickness, min: 1.0, max: 10.0, step: 0.5 },
          { label: 'Wave Freq', key: 'waveFrequency', val: waveFrequency, min: 0.0, max: 2.0, step: 0.05 },
          { label: 'Ocean Height', key: 'waveMagnitude', val: waveMagnitude, min: 0.0, max: 8.0, step: 0.1 },
          { label: 'Wave Dir X', key: 'waveDirectionX', val: waveDirection.x, min: -2.0, max: 2.0, step: 0.1 },
          { label: 'Wave Dir Y', key: 'waveDirectionY', val: waveDirection.y, min: -2.0, max: 2.0, step: 0.1 },
        ].map((ctrl) => (
          <div key={ctrl.key} className="flex flex-col">
            <div className="flex justify-between text-sm mb-1 text-gray-300">
              <span>{ctrl.label}</span>
              <span className="text-white font-bold">{Number(ctrl.val).toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min={ctrl.min} max={ctrl.max} step={ctrl.step} 
              value={ctrl.val}
              onChange={(e) => {
                if (ctrl.key === 'waveDirectionX') {
                  const newDir = waveDirection.clone()
                  newDir.x = parseFloat(e.target.value)
                  setParam('waveDirection', newDir)
                } else if (ctrl.key === 'waveDirectionY') {
                  const newDir = waveDirection.clone()
                  newDir.y = parseFloat(e.target.value)
                  setParam('waveDirection', newDir)
                } else {
                  setParam(ctrl.key, parseFloat(e.target.value))
                }
              }}
              className="w-full cursor-pointer accent-white h-1.5 bg-white/20 rounded-lg appearance-none"
            />
          </div>
        ))}

        <div className="flex flex-col mt-2 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm mb-1 text-gray-300">
            <span>Mouse Mode</span>
            <span className="text-white font-bold">{['Motion', 'Color', 'Both'][mouseInteraction]}</span>
          </div>
          <input 
            type="range" 
            min="0" max="2" step="1" 
            value={mouseInteraction}
            onChange={(e) => setParam('mouseInteraction', parseInt(e.target.value))}
            className="w-full cursor-pointer accent-white h-1.5 bg-white/20 rounded-lg appearance-none"
          />
        </div>

        <div className="flex gap-4 mt-2 pt-4 border-t border-white/10">
          {[
            { label: 'Void', key: 'background', val: theme.background },
            { label: 'Grid', key: 'grid', val: theme.grid },
            { label: 'Pulse', key: 'accent', val: theme.accent }
          ].map((clr) => (
            <div key={clr.key} className="flex-1 flex flex-col gap-1.5">
              <span className="text-xs text-gray-300 text-center uppercase tracking-wider font-bold">{clr.label}</span>
              <input 
                type="color" 
                value={clr.val || '#ffffff'}
                onChange={(e) => setThemeParam(clr.key, e.target.value)}
                className="w-full h-8 border-none cursor-pointer bg-transparent"
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
