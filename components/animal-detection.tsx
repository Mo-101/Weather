"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Camera } from "lucide-react"

interface AnimalDetectionProps {
  compact?: boolean
}

export function AnimalDetection({ compact = false }: AnimalDetectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Analyze image
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error analyzing image:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-300">Upload an image to detect animals using Google Vision AI</div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-purple-600/40 backdrop-blur-lg border-purple-400/20 text-white hover:bg-purple-600/60 text-xs"
        disabled={isAnalyzing}
        variant="outline"
      >
        <Upload className="w-3 h-3 mr-2" />
        {isAnalyzing ? "Analyzing..." : "Upload Image"}
      </Button>

      {imagePreview && (
        <div className="space-y-2">
          <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-24 object-cover rounded" />
        </div>
      )}

      {results && (
        <div className="space-y-2">
          <div className="text-xs font-medium flex items-center gap-2">
            <Camera className="w-3 h-3" />
            Detection Results:
          </div>
          <div className="text-xs space-y-1 max-h-24 overflow-y-auto">
            {results.animals?.map((animal: any, index: number) => (
              <div key={index} className="bg-white/10 p-2 rounded">
                <div className="font-medium">{animal.name}</div>
                <div className="text-gray-400">Confidence: {(animal.confidence * 100).toFixed(1)}%</div>
              </div>
            ))}
            {results.animals?.length === 0 && <div className="text-gray-400 text-center py-2">No animals detected</div>}
          </div>
        </div>
      )}
    </div>
  )
}
