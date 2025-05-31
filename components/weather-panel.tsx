"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Gauge } from "lucide-react"

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
}

export function WeatherPanel({ weatherData, location, isLoading }: WeatherPanelProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-8 h-8 text-yellow-400" />
      case "clouds":
        return <Cloud className="w-8 h-8 text-gray-400" />
      case "rain":
        return <CloudRain className="w-8 h-8 text-blue-400" />
      default:
        return <Sun className="w-8 h-8 text-yellow-400" />
    }
  }

  if (isLoading) {
    return (
      <Card className="w-80 bg-black/20 backdrop-blur-md border-purple-500/30 text-white">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300/20 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-300/20 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300/20 rounded"></div>
              <div className="h-3 bg-gray-300/20 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) {
    return (
      <Card className="w-80 bg-black/20 backdrop-blur-md border-purple-500/30 text-white">
        <CardContent className="p-6">
          <p>No weather data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-80 bg-black/20 backdrop-blur-md border-purple-500/30 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getWeatherIcon(weatherData.weather[0].main)}
          <span className="truncate">{location.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</div>
          <div className="text-sm text-gray-300 capitalize">{weatherData.weather[0].description}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-red-400" />
            <span>Feels like {Math.round(weatherData.main.feels_like)}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>{weatherData.main.humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-400" />
            <span>{weatherData.wind.speed} m/s</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span>{weatherData.main.pressure} hPa</span>
          </div>
        </div>

        {weatherData.visibility && (
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-gray-400" />
            <span>Visibility: {(weatherData.visibility / 1000).toFixed(1)} km</span>
          </div>
        )}

        <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
          <div>
            Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </div>
          <div>Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
