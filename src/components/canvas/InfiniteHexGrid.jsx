import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import gsap from 'gsap'

export const InfiniteHexGrid = () => {
  const meshRef = useRef(null)
  const wireframeRef = useRef(null)
  
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
  const flightDuration = usePortfolioStore((state) => state.flightDuration)
  
  // New granular mouse interactions
  const mouseMotion = usePortfolioStore((state) => state.mouseMotion)
  const mouseMotionDepth = usePortfolioStore((state) => state.mouseMotionDepth)
  const mouseColor = usePortfolioStore((state) => state.mouseColor)
  const mouseColorTint = usePortfolioStore((state) => state.mouseColorTint)
  const mouseLighting = usePortfolioStore((state) => state.mouseLighting)
  const mouseLightingIntensity = usePortfolioStore((state) => state.mouseLightingIntensity)
  const mouseRadius = usePortfolioStore((state) => state.mouseRadius)
  
  // Theme parameters
  const themeTrough = usePortfolioStore((state) => state.theme.trough)
  const themePeak = usePortfolioStore((state) => state.theme.peak)
  const themeAccent = usePortfolioStore((state) => state.theme.accent)
  const colorBlendBias = usePortfolioStore((state) => state.colorBlendBias)
  const radialFalloff = usePortfolioStore((state) => state.radialFalloff)
  const fogColor = usePortfolioStore((state) => state.theme.fogColor)
  const fogDensity = usePortfolioStore((state) => state.fogDensity)
  const showWireframe = usePortfolioStore((state) => state.showWireframe)
  const wireframeColor = usePortfolioStore((state) => state.theme.wireframeColor)
  const wireframeOpacity = usePortfolioStore((state) => state.wireframeOpacity)

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
    uThemeTrough: { value: new THREE.Color(themeTrough) },
    uThemePeak: { value: new THREE.Color(themePeak) },
    uThemeAccent: { value: new THREE.Color(themeAccent) },
    uColorBlendBias: { value: colorBlendBias },
    uRadialFalloff: { value: radialFalloff },
    
    // New granular mouse uniforms
    uMouseMotion: { value: mouseMotion ? 1.0 : 0.0 },
    uMouseMotionDepth: { value: mouseMotionDepth },
    uMouseColor: { value: mouseColor ? 1.0 : 0.0 },
    uMouseColorTint: { value: new THREE.Color(mouseColorTint) },
    uMouseLighting: { value: mouseLighting ? 1.0 : 0.0 },
    uMouseLightingIntensity: { value: mouseLightingIntensity },
    uMouseRadius: { value: mouseRadius }
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
  const defaultColor = useMemo(() => new THREE.Color(themeTrough), [themeTrough])
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
  
  const lastWarpCheck = useRef(0)

  useFrame((state) => {
    if (!meshRef.current) return

    if (state.scene.fog) {
       state.scene.fog.color.set(fogColor)
       state.scene.fog.density = fogDensity
    } else {
       state.scene.fog = new THREE.FogExp2(fogColor, fogDensity)
    }

    // Supply physics uniforms
    customUniforms.uTime.value = state.clock.elapsedTime
    customUniforms.uWaveSpeed.value = waveSpeed
    customUniforms.uWaveFreq.value = waveFrequency
    customUniforms.uWaveHeight.value = waveMagnitude
    customUniforms.uThemeTrough.value.set(themeTrough)
    customUniforms.uThemePeak.value.set(themePeak)
    customUniforms.uThemeAccent.value.set(themeAccent)
    customUniforms.uColorBlendBias.value = colorBlendBias
    customUniforms.uRadialFalloff.value = radialFalloff
    if (waveDirection) customUniforms.uWaveDir.value.copy(waveDirection)
    
    // Sync new mouse variables smoothly
    customUniforms.uMouseMotion.value = mouseMotion ? 1.0 : 0.0
    customUniforms.uMouseMotionDepth.value = mouseMotionDepth
    customUniforms.uMouseColor.value = mouseColor ? 1.0 : 0.0
    customUniforms.uMouseColorTint.value.set(mouseColorTint)
    customUniforms.uMouseLighting.value = mouseLighting ? 1.0 : 0.0
    customUniforms.uMouseLightingIntensity.value = mouseLightingIntensity
    customUniforms.uMouseRadius.value = mouseRadius
    
    raycaster.setFromCamera(state.pointer, state.camera)
    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
      customUniforms.uMouse.value.set(intersectPoint.x, intersectPoint.z)
    }

    const { camera } = state
    const cx = camera.position.x
    const cz = camera.position.z

    // Orbit Engine: Dynamic Spatial Separation (Continuous Evaluation)
    if (state.clock.elapsedTime - lastWarpCheck.current > 0.3) {
       lastWarpCheck.current = state.clock.elapsedTime
       
       const bins = Array(8).fill().map(() => [])
       
       const currentPages = usePortfolioStore.getState().pages
       const currentActiveId = usePortfolioStore.getState().activePageId
       
       const pageData = currentPages
         .filter(page => page.id !== currentActiveId && page.id !== window._globalHoveredPage)
         .map(page => {
         const modRow = ((page.vCoord.y % 2) + 2) % 2
         const worldX = (page.vCoord.x + modRow * 0.5) * hexWidth
         const worldZ = page.vCoord.y * 1.5 * r
         
         const dx = worldX - cx
         const dz = worldZ - cz
         const dist = Math.hypot(dx, dz)
         
         let angle = Math.atan2(dz, dx)
         if (angle < 0) angle += Math.PI * 2
         
         const binIdx = Math.floor(angle / (Math.PI / 4)) % 8
         return { page, worldX, worldZ, dist, binIdx }
       })
       
       pageData.forEach(data => {
          if (data.dist > 25) { 
             bins[data.binIdx].push(data)
          }
       })
       
       let warped = false
       const newPages = [...currentPages]
       
       bins.forEach((bin, binIdx) => {
          while (bin.length > 1) {
             bin.sort((a, b) => a.dist - b.dist)
             const furthest = bin.pop()
             
             let targetBin = (binIdx + 4) % 8
             let offset = 0
             let foundEmpty = -1
             while (offset < 8) {
                const checkBin = (targetBin + (offset % 2 === 0 ? offset/2 : -Math.ceil(offset/2)) + 8) % 8
                if (bins[checkBin].length === 0) {
                   foundEmpty = checkBin
                   break
                }
                offset++
             }
             
             if (foundEmpty !== -1) {
                const newAngle = foundEmpty * (Math.PI / 4) + (Math.PI / 8)
                const newWorldX = cx + Math.cos(newAngle) * furthest.dist
                const newWorldZ = cz + Math.sin(newAngle) * furthest.dist
                
                const newCoord = getLogicalCoord(newWorldX, newWorldZ)
                
                const pIdx = newPages.findIndex(p => p.id === furthest.page.id)
                if (pIdx > -1) {
                   newPages[pIdx] = { ...newPages[pIdx], vCoord: new THREE.Vector2(newCoord.x, newCoord.y) }
                   warped = true
                }
                bins[foundEmpty].push(furthest)
             }
          }
       })
       
       if (warped) {
          usePortfolioStore.setState({ pages: newPages })
       }
    }

    // Dynamic Density Trigger based on Camera altitude natively maps logical virtual pages
    const densityTrigger = Math.max(0, (camera.position.y - 20) / 20)
    
    let activeInstanceIndex = -1;

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
          accentColorObj.set(pageForInstance.theme || themeAccent)
          meshRef.current.setColorAt(i, accentColorObj)
          if (pageForInstance.id === activePageId) {
             activeInstanceIndex = i;
          }
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
    
    // WebGL Depth Sorting Fix: 
    // Transparent elements writing to the depth buffer will occlude instances drawn *after* them.
    // By mathematically swapping the active hex to the absolute end of the instanced array, 
    // it draws over the background grid perfectly without culling the bottom half!
    if (activeInstanceIndex !== -1 && activeInstanceIndex !== count - 1) {
      const tempMat = new THREE.Matrix4()
      const lastMat = new THREE.Matrix4()
      meshRef.current.getMatrixAt(activeInstanceIndex, tempMat)
      meshRef.current.getMatrixAt(count - 1, lastMat)
      meshRef.current.setMatrixAt(count - 1, tempMat)
      meshRef.current.setMatrixAt(activeInstanceIndex, lastMat)
      
      const tempColor = new THREE.Color()
      const lastColor = new THREE.Color()
      meshRef.current.getColorAt(activeInstanceIndex, tempColor)
      meshRef.current.getColorAt(count - 1, lastColor)
      meshRef.current.setColorAt(count - 1, tempColor)
      meshRef.current.setColorAt(activeInstanceIndex, lastColor)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    
    if (showWireframe && wireframeRef.current) {
       wireframeRef.current.instanceMatrix.copy(meshRef.current.instanceMatrix)
       wireframeRef.current.instanceMatrix.needsUpdate = true
    }
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
    shader.uniforms.uThemeTrough = customUniforms.uThemeTrough
    shader.uniforms.uThemePeak = customUniforms.uThemePeak
    shader.uniforms.uThemeAccent = customUniforms.uThemeAccent
    shader.uniforms.uColorBlendBias = customUniforms.uColorBlendBias
    shader.uniforms.uRadialFalloff = customUniforms.uRadialFalloff
    
    shader.uniforms.uMouseMotion = customUniforms.uMouseMotion
    shader.uniforms.uMouseMotionDepth = customUniforms.uMouseMotionDepth
    shader.uniforms.uMouseColor = customUniforms.uMouseColor
    shader.uniforms.uMouseColorTint = customUniforms.uMouseColorTint
    shader.uniforms.uMouseLighting = customUniforms.uMouseLighting
    shader.uniforms.uMouseLightingIntensity = customUniforms.uMouseLightingIntensity
    shader.uniforms.uMouseRadius = customUniforms.uMouseRadius

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
      
      uniform float uMouseMotion;
      uniform float uMouseMotionDepth;
      uniform float uMouseRadius;
      
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
      
      float wave1 = sin(centerXZ.x * uWaveFreq * 0.8 + uTime * uWaveSpeed) * (uWaveHeight * 1.2);
      float wave2 = cos(centerXZ.y * uWaveFreq * 1.1 - uTime * (uWaveSpeed * 0.7)) * (uWaveHeight * 0.9);
      float wave3 = sin((centerXZ.x + centerXZ.y) * uWaveFreq * 0.4 + uTime * (uWaveSpeed * 1.3)) * (uWaveHeight * 0.6);
      
      float wave = wave1 + wave2 + wave3;
      vWaveFactor = wave; 
      
      float distMouse = distance(centerXZ, uMouse);
      
      float mouseDip = 0.0;
      if (uMouseMotion > 0.5) {
         mouseDip = smoothstep(uMouseRadius, 0.0, distMouse) * uMouseMotionDepth;
      }
      
      float distActive = distance(centerXZ, uActivePos);
      float isActiveScale = 1.0 - step(0.1, distActive); 
      
      float growth = isActiveScale * 12.0 * uTransition;
      if (position.y > 0.0) {
         transformed.y += growth; 
      }
      
      transformed.x *= 1.0 + (isActiveScale * uTransition * 30.0);
      transformed.z *= 1.0 + (isActiveScale * uTransition * 30.0);
      
      transformed.y += wave - mouseDip;
      `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform vec3 uThemeTrough;
      uniform vec3 uThemePeak;
      uniform vec3 uThemeAccent;
      uniform float uColorBlendBias;
      uniform float uRadialFalloff;
      
      uniform float uMouseColor;
      uniform vec3 uMouseColorTint;
      uniform float uMouseLighting;
      uniform float uMouseLightingIntensity;
      uniform float uMouseRadius;
      
      uniform vec2 uMouse;
      uniform vec2 uActivePos;
      uniform float uTransition;
      
      varying vec2 vWorldPositionXZ;
      varying float vWaveFactor;
      `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      
      float depthMix = clamp((vWaveFactor * 1.5) + uColorBlendBias, 0.0, 1.0);
      vec3 gradientColor = mix(uThemeTrough, uThemePeak, depthMix); 
      
      float isSpecialPage = step(0.01, distance(diffuseColor.rgb, uThemeTrough)); 
      
      if (isSpecialPage < 0.5) {
         diffuseColor.rgb = gradientColor;
      }
      
      float distToMouse = distance(vWorldPositionXZ, uMouse);
      float mouseMask = smoothstep(uMouseRadius, 0.0, distToMouse);
      
      if (uMouseColor > 0.5) {
         diffuseColor.rgb = mix(diffuseColor.rgb, uMouseColorTint, mouseMask * 0.85);
      }
      
      if (uMouseLighting > 0.5) {
         diffuseColor.rgb += uThemeAccent * mouseMask * uMouseLightingIntensity;    
      }
      
      float distActiveFrag = distance(vWorldPositionXZ, uActivePos);
      float isActiveFrag = 1.0 - step(0.1, distActiveFrag);
      
      // Radial Falloff
      if (uRadialFalloff > 0.0) {
         float distToCenter = distance(vWorldPositionXZ, vec2(0.0));
         float radialMask = smoothstep(10.0, 10.0 + (50.0 * (1.0 - uRadialFalloff)), distToCenter);
         diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0), radialMask * uRadialFalloff);
      }
      
      float alphaFade = isActiveFrag * smoothstep(0.8, 1.0, uTransition);
      diffuseColor.a *= (1.0 - alphaFade);
      `
    )
  }

  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: wireframeColor,
      wireframe: true,
      transparent: true,
      opacity: wireframeOpacity,
      roughness: 0.1,
      metalness: 0.8
    })
  }, [wireframeColor, wireframeOpacity])

  return (
    <group>
      <instancedMesh 
        ref={meshRef} 
        args={[null, null, count]}
      >
        <cylinderGeometry args={[r * gridSpacing, r * gridSpacing, thickness, 6]} />
        <meshStandardMaterial 
          transparent={true}
          onBeforeCompile={onBeforeCompile}
          customProgramCacheKey={() => "customHexShader_radial_explosion"}
          color="#ffffff"
          roughness={0.6}
          metalness={0.4}
        />
      </instancedMesh>
      
      {showWireframe && (
        <instancedMesh ref={wireframeRef} args={[null, null, count]}>
          <cylinderGeometry args={[r * gridSpacing, r * gridSpacing, thickness, 6]} />
          <primitive object={wireframeMaterial} attach="material" onBeforeCompile={onBeforeCompile} customProgramCacheKey={() => "customHexShader_wireframe"} />
        </instancedMesh>
      )}
      
      {/* Invisible interaction plane mathematically replaces 10,000-instance Raycasting to eliminate CPU freezing and scroll locking */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, thickness / 2, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[5000, 5000]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  )
}
