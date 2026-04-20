import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import * as THREE from 'three'
import gsap from 'gsap'

export const PageContainer = ({ page }) => {
  const groupRef = useRef(null)
  const scaleRef = useRef(null)
  const contentRef = useRef(null)
  
  const view = usePortfolioStore((state) => state.view)
  const activePageId = usePortfolioStore((state) => state.activePageId)
  const resetView = usePortfolioStore((state) => state.resetView)

  // Mathematically calculate the absolute physical world X/Z for this specific page
  const r = usePortfolioStore((state) => state.hexSize)
  const waveSpeed = usePortfolioStore((state) => state.waveSpeed)
  const waveHeight = usePortfolioStore((state) => state.waveHeight)
  const hexWidth = Math.sqrt(3) * r
  
  const modRow = ((page.vCoord.y % 2) + 2) % 2
  const worldX = (page.vCoord.x + modRow * 0.5) * hexWidth
  const worldZ = page.vCoord.y * 1.5 * r

  const isActive = activePageId === page.id

  // 1. Manually synchronize the JS bounding box to the GPU Wavy Ocean GLSL logic
  useFrame((state) => {
    if (!groupRef.current) return
    const elapsedTime = state.clock.getElapsedTime()
    // Calculate identical vertex shader offset
    const wave = Math.sin(worldX * 0.3 + elapsedTime * waveSpeed) * Math.cos(worldZ * 0.3 + elapsedTime * (waveSpeed * 0.73)) * waveHeight
    // 2 is half of physical thickness (4). We add 0.05 margin to cleanly avoid Z-fighting.
    groupRef.current.position.y = 2 + wave + 0.05
  })

  // 2. Synchronize GSAP to zoom and scale the panel seamlessly into your screen viewport
  useEffect(() => {
    if (view === 'ZOOMED' && isActive) {
      // Scale dramatically from the top of the Hexagon to visually encompass the immediate camera frustum
      gsap.to(scaleRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 1.2,
        ease: 'power3.inOut'
      })
      gsap.to(contentRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.6,
        delay: 0.6 // Wait until we are somewhat close before fully fading DOM in
      })
    } else {
      // Return elegantly to the hexagon surface
      gsap.to(scaleRef.current.scale, {
        x: 0.2, y: 0.2, z: 0.2, // Small spatial size
        duration: 1.2,
        ease: 'power3.inOut'
      })
      gsap.to(contentRef.current, {
        opacity: 0.8, // Semi-transparent idle state indicator
        pointerEvents: 'none',
        duration: 0.4
      })
    }
  }, [view, isActive])

  // Normalization scaling factor. Maps a 600px wide DOM Block back down to ~3D spatial units.
  const htmlScale = 0.005 

  return (
    <group ref={groupRef} position={[worldX, 2, worldZ]}>
      {/* 
        This nested group absorbs GSAP manipulation smoothly along individual vectors, 
        free from the positional waving updates of its parent.
      */}
      <group ref={scaleRef} scale={0.2}>
        <Html 
          transform 
          occlude="blending" 
          rotation={[-Math.PI / 2, 0, 0]} 
          scale={htmlScale}
        >
          <div 
            ref={contentRef}
            style={{ 
              width: '800px', 
              height: '600px',
              background: `linear-gradient(145deg, ${page.theme} 0%, rgba(20,20,25,0.95) 80%)`,
              backdropFilter: 'blur(10px)',
              borderRadius: '40px',
              padding: '60px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.8,
              pointerEvents: 'none', // Prevents DOM stealing clicks from the R3F Canvas when inactive
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)',
              border: `4px solid ${page.theme}`,
              color: 'white',
              fontFamily: 'system-ui, sans-serif'
            }}
          >
            <h1 style={{ fontSize: '5rem', margin: '0 0 20px 0', textShadow: '0 4px 15px rgba(0,0,0,0.5)', textTransform: 'uppercase' }}>
              {page.id}
            </h1>
            <p style={{ fontSize: '1.8rem', opacity: 0.7, marginBottom: 'auto' }}>
              Sector Map Coordinates: [{page.vCoord.x}, {page.vCoord.y}]
            </p>

            {/* Fulfills requirement: Close Button driving Zustand resets */}
            <button 
              onClick={(e) => {
                e.stopPropagation()
                resetView()
              }}
              style={{
                marginTop: 'auto',
                padding: '20px 60px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                borderRadius: '40px',
                border: 'none',
                background: 'white',
                color: '#1a1a1a',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Exit View
            </button>
          </div>
        </Html>
      </group>
    </group>
  )
}
