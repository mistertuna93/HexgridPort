import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import gsap from 'gsap'

export const InfiniteHexGrid = () => {
  const meshRef = useRef(null)
  
  const pages = usePortfolioStore((state) => state.pages)
  const triggerZoom = usePortfolioStore((state) => state.triggerZoom)
  const view = usePortfolioStore((state) => state.view)
  const activePageId = usePortfolioStore((state) => state.activePageId)

  // Layout parameters
  const r = usePortfolioStore((state) => state.hexSize)
  const gridSpacing = usePortfolioStore((state) => state.gridSpacing)
  const thickness = usePortfolioStore((state) => state.thickness) || 4 // Fallback
  const waveSpeed = usePortfolioStore((state) => state.waveSpeed)
  const waveFrequency = usePortfolioStore((state) => state.waveFrequency)
  const waveMagnitude = usePortfolioStore((state) => state.waveMagnitude)
  const waveDirection = usePortfolioStore((state) => state.waveDirection) || new THREE.Vector2(1,1)
  const wallHeight = usePortfolioStore((state) => state.wallHeight)
  const flightDuration = usePortfolioStore((state) => state.flightDuration)
  const mouseInteraction = usePortfolioStore((state) => state.mouseInteraction)
  
  // Theme parameters
  const themeGrid = usePortfolioStore((state) => state.theme.grid)
  const themeAccent = usePortfolioStore((state) => state.theme.accent)

  const hexWidth = Math.sqrt(3) * r 
  const hexHeight = 2 * r

  const cols = 100
  const rows = 100
  const count = cols * rows
  const totalWidth = cols * hexWidth
  const totalDepth = rows * 1.5 * r 

  // GLSL Uniforms
  const customUniformsRef = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(9999, 9999) },
    uTransition: { value: 0 },
    uActivePos: { value: new THREE.Vector2(9999, 9999) },
    uWaveSpeed: { value: waveSpeed },
    uWaveFreq: { value: waveFrequency },
    uWaveHeight: { value: waveMagnitude },
    uWaveDir: { value: waveDirection },
    uWallHeight: { value: wallHeight },
    uMouseInteraction: { value: mouseInteraction },
    uThemeGrid: { value: new THREE.Color(themeGrid) },
    uThemeAccent: { value: new THREE.Color(themeAccent) }
  })
  const customUniforms = customUniformsRef.current

  useEffect(() => {
    if (view === 'GROWING') {
      // Trigger growth sequentially ONLY after camera arrival
      gsap.to(customUniforms.uTransition, {
        value: 1,
        duration: 0.6, // Snappier growth for immersive punch
        ease: 'power2.out',
        onComplete: () => {
          usePortfolioStore.setState({ view: 'ZOOMED', isTransitioning: false })
        }
      })
    } else if (view === 'GRID' || view === 'FOCUSING') {
      // Keep hex flat while travelling or in grid view
      gsap.to(customUniforms.uTransition, {
        value: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      })
    }

    if (activePageId) {
      const page = pages.find((p) => p.id === activePageId)
      if (page) {
        const modRow = ((page.vCoord.y % 2) + 2) % 2
        const worldX = (page.vCoord.x + modRow * 0.5) * hexWidth
        const worldZ = page.vCoord.y * 1.5 * r
        customUniforms.uActivePos.value.set(worldX, worldZ)
      }
    }
  }, [view, activePageId, pages, hexWidth, r, customUniforms])

  const dummy = useRef(new THREE.Object3D()).current
  const colorObj = useRef(new THREE.Color()).current
  const defaultColor = useMemo(() => new THREE.Color(themeGrid), [themeGrid])
  const accentColorObj = useRef(new THREE.Color()).current

  const raycaster = useRef(new THREE.Raycaster()).current
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const intersectPoint = useRef(new THREE.Vector3()).current

  const getLogicalCoord = (x, z) => {
    const logical_row = Math.round(z / (1.5 * r))
    const modRow = ((logical_row % 2) + 2) % 2 
    const logical_col = Math.round(x / hexWidth - modRow * 0.5)
    return { x: logical_col, y: logical_row }
  }

  const handlePointerDown = (e) => {
    const logicalCoord = getLogicalCoord(e.point.x, e.point.z)
    const page = pages.find((p) => p.vCoord.x === logicalCoord.x && p.vCoord.y === logicalCoord.y)
    
    // Conditionally isolate interaction bindings securely mapping strictly to routing links!
    if (page) {
      e.stopPropagation()
      triggerZoom(page.id)
    }
  }

  const handlePointerMove = (e) => {
    const logicalCoord = getLogicalCoord(e.point.x, e.point.z)
    const page = pages.find((p) => p.vCoord.x === logicalCoord.x && p.vCoord.y === logicalCoord.y)
    document.body.style.cursor = page ? 'pointer' : 'auto'
  }

  const handlePointerOut = () => document.body.style.cursor = 'auto'

  useFrame((state) => {
    if (!meshRef.current) return

    // Supply physics uniforms
    customUniforms.uTime.value = state.clock.getElapsedTime()
    customUniforms.uWaveSpeed.value = waveSpeed
    customUniforms.uWaveFreq.value = waveFrequency
    customUniforms.uWaveHeight.value = waveMagnitude
    customUniforms.uWallHeight.value = wallHeight
    customUniforms.uMouseInteraction.value = mouseInteraction
    customUniforms.uThemeGrid.value.set(themeGrid)
    customUniforms.uThemeAccent.value.set(themeAccent)
    if (waveDirection) customUniforms.uWaveDir.value.copy(waveDirection)
    
    raycaster.setFromCamera(state.pointer, state.camera)
    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
      customUniforms.uMouse.value.set(intersectPoint.x, intersectPoint.z)
    }

    const { camera } = state
    const cx = camera.position.x
    const cz = camera.position.z

    // Dynamic Density Trigger based on Camera altitude natively maps logical virtual pages
    const densityTrigger = Math.max(0, (camera.position.y - 20) / 20)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col

        const baseX = (col + (row % 2) * 0.5) * hexWidth
        const baseZ = row * 1.5 * r

        let dx = baseX - cx
        let dz = baseZ - cz

        dx = ((dx + totalWidth / 2) % totalWidth + totalWidth) % totalWidth - totalWidth / 2
        dz = ((dz + totalDepth / 2) % totalDepth + totalDepth) % totalDepth - totalDepth / 2

        const worldX = cx + dx
        const worldZ = cz + dz

        dummy.position.set(worldX, 0, worldZ)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)

        // Logical ID Mapping
        const logicalCoord = getLogicalCoord(worldX, worldZ)
        const pageForInstance = pages.find((p) => p.vCoord.x === logicalCoord.x && p.vCoord.y === logicalCoord.y)

        if (pageForInstance) {
          meshRef.current.setColorAt(i, defaultColor)
        } else {
          // Pseudorandom deterministic spatial hash generator
          const hash = Math.abs(Math.sin(logicalCoord.x * 12.9898 + logicalCoord.y * 78.233) * 43758.5453) % 1
          if (hash < densityTrigger * 0.08) {
            // Unlocks natively colored responsive procedural tiles as we zoom away!
            accentColorObj.set(themeAccent)
            meshRef.current.setColorAt(i, accentColorObj)
          } else {
            meshRef.current.setColorAt(i, defaultColor)
          }
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime = customUniforms.uTime
    shader.uniforms.uMouse = customUniforms.uMouse
    shader.uniforms.uTransition = customUniforms.uTransition
    shader.uniforms.uActivePos = customUniforms.uActivePos
    shader.uniforms.uWaveSpeed = customUniforms.uWaveSpeed
    shader.uniforms.uWaveFreq = customUniforms.uWaveFreq
    shader.uniforms.uWaveHeight = customUniforms.uWaveHeight
    shader.uniforms.uWaveDir = customUniforms.uWaveDir
    shader.uniforms.uWallHeight = customUniforms.uWallHeight
    shader.uniforms.uMouseInteraction = customUniforms.uMouseInteraction
    shader.uniforms.uThemeGrid = customUniforms.uThemeGrid
    shader.uniforms.uThemeAccent = customUniforms.uThemeAccent

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uTransition;
      uniform vec2 uActivePos;
      
      uniform float uWaveSpeed;
      uniform float uWaveFreq;
      uniform float uWaveHeight;
      uniform vec2 uWaveDir;
      uniform float uWallHeight;
      uniform float uMouseInteraction;
      
      varying vec2 vWorldPositionXZ;
      varying float vWaveFactor;
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      
      vec2 centerXZ = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
      vWorldPositionXZ = centerXZ;
      
      // Multi-directional cross-domain organic structural liquid warping dynamically mapped
      float wave1 = sin(centerXZ.x * uWaveFreq * 0.8 + uTime * uWaveSpeed) * (uWaveHeight * 1.2);
      float wave2 = cos(centerXZ.y * uWaveFreq * 1.1 - uTime * (uWaveSpeed * 0.7)) * (uWaveHeight * 0.9);
      float wave3 = sin((centerXZ.x + centerXZ.y) * uWaveFreq * 0.4 + uTime * (uWaveSpeed * 1.3)) * (uWaveHeight * 0.6);
      
      float wave = wave1 + wave2 + wave3;
      vWaveFactor = wave; // Shared securely to fragment mapping
      
      float distMouse = distance(centerXZ, uMouse);
      
      // Dip down smoothly if mouse controls motion (Mode 0 or 2)
      float mouseDip = 0.0;
      if (uMouseInteraction < 0.5 || uMouseInteraction > 1.5) {
         mouseDip = smoothstep(12.0, 0.0, distMouse) * 3.5;
      }
      
      float distActive = distance(centerXZ, uActivePos);
      float isActiveScale = 1.0 - step(0.1, distActive); 
      
      // The parent hex organically GROWS out of the floor mapping continuously stretching natively smoothly
      float growth = isActiveScale * 12.0 * uTransition;
      if (position.y > 0.0) {
         transformed.y += growth; // Stretches top face securely seamlessly preventing floor detachment entirely 
      }
      
      // Expands the matrix limits mapping perfectly natively scaling structurally to fill viewport
      transformed.x *= 1.0 + (isActiveScale * uTransition * 30.0);
      transformed.z *= 1.0 + (isActiveScale * uTransition * 30.0);
      
      // Pure continuous wave floor evaluation smoothly mapped beneath UI natively 
      transformed.y += wave - mouseDip;
      `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform vec3 uThemeGrid;
      uniform vec3 uThemeAccent;
      uniform float uMouseInteraction;
      uniform vec2 uMouse;
      
      varying vec2 vWorldPositionXZ;
      varying float vWaveFactor;
      `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      
      // Normalize our wave output (approx -uWaveHeight to +uWaveHeight) into a smooth 0.0 - 1.0 Mix range
      float depthMix = clamp((vWaveFactor * 1.5) + 0.5, 0.0, 1.0);
      vec3 gradientColor = mix(uThemeGrid, uThemeAccent, depthMix * 0.35); 
      
      // We check if this individual instance color was mutated dynamically by evaluating explicitly what ThreeJS just processed
      float isSpecialPage = step(0.01, distance(diffuseColor.rgb, uThemeGrid)); 
      
      if (isSpecialPage < 0.5) {
         diffuseColor.rgb = gradientColor;
      }
      // If it is > 0.5, it retains diffuseColor natively which already securely holds the Page's instance color.
      
      // 0 = Motion, 1 = Color, 2 = Both
      if (uMouseInteraction > 0.5) {
         float distToMouse = distance(vWorldPositionXZ, uMouse);
         float glow = smoothstep(14.0, 0.0, distToMouse);
         diffuseColor.rgb += uThemeAccent * glow * 2.0;    
      }
      `
    )
  }

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[null, null, count]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <cylinderGeometry args={[r * gridSpacing, r * gridSpacing, thickness, 6]} />
      <meshStandardMaterial 
        onBeforeCompile={onBeforeCompile}
        customProgramCacheKey={() => "customHexShader_radial_explosion"}
        color="#ffffff"
        roughness={0.6}
        metalness={0.4}
      />
    </instancedMesh>
  )
}
