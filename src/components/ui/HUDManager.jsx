import React from 'react'
import { HomeOverlay } from './HomeOverlay'
import { ActivePageOverlay } from './ActivePageOverlay'
import { SettingsDashboard } from './SettingsDashboard'
import { ZoomControls } from './ZoomControls'
import { Minimap } from './Minimap'

export const HUDManager = () => {
    return (
        <>
            <HomeOverlay />
            <ActivePageOverlay />
            <SettingsDashboard />
            <ZoomControls />
            <Minimap />
        </>
    )
}