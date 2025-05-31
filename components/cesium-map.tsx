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
    let loadingTimeout: NodeJS.Timeout

    const loadCesium = async () => {
      try {
        // Set a timeout for loading
        loadingTimeout = setTimeout(() => {
          if (isLoading) {
            setError("Map loading timeout. Please refresh the page.")
            setIsLoading(false)
          }
        }, 15000) // 15 second timeout

        // Load Cesium CSS first
        if (!document.querySelector('link[href*="cesium"]')) {
          const cssLink = document.createElement("link")
          cssLink.rel = "stylesheet"
          cssLink.href = "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Widgets/widgets.css"
          cssLink.onerror = () => {
            console.warn("Failed to load Cesium CSS, continuing anyway...")
          }
          document.head.appendChild(cssLink)
        }

        // Load Cesium JS with retry logic
        if (!window.Cesium) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Cesium.js"
            script.async = true
            script.onload = () => {
              // Wait a bit for Cesium to fully initialize
              setTimeout(resolve, 500)
            }
            script.onerror = () => {
              reject(new Error("Failed to load Cesium library"))
            }
            document.head.appendChild(script)
          })
        }

        if (!isMounted || !cesiumContainerRef.current) return

        // Clear the timeout since we're proceeding
        clearTimeout(loadingTimeout)

        // Hardcode Cesium Ion token directly
        window.Cesium.Ion.defaultAccessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk"

        // Initialize Cesium viewer with error handling
        try {
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
            requestRenderMode: true, // Optimize performance
            maximumRenderTimeChange: Number.POSITIVE_INFINITY,
          })
        } catch (cesiumError) {
          console.error("Cesium initialization error:", cesiumError)
          throw new Error("Failed to initialize 3D map viewer")
        }

        // Set initial view to Nigeria with error handling
        try {
          viewerRef.current.camera.setView({
            destination: window.Cesium.Cartesian3.fromDegrees(8.6753, 9.082, 1500000),
            orientation: {
              heading: 0.0,
              pitch: -0.3,
              roll: 0.0,
            },
          })
        } catch (cameraError) {
          console.warn("Camera positioning error:", cameraError)
          // Continue anyway with default view
        }

        // Add click handler with error protection
        const clickHandler = (event: MouseEvent) => {
          try {
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
          } catch (clickError) {
            console.warn("Click handler error:", clickError)
          }
        }

        viewerRef.current.cesiumWidget.cesiumContainer.addEventListener("click", clickHandler)

        // Add Nigerian cities with error handling
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
          try {
            viewerRef.current.entities.add({
              position: window.Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
              point: {
                pixelSize: 15,
                color: window.Cesium.Color.CYAN,
                outlineColor: window.Cesium.Color.WHITE,
                outlineWidth: 3,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
              },
              label: {
                text: city.name,
                font: "14pt sans-serif",
                pixelOffset: new window.Cesium.Cartesian2(0, -50),
                fillColor: window.Cesium.Color.WHITE,
                outlineColor: window.Cesium.Color.BLACK,
                outlineWidth: 2,
                style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                scale: 1.0,
              },
            })
          } catch (entityError) {
            console.warn(`Failed to add city marker for ${city.name}:`, entityError)
          }
        })

        setIsLoading(false)
      } catch (err) {
        console.error("Error loading Cesium:", err)
        setError(
          "Failed to load 3D map. This might be due to browser extensions or network issues. Please try refreshing the page or disabling browser extensions.",
        )
        setIsLoading(false)
      }
    }

    loadCesium()

    return () => {
      isMounted = false
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
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
        <div className="text-center text-white p-8 max-w-md">
          <div className="text-4xl mb-4">🌍</div>
          <div className="text-xl font-semibold mb-4">Map Loading Issue</div>
          <div className="text-sm text-gray-300 mb-6 leading-relaxed">{error}</div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors"
            >
              🔄 Refresh Page
            </button>
            <div className="text-xs text-gray-400">💡 Tip: Try disabling browser extensions if the issue persists</div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center text-white">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl">🌍</div>
            </div>
          </div>
          <div className="text-lg font-semibold mb-2">Loading 3D Earth Map</div>
          <div className="text-sm text-gray-300 mb-4">Powered by Cesium Ion</div>
          <div className="text-xs text-gray-400">This may take a few moments on first load...</div>
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
