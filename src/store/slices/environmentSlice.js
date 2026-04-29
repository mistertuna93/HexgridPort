export const createEnvironmentSlice = (set, get) => ({
  // Default values (overridden by themeSlice/presets during store initialization)
  hexSize: 1.5,
  gridSpacing: 0.75,
  thickness: 4,
  waveSpeed: 1.0,
  waveFrequency: 0.05,
  waveMagnitude: 5.1,
  waveDirection: { x: 1.0, y: 1.0 },
  mouseMotion: true,
  mouseMotionDepth: 7.0,
  mouseColor: false,
  mouseColorTint: '#ffffff',
  mouseLighting: false,
  mouseLightingIntensity: 2.0,
  mouseRadius: 7.0,
  colorBlendBias: 0.35,
  fogDensity: 0.02,
  radialFalloff: 0.0,
  showWireframe: false,
  wireframeOpacity: 0.5,
  nodeColorMode: 'prismatic',
  
  // Interaction states
  hoverPoint: null,
  isCursorInside: false,
  isPointerOverUI: false,

  setParam: (key, value) => {
    set({ [key]: value })
    if (key === 'nodeColorMode') {
      // Sync page colors if they changed the color mode
      if (get().syncPageColors) {
        get().syncPageColors()
      }
    }
  }
})
