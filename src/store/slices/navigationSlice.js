import * as THREE from 'three'

export const createNavigationSlice = (set, get) => ({
  view: 'ZOOMED',
  activePageId: 'home',
  isTransitioning: false,
  flightDuration: 1.2,
  lastCameraPos: new THREE.Vector3(0, 20, 0),
  targetZoom: null,
  targetPan: null,

  transitionToPage: async (id) => {
    const state = get()
    if (state.isTransitioning || (state.activePageId === id && state.view === 'ZOOMED')) return
    set({ isTransitioning: true })

    const fromPos = state.lastCameraPos
    const page = state.pages.find(p => p.id === id)
    if (page && fromPos) {
      const r = state.hexSize || 1.0
      const hexWidth = Math.sqrt(3) * r
      const modRow = ((page.vCoord.y % 2) + 2) % 2
      const targetX = (page.vCoord.x + modRow * 0.5) * hexWidth
      const targetZ = page.vCoord.y * 1.5 * r
      const dist = Math.sqrt(Math.pow(targetX - fromPos.x, 2) + Math.pow(22 - fromPos.y, 2) + Math.pow((targetZ + 15) - fromPos.z, 2))
      set({ flightDuration: Math.max(1.2, dist / 25.0) })
    }

    if (state.view === 'ZOOMED' || state.view === 'GROWING' || state.view === 'FOCUSING') {
      set({ view: 'FADING_UI' })
      await new Promise(r => setTimeout(r, 600))
    }
    set({ view: 'FOCUSING', activePageId: id })
  },

  triggerZoom: (id) => get().transitionToPage(id),
  triggerManualZoom: (yLevel) => set({ targetZoom: yLevel }),
  triggerManualPan: (x, z) => set({ targetPan: { x, z } }),
  openHome: () => get().transitionToPage('home'),

  resetView: async () => {
    const state = get()
    if (state.isTransitioning || state.view === 'GRID') return
    set({ isTransitioning: true, view: 'FADING_UI' })
    await new Promise(r => setTimeout(r, 600))
    set({ view: 'GRID', activePageId: null })
    await new Promise(r => setTimeout(r, 600))
    set({ isTransitioning: false })
  },

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
})
