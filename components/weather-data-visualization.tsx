"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Droplets, Wind } from "lucide-react"

interface WeatherDataVisualizationProps {
  location: {
    latitude: number
    longitude: number
    name: string
  }
}

export function WeatherDataVisualization({ location }: WeatherDataVisualizationProps) {
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<"temperature" | "humidity" | "wind">("temperature")

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/weather/historical?lat=${location.latitude}&lon=${location.longitude}`)
        const data = await response.json()
        setHistoricalData(data.hourly || [])
      } catch (error) {
        console.error("Error fetching historical data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (location.latitude && location.longitude) {
      fetchHistoricalData()
    }
  }, [location])

  const getMetricValue = (item: any) => {
    switch (selectedMetric) {
      case "temperature":
        return item.temp
      case "humidity":
        return item.humidity
      case "wind":
        return item.wind_speed
      default:
        return 0
    }
  }

  const getMetricUnit = () => {
    switch (selectedMetric) {
      case "temperature":
        return "°C"
      case "humidity":
        return "%"
      case "wind":
        return "m/s"
      default:
        return ""
    }
  }

  const getMetricIcon = () => {
    switch (selectedMetric) {
      case "temperature":
        return <TrendingUp className="w-4 h-4" />
      case "humidity":
        return <Droplets className="w-4 h-4" />
      case "wind":
        return <Wind className="w-4 h-4" />
      default:
        return <BarChart3 className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <Card className="w-96 bg-black/20 backdrop-blur-md border-purple-500/30 text-white">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...historicalData.map(getMetricValue))
  const minValue = Math.min(...historicalData.map(getMetricValue))

  return (
    <Card className="w-96 bg-black/20 backdrop-blur-md border-purple-500/30 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Weather Trends
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={selectedMetric === "temperature" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedMetric("temperature")}
            className="text-xs"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Temp
          </Button>
          <Button
            variant={selectedMetric === "humidity" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedMetric("humidity")}
            className="text-xs"
          >
            <Droplets className="w-3 h-3 mr-1" />
            Humidity
          </Button>
          <Button
            variant={selectedMetric === "wind" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedMetric("wind")}
            className="text-xs"
          >
            <Wind className="w-3 h-3 mr-1" />
            Wind
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            {getMetricIcon()}
            {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
          </span>
          <span className="text-gray-400">Last 24 hours</span>
        </div>

        <div className="relative h-32 flex items-end justify-between gap-1">
          {historicalData.slice(-24).map((item, index) => {
            const value = getMetricValue(item)
            const height = ((value - minValue) / (maxValue - minValue)) * 100

            return (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${Math.max(height, 5)}%` }}
                title={`${value}${getMetricUnit()} at ${new Date(item.dt * 1000).toLocaleTimeString()}`}
              />
            )
          })}
        </div>

        <div className="flex justify-between text-xs text-gray-400">
          <span>
            {minValue.toFixed(1)}
            {getMetricUnit()}
          </span>
          <span>
            {maxValue.toFixed(1)}
            {getMetricUnit()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
