import * as THREE from 'three'

export const createNavigationSlice = (set, get) => ({
    view: 'GRID',
    activePageId: null,
    isTransitioning: false,
    lastCameraPos: new THREE.Vector3(0, 20, 0),
    targetZoom: null,
    targetPan: null,
    flightDuration: 2.0,

    triggerZoom: (pageId) => set({ activePageId: pageId, view: 'FOCUSING' }),
    triggerManualZoom: (yLevel) => set({ targetZoom: yLevel }),
    triggerManualPan: (x, z) => set({ targetPan: { x, z } }),

    transitionToPage: async (id) => {
        set({ isTransitioning: true })
        set({ activePageId: id, view: 'FOCUSING' })
        // Ensure smooth boolean reset
        setTimeout(() => set({ isTransitioning: false }), get().flightDuration * 1000)
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
        const prevIndex = currentIndex === 0 ? state.pages.length - 1 : currentIndex - 1
        state.transitionToPage(state.pages[prevIndex].id)
    }
})