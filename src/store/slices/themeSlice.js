// src/store/slices/themeSlice.js
import * as THREE from 'three'

export const createThemeSlice = (set, get) => ({
    // Define default pages with their coordinates
    pages: [
        { id: 'bio', vCoord: new THREE.Vector2(0, 0), theme: '#4488ff' },
        { id: 'projects', vCoord: new THREE.Vector2(42, 18), theme: '#ff4488' },
        { id: 'roadmap', vCoord: new THREE.Vector2(25, 55), theme: '#44ff88' },
        { id: 'arsenal', vCoord: new THREE.Vector2(-35, 38), theme: '#ffff44' },
        { id: 'contact', vCoord: new THREE.Vector2(-50, -15), theme: '#ff8844' }
    ],

    // Grid Layout
    hexSize: 1.5,
    gridSpacing: 1.05,
    thickness: 4.0,

    // Theme Colors
    theme: {
        accent: '#4488ff',
        bg: '#000000'
    },

    // Wave Settings
    waveSpeed: 0.5,
    waveFrequency: 0.1,
    waveMagnitude: 2.0, // This must match the Grid's Uniform setup
    waveDirection: new THREE.Vector2(1, 1),

    // Visuals
    colorBlendBias: 0.5,
    radialFalloff: 0.8,
    showWireframe: true,
    wireframeOpacity: 0.1
})