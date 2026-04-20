import { create } from 'zustand'
import * as THREE from 'three'

const defaultPages = [
  { id: 'about', vCoord: new THREE.Vector2(0, 0), theme: '#3b82f6' },
  { id: 'projects', vCoord: new THREE.Vector2(2, 2), theme: '#10b981' },
  { id: 'contact', vCoord: new THREE.Vector2(-2, -1), theme: '#ef4444' }
]

export const presets = {
  abyss: {
    theme: { background: '#09090b', grid: '#1f2937', accent: '#3b82f6' },
    layout: { hexSize: 1.0, gridSpacing: 0.95, waveSpeed: 1.5, waveHeight: 0.5, wallHeight: 50.0 }
  },
  cyber: {
    theme: { background: '#000000', grid: '#0f172a', accent: '#a855f7' },
    layout: { hexSize: 1.2, gridSpacing: 0.9, waveSpeed: 2.5, waveHeight: 1.2, wallHeight: 65.0 }
  },
  daylight: {
    theme: { background: '#f8fafc', grid: '#cbd5e1', accent: '#f59e0b' },
    layout: { hexSize: 0.8, gridSpacing: 0.98, waveSpeed: 0.8, waveHeight: 0.2, wallHeight: 30.0 }
  }
}

export const usePortfolioStore = create((set) => ({
  pages: defaultPages,
  view: 'GRID',
  activePageId: null,

  // Default injection
  theme: presets.abyss.theme,
  ...presets.abyss.layout,

  triggerZoom: (id) => set({ view: 'ZOOMED', activePageId: id }),
  resetView: () => set({ view: 'GRID' }),
  
  setParam: (key, value) => set({ [key]: value }),
  setThemeParam: (key, value) => set((state) => ({ theme: { ...state.theme, [key]: value } })),
  
  applyPreset: (presetId) => set(() => {
    const p = presets[presetId]
    if (!p) return {}
    return { theme: p.theme, ...p.layout }
  }),

  nextPage: () => set((state) => {
    if (!state.activePageId) return { activePageId: state.pages[0].id, view: 'ZOOMED' }
    const currentIndex = state.pages.findIndex(p => p.id === state.activePageId)
    const nextIndex = (currentIndex + 1) % state.pages.length
    return { activePageId: state.pages[nextIndex].id, view: 'ZOOMED' }
  }),
  
  prevPage: () => set((state) => {
    if (!state.activePageId) return { activePageId: state.pages[state.pages.length - 1].id, view: 'ZOOMED' }
    const currentIndex = state.pages.findIndex(p => p.id === state.activePageId)
    const prevIndex = (currentIndex - 1 + state.pages.length) % state.pages.length
    return { activePageId: state.pages[prevIndex].id, view: 'ZOOMED' }
  })
}))
