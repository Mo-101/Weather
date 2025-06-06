"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Cloud, Zap, Wind, Thermometer } from "lucide-react"

interface WeatherAlert {
  event: string
  description: string
  severity: "minor" | "moderate" | "severe" | "extreme"
  start: number
  end: number
  areas: string[]
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[]
  compact?: boolean
}

export function WeatherAlerts({ alerts, compact = false }: WeatherAlertsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "border-red-500 bg-red-500/10"
      case "severe":
        return "border-orange-500 bg-orange-500/10"
      case "moderate":
        return "border-yellow-500 bg-yellow-500/10"
      default:
        return "border-blue-500 bg-blue-500/10"
    }
  }

  const getAlertIcon = (event: string) => {
    const eventLower = event.toLowerCase()
    if (eventLower.includes("thunder") || eventLower.includes("lightning")) {
      return <Zap className="w-4 h-4 text-yellow-400" />
    }
    if (eventLower.includes("wind")) {
      return <Wind className="w-4 h-4 text-gray-400" />
    }
    if (eventLower.includes("heat") || eventLower.includes("temperature")) {
      return <Thermometer className="w-4 h-4 text-red-400" />
    }
    if (eventLower.includes("rain") || eventLower.includes("flood")) {
      return <Cloud className="w-4 h-4 text-blue-400" />
    }
    return <AlertTriangle className="w-4 h-4 text-orange-400" />
  }

  if (compact) {
    return (
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div key={index} className={`p-2 rounded border text-xs ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-center gap-2 mb-1">
              {getAlertIcon(alert.event)}
              <span className="font-medium">{alert.event}</span>
            </div>
            <p className="text-gray-300 text-xs">{alert.description.substring(0, 80)}...</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-80 bg-black/40 backdrop-blur-lg border-red-500/30 text-white shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          Weather Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-64 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getAlertIcon(alert.event)}
              <span className="font-medium text-sm">{alert.event}</span>
              <span
                className={`text-xs px-2 py-1 rounded uppercase font-bold ${
                  alert.severity === "extreme"
                    ? "bg-red-600"
                    : alert.severity === "severe"
                      ? "bg-orange-600"
                      : alert.severity === "moderate"
                        ? "bg-yellow-600"
                        : "bg-blue-600"
                }`}
              >
                {alert.severity}
              </span>
            </div>
            <p className="text-xs text-gray-300 mb-2">{alert.description}</p>
            <div className="text-xs text-gray-400">
              <div>Start: {new Date(alert.start * 1000).toLocaleString()}</div>
              <div>End: {new Date(alert.end * 1000).toLocaleString()}</div>
              {alert.areas.length > 0 && <div>Areas: {alert.areas.join(", ")}</div>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
