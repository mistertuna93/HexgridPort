import { create } from 'zustand'
import * as THREE from 'three'

const defaultPages = [
  { id: 'bio', vCoord: new THREE.Vector2(0, 0), theme: '#3b82f6' },
  { id: 'projects', vCoord: new THREE.Vector2(42, 18), theme: '#10b981' },
  { id: 'roadmap', vCoord: new THREE.Vector2(25, 55), theme: '#f59e0b' },
  { id: 'arsenal', vCoord: new THREE.Vector2(-35, 38), theme: '#a855f7' },
  { id: 'contact', vCoord: new THREE.Vector2(-50, -15), theme: '#ef4444' }
]

export const presets = {
  cinematic: {
    theme: { background: '#09090b', grid: '#1f2937', accent: '#3b82f6' },
    layout: { 
      hexSize: 1.0, gridSpacing: 0.95, thickness: 4, 
      waveSpeed: 1.0, waveFrequency: 0.3, waveMagnitude: 0.8, waveDirection: new THREE.Vector2(1.0, 1.0), 
      mouseInteraction: 2, wallHeight: 50.0 
    }
  },
  cyberpunk: { 
    theme: { background: '#000000', grid: '#0f172a', accent: '#22d3ee' }, // Brighter cyan accent
    layout: { 
      hexSize: 1.2, gridSpacing: 0.9, thickness: 6, 
      waveSpeed: 2.0, waveFrequency: 0.5, waveMagnitude: 1.5, waveDirection: new THREE.Vector2(0.5, 2.0), 
      mouseInteraction: 2, wallHeight: 65.0 
    }
  },
  minimal: {
    theme: { background: '#f8fafc', grid: '#cbd5e1', accent: '#f59e0b' },
    layout: { 
      hexSize: 0.8, gridSpacing: 0.98, thickness: 2, 
      waveSpeed: 0.5, waveFrequency: 0.2, waveMagnitude: 0.2, waveDirection: new THREE.Vector2(1.0, 0.0), 
      mouseInteraction: 0, wallHeight: 30.0 
    }
  }
}

export const usePortfolioStore = create((set, get) => ({
  pages: defaultPages,
  view: 'GRID',
  activePageId: null,
  hoverPoint: null,
  isCursorInside: false,

  // Default injection maps to Cinematic Base
  theme: presets.cinematic.theme,
  ...presets.cinematic.layout,

  isTransitioning: false,
  flightDuration: 1.2,
  lastCameraPos: new THREE.Vector3(0, 20, 0),

  transitionToPage: async (id) => {
    const state = get()
    if (state.isTransitioning || (state.activePageId === id && state.view === 'ZOOMED')) return
    
    set({ isTransitioning: true })
    
    // Calculate the physical flight duration natively from the tracked camera position
    const fromPos = state.lastCameraPos
    const page = state.pages.find(p => p.id === id)
    if (page && fromPos) {
       const r = state.hexSize || 1.0
       const hexWidth = Math.sqrt(3) * r
       const modRow = ((page.vCoord.y % 2) + 2) % 2
       const targetX = (page.vCoord.x + modRow * 0.5) * hexWidth
       const targetZ = page.vCoord.y * 1.5 * r
       
       const dx = targetX - fromPos.x
       const dz = (targetZ + 15) - fromPos.z
       const dy = 22 - fromPos.y
       const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
       set({ flightDuration: Math.max(1.2, dist / 25.0) })
    }

    // Return back to general Grid configuration physically bridging the transition
    if (state.view === 'ZOOMED' || state.view === 'FOCUSING') {
       set({ view: 'FOCUSING' }) // Pulls UI away gracefully
       await new Promise(r => setTimeout(r, 600))
       // Bypasses origin return to strictly mathematically glide directly cleanly node to node natively
    }
    
    // Phase 1 - Camera safely physically glides into tracking position cleanly independently
    set({ view: 'FOCUSING', activePageId: id })
    // Exact mapping completely mathematically cleanly natively executed implicitly dynamically mapping cleanly organically internally by the CameraController onComplete explicitly!
  },

  triggerZoom: (id) => get().transitionToPage(id),
  
  resetView: async () => {
    const state = get()
    if (state.isTransitioning || state.view === 'GRID') return
    
    set({ isTransitioning: true })
    
    set({ view: 'FOCUSING' }) // Fades UI securely natively
    await new Promise(r => setTimeout(r, 600))
    
    set({ view: 'GRID', activePageId: null }) // Glides Camera backwards organically entirely gutted 
    await new Promise(r => setTimeout(r, 600)) // Shrink animation mapped natively cleanly securely
    
    set({ isTransitioning: false }) // Cleanly wipe memory after tile successfully docks 
  },
  
  setParam: (key, value) => set({ [key]: value }),
  setThemeParam: (key, value) => set((state) => ({ theme: { ...state.theme, [key]: value } })),
  setHoverPoint: (point) => {
    if (!get().isTransitioning) set({ hoverPoint: point })
  },
  
  applyPreset: (presetId) => set(() => {
    const p = presets[presetId]
    if (!p) return {}
    return { theme: p.theme, ...p.layout }
  }),

  nextPage: () => {
    const state = get()
    if (state.isTransitioning) return
    
    if (!state.activePageId) {
      state.transitionToPage(state.pages[0].id)
      return
    }
    const currentIndex = state.pages.findIndex(p => p.id === state.activePageId)
    const nextIndex = (currentIndex + 1) % state.pages.length
    state.transitionToPage(state.pages[nextIndex].id)
  },
  
  prevPage: () => {
    const state = get()
    if (state.isTransitioning) return
    
    if (!state.activePageId) {
      state.transitionToPage(state.pages[state.pages.length - 1].id)
      return
    }
    const currentIndex = state.pages.findIndex(p => p.id === state.activePageId)
    const prevIndex = (currentIndex - 1 + state.pages.length) % state.pages.length
    state.transitionToPage(state.pages[prevIndex].id)
  }
}))
