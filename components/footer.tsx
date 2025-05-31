"use client"

import { Clock, Zap } from "lucide-react"

export function Footer() {
  const newsItems = [
    {
      title: "Heavy Rainfall Expected in Lagos State",
      time: "2 hours ago",
      source: "Nigerian Meteorological Agency",
    },
    {
      title: "Drought Conditions Persist in Northern Nigeria",
      time: "4 hours ago",
      source: "Weather Nigeria",
    },
    {
      title: "Harmattan Season Approaches West Africa",
      time: "6 hours ago",
      source: "African Weather Centre",
    },
  ]

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-t border-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Latest Weather News - Nigeria
            </h3>
            <div className="flex space-x-6 text-xs">
              {newsItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-300">
                  <Clock className="w-3 h-3" />
                  <span>{item.title}</span>
                  <span className="text-gray-500">• {item.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-400">Powered by OpenWeather API • Cesium • Google Vision • Groq AI</div>
        </div>
      </div>
    </footer>
  )
}
