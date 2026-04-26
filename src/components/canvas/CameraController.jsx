import { useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import gsap from 'gsap'

export const CameraController = () => {
  const { camera, controls } = useThree()
  const pages = usePortfolioStore((state) => state.pages)
  const view = usePortfolioStore((state) => state.view)
  const activePageId = usePortfolioStore((state) => state.activePageId)
  const hoverPoint = usePortfolioStore((state) => state.hoverPoint)
  const wallHeight = usePortfolioStore((state) => state.wallHeight) || 30 // Extract configuration limit

  // Fetch responsive coordinates to stretch bounds appropriately
  const r = usePortfolioStore((state) => state.hexSize)
  const hexWidth = Math.sqrt(3) * r

  // Calculate the Bounding Box of all mapped pages so user can't get lost
  const bounds = useMemo(() => {
    const minV = pages.reduce((acc, p) => ({ x: Math.min(acc.x, p.vCoord.x), y: Math.min(acc.y, p.vCoord.y) }), { x: Infinity, y: Infinity })
    const maxV = pages.reduce((acc, p) => ({ x: Math.max(acc.x, p.vCoord.x), y: Math.max(acc.y, p.vCoord.y) }), { x: -Infinity, y: -Infinity })

    return {
      minX: (minV.x - 1) * hexWidth,
      maxX: (maxV.x + 1) * hexWidth,
      minZ: (minV.y - 1) * 1.5 * r,
      maxZ: (maxV.y + 1) * 1.5 * r
    }
  }, [pages, hexWidth, r])
  
  const padding = 15 // Margin around the bounding box

  useFrame((state, delta) => {
    if (!controls) return
    
    // Joystick Camera Drive - dynamically continuous sliding logic mapped strictly to cursor hover presence natively
    if (view === 'GRID') {
      const isCursorInside = usePortfolioStore.getState().isCursorInside
      
      if (isCursorInside) {
        // Core Viewport Edge panning strictly smoothly triggering RTS tracker identically
        const edgeThreshold = 0.92 // Outermost 4% cleanly cleanly
        
        let panX = 0
        let panZ = 0
        
        if (state.pointer.x > edgeThreshold) panX = 1
        if (state.pointer.x < -edgeThreshold) panX = -1
        
        // Y mapping: Top of screen natively pushes tracking backwards (-Z into distance) identically natively
        if (state.pointer.y > edgeThreshold) panZ = -1
        if (state.pointer.y < -edgeThreshold) panZ = 1
        
        if (panX !== 0 || panZ !== 0) {
           const panSpeed = 25.0 * delta
           const len = Math.sqrt(panX*panX + panZ*panZ)
           
           camera.position.x += (panX / len) * panSpeed
           camera.position.z += (panZ / len) * panSpeed
           controls.target.x += (panX / len) * panSpeed
           controls.target.z += (panZ / len) * panSpeed
           controls.update()
        }
      }
    }
    
    // Clamp panning targets so camera never wanders out of bounds organically mathematically
    controls.target.x = Math.max(bounds.minX - padding, Math.min(bounds.maxX + padding, controls.target.x))
    controls.target.z = Math.max(bounds.minZ - padding, Math.min(bounds.maxZ + padding, controls.target.z))
    
    // Sustain absolute spatial awareness in the store for flight duration calculations
    usePortfolioStore.setState({ lastCameraPos: camera.position.clone() })
    
    controls.update()
  })

  // GSAP Triggers
  useEffect(() => {
    if (!controls) return

    if (view === 'FOCUSING' && activePageId) {
      const currentPages = usePortfolioStore.getState().pages
      const page = currentPages.find((p) => p.id === activePageId)
      if (!page) return
      
      const r = usePortfolioStore.getState().hexSize || 1.0
      const hexWidth = Math.sqrt(3) * r
      const modRow = ((page.vCoord.y % 2) + 2) % 2
      const worldX = (page.vCoord.x + modRow * 0.5) * hexWidth
      const worldZ = page.vCoord.y * 1.5 * r

      // Target perfectly centered heavily zoomed all the way cleanly independently mapping native layout beautifully 
      const tCamX = worldX
      const tCamY = 15 // Elevated slightly to prevent near-plane clipping when hex expands
      const tCamZ = worldZ // Exactly centered to maintain MapControls strict top-down polarAngle
      const tLookX = worldX
      const tLookY = 0
      const tLookZ = worldZ

      // Capture duration from store (was pre-calculated in transitionToPage)
      const flightDuration = usePortfolioStore.getState().flightDuration

      controls.enabled = false

      // Ensure the control's target smoothly interpolates tightly natively
      if (controls) {
        gsap.to(controls.target, {
          x: tLookX,
          y: tLookY,
          z: tLookZ,
          duration: flightDuration,
          ease: 'power2.inOut'
        })
      }

      gsap.to(camera.position, {
        x: tCamX,
        y: tCamY,
        z: tCamZ,
        duration: flightDuration,
        ease: 'power2.inOut',
        onUpdate: () => controls?.update(),
        onComplete: () => {
           // Allow camera cleanly executing seamlessly firing isolated route completely gracefully native
           controls.enabled = true
           if (usePortfolioStore.getState().view === 'FOCUSING') {
              // Once flight is complete, trigger the structural growth phase natively
              usePortfolioStore.setState({ view: 'GROWING' })
           }
        }
      })
    } else if (view === 'GRID' && !activePageId) {
      // Retain tracking strictly locked natively seamlessly isolating the exact zoomed limit inherently mapped cleanly explicitly smoothly statically safely!
      controls.enabled = true
      usePortfolioStore.setState({ isTransitioning: false })
    }
  }, [view, activePageId, camera, controls, hexWidth])

  return null
}
