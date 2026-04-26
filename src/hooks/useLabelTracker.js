import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePortfolioStore } from '../store/usePortfolioStore'

export const useLabelTracker = ({ page, groupRef, labelWrapperRef, hoverActiveRef, worldX, worldZ, centerXZ, isActive }) => {
    const view = usePortfolioStore((state) => state.view)
    const setHoverPoint = usePortfolioStore((state) => state.setHoverPoint)
    const waveSpeed = usePortfolioStore((state) => state.waveSpeed)
    const waveFrequency = usePortfolioStore((state) => state.waveFrequency)
    const waveMagnitude = usePortfolioStore((state) => state.waveMagnitude)
    const waveDirection = usePortfolioStore((state) => state.waveDirection) || new THREE.Vector2(1, 1)

    useFrame((state) => {
        if (!groupRef.current) return
        const elapsedTime = state.clock.elapsedTime

        // Physical Hexagon Height Matrix Math
        const proj = centerXZ.dot(waveDirection.clone().normalize())
        const wave = Math.sin(proj * waveFrequency + elapsedTime * waveSpeed) * waveMagnitude

        groupRef.current.position.y = 2 + wave + 0.05
        groupRef.current.position.x = worldX
        groupRef.current.position.z = worldZ

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

            const exclusionZones = [
                { x: 80, y: 80, r: 140 },
                { x: 80, y: state.size.height - 80, r: 180 },
                { x: state.size.width - 80, y: 80, r: 120 },
                { x: state.size.width - 80, y: state.size.height - 80, r: 120 }
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
                        labelAbsX += (toCenterX / toCenterDist) * pushForce * 1.5
                        labelAbsY += (toCenterY / toCenterDist) * pushForce * 1.5
                    }
                }
            })

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
}