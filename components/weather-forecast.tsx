"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Sun, Cloud, CloudRain } from "lucide-react"

interface ForecastDay {
  dt: number
  temp: {
    day: number
    night: number
    min: number
    max: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  humidity: number
  wind_speed: number
  pop: number // Probability of precipitation
}

interface WeatherForecastProps {
  location: {
    latitude: number
    longitude: number
    name: string
  }
}

export function WeatherForecast({ location }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/weather/forecast?lat=${location.latitude}&lon=${location.longitude}`)
        const data = await response.json()
        setForecast(data.daily || [])
      } catch (error) {
        console.error("Error fetching forecast:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (location.latitude && location.longitude) {
      fetchForecast()
    }
  }, [location])

  const nextDay = () => {
    setCurrentIndex((prev) => (prev + 1) % forecast.length)
  }

  const prevDay = () => {
    setCurrentIndex((prev) => (prev - 1 + forecast.length) % forecast.length)
  }

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
      <Card className="w-80 bg-black/20 backdrop-blur-md border-purple-500/30 text-white">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300/20 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300/20 rounded"></div>
              <div className="h-3 bg-gray-300/20 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!forecast.length) {
    return null
  }

  const currentDay = forecast[currentIndex]
  const date = new Date(currentDay.dt * 1000)

  return (
    <Card className="w-80 bg-black/20 backdrop-blur-md border-purple-500/30 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>5-Day Forecast</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={prevDay} className="text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm px-2">
              {currentIndex + 1}/{forecast.length}
            </span>
            <Button variant="ghost" size="sm" onClick={nextDay} className="text-white hover:bg-white/10">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getWeatherIcon(currentDay.weather[0].main)}
            <div className="text-lg font-medium">
              {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </div>
          </div>
          <div className="text-sm text-gray-300 capitalize">{currentDay.weather[0].description}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{Math.round(currentDay.temp.max)}°C</div>
            <div className="text-xs text-gray-400">High</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{Math.round(currentDay.temp.min)}°C</div>
            <div className="text-xs text-gray-400">Low</div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Humidity:</span>
            <span>{currentDay.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Wind Speed:</span>
            <span>{currentDay.wind_speed.toFixed(1)} m/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Rain Chance:</span>
            <span>{Math.round(currentDay.pop * 100)}%</span>
          </div>
        </div>

        <div className="flex justify-center space-x-1">
          {forecast.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-purple-400" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
