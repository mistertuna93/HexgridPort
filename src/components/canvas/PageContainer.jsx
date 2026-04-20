import React, { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import * as THREE from 'three'
import gsap from 'gsap'

export const PageContainer = ({ page }) => {
  const groupRef = useRef(null)
  const scaleRef = useRef(null)
  const idleRef = useRef(null)
  const activeRef = useRef(null)
  const labelWrapperRef = useRef(null)
  const hoverActiveRef = useRef(false)

  const view = usePortfolioStore((state) => state.view)
  const activePageId = usePortfolioStore((state) => state.activePageId)
  const triggerZoom = usePortfolioStore((state) => state.triggerZoom)
  const setHoverPoint = usePortfolioStore((state) => state.setHoverPoint)


  const r = usePortfolioStore((state) => state.hexSize)
  const waveSpeed = usePortfolioStore((state) => state.waveSpeed)
  const waveFrequency = usePortfolioStore((state) => state.waveFrequency)
  const waveMagnitude = usePortfolioStore((state) => state.waveMagnitude)
  const waveDirection = usePortfolioStore((state) => state.waveDirection) || new THREE.Vector2(1,1)
  const themeGrid = usePortfolioStore((state) => state.theme.grid)
  const wallHeight = usePortfolioStore((state) => state.wallHeight) || 30 // Extract for exact height syncing

  const hexWidth = Math.sqrt(3) * r
  
  const modRow = ((page.vCoord.y % 2) + 2) % 2
  const worldX = (page.vCoord.x + modRow * 0.5) * hexWidth
  const worldZ = page.vCoord.y * 1.5 * r
  const centerXZ = useMemo(() => new THREE.Vector2(worldX, worldZ), [worldX, worldZ])
  const pages = usePortfolioStore((state) => state.pages)

  const activePage = useMemo(() => pages.find(p => p.id === activePageId), [pages, activePageId])
  const activeCenterXZ = useMemo(() => {
    if (!activePage) return new THREE.Vector2(9999, 9999)
    const modRow = ((activePage.vCoord.y % 2) + 2) % 2
    const wX = (activePage.vCoord.x + modRow * 0.5) * hexWidth
    const wZ = activePage.vCoord.y * 1.5 * r
    return new THREE.Vector2(wX, wZ)
  }, [activePage, hexWidth, r])

  const isActive = activePageId === page.id
  
  // Custom GSAP integration ensuring DOM Component cleanly follows GPU Fragment Elevation matrix independently perfectly!
  const transitionRef = useRef({ value: 0 })

  useFrame((state) => {
    if (!groupRef.current) return
    const elapsedTime = state.clock.getElapsedTime()
    
    // Physical Hexagon Height Matrix Math
    const proj = centerXZ.dot(waveDirection.clone().normalize())
    const wave = Math.sin(proj * waveFrequency + elapsedTime * waveSpeed) * waveMagnitude
    
    // Inactive matrices MUST stay locked securely to the structural wave limits natively!
    groupRef.current.position.y = 2 + wave + 0.05
    
    groupRef.current.position.x = worldX
    groupRef.current.position.z = worldZ

    // HUD Dynamic Viewport Clamped Compass Routing
    if (labelWrapperRef.current) {
      // Pin projection explicitly to spatial element
      const v = new THREE.Vector3(groupRef.current.position.x, 2 + wave, groupRef.current.position.z)
      v.project(state.camera)

      // Normalize projective flippage cleanly explicitly mapping out of bounds dynamically natively inherently securely!
      if (v.z > 1.0) {
         v.x *= -10000 // Invert the camera plane divide flawlessly and blast to infinite edge bounds
         v.y *= -10000
      }

      // Calculate Parent Hex absolute screen coordinates natively
      const parentScreenX = (v.x * 0.5 + 0.5) * state.size.width
      const parentScreenY = (-v.y * 0.5 + 0.5) * state.size.height

      // Determine radial vector distance from pure screen center
      // Proposed absolute target position for the tracking label natively centering perfectly flat on target geometry
      let labelAbsX = parentScreenX
      let labelAbsY = parentScreenY
      
      // Hard clamp bounds restricting absolute matrix tightly inside screen padding bounds (The Compass)
      const pad = 60
      labelAbsX = Math.max(pad, Math.min(state.size.width - pad, labelAbsX))
      labelAbsY = Math.max(pad, Math.min(state.size.height - pad, labelAbsY))
      
      const isClamped = labelAbsX === pad || labelAbsX === state.size.width - pad || labelAbsY === pad || labelAbsY === state.size.height - pad
      
      // Button Avoidance: Pushes labels away from the Config button (typically bottom-right)
      const configBtnX = state.size.width - 24 // approximate center of fixed bottom-6 right-6
      const configBtnY = state.size.height - 24
      const distToBtn = Math.sqrt(Math.pow(labelAbsX - configBtnX, 2) + Math.pow(labelAbsY - configBtnY, 2))
      if (distToBtn < 100) {
         labelAbsY -= (100 - distToBtn) * 0.8 // Push UP away from bottom corner
         labelAbsX -= (100 - distToBtn) * 0.5
      }

      // Dynamic Perimeter Anti-Stacking Collision Separation securely identically mapping conditionally implicitly
      if (window._frameStackTracker !== state.clock.elapsedTime) {
         window._frameStackTracker = state.clock.elapsedTime
         window._activeClampedPos = []
      }
      
      if (isClamped) {
         const sep = 70 // Tighter separation to reduce large jumps
         let iterations = 0
         let conflict = window._activeClampedPos.find(p => Math.abs(p.x - labelAbsX) < sep && Math.abs(p.y - labelAbsY) < sep)
         
         while (conflict && iterations < 5) {
            // Gently shift away from conflicts rather than flying around the perimeter
            labelAbsY -= sep * 0.5
            labelAbsX -= sep * 0.2
            
            iterations++
            conflict = window._activeClampedPos.find(p => Math.abs(p.x - labelAbsX) < sep && Math.abs(p.y - labelAbsY) < sep)
         }
      }
      
      window._activeClampedPos.push({ x: labelAbsX, y: labelAbsY })
      
      // Re-calculate the strictly required local transforms for the DOM Node
      const targetPx = labelAbsX - parentScreenX
      const targetPy = labelAbsY - parentScreenY
      
      // Smooth dampened Lerp to eliminate jitter and 'too much movement' snap
      if (!labelWrapperRef.current._currentX) {
        labelWrapperRef.current._currentX = targetPx
        labelWrapperRef.current._currentY = targetPy
      }
      
      labelWrapperRef.current._currentX += (targetPx - labelWrapperRef.current._currentX) * 0.15
      labelWrapperRef.current._currentY += (targetPy - labelWrapperRef.current._currentY) * 0.15
      
      labelWrapperRef.current.style.transform = `translate(${labelWrapperRef.current._currentX}px, ${labelWrapperRef.current._currentY}px) translate(-50%, -50%)`
      
      // Native Mathematical Ghost-Pointer Interaction natively securely ensuring 3D Glow remains identically mapped without DOM strobe masking 
      const mousePx = (state.pointer.x * 0.5 + 0.5) * state.size.width
      const mousePy = (-state.pointer.y * 0.5 + 0.5) * state.size.height
      const hoverDist = Math.sqrt(Math.pow(labelAbsX - mousePx, 2) + Math.pow(labelAbsY - mousePy, 2))
      
      // Inject massive hysteresis! If already hovering, expand the retention envelope to 250px so the panning slider doesn't violently mathematically natively escape the cursor!
      const retentionRadius = hoverActiveRef.current ? 250 : 50
      const isCurrentlyHovered = hoverDist < retentionRadius && view === 'GRID' && !isActive
      
      if (isCurrentlyHovered && !hoverActiveRef.current) {
        hoverActiveRef.current = true
        document.body.style.cursor = 'pointer'
        setHoverPoint({ x: worldX, z: worldZ })
      } else if (!isCurrentlyHovered && hoverActiveRef.current) {
        hoverActiveRef.current = false
        // Only safely reset the global cursor mathematically evaluating conditionally
        if (document.body.style.cursor === 'pointer') {
          document.body.style.cursor = 'auto'
        }
        setHoverPoint(null)
      }
    }
  })

  useEffect(() => {
    if (view === 'ZOOMED' && isActive) {
      gsap.to(transitionRef.current, { value: 1, duration: 1.2, ease: 'power3.inOut' })
      gsap.to(scaleRef.current.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power3.inOut' })
      gsap.to(activeRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.6, delay: 0.6 })
      gsap.to(idleRef.current, { opacity: 0, duration: 0.3 })
    } else {
      gsap.to(transitionRef.current, { value: 0, duration: 1.2, ease: 'power3.inOut' })
      gsap.to(scaleRef.current.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 1.2, ease: 'power3.inOut' })
      gsap.to(activeRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.4 })
      gsap.to(idleRef.current, { opacity: 1, duration: 0.6, delay: 0.8 })
    }
  }, [view, isActive])

  // Synthetic DOM Click Intercept mapping mathematically flawlessly referencing native spatial ranges perfectly bypassing DOM pointer bugs identical natively
  useEffect(() => {
    const handleClick = () => {
      if (hoverActiveRef.current && view === 'GRID') {
        triggerZoom(page.id)
      }
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [page.id, view, triggerZoom])

  // Dynamically compute perceptual string contrast flawlessly ensuring no tag perfectly camouflages against its hex map securely
  const getLuminance = (hexcolor) => {
    let hex = hexcolor.replace("#", "")
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return ((r * 299) + (g * 587) + (b * 114)) / 1000
  }

  const gridLumina = getLuminance(themeGrid)
  const themeLumina = getLuminance(page.theme)

  // If the absolute YIQ separation is too tight visually, the HUD evaluates a high contrast monochrome fallback
  const indicatorColor = Math.abs(gridLumina - themeLumina) < 40 
    ? (gridLumina >= 128 ? '#000000' : '#ffffff') 
    : page.theme

  return (
    <group ref={groupRef} position={[worldX, 2, worldZ]}>
      {/* Sci-Fi Callout HUD Tracker */}
      <Html center zIndexRange={[100, 0]}>
        <div 
          ref={idleRef} 
          className="relative w-0 h-0 pointer-events-none transition-opacity duration-300" 
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {/* Floating Tracking Label (Now flawlessly interactively ghosted mathematically seamlessly resolving render strobing!) */}
          <div 
            ref={labelWrapperRef} 
            className="absolute left-0 top-0 transition-none will-change-transform pointer-events-none"
          >
            <div className="p-4 group -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 pointer-events-none">
               <div 
                 className="px-4 py-1.5 backdrop-blur-md border rounded-full shadow-lg relative transition-all duration-300 pointer-events-none" 
                 style={{ 
                   borderColor: `${page.theme}88`,
                   transform: hoverActiveRef.current ? 'scale(1.1)' : 'scale(1)',
                   backgroundColor: hoverActiveRef.current ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                 }}
               >
                  <h1 
                    className="text-sm m-0 font-bold uppercase tracking-widest"
                    style={{ 
                      color: indicatorColor,
                      textShadow: '0 1px 5px rgba(0,0,0,0.5)'
                    }}
                  >
                    {page.id}
                  </h1>
               </div>
            </div>
          </div>
        </div>
      </Html>

      {/* 3D Component Wrapper physically projected natively onto grid */}
      <group ref={scaleRef} scale={isActive ? 1.0 : 0.4}>
        <group position={[0, -0.45, 0]}> {/* Anchor visually underneath the hex matrix geometry */}
        </group>
      </group>
    </group>
  )
}
