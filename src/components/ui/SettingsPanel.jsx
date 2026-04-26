import React, { useState } from 'react'
import { usePortfolioStore, presets } from '../../store/usePortfolioStore'

export const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const openHome = usePortfolioStore((s) => s.openHome)

  const hexSize = usePortfolioStore((s) => s.hexSize)
  const gridSpacing = usePortfolioStore((s) => s.gridSpacing)
  const waveSpeed = usePortfolioStore((s) => s.waveSpeed)
  const waveHeight = usePortfolioStore((s) => s.waveHeight)
  const wallHeight = usePortfolioStore((s) => s.wallHeight)
  const theme = usePortfolioStore((s) => s.theme)
  const setParam = usePortfolioStore((s) => s.setParam)
  const setThemeParam = usePortfolioStore((s) => s.setThemeParam)
  const applyPreset = usePortfolioStore((s) => s.applyPreset)

  return (
    <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 100, display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
      {!isOpen && (
        <button
          onClick={openHome}
          style={{
            background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
            width: '54px', height: '54px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(10px)',
            fontSize: '1.4rem', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        > ? </button>
      )}

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
            padding: '0 30px', height: '54px', borderRadius: '30px', cursor: 'pointer', backdropFilter: 'blur(10px)',
            fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'background 0.2s'
          }}
        > ❖ Config </button>
      ) : (
        <div style={{
          background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: '25px',
          padding: '30px', width: '340px', color: 'white', fontFamily: 'system-ui, sans-serif',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>System Config</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }}>✕</button>
          </div>
          <div style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
            {Object.keys(presets).map((p) => (
              <button key={p} onClick={() => applyPreset(p)} style={{ flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', textTransform: 'capitalize', fontSize: '0.9rem', fontWeight: 'bold' }}>{p}</button>
            ))}
          </div>
          {[
            { label: 'Hex Size', key: 'hexSize', val: hexSize, min: 0.3, max: 2.5, step: 0.1 },
            { label: 'Grid Margin (%)', key: 'gridSpacing', val: gridSpacing, min: 0.6, max: 1.0, step: 0.01 },
            { label: 'Wave Speed', key: 'waveSpeed', val: waveSpeed, min: 0.0, max: 5.0, step: 0.1 },
            { label: 'Ocean Height', key: 'waveHeight', val: waveHeight, min: 0.0, max: 8.0, step: 0.1 },
            { label: 'Shaft Depth', key: 'wallHeight', val: wallHeight, min: 0.0, max: 150.0, step: 2.0 }
          ].map((ctrl) => (
            <div key={ctrl.key} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px', color: '#c2c2c2' }}>
                <span>{ctrl.label}</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>{ctrl.val}</span>
              </div>
              <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={ctrl.val} onChange={(e) => setParam(ctrl.key, parseFloat(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '15px', marginTop: '25px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { label: 'Void BG', key: 'background', val: theme.background },
              { label: 'Matrix Floor', key: 'grid', val: theme.grid },
              { label: 'Pulse Accent', key: 'accent', val: theme.accent }
            ].map((clr) => (
              <div key={clr.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#c2c2c2', textAlign: 'center' }}>{clr.label}</span>
                <input type="color" value={clr.val} onChange={(e) => setThemeParam(clr.key, e.target.value)} style={{ width: '100%', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0, background: 'transparent' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}