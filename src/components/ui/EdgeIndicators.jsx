import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import * as THREE from 'three'

export const EdgeIndicators = () => {
  const { camera, size } = useThree()
  const pages = usePortfolioStore((state) => state.pages)
  const activePageId = usePortfolioStore((state) => state.activePageId)
  
  const r = 1
  const hexWidth = Math.sqrt(3) * r

  useFrame(() => {
    pages.forEach((page) => {
      const container = document.getElementById(`indicator-${page.id}`)
      if (!container) return

      // Don't show indicator for the currently active/zoomed page
      if (activePageId === page.id) {
        container.style.opacity = '0'
        return
      }

      // Find Physical Coordinates
      const modRow = ((page.vCoord.y % 2) + 2) % 2
      const worldX = (page.vCoord.x + modRow * 0.5) * hexWidth
      const worldZ = page.vCoord.y * 1.5 * r
      
      const v = new THREE.Vector3(worldX, 0, worldZ)
      // Project Physical -> Normalized Device Coordinates [-1, 1]
      v.project(camera)

      // Test Bounds (Add a tiny buffer like 1.1 so it only triggers fully offscreen)
      const isOffScreen = v.x < -1.1 || v.x > 1.1 || v.y < -1 || v.y > 1 || v.z > 1

      if (isOffScreen) {
        container.style.opacity = '1'

        let clampedX = v.x
        let clampedY = v.y
        
        // If block is deeply behind the camera, point away
        if (v.z > 1) {
          clampedX = -v.x
          clampedY = -v.y
        }
        
        // Clamp it smoothly to inner edge boundaries (0.95 gives padding)
        const edgeLimit = 0.95
        const scale = edgeLimit / Math.max(Math.abs(clampedX), Math.abs(clampedY))
        clampedX *= scale
        clampedY *= scale

        // Scale NDC -> Viewport Pixels
        const px = (clampedX * 0.5 + 0.5) * size.width
        const py = -(clampedY * 0.5 - 0.5) * size.height 

        // Point rotation towards location
        const angle = Math.atan2(-clampedY, clampedX)

        container.style.transform = `translate(${px}px, ${py}px) rotate(${angle}rad)`
      } else {
        container.style.opacity = '0'
      }
    })
  })

  return null
}

export const EdgeIndicatorsDOM = () => {
  const pages = usePortfolioStore((state) => state.pages)
  
  return (
    <div 
      id="indicators-container" 
      style={{ 
        position: 'absolute', 
        top: 0, left: 0, 
        width: '100%', height: '100%', 
        pointerEvents: 'none', 
        zIndex: 10 
      }}
    >
      {pages.map(page => (
        <div 
          key={page.id} 
          id={`indicator-${page.id}`}
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            marginLeft: '-10px',      // Center the origin of the rotation logically
            marginTop: '-10px',
            opacity: 0,
            transition: 'opacity 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform' // Performance opt
          }}
        >
          {/* Arrow pointing physically Right, then CSS Rotate handles direction */}
          <div style={{
            width: 0, height: 0, 
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: `14px solid ${page.theme}`
          }} />
        </div>
      ))}
    </div>
  )
}
