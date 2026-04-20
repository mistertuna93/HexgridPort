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

  const r = usePortfolioStore((state) => state.hexSize)
  const gridSpacing = usePortfolioStore((state) => state.gridSpacing)
  const waveSpeed = usePortfolioStore((state) => state.waveSpeed)
  const waveHeight = usePortfolioStore((state) => state.waveHeight)
  const wallHeight = usePortfolioStore((state) => state.wallHeight)
  const themeGrid = usePortfolioStore((state) => state.theme.grid)

  const hexWidth = Math.sqrt(3) * r 
  const hexHeight = 2 * r
  const thickness = 4

  const cols = 100
  const rows = 100
  const count = cols * rows

  const totalWidth = cols * hexWidth
  const totalDepth = rows * 1.5 * r 

  // GLSL Uniforms mapped directly to memory without causing re-renders
  const customUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(9999, 9999) },
    uTransition: { value: 0 },
    uActivePos: { value: new THREE.Vector2(9999, 9999) },
    uWaveSpeed: { value: waveSpeed },
    uWaveHeight: { value: waveHeight },
    uWallHeight: { value: wallHeight }
  }), [])

  // Sync Zustand state changes directly to the GPU GSAP animation engine
  useEffect(() => {
    gsap.to(customUniforms.uTransition, {
      value: view === 'ZOOMED' ? 1 : 0,
      duration: 1.2,
      ease: 'power3.inOut' // Exact identical curve to the CameraController!
    })

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

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colorObj = useMemo(() => new THREE.Color(), [])
  
  // Explicitly tie the default tile color to the dynamic Theme Settings panel
  const defaultColor = useMemo(() => new THREE.Color(themeGrid), [themeGrid])

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const intersectPoint = useMemo(() => new THREE.Vector3(), [])

  const getLogicalCoord = (x, z) => {
    const logical_row = Math.round(z / (1.5 * r))
    const modRow = ((logical_row % 2) + 2) % 2 
    const logical_col = Math.round(x / hexWidth - modRow * 0.5)
    return { x: logical_col, y: logical_row }
  }

  const handlePointerDown = (e) => {
    e.stopPropagation()
    const logicalCoord = getLogicalCoord(e.point.x, e.point.z)
    const page = pages.find((p) => p.vCoord.x === logicalCoord.x && p.vCoord.y === logicalCoord.y)
    
    if (page) {
      triggerZoom(page.id)
    }
  }

  const handlePointerMove = (e) => {
    const logicalCoord = getLogicalCoord(e.point.x, e.point.z)
    const page = pages.find((p) => p.vCoord.x === logicalCoord.x && p.vCoord.y === logicalCoord.y)
    document.body.style.cursor = page ? 'pointer' : 'auto'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  useFrame((state) => {
    if (!meshRef.current) return

    // Supply physics uniforms
    customUniforms.uTime.value = state.clock.getElapsedTime()
    customUniforms.uWaveSpeed.value = waveSpeed
    customUniforms.uWaveHeight.value = waveHeight
    customUniforms.uWallHeight.value = wallHeight
    
    // Mathematically intersect pointer to pass directly to Shader
    raycaster.setFromCamera(state.pointer, state.camera)
    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
      customUniforms.uMouse.value.set(intersectPoint.x, intersectPoint.z)
    }

    const { camera } = state
    const cx = camera.position.x
    const cz = camera.position.z

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

        // Sync Colors
        const logicalCoord = getLogicalCoord(worldX, worldZ)
        const pageForInstance = pages.find((p) => p.vCoord.x === logicalCoord.x && p.vCoord.y === logicalCoord.y)

        if (pageForInstance) {
          colorObj.set(pageForInstance.theme)
          meshRef.current.setColorAt(i, colorObj)
        } else {
          meshRef.current.setColorAt(i, defaultColor)
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  // GLSL Shader injection payload securely reading from Zustand Unifroms
  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime = customUniforms.uTime
    shader.uniforms.uMouse = customUniforms.uMouse
    shader.uniforms.uTransition = customUniforms.uTransition
    shader.uniforms.uActivePos = customUniforms.uActivePos
    shader.uniforms.uWaveSpeed = customUniforms.uWaveSpeed
    shader.uniforms.uWaveHeight = customUniforms.uWaveHeight
    shader.uniforms.uWallHeight = customUniforms.uWallHeight

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uTransition;
      uniform vec2 uActivePos;
      
      uniform float uWaveSpeed;
      uniform float uWaveHeight;
      uniform float uWallHeight;
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      
      // Extract exact world coordinates mathematically from the instance transformation matrix
      vec2 centerXZ = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
      
      // 1. Mouse Dip Calculation
      float distMouse = distance(centerXZ, uMouse);
      // Dip down by up to 3.0 units smoothly spreading out across a radius of 10.0
      float mouseDip = smoothstep(10.0, 0.0, distMouse) * 3.0;
      
      // 2. Wavy Ocean Math
      float wave = sin(centerXZ.x * 0.3 + uTime * uWaveSpeed) * cos(centerXZ.y * 0.3 + uTime * (uWaveSpeed * 0.73)) * uWaveHeight;
      
      // 3. Zoom Transition Block logic
      float distActive = distance(centerXZ, uActivePos);
      
      // Isolate only hexagons that are NOT precisely at the active page coordinate
      float isNotActive = step(0.1, distActive); 
      
      // If we are active (isNotActive == 0), the offset stays firmly 0. 
      // All others rise dramatically up to 'uWallHeight' high!
      float transitionOffset = isNotActive * (uWallHeight * uTransition);
      
      // Apply transforms locally inside the shader before final model mapping
      transformed.y += wave - mouseDip + transitionOffset;
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
        customProgramCacheKey={() => "customHexGlslShader"}
        color="#ffffff"
        roughness={0.6}
        metalness={0.4}
      />
    </instancedMesh>
  )
}
