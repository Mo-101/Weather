"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Cloud, Menu, X, Globe, Zap, Bot } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Cloud className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold text-white">WeatherAI Nigeria</span>
              <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">Powered by Groq</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Globe className="w-4 h-4 mr-2" />
                3D Map
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Zap className="w-4 h-4 mr-2" />
                Live Weather
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:bg-white/10">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black/40 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button variant="ghost" className="w-full text-left text-white hover:bg-white/10">
              3D Map View
            </Button>
            <Button variant="ghost" className="w-full text-left text-white hover:bg-white/10">
              Live Weather Data
            </Button>
            <Button variant="ghost" className="w-full text-left text-white hover:bg-white/10">
              AI Assistant
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
