export const createInteractionSlice = (set, get) => ({
    hoverPoint: null,
    isPointerOverUI: false,

    mouseMotion: true,
    mouseMotionDepth: 1.0,
    mouseColor: '#ffffff',
    mouseColorTint: 0.5,
    mouseLighting: true,
    mouseLightingIntensity: 1.0,
    mouseRadius: 5.0,
    colorBlendBias: 0.5,
    radialFalloff: 2.0,

    setHoverPoint: (pt) => set({ hoverPoint: pt }),
    setIsPointerOverUI: (isOver) => set({ isPointerOverUI: isOver })
})