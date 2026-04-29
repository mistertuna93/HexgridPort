import React from 'react'
import { ActivePageOverlay } from './ActivePageOverlay'
import { SettingsDashboard } from './SettingsDashboard'
import { ZoomControls } from './ZoomControls'
import { Minimap } from './Minimap'

export const HUDManager = () => {
    return (
        <>
            <ActivePageOverlay />
            <SettingsDashboard />
            <ZoomControls />
            <Minimap />
        </>
    )
}