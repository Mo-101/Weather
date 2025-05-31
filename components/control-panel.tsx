"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Camera, BarChart3, Settings } from "lucide-react"
import { AnimalDetection } from "@/components/animal-detection"
import { WeatherAlerts } from "@/components/weather-alerts"

interface ControlPanelProps {
  activePanel: string | null
  setActivePanel: (panel: string | null) => void
  weatherAlerts: any[]
  location: {
    latitude: number
    longitude: number
    name: string
  }
}

export function ControlPanel({ activePanel, setActivePanel, weatherAlerts, location }: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isExpanded) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-black/40 backdrop-blur-lg border-white/20 text-white hover:bg-black/60 p-3"
          variant="outline"
        >
          <Settings className="w-5 h-5" />
        </Button>
        {weatherAlerts.length > 0 && (
          <Button
            onClick={() => {
              setIsExpanded(true)
              setActivePanel("alerts")
            }}
            className="bg-red-500/40 backdrop-blur-lg border-red-400/20 text-white hover:bg-red-500/60 p-3"
            variant="outline"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="ml-1 text-xs">{weatherAlerts.length}</span>
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className="w-80 bg-black/40 backdrop-blur-lg border-white/20 text-white shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Controls</h3>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            ×
          </Button>
        </div>

        <Tabs value={activePanel || "alerts"} onValueChange={setActivePanel} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="alerts" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="detection" className="text-xs">
              <Camera className="w-3 h-3 mr-1" />
              Vision
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              <BarChart3 className="w-3 h-3 mr-1" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="mt-4">
            {weatherAlerts.length > 0 ? (
              <WeatherAlerts alerts={weatherAlerts} compact={true} />
            ) : (
              <div className="text-center text-gray-400 text-sm py-4">No weather alerts at this time</div>
            )}
          </TabsContent>

          <TabsContent value="detection" className="mt-4">
            <AnimalDetection compact={true} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="text-center text-gray-400 text-sm py-4">Weather analytics coming soon</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
