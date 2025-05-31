"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { WeatherPanel } from "@/components/weather-panel"
import { ChatBot } from "@/components/chat-bot"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoadingSpinner } from "@/components/loading-spinner"
import { WeatherForecast } from "@/components/weather-forecast"
import { ControlPanel } from "@/components/control-panel"

// Dynamically import Cesium component to avoid SSR issues
const CesiumMap = dynamic(() => import("@/components/cesium-map"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState({
    longitude: 8.6753,
    latitude: 9.082,
    name: "Nigeria",
  })
  const [weatherData, setWeatherData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [weatherAlerts, setWeatherAlerts] = useState([])
  const [activePanel, setActivePanel] = useState<string | null>("weather")

  const fetchWeatherData = async (lat: number, lon: number, locationName: string) => {
    setIsLoading(true)
    try {
      const [weatherResponse, alertsResponse] = await Promise.all([
        fetch(`/api/weather?lat=${lat}&lon=${lon}`),
        fetch(`/api/weather/alerts?lat=${lat}&lon=${lon}`),
      ])

      const weatherData = await weatherResponse.json()
      const alertsData = await alertsResponse.json()

      setWeatherData(weatherData)
      setWeatherAlerts(alertsData.alerts || [])
      setSelectedLocation({ longitude: lon, latitude: lat, name: locationName })
    } catch (error) {
      console.error("Error fetching weather data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Fetch initial weather data for Nigeria
    fetchWeatherData(9.082, 8.6753, "Nigeria")
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Navigation */}
      <Navigation />

      {/* Main Content - Full Screen Cesium Map */}
      <div className="relative h-screen">
        {/* Cesium Map Container - Full Background */}
        <div className="absolute inset-0">
          <CesiumMap onLocationSelect={fetchWeatherData} selectedLocation={selectedLocation} />
        </div>

        {/* Left Side Panel - Compact Weather Info */}
        <div className="absolute top-20 left-4 z-20">
          <WeatherPanel weatherData={weatherData} location={selectedLocation} isLoading={isLoading} compact={true} />
        </div>

        {/* Right Side Control Panel */}
        <div className="absolute top-20 right-4 z-20">
          <ControlPanel
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            weatherAlerts={weatherAlerts}
            location={selectedLocation}
          />
        </div>

        {/* Bottom Panel - Forecast (Collapsible) */}
        <div className="absolute bottom-20 left-4 right-4 z-20">
          <WeatherForecast location={selectedLocation} horizontal={true} />
        </div>

        {/* Floating Chat Button */}
        <div className="absolute bottom-6 right-6 z-30">
          <ChatBot />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
