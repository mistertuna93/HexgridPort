import React, { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import * as THREE from 'three'
import gsap from 'gsap'

export const PageContainer = ({ page }) => {
  const groupRef = useRef(null)
  const idleRef = useRef(null)
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
  const waveDirection = usePortfolioStore((state) => state.waveDirection) || new THREE.Vector2(1, 1)
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

  useFrame((state) => {
    if (!groupRef.current) return
    const elapsedTime = state.clock.elapsedTime

    // Physical Hexagon Height Matrix Math
    const proj = centerXZ.dot(waveDirection.clone().normalize())
    const wave = Math.sin(proj * waveFrequency + elapsedTime * waveSpeed) * waveMagnitude

    // Inactive matrices MUST stay locked securely to the structural wave limits natively!
    groupRef.current.position.y = 2 + wave + 0.05

    groupRef.current.position.x = worldX
    groupRef.current.position.z = worldZ

    // HUD Dynamic Viewport Clamped Compass Routing
    if (labelWrapperRef.current) {
      const v = new THREE.Vector3(groupRef.current.position.x, 2 + wave, groupRef.current.position.z)
      v.project(state.camera)

      if (v.z > 1.0) {
        v.x *= -10000
        v.y *= -10000
      }

      const parentScreenX = (v.x * 0.5 + 0.5) * state.size.width
      const parentScreenY = (-v.y * 0.5 + 0.5) * state.size.height

      let labelAbsX = parentScreenX
      let labelAbsY = parentScreenY

      const pad = 60
      labelAbsX = Math.max(pad, Math.min(state.size.width - pad, labelAbsX))
      labelAbsY = Math.max(pad, Math.min(state.size.height - pad, labelAbsY))

      const isClamped = labelAbsX === pad || labelAbsX === state.size.width - pad || labelAbsY === pad || labelAbsY === state.size.height - pad

      // --- UPGRADED BUTTON AVOIDANCE (STRONGER INWARD PULL) ---
      // Increased all radii (r) by 20-30 pixels to create a larger forcefield
      const exclusionZones = [
        { x: 80, y: 80, r: 140 }, // Top-Left: Minimap
        { x: 80, y: state.size.height - 80, r: 180 }, // Bottom-Left: ZoomControls (Largest because of the expanding track)
        { x: state.size.width - 80, y: 80, r: 120 }, // Top-Right: Top UI / Settings
        { x: state.size.width - 80, y: state.size.height - 80, r: 120 } // Bottom-Right: Bottom UI
      ]

      const screenCenterX = state.size.width / 2
      const screenCenterY = state.size.height / 2

      exclusionZones.forEach(zone => {
        const dx = labelAbsX - zone.x
        const dy = labelAbsY - zone.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < zone.r && dist > 0.01) {
          const toCenterX = screenCenterX - labelAbsX
          const toCenterY = screenCenterY - labelAbsY
          const toCenterDist = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY)

          if (toCenterDist > 0.01) {
            const pushForce = zone.r - dist
            // INCREASED MULTIPLIER: Changed from 0.8 to 1.5 for a much stronger shove!
            labelAbsX += (toCenterX / toCenterDist) * pushForce * 1.5
            labelAbsY += (toCenterY / toCenterDist) * pushForce * 1.5
          }
        }
      })
      // -------------------------------------------------

      // Dynamic Perimeter Anti-Stacking Collision Separation
      if (window._frameStackTracker !== state.clock.elapsedTime) {
        window._frameStackTracker = state.clock.elapsedTime
        window._activeClampedPos = []
      }

      if (isClamped) {
        const sep = 70
        let iterations = 0
        let conflict = window._activeClampedPos.find(p => Math.abs(p.x - labelAbsX) < sep && Math.abs(p.y - labelAbsY) < sep)

        while (conflict && iterations < 5) {
          labelAbsY -= sep * 0.5
          labelAbsX -= sep * 0.2
          iterations++
          conflict = window._activeClampedPos.find(p => Math.abs(p.x - labelAbsX) < sep && Math.abs(p.y - labelAbsY) < sep)
        }
      }

      window._activeClampedPos.push({ x: labelAbsX, y: labelAbsY })

      const targetPx = labelAbsX - parentScreenX
      const targetPy = labelAbsY - parentScreenY

      if (!labelWrapperRef.current._currentX) {
        labelWrapperRef.current._currentX = targetPx
        labelWrapperRef.current._currentY = targetPy
      }

      labelWrapperRef.current._currentX += (targetPx - labelWrapperRef.current._currentX) * 0.15
      labelWrapperRef.current._currentY += (targetPy - labelWrapperRef.current._currentY) * 0.15

      labelWrapperRef.current.style.transform = `translate(${labelWrapperRef.current._currentX}px, ${labelWrapperRef.current._currentY}px) translate(-50%, -50%)`

      const mousePx = (state.pointer.x * 0.5 + 0.5) * state.size.width
      const mousePy = (-state.pointer.y * 0.5 + 0.5) * state.size.height
      const hoverDist = Math.sqrt(Math.pow(labelAbsX - mousePx, 2) + Math.pow(labelAbsY - mousePy, 2))

      const isPointerOverUI = usePortfolioStore.getState().isPointerOverUI
      const retentionRadius = hoverActiveRef.current ? 300 : 40
      const isCurrentlyHovered = hoverDist < retentionRadius && view === 'GRID' && !isActive && !isPointerOverUI

      if (isCurrentlyHovered && !hoverActiveRef.current) {
        if (!window._globalHoveredPage) {
          window._globalHoveredPage = page.id
          hoverActiveRef.current = true
          document.body.style.cursor = 'pointer'
          setHoverPoint({ x: worldX, z: worldZ, id: page.id })
        }
      } else if (!isCurrentlyHovered && hoverActiveRef.current) {
        hoverActiveRef.current = false
        if (window._globalHoveredPage === page.id) {
          window._globalHoveredPage = null
        }
        if (document.body.style.cursor === 'pointer' && !window._globalHoveredPage) {
          document.body.style.cursor = 'auto'
        }
        setHoverPoint(null)
      }
    }
  })

  useEffect(() => {
    const handleClick = () => {
      if (hoverActiveRef.current && view === 'GRID' && window._globalHoveredPage === page.id) {
        window._globalHoveredPage = null
        triggerZoom(page.id)
      }
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [page.id, view, triggerZoom])

  useEffect(() => {
    if (view === 'ZOOMED' && isActive) {
      if (idleRef.current) gsap.to(idleRef.current, { opacity: 0, duration: 0.3 })
    } else {
      if (idleRef.current) gsap.to(idleRef.current, { opacity: 1, duration: 0.6, delay: 0.8 })
    }
  }, [view, isActive])

  const indicatorColor = page.theme || '#ffffff'

  return (
    <group ref={groupRef} position={[worldX, 2, worldZ]}>
      <Html center zIndexRange={[100, 0]}>
        <div
          ref={idleRef}
          className="relative w-0 h-0 pointer-events-none transition-opacity duration-300"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
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

      <group scale={isActive ? 1.0 : 0.4}>
        <group position={[0, -0.45, 0]} />
      </group>
    </group>
  )
}