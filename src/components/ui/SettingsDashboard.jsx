import React, { useState } from 'react'
import { usePortfolioStore, presets } from '../../store/usePortfolioStore'

export const SettingsDashboard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('layout') // 'layout', 'animation', 'theme', 'mouse', 'presets'
  const [presetName, setPresetName] = useState('')
  
  const state = usePortfolioStore()
  
  if (!isOpen) {
    return (
      <div 
        className="fixed bottom-8 right-8 z-[999] flex gap-4"
        onPointerEnter={() => usePortfolioStore.setState({ isPointerOverUI: true })}
        onPointerLeave={() => usePortfolioStore.setState({ isPointerOverUI: false })}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); usePortfolioStore.setState({ isHomeOpen: true }) }}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-12 h-12 rounded-full cursor-pointer backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 flex items-center justify-center"
          title="Open Welcome View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsOpen(true) }}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-12 h-12 rounded-full cursor-pointer backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 flex items-center justify-center"
          title="Configure Environment"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'layout', label: 'Grid' },
    { id: 'animation', label: 'Animation' },
    { id: 'theme', label: 'Theme' },
    { id: 'mouse', label: 'Mouse' },
    { id: 'presets', label: 'Presets' }
  ]

  const renderSlider = (label, key, min, max, step, tooltip) => (
    <div key={key} className="flex flex-col group mb-4 last:mb-0" title={tooltip}>
      <div className="flex justify-between text-sm mb-1.5 text-gray-300 group-hover:text-white transition-colors">
        <span>{label}</span>
        <span className="text-white font-mono bg-black/30 px-2 py-0.5 rounded-md text-xs">{Number(state[key]).toFixed(2)}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} 
        value={state[key]}
        onChange={(e) => usePortfolioStore.setState({ [key]: parseFloat(e.target.value) })}
        className="w-full cursor-pointer accent-white h-1.5 bg-white/20 hover:bg-white/30 rounded-lg appearance-none transition-colors"
      />
    </div>
  )

  const renderColor = (label, key, tooltip) => (
    <div key={key} className="flex justify-between items-center mb-3 p-2 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors" title={tooltip}>
      <span className="text-sm text-gray-300 font-medium ml-2">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-gray-500 uppercase">{state.theme[key]}</span>
        <input 
          type="color" 
          value={state.theme[key]} 
          onChange={(e) => {
            const newTheme = { ...state.theme, [key]: e.target.value }
            usePortfolioStore.setState({ theme: newTheme })
          }}
          className="w-8 h-8 rounded-full border-2 border-white/20 cursor-pointer overflow-hidden p-0 bg-transparent"
        />
      </div>
    </div>
  )

  const renderToggle = (label, key, tooltip) => (
    <div key={key} className="flex items-center justify-between mb-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer" title={tooltip} onClick={() => usePortfolioStore.setState({ [key]: !state[key] })}>
      <span className="text-sm font-bold text-white">{label}</span>
      <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${state[key] ? 'bg-blue-500' : 'bg-gray-600'}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300 ${state[key] ? 'left-6' : 'left-1'}`} />
      </div>
    </div>
  )

  return (
    <div 
      className="fixed bottom-6 right-6 z-[999] bg-black/70 backdrop-blur-3xl border border-white/20 rounded-3xl w-[400px] text-white font-sans shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8"
      onClick={(e) => e.stopPropagation()}
      onPointerEnter={() => usePortfolioStore.setState({ isPointerOverUI: true })}
      onPointerLeave={() => usePortfolioStore.setState({ isPointerOverUI: false })}
    >
      
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
        <h3 className="m-0 text-lg font-bold tracking-tight">System Core</h3>
        <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-white transition-colors">✕</button>
      </div>

      {/* Tabs Nav */}
      <div className="flex px-2 pt-2 border-b border-white/10 overflow-x-auto custom-scrollbar">
        {tabs.map(t => (
          <button 
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === t.id ? 'border-blue-400 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
        
        {activeTab === 'layout' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderSlider('Hex Size', 'hexSize', 0.3, 2.5, 0.1, 'The physical radius of every individual hexagon.')}
            {renderSlider('Grid Spacing', 'gridSpacing', 0.6, 1.0, 0.01, 'The gap size between hexagons.')}
            {renderSlider('Thickness', 'thickness', 1.0, 10.0, 0.5, 'How far the hexagons extend downwards into the abyss.')}
          </div>
        )}

        {activeTab === 'animation' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderSlider('Wave Frequency', 'waveFrequency', 0.0, 2.0, 0.05, 'How tightly packed the liquid waves are across the grid.')}
            {renderSlider('Wave Speed', 'waveSpeed', 0.0, 5.0, 0.1, 'How fast the liquid waves travel across the environment.')}
            {renderSlider('Wave Magnitude', 'waveMagnitude', 0.0, 8.0, 0.1, 'The maximum height displacement of the waves.')}
            
            <div className="mt-6 pt-4 border-t border-white/10" title="The mathematical direction vector the waves travel along.">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Direction Vector</span>
              <div className="flex flex-col group mb-4">
                <div className="flex justify-between text-sm mb-1.5 text-gray-300">
                  <span>Dir X</span><span className="text-xs font-mono bg-black/30 px-2 rounded">{Number(state.waveDirection.x).toFixed(2)}</span>
                </div>
                <input type="range" min="-2" max="2" step="0.1" value={state.waveDirection.x} onChange={(e) => usePortfolioStore.setState({ waveDirection: { x: parseFloat(e.target.value), y: state.waveDirection.y } })} className="w-full accent-white h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div className="flex flex-col group mb-4">
                <div className="flex justify-between text-sm mb-1.5 text-gray-300">
                  <span>Dir Y</span><span className="text-xs font-mono bg-black/30 px-2 rounded">{Number(state.waveDirection.y).toFixed(2)}</span>
                </div>
                <input type="range" min="-2" max="2" step="0.1" value={state.waveDirection.y} onChange={(e) => usePortfolioStore.setState({ waveDirection: { x: state.waveDirection.x, y: parseFloat(e.target.value) } })} className="w-full accent-white h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-2">
            
            <div className="mb-4 bg-black/20 p-3 rounded-2xl border border-white/5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Topography & Base</span>
              {renderColor('Background / Void', 'background', 'The solid infinite void color behind the grid.')}
              {renderColor('Wave Peak Color', 'peak', 'The color of the hexagons at the highest crest of the waves.')}
              {renderColor('Wave Trough Color', 'trough', 'The color of the hexagons at the deepest depths of the grid.')}
              {renderSlider('Gradient Bias', 'colorBlendBias', 0.0, 1.0, 0.05, 'Shifts the color gradient between peaks and troughs.')}
            </div>
            
            <div className="mb-4 bg-black/20 p-3 rounded-2xl border border-white/5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Atmosphere & Fading</span>
              {renderColor('Atmospheric Fog', 'fogColor', 'The color of the atmospheric fog enveloping the grid.')}
              {renderSlider('Fog Density', 'fogDensity', 0.0, 0.1, 0.005, 'How thick the fog is.')}
              {renderSlider('Radial Fading', 'radialFalloff', 0.0, 1.0, 0.05, 'Dims the edges of the grid into pitch black shadows.')}
            </div>
            
            <div className="mb-4 bg-black/20 p-3 rounded-2xl border border-white/5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Data Nodes & Highlights</span>
              {renderColor('Global Accent Color', 'accent', 'The foundational bright highlight color used for interactions and data nodes.')}
              
              <div className="mt-3 flex justify-between items-center pr-2" title="The color mode for the 5 interactive floating data nodes.">
                <span className="text-sm text-gray-300 font-medium ml-2">Node Color Palette</span>
                <select 
                  value={state.nodeColorMode} 
                  onChange={(e) => usePortfolioStore.getState().setParam('nodeColorMode', e.target.value)}
                  className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="uniform">Uniform (Matches Accent)</option>
                  <option value="prismatic">Prismatic (Rainbow Shift)</option>
                  <option value="monochrome">Monochrome (Pure B/W)</option>
                </select>
              </div>
            </div>
            
            <div className="mb-2 bg-black/20 p-3 rounded-2xl border border-white/5">
               {renderToggle('Structural Wireframe', 'showWireframe', 'Renders a glowing, independent wireframe overlay across the grid.')}
               {state.showWireframe && (
                 <div className="mt-2 pl-2">
                    {renderColor('Wireframe Tint', 'wireframeColor', 'The color of the wireframe lines.')}
                    {renderSlider('Opacity', 'wireframeOpacity', 0.0, 1.0, 0.05, 'The transparency of the wireframe stroke.')}
                 </div>
               )}
            </div>
            
          </div>
        )}

        {activeTab === 'mouse' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderSlider('Effect Radius', 'mouseRadius', 1.0, 30.0, 1.0, 'The physical blast radius of the mouse cursor affecting the grid.')}
            <div className="my-4 border-b border-white/10" />

            {/* Motion */}
            <div className="mb-4 bg-black/20 p-3 rounded-2xl border border-white/5">
               {renderToggle('Physical Depth Motion', 'mouseMotion', 'Forces the hexagons to physically retreat away from your cursor.')}
               {state.mouseMotion && <div className="mt-2 pl-2">{renderSlider('Dip Depth', 'mouseMotionDepth', 0.0, 10.0, 0.5, 'How deep the hole created by your cursor goes.')}</div>}
            </div>

            {/* Color Tint */}
            <div className="mb-4 bg-black/20 p-3 rounded-2xl border border-white/5">
               {renderToggle('Base Color Shift', 'mouseColor', 'Smoothly overrides the physical material color of the hexagons beneath the cursor.')}
               {state.mouseColor && (
                  <div className="mt-2 pl-2 flex justify-between items-center pr-2" title="The specific tint color applied to the cursor area.">
                     <span className="text-sm text-gray-400">Tint Color</span>
                     <input type="color" value={state.mouseColorTint} onChange={(e) => usePortfolioStore.setState({ mouseColorTint: e.target.value })} className="w-8 h-8 rounded-full border border-white/20 bg-transparent cursor-pointer" />
                  </div>
               )}
            </div>

            {/* Emissive Lighting */}
            <div className="mb-2 bg-black/20 p-3 rounded-2xl border border-white/5">
               {renderToggle('Emissive Core Glow', 'mouseLighting', 'Attaches a bright additive neon light source to your cursor.')}
               {state.mouseLighting && <div className="mt-2 pl-2">{renderSlider('Glow Intensity', 'mouseLightingIntensity', 0.0, 10.0, 0.5, 'How bright the emissive neon glow burns.')}</div>}
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Save Custom Preset</span>
            <div className="flex gap-2 mb-6">
               <input 
                  type="text" 
                  value={presetName} 
                  onChange={e => setPresetName(e.target.value)} 
                  placeholder="Preset Name..." 
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
               />
               <button 
                  onClick={() => {
                     if (presetName.trim()) {
                        state.saveUserPreset(presetName.trim())
                        setPresetName('')
                     }
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors cursor-pointer"
               >Save</button>
            </div>

            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">My Presets</span>
            <div className="grid grid-cols-2 gap-2 mb-6">
               {Object.keys(state.userPresets || {}).map(p => (
                  <div key={p} className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                     <button onClick={() => state.applyPreset(p, true)} className="flex-1 py-2 px-3 text-sm font-semibold hover:bg-white/10 text-left truncate cursor-pointer">{p}</button>
                     <button onClick={() => state.deleteUserPreset(p)} className="bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white px-3 transition-colors cursor-pointer">✕</button>
                  </div>
               ))}
               {Object.keys(state.userPresets || {}).length === 0 && (
                  <span className="text-xs text-gray-500 italic col-span-2 py-2">No custom presets saved.</span>
               )}
            </div>

            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">System Defaults</span>
            <div className="grid grid-cols-2 gap-2 mb-6">
               {Object.keys(presets).map(p => (
                  <button key={p} onClick={() => state.applyPreset(p)} className="bg-white/5 border border-white/10 hover:border-blue-400/50 hover:bg-white/10 rounded-xl py-2 px-3 text-sm font-semibold capitalize text-left transition-colors truncate cursor-pointer">
                     {p}
                  </button>
               ))}
            </div>
            
            <div className="pt-4 border-t border-white/10 mt-2">
               <button onClick={() => {
                  state.setDefaultPreset()
                  alert('Default preset saved! This configuration will load on startup.')
               }} className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  Set Current As Default
               </button>
               <p className="text-[10px] text-gray-500 text-center mt-2 leading-tight">This will permanently set your current configuration to load on startup.</p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  )
}
