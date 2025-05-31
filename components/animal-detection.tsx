"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Scan, Camera } from "lucide-react"

export function AnimalDetection() {
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
    <Card className="w-80 bg-black/20 backdrop-blur-md border-purple-500/30 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="w-5 h-5" />
          Animal Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-300">
          Upload an image to detect animals, particularly rodents and wildlife using Google Vision AI
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isAnalyzing}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isAnalyzing ? "Analyzing..." : "Upload Image"}
        </Button>

        {imagePreview && (
          <div className="space-y-2">
            <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-32 object-cover rounded" />
          </div>
        )}

        {results && (
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Detection Results:
            </div>
            <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
              {results.animals?.map((animal: any, index: number) => (
                <div key={index} className="bg-white/10 p-2 rounded">
                  <div className="font-medium">{animal.name}</div>
                  <div className="text-gray-400">Confidence: {(animal.confidence * 100).toFixed(1)}%</div>
                  <div className="text-gray-500 text-xs">Type: {animal.type}</div>
                </div>
              ))}
              {results.animals?.length === 0 && (
                <div className="text-gray-400 text-center py-2">No animals detected in this image</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
