import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // Return mock alerts for demonstration (OpenWeather One Call API requires subscription)
    const mockAlerts = [
      {
        event: "Heavy Rainfall Warning",
        description:
          "Heavy rainfall expected in the region. Potential for flooding in low-lying areas. Stay indoors and avoid unnecessary travel.",
        severity: "moderate" as const,
        start: Date.now() / 1000,
        end: (Date.now() + 24 * 60 * 60 * 1000) / 1000,
        areas: ["Lagos State", "Ogun State"],
      },
      {
        event: "High Temperature Advisory",
        description: "Unusually high temperatures expected. Stay hydrated and avoid prolonged sun exposure.",
        severity: "minor" as const,
        start: Date.now() / 1000,
        end: (Date.now() + 12 * 60 * 60 * 1000) / 1000,
        areas: ["Northern Nigeria"],
      },
    ]

    return NextResponse.json({ alerts: mockAlerts })
  } catch (error) {
    console.error("Weather alerts API error:", error)
    return NextResponse.json({ alerts: [] })
  }
}
