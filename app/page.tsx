"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { WeatherPanel } from "@/components/weather-panel"
import { ChatBot } from "@/components/chat-bot"
import { AnimalDetection } from "@/components/animal-detection"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoadingSpinner } from "@/components/loading-spinner"
import { WeatherAlerts } from "@/components/weather-alerts"
import { WeatherForecast } from "@/components/weather-forecast"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="relative h-screen flex">
        {/* Cesium Map Container */}
        <div className="flex-1 relative">
          <CesiumMap onLocationSelect={fetchWeatherData} selectedLocation={selectedLocation} />

          {/* Overlay Panels */}
          <div className="absolute top-4 left-4 z-10 space-y-4">
            <WeatherPanel weatherData={weatherData} location={selectedLocation} isLoading={isLoading} />
            {weatherAlerts.length > 0 && <WeatherAlerts alerts={weatherAlerts} />}
          </div>

          <div className="absolute bottom-20 left-4 z-10">
            <WeatherForecast location={selectedLocation} />
          </div>

          <div className="absolute top-4 right-4 z-10">
            <AnimalDetection />
          </div>

          <div className="absolute bottom-4 right-4 z-10">
            <ChatBot />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
