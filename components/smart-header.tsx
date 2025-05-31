"use client"

import React from "react"
import { Button } from "@/components/ui/button" // Assuming you have a Button component

interface SmartHeaderProps {
  visible: boolean
  onToggleWeather: () => void
  onToggleRisk: () => void
  onToggleControl: () => void
  onToggleColonies: () => void
  onToggleAnalytics: () => void
  onToggleSettings: () => void
  onToggleAIHub: () => void
}

export default function SmartHeader({
  visible,
  onToggleWeather,
  onToggleRisk,
  onToggleControl,
  onToggleColonies,
  onToggleAnalytics,
  onToggleSettings,
  onToggleAIHub,
}: SmartHeaderProps) {
  if (!visible) {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/70 backdrop-blur-md text-white p-4 shadow-lg z-[1000] transition-transform duration-300 ease-in-out">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Weather App Dashboard</h1>
        <nav className="flex space-x-2">
          <Button onClick={onToggleWeather} variant="ghost" size="sm">Weather</Button>
          <Button onClick={onToggleRisk} variant="ghost" size="sm">Risk</Button>
          <Button onClick={onToggleControl} variant="ghost" size="sm">Control</Button>
          <Button onClick={onToggleColonies} variant="ghost" size="sm">Colonies</Button>
          <Button onClick={onToggleAnalytics} variant="ghost" size="sm">Analytics</Button>
          <Button onClick={onToggleSettings} variant="ghost" size="sm">Settings</Button>
          <Button onClick={onToggleAIHub} variant="ghost" size="sm">AI Hub</Button>
          {/* Add more navigation items or a menu button for smaller screens */}
        </nav>
      </div>
    </header>
  )
}