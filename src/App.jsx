import React from 'react'
import { Canvas } from '@react-three/fiber'
import { MapControls, Environment } from '@react-three/drei'
import { InfiniteHexGrid } from './components/canvas/InfiniteHexGrid'
import { CameraController } from './components/canvas/CameraController'
import { EdgeIndicators, EdgeIndicatorsDOM } from './components/ui/EdgeIndicators'

function App() {
  return (
    <>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#09090b' }}>
        {/* Positioned the camera perfectly vertical looking down */}
        <Canvas camera={{ position: [0, 20, 0], fov: 45 }}>
          <color attach="background" args={['#09090b']} />
          {/* Fog matched to background color hides the grid edges */}
          <fog attach="fog" args={['#09090b', 20, 65]} />
          
          {/* Lighting setup */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 20, 10]} intensity={2} color="#abcdef" />
          <directionalLight position={[-10, 20, -10]} intensity={1} color="#ffebba" />
          
          <InfiniteHexGrid />
          <CameraController />
          <EdgeIndicators />
          
          {/* Constraints limit zooming and lock both polar angle and rotation to strictly top-down */}
          <MapControls 
            makeDefault 
            enableDamping 
            enableRotate={false} // Prevents azimuthal rotation (spinning)
            minDistance={5} 
            maxDistance={40} 
            maxPolarAngle={0} // Locked to vertical
            minPolarAngle={0} // Locked to vertical
          />
        </Canvas>
      </div>
      
      {/* 2D Overlay layer for pointer UI outside the WebGL context */}
      <EdgeIndicatorsDOM />
    </>
  )
}

export default App

