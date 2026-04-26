import { create } from 'zustand'
import * as THREE from 'three'

const defaultPages = [
  { id: 'bio', vCoord: new THREE.Vector2(0, 0) },
  { id: 'projects', vCoord: new THREE.Vector2(42, 18) },
  { id: 'roadmap', vCoord: new THREE.Vector2(25, 55) },
  { id: 'arsenal', vCoord: new THREE.Vector2(-35, 38) },
  { id: 'contact', vCoord: new THREE.Vector2(-50, -15) }
]

const getW3CLuminance = (r, g, b) => {
  const a = [r, g, b].map(function (v) {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

const getContrastRatio = (l1, l2) => {
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (lightest + 0.05) / (darkest + 0.05);
}

const generatePageColors = (theme, mode) => {
  const accentColor = new THREE.Color(theme.accent)
  const troughColor = new THREE.Color(theme.trough)
  const peakColor = new THREE.Color(theme.peak)

  const troughHsl = {}
  troughColor.getHSL(troughHsl)
  const peakHsl = {}
  peakColor.getHSL(peakHsl)

  // Calculate the absolute safest Hue (Direct opposite of the theme)
  const avgThemeHue = (troughHsl.h + peakHsl.h) / 2.0
  const oppositeHue = (avgThemeHue + 0.5) % 1.0

  const hslGrid = {}
  new THREE.Color().lerpColors(troughColor, peakColor, 0.5).getHSL(hslGrid)
  const gridLum = getW3CLuminance(troughColor.r, troughColor.g, troughColor.b)

  const hslAccent = {}
  accentColor.getHSL(hslAccent)

  return defaultPages.map((page, index) => {
    const color = new THREE.Color()

    if (mode === 'uniform') {
      color.copy(accentColor)
    } else if (mode === 'monochrome') {
      color.setHex(hslGrid.l < 0.5 ? 0xffffff : 0x000000)
    } else { // prismatic
      // Intelligently distribute hues strictly centered around the safe opposite hue
      const shift = (index - Math.floor(defaultPages.length / 2)) * 0.11 // Tighten spread slightly to ensure all 5 colors fit safely on the opposite side of the wheel
      color.setHSL((oppositeHue + shift + 1.0) % 1.0, 1.0, 0.6)
    }

    // Strict isolation enforcement ONLY for uniform mode (Prismatic is already mathematically safe)
    if (mode === 'uniform') {
      const finalHsl = {}
      color.getHSL(finalHsl)

      const distTrough = Math.min(Math.abs(finalHsl.h - troughHsl.h), 1.0 - Math.abs(finalHsl.h - troughHsl.h))
      const distPeak = Math.min(Math.abs(finalHsl.h - peakHsl.h), 1.0 - Math.abs(finalHsl.h - peakHsl.h))

      // If the user's chosen color is within 20% of EITHER the peak or trough hue, shove it to the opposite hue!
      if (distTrough < 0.2 || distPeak < 0.2) {
        finalHsl.h = oppositeHue
        color.setHSL(finalHsl.h, finalHsl.s, finalHsl.l)
      }
    }

    // W3C Accessibility Contrast Enforcer (Lightness) applies to ALL colors
    const nodeLum = getW3CLuminance(color.r, color.g, color.b)
    const ratio = getContrastRatio(nodeLum, gridLum)

    if (ratio < 4.5) {
      const finalHsl = {}
      color.getHSL(finalHsl)
      finalHsl.l = hslGrid.l < 0.5 ? Math.max(0.7, finalHsl.l + 0.4) : Math.min(0.3, finalHsl.l - 0.4)
      color.setHSL(finalHsl.h, finalHsl.s, finalHsl.l)
    }

    return { ...page, theme: '#' + color.getHexString() }
  })
}

export const presets = {
  purps: {
    theme: { background: '#09090b', trough: '#400040', peak: '#008040', accent: '#00ff80', fogColor: '#09090b', wireframeColor: '#00ff80' },
    layout: {
      hexSize: 1.5, gridSpacing: 0.75, thickness: 4,
      waveSpeed: 1.0, waveFrequency: 0.05, waveMagnitude: 5.1, waveDirection: new THREE.Vector2(1.0, 1.0),
      mouseMotion: true, mouseMotionDepth: 7.0,
      mouseColor: false, mouseColorTint: '#ffffff',
      mouseLighting: false, mouseLightingIntensity: 2.0,
      mouseRadius: 7.0,
      colorBlendBias: 0.35, fogDensity: 0.02, radialFalloff: 0.0, showWireframe: false, wireframeOpacity: 0.5, nodeColorMode: 'prismatic'
    }
  },
  cyberpunk: {
    theme: { background: '#000000', trough: '#0f172a', peak: '#1e1b4b', accent: '#22d3ee', fogColor: '#000000', wireframeColor: '#22d3ee' },
    layout: {
      hexSize: 1.2, gridSpacing: 0.9, thickness: 6,
      waveSpeed: 2.0, waveFrequency: 0.5, waveMagnitude: 1.5, waveDirection: new THREE.Vector2(0.5, 2.0),
      mouseMotion: true, mouseMotionDepth: 5.0,
      mouseColor: true, mouseColorTint: '#00ffff',
      mouseLighting: true, mouseLightingIntensity: 3.5,
      mouseRadius: 15.0,
      colorBlendBias: 0.5, fogDensity: 0.05, radialFalloff: 0.8, showWireframe: true, wireframeOpacity: 0.8, nodeColorMode: 'uniform'
    }
  },
  minimal: {
    theme: { background: '#f8fafc', trough: '#cbd5e1', peak: '#f1f5f9', accent: '#f59e0b', fogColor: '#f8fafc', wireframeColor: '#94a3b8' },
    layout: {
      hexSize: 0.8, gridSpacing: 0.98, thickness: 2,
      waveSpeed: 0.5, waveFrequency: 0.2, waveMagnitude: 0.2, waveDirection: new THREE.Vector2(1.0, 0.0),
      mouseMotion: true, mouseMotionDepth: 1.5,
      mouseColor: false, mouseColorTint: '#000000',
      mouseLighting: false, mouseLightingIntensity: 0.0,
      mouseRadius: 8.0,
      colorBlendBias: 0.2, fogDensity: 0.0, radialFalloff: 0.0, showWireframe: false, wireframeOpacity: 0.2, nodeColorMode: 'monochrome'
    }
  }
}

// Persisted Store Hydration
const loadPersistedState = () => {
  try {
    const defaultPresetStr = localStorage.getItem('userDefaultPreset')
    const userPresetsStr = localStorage.getItem('userPresets')

    let defaultPreset = null
    let customPresets = {}

    if (defaultPresetStr) defaultPreset = JSON.parse(defaultPresetStr)
    if (userPresetsStr) customPresets = JSON.parse(userPresetsStr)

    return { defaultPreset, customPresets }
  } catch (e) {
    console.warn("Failed to load local presets", e)
    return { defaultPreset: null, customPresets: {} }
  }
}

const { defaultPreset, customPresets } = loadPersistedState()

const getInitialLayout = (dPreset) => {
  if (dPreset && dPreset.layout) {
    return {
      ...dPreset.layout,
      waveDirection: new THREE.Vector2(dPreset.layout.waveDirection.x, dPreset.layout.waveDirection.y)
    }
  }
  return presets.purps.layout
}

const initialLayout = getInitialLayout(defaultPreset)
const initialTheme = defaultPreset ? defaultPreset.theme : presets.purps.theme

export const usePortfolioStore = create((set, get) => ({
  pages: generatePageColors(initialTheme, initialLayout.nodeColorMode),
  view: 'GRID',
  activePageId: null,
  hoverPoint: null,
  isCursorInside: false,
  isPointerOverUI: false,
  isHomeOpen: true,

  theme: initialTheme,
  ...initialLayout,

  userPresets: customPresets,

  isTransitioning: false,
  flightDuration: 1.2,
  lastCameraPos: new THREE.Vector3(0, 20, 0),
  targetZoom: null,
  targetPan: null,
  triggerManualPan: (x, z) => set({ targetPan: { x, z } }),
  triggerManualZoom: (yLevel) => set({ targetZoom: yLevel }),

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
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      set({ flightDuration: Math.max(1.2, dist / 25.0) })
    }

    // Phase 1 - Fade UI and wait if we are in a zoomed or growing state
    if (state.view === 'ZOOMED' || state.view === 'GROWING' || state.view === 'FOCUSING') {
      set({ view: 'FADING_UI' }) // Pulls UI away gracefully
      await new Promise(r => setTimeout(r, 600))
    }

    // Phase 2 - Camera safely physically glides into tracking position
    set({ view: 'FOCUSING', activePageId: id })
  },

  triggerZoom: (id) => get().transitionToPage(id),

  resetView: async () => {
    const state = get()
    if (state.isTransitioning || state.view === 'GRID') return

    set({ isTransitioning: true })

    set({ view: 'FADING_UI' }) // Fades UI securely natively
    await new Promise(r => setTimeout(r, 600))

    set({ view: 'GRID', activePageId: null }) // Glides Camera backwards organically entirely gutted 
    await new Promise(r => setTimeout(r, 600)) // Shrink animation mapped natively cleanly securely

    set({ isTransitioning: false }) // Cleanly wipe memory after tile successfully docks 
  },

  closeHome: () => set({ isHomeOpen: false }),

  setParam: (key, value) => {
    set({ [key]: value })
    if (key === 'nodeColorMode') get().syncPageColors()
  },
  setThemeParam: (key, value) => {
    set((state) => ({ theme: { ...state.theme, [key]: value } }))
    if (['accent', 'trough', 'peak'].includes(key)) get().syncPageColors()
  },
  syncPageColors: () => {
    const { theme, nodeColorMode } = get()
    set({ pages: generatePageColors(theme, nodeColorMode) })
  },
  setHoverPoint: (point) => {
    if (!get().isTransitioning) set({ hoverPoint: point })
  },

  applyPreset: (presetId, isCustom = false) => set((state) => {
    const p = isCustom ? state.userPresets[presetId] : presets[presetId]
    if (!p) return {}
    return {
      theme: p.theme,
      ...p.layout,
      waveDirection: new THREE.Vector2(p.layout.waveDirection.x, p.layout.waveDirection.y),
      pages: generatePageColors(p.theme, p.layout.nodeColorMode)
    }
  }),

  saveUserPreset: (name) => {
    const state = get()
    const newPreset = {
      theme: state.theme,
      layout: {
        hexSize: state.hexSize, gridSpacing: state.gridSpacing, thickness: state.thickness,
        waveSpeed: state.waveSpeed, waveFrequency: state.waveFrequency, waveMagnitude: state.waveMagnitude,
        waveDirection: { x: state.waveDirection.x, y: state.waveDirection.y },
        mouseMotion: state.mouseMotion, mouseMotionDepth: state.mouseMotionDepth,
        mouseColor: state.mouseColor, mouseColorTint: state.mouseColorTint,
        mouseLighting: state.mouseLighting, mouseLightingIntensity: state.mouseLightingIntensity,
        mouseRadius: state.mouseRadius,
        colorBlendBias: state.colorBlendBias, fogDensity: state.fogDensity,
        radialFalloff: state.radialFalloff, showWireframe: state.showWireframe,
        wireframeOpacity: state.wireframeOpacity, nodeColorMode: state.nodeColorMode
      }
    }

    const updatedPresets = { ...state.userPresets, [name]: newPreset }
    set({ userPresets: updatedPresets })
    localStorage.setItem('userPresets', JSON.stringify(updatedPresets))
  },

  deleteUserPreset: (name) => {
    const { userPresets } = get()
    const updated = { ...userPresets }
    delete updated[name]
    set({ userPresets: updated })
    localStorage.setItem('userPresets', JSON.stringify(updated))
  },

  setDefaultPreset: () => {
    const state = get()
    const currentAsDefault = {
      theme: state.theme,
      layout: {
        hexSize: state.hexSize, gridSpacing: state.gridSpacing, thickness: state.thickness,
        waveSpeed: state.waveSpeed, waveFrequency: state.waveFrequency, waveMagnitude: state.waveMagnitude,
        waveDirection: { x: state.waveDirection.x, y: state.waveDirection.y },
        mouseMotion: state.mouseMotion, mouseMotionDepth: state.mouseMotionDepth,
        mouseColor: state.mouseColor, mouseColorTint: state.mouseColorTint,
        mouseLighting: state.mouseLighting, mouseLightingIntensity: state.mouseLightingIntensity,
        mouseRadius: state.mouseRadius,
        colorBlendBias: state.colorBlendBias, fogDensity: state.fogDensity,
        radialFalloff: state.radialFalloff, showWireframe: state.showWireframe,
        wireframeOpacity: state.wireframeOpacity, nodeColorMode: state.nodeColorMode
      }
    }
    localStorage.setItem('userDefaultPreset', JSON.stringify(currentAsDefault))
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
}))
