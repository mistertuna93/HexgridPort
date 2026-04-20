import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { MapControls, KeyboardControls, useKeyboardControls } from '@react-three/drei'
import { InfiniteHexGrid } from './components/canvas/InfiniteHexGrid'
import { CameraController } from './components/canvas/CameraController'
import { EdgeIndicators, EdgeIndicatorsDOM } from './components/ui/EdgeIndicators'
import { PageContainer } from './components/canvas/PageContainer'
import { SettingsPanel } from './components/ui/SettingsPanel'
import { usePortfolioStore } from './store/usePortfolioStore'

// Binds configured keys directly to our Zustand routing actions
const KeyboardRouter = () => {
  const [subscribe] = useKeyboardControls()
  const nextPage = usePortfolioStore((state) => state.nextPage)
  const prevPage = usePortfolioStore((state) => state.prevPage)

  useEffect(() => {
    const unsubNext = subscribe((state) => state.nextPage, (pressed) => pressed && nextPage())
    const unsubPrev = subscribe((state) => state.prevPage, (pressed) => pressed && prevPage())
    
    return () => {
      unsubNext()
      unsubPrev()
    }
  }, [subscribe, nextPage, prevPage])

  return null
}

const keyboardBindings = [
  { name: 'nextPage', keys: ['ArrowRight', 'ArrowDown', 'KeyD', 'KeyS'] },
  { name: 'prevPage', keys: ['ArrowLeft', 'ArrowUp', 'KeyA', 'KeyW'] }
]

function App() {
  const pages = usePortfolioStore((state) => state.pages)
  const themeBg = usePortfolioStore((state) => state.theme.background) // Reactive background color

  return (
    <KeyboardControls map={keyboardBindings}>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: themeBg, transition: 'background 0.5s ease' }}>
        
        {/* The headless router sits above the WebGL context */}
        <KeyboardRouter />
        
        {/* Positioned the camera perfectly vertical looking down */}
        <Canvas camera={{ position: [0, 20, 0], fov: 45 }}>
          <color attach="background" args={[themeBg]} />
          {/* Fog matched seamlessly to the new dynamic background color */}
          <fog attach="fog" args={[themeBg, 20, 65]} />
          
          {/* Lighting setup */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 20, 10]} intensity={2} color="#abcdef" />
          <directionalLight position={[-10, 20, -10]} intensity={1} color="#ffebba" />
          
          <InfiniteHexGrid />
          <CameraController />
          <EdgeIndicators />
          
          {/* Stamps the localized HTML nodes onto the spatial layout */}
          {pages.map((p) => (
            <PageContainer key={p.id} page={p} />
          ))}
          
          {/* Constraints limit zooming and lock both polar angle and rotation to strictly top-down */}
          <MapControls 
            makeDefault 
            enableDamping 
            enableRotate={false} 
            minDistance={5} 
            maxDistance={40} 
            maxPolarAngle={0} 
            minPolarAngle={0} 
          />
        </Canvas>
      </div>
      
      {/* 2D Overlay UI layers */}
      <EdgeIndicatorsDOM />
      <SettingsPanel />
      
    </KeyboardControls>
  )
}

export default App
