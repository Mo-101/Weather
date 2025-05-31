"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Gauge, MapPin } from "lucide-react"

interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
  }
  visibility?: number
  name: string
}

interface WeatherPanelProps {
  weatherData: WeatherData | null
  location: {
    name: string
    latitude: number
    longitude: number
  }
  isLoading: boolean
  compact?: boolean
}

export function WeatherPanel({ weatherData, location, isLoading, compact = false }: WeatherPanelProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-6 h-6 text-yellow-400" />
      case "clouds":
        return <Cloud className="w-6 h-6 text-gray-400" />
      case "rain":
        return <CloudRain className="w-6 h-6 text-blue-400" />
      default:
        return <Sun className="w-6 h-6 text-yellow-400" />
    }
  }

  if (isLoading) {
    return (
      <Card className="w-72 bg-black/40 backdrop-blur-lg border-white/20 text-white shadow-2xl">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-3 bg-gray-300/20 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-300/20 rounded w-1/2 mb-3"></div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-300/20 rounded"></div>
              <div className="h-2 bg-gray-300/20 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) {
    return (
      <Card className="w-72 bg-black/40 backdrop-blur-lg border-white/20 text-white shadow-2xl">
        <CardContent className="p-4">
          <p className="text-sm">Click on the map to get weather data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-72 bg-black/40 backdrop-blur-lg border-white/20 text-white shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-purple-400" />
          <span className="truncate">{location.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weatherData.weather[0].main)}
            <div>
              <div className="text-2xl font-bold">{Math.round(weatherData.main.temp)}°C</div>
              <div className="text-xs text-gray-300 capitalize">{weatherData.weather[0].description}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-red-400" />
            <span>Feels {Math.round(weatherData.main.feels_like)}°C</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-400" />
            <span>{weatherData.main.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-gray-400" />
            <span>{weatherData.wind.speed} m/s</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-gray-400" />
            <span>{weatherData.main.pressure} hPa</span>
          </div>
        </div>

        <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
          <div>
            {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
