import { useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import gsap from 'gsap'

export const CameraController = () => {
  const { camera, controls } = useThree()
  const pages = usePortfolioStore((state) => state.pages)
  const view = usePortfolioStore((state) => state.view)
  const activePageId = usePortfolioStore((state) => state.activePageId)

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

  useFrame(() => {
    if (!controls) return
    
    // Clamp panning targets so camera never wanders out of bounds
    controls.target.x = Math.max(bounds.minX - padding, Math.min(bounds.maxX + padding, controls.target.x))
    controls.target.z = Math.max(bounds.minZ - padding, Math.min(bounds.maxZ + padding, controls.target.z))
    controls.update()
  })

  // GSAP Triggers
  useEffect(() => {
    if (!controls) return

    if (view === 'ZOOMED' && activePageId) {
      const page = pages.find((p) => p.id === activePageId)
      if (!page) return

      const modRow = ((page.vCoord.y % 2) + 2) % 2
      const worldX = (page.vCoord.x + modRow * 0.5) * hexWidth
      const worldZ = page.vCoord.y * 1.5 * r
      
      controls.enabled = false
      
      // Animate Camera Height
      gsap.to(camera.position, {
        x: worldX,
        y: 6, // Low altitude Zoom
        z: worldZ + 0.1, // Offset prevents top-down gimbal lock
        duration: 1.2,
        ease: 'power3.inOut'
      })

      // Animate Control Target (Panning instantly to coordinate)
      gsap.to(controls.target, {
        x: worldX,
        y: 0,
        z: worldZ,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
        onComplete: () => { controls.enabled = true }
      })
    } else if (view === 'GRID') {
      controls.enabled = false
      gsap.to(camera.position, {
        y: 20, // Grid altitude
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
        onComplete: () => { controls.enabled = true }
      })
    }
  }, [view, activePageId, pages, camera, controls, hexWidth])

  return null
}
