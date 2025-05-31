"use client"

import { useEffect, useRef, useState } from "react"

interface CesiumMapProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void
  selectedLocation: {
    longitude: number
    latitude: number
    name: string
  }
}

export default function CesiumMap({ onLocationSelect, selectedLocation }: CesiumMapProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadCesium = async () => {
      try {
        // Load Cesium CSS first
        if (!document.querySelector('link[href*="cesium"]')) {
          const cssLink = document.createElement("link")
          cssLink.rel = "stylesheet"
          cssLink.href = "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Widgets/widgets.css"
          document.head.appendChild(cssLink)
        }

        // Load Cesium JS
        if (!window.Cesium) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Cesium.js"
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        if (!isMounted || !cesiumContainerRef.current) return

        // Fetch Cesium token
        const tokenResponse = await fetch("/api/cesium-token")
        const tokenData = await tokenResponse.json()

        if (!tokenData.token) {
          throw new Error("Cesium token not available")
        }

        window.Cesium.Ion.defaultAccessToken = tokenData.token

        // Initialize Cesium viewer
        viewerRef.current = new window.Cesium.Viewer(cesiumContainerRef.current, {
          terrainProvider: window.Cesium.createWorldTerrain(),
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          vrButton: false,
          geocoder: false,
          infoBox: false,
          selectionIndicator: false,
          creditContainer: document.createElement("div"), // Hide credits
        })

        // Set initial view to Nigeria
        viewerRef.current.camera.setView({
          destination: window.Cesium.Cartesian3.fromDegrees(8.6753, 9.082, 1500000),
          orientation: {
            heading: 0.0,
            pitch: -0.3,
            roll: 0.0,
          },
        })

        // Add click handler
        viewerRef.current.cesiumWidget.cesiumContainer.addEventListener("click", (event: MouseEvent) => {
          const pickedPosition = viewerRef.current.camera.pickEllipsoid(
            new window.Cesium.Cartesian2(event.clientX, event.clientY),
            viewerRef.current.scene.globe.ellipsoid,
          )

          if (pickedPosition) {
            const cartographic = window.Cesium.Cartographic.fromCartesian(pickedPosition)
            const longitude = window.Cesium.Math.toDegrees(cartographic.longitude)
            const latitude = window.Cesium.Math.toDegrees(cartographic.latitude)

            onLocationSelect(latitude, longitude, `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
          }
        })

        // Add Nigerian cities
        const cities = [
          { name: "Lagos", lon: 3.3792, lat: 6.5244 },
          { name: "Abuja", lon: 7.5399, lat: 9.0579 },
          { name: "Kano", lon: 8.5417, lat: 12.0022 },
          { name: "Ibadan", lon: 3.947, lat: 7.3775 },
          { name: "Port Harcourt", lon: 7.0134, lat: 4.8156 },
          { name: "Benin City", lon: 5.6037, lat: 6.335 },
          { name: "Maiduguri", lon: 13.1571, lat: 11.8311 },
          { name: "Zaria", lon: 7.7719, lat: 11.0449 },
          { name: "Aba", lon: 7.3667, lat: 5.1167 },
          { name: "Jos", lon: 8.8965, lat: 9.9285 },
        ]

        cities.forEach((city) => {
          viewerRef.current.entities.add({
            position: window.Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
            point: {
              pixelSize: 10,
              color: window.Cesium.Color.CYAN,
              outlineColor: window.Cesium.Color.WHITE,
              outlineWidth: 2,
              heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
            },
            label: {
              text: city.name,
              font: "12pt sans-serif",
              pixelOffset: new window.Cesium.Cartesian2(0, -40),
              fillColor: window.Cesium.Color.WHITE,
              outlineColor: window.Cesium.Color.BLACK,
              outlineWidth: 2,
              style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
              scale: 0.9,
            },
          })
        })

        setIsLoading(false)
      } catch (err) {
        console.error("Error loading Cesium:", err)
        setError("Failed to load 3D map. Please refresh the page.")
        setIsLoading(false)
      }
    }

    loadCesium()

    return () => {
      isMounted = false
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy()
        } catch (e) {
          console.warn("Error destroying Cesium viewer:", e)
        }
      }
    }
  }, [onLocationSelect])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center text-white p-8">
          <div className="text-xl mb-4">🌍</div>
          <div className="text-lg font-semibold mb-2">Map Loading Error</div>
          <div className="text-sm text-gray-300 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-lg font-semibold mb-2">Loading 3D Earth Map</div>
          <div className="text-sm text-gray-300">Powered by Cesium</div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={cesiumContainerRef}
      className="w-full h-full absolute inset-0"
      style={{
        background: "transparent",
        zIndex: 1,
      }}
    />
  )
}
