import { create } from 'zustand'

export const usePortfolioStore = create((set) => ({
  // Centralized hub for pages mapped to logical hexagon grid coordinates
  pages: [
    { id: 'intro', vCoord: { x: 0, y: 0 }, theme: '#ff4c4c' }, // Center origin
    { id: 'about', vCoord: { x: 2, y: 3 }, theme: '#4cff4c' }, 
    { id: 'projects', vCoord: { x: -3, y: -2 }, theme: '#4c4cff' },
  ],
  
  // App state
  view: 'GRID', // 'GRID' | 'ZOOMED'
  activePageId: null,

  // Actions
  triggerZoom: (id) => set({ activePageId: id, view: 'ZOOMED' }),
  resetView: () => set({ activePageId: null, view: 'GRID' })
}))
