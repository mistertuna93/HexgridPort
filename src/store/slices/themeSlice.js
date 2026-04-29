import * as THREE from 'three'

export const defaultPages = [
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

export const generatePageColors = (theme, mode) => {
  const accentColor = new THREE.Color(theme.accent)
  const troughColor = new THREE.Color(theme.trough)
  const peakColor = new THREE.Color(theme.peak)

  const troughHsl = {}; troughColor.getHSL(troughHsl)
  const peakHsl = {}; peakColor.getHSL(peakHsl)

  const avgThemeHue = (troughHsl.h + peakHsl.h) / 2.0
  const oppositeHue = (avgThemeHue + 0.5) % 1.0

  const hslGrid = {}; new THREE.Color().lerpColors(troughColor, peakColor, 0.5).getHSL(hslGrid)
  const gridLum = getW3CLuminance(troughColor.r, troughColor.g, troughColor.b)

  return defaultPages.map((page, index) => {
    const color = new THREE.Color()

    if (mode === 'uniform') {
      color.copy(accentColor)
    } else if (mode === 'monochrome') {
      color.setHex(hslGrid.l < 0.5 ? 0xffffff : 0x000000)
    } else {
      const shift = (index - Math.floor(defaultPages.length / 2)) * 0.11
      color.setHSL((oppositeHue + shift + 1.0) % 1.0, 1.0, 0.6)
    }

    if (mode === 'uniform') {
      const finalHsl = {}; color.getHSL(finalHsl)
      const distTrough = Math.min(Math.abs(finalHsl.h - troughHsl.h), 1.0 - Math.abs(finalHsl.h - troughHsl.h))
      const distPeak = Math.min(Math.abs(finalHsl.h - peakHsl.h), 1.0 - Math.abs(finalHsl.h - peakHsl.h))

      if (distTrough < 0.2 || distPeak < 0.2) {
        finalHsl.h = oppositeHue
        color.setHSL(finalHsl.h, finalHsl.s, finalHsl.l)
      }
    }

    const nodeLum = getW3CLuminance(color.r, color.g, color.b)
    const ratio = getContrastRatio(nodeLum, gridLum)

    if (ratio < 4.5) {
      const finalHsl = {}; color.getHSL(finalHsl)
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

export const loadPersistedState = () => {
  try {
    const defaultPresetStr = localStorage.getItem('userDefaultPreset')
    const userPresetsStr = localStorage.getItem('userPresets')
    let defaultPreset = null; let customPresets = {}
    if (defaultPresetStr) defaultPreset = JSON.parse(defaultPresetStr)
    if (userPresetsStr) customPresets = JSON.parse(userPresetsStr)
    return { defaultPreset, customPresets }
  } catch (e) {
    return { defaultPreset: null, customPresets: {} }
  }
}

export const createThemeSlice = (set, get) => ({
  theme: presets.purps.theme,
  pages: [],
  userPresets: {},

  setThemeParam: (key, value) => {
    set((state) => ({ theme: { ...state.theme, [key]: value } }))
    if (['accent', 'trough', 'peak'].includes(key)) {
        if (get().syncPageColors) get().syncPageColors()
    }
  },

  syncPageColors: () => {
    const { theme, nodeColorMode } = get()
    set({ pages: generatePageColors(theme, nodeColorMode) })
  },

  applyPreset: (presetId, isCustom = false) => set((state) => {
    const p = isCustom ? state.userPresets[presetId] : presets[presetId]
    if (!p) return {}
    return {
      theme: p.theme, ...p.layout,
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
  }
})