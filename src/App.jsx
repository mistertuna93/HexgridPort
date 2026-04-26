import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { InfiniteHexGrid } from './components/canvas/InfiniteHexGrid'
import { CameraController } from './components/canvas/CameraController'

import { PageContainer } from './components/canvas/PageContainer'
import { SettingsDashboard } from './components/ui/SettingsDashboard'
import { ActivePageOverlay } from './components/ui/ActivePageOverlay'
import { usePortfolioStore } from './store/usePortfolioStore'
import { ZoomControls } from './components/ui/ZoomControls'
import { Minimap } from './components/ui/Minimap'

// Implicit pagination router removed to allow MapControls exclusive uninhibited arrow access natively

function App() {
  const pages = usePortfolioStore((state) => state.pages)
  const themeBg = usePortfolioStore((state) => state.theme.background) // Reactive background color

  return (
    <>
      <div
        className="w-screen h-screen overflow-hidden flex flex-col transition-colors duration-500 ease-in-out"
        style={{ backgroundColor: themeBg }}
        onPointerEnter={() => usePortfolioStore.setState({ isCursorInside: true })}
        onPointerLeave={() => usePortfolioStore.setState({ isCursorInside: false })}
      >

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

          {/* Stamps the localized HTML nodes onto the spatial layout */}
          {pages.map((p) => (
            <PageContainer key={p.id} page={p} />
          ))}

          {/* Constraints limit zooming and lock both polar angle and rotation to strictly top-down */}
          <MapControls
            makeDefault
            enableDamping
            enableZoom={true}
            zoomSpeed={1.5}
            enableRotate={false}
            minDistance={15}
            maxDistance={40}
            maxPolarAngle={0}
            minPolarAngle={0}
            listenToKeyEvents={window}
          />
        </Canvas>
      </div>

      {/* 2D Overlay UI layers */}
      <ActivePageOverlay />
      <SettingsDashboard />
      <ZoomControls />
      <Minimap />
    </>
  )
}

export default App
