import { type NextRequest, NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString("base64")

    // Initialize Google Auth
    const auth = new GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}"),
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    })

    const authClient = await auth.getClient()
    const accessToken = await authClient.getAccessToken()

    // Call Google Vision API
    const visionResponse = await fetch("https://vision.googleapis.com/v1/images:annotate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: "LABEL_DETECTION",
                maxResults: 10,
              },
              {
                type: "OBJECT_LOCALIZATION",
                maxResults: 10,
              },
            ],
          },
        ],
      }),
    })

    const visionData = await visionResponse.json()

    // Filter for animal-related detections
    const labels = visionData.responses[0]?.labelAnnotations || []
    const objects = visionData.responses[0]?.localizedObjectAnnotations || []

    const animalKeywords = ["animal", "rodent", "rat", "mouse", "mammal", "wildlife", "creature", "bird", "cat", "dog"]

    const detectedAnimals = [
      ...labels
        .filter((label: any) => animalKeywords.some((keyword) => label.description.toLowerCase().includes(keyword)))
        .map((label: any) => ({
          name: label.description,
          confidence: label.score,
          type: "label",
        })),
      ...objects
        .filter((obj: any) => animalKeywords.some((keyword) => obj.name.toLowerCase().includes(keyword)))
        .map((obj: any) => ({
          name: obj.name,
          confidence: obj.score,
          type: "object",
        })),
    ]

    return NextResponse.json({
      animals: detectedAnimals,
      totalDetections: detectedAnimals.length,
    })
  } catch (error) {
    console.error("Vision API error:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
