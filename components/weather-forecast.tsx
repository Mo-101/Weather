"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronUp, ChevronDown, Sun, Cloud, CloudRain } from "lucide-react"

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
  pop: number
}

interface WeatherForecastProps {
  location: {
    latitude: number
    longitude: number
    name: string
  }
  horizontal?: boolean
}

export function WeatherForecast({ location, horizontal = false }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

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

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-4 h-4 text-yellow-400" />
      case "clouds":
        return <Cloud className="w-4 h-4 text-gray-400" />
      case "rain":
        return <CloudRain className="w-4 h-4 text-blue-400" />
      default:
        return <Sun className="w-4 h-4 text-yellow-400" />
    }
  }

  if (isLoading || !forecast.length) {
    return null
  }

  return (
    <Card className="bg-black/40 backdrop-blur-lg border-white/20 text-white shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>5-Day Forecast</span>
          </div>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-5 gap-2">
            {forecast.slice(0, 5).map((day, index) => {
              const date = new Date(day.dt * 1000)
              return (
                <div key={index} className="text-center p-2 rounded bg-white/5">
                  <div className="text-xs text-gray-400 mb-1">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="flex justify-center mb-1">{getWeatherIcon(day.weather[0].main)}</div>
                  <div className="text-xs">
                    <div className="font-medium">{Math.round(day.temp.max)}°</div>
                    <div className="text-gray-400">{Math.round(day.temp.min)}°</div>
                  </div>
                  <div className="text-xs text-blue-400 mt-1">{Math.round(day.pop * 100)}%</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
