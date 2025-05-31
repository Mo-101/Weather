import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // Generate mock historical data for the last 24 hours
    // In a real application, you would fetch this from a weather API or database
    const now = Math.floor(Date.now() / 1000)
    const hourlyData = []

    for (let i = 23; i >= 0; i--) {
      const timestamp = now - i * 3600 // Go back i hours

      // Generate realistic weather data with some variation
      const baseTemp = 25 + Math.sin(((timestamp / 3600) * Math.PI) / 12) * 5 // Daily temperature cycle
      const tempVariation = (Math.random() - 0.5) * 4

      hourlyData.push({
        dt: timestamp,
        temp: Math.round((baseTemp + tempVariation) * 10) / 10,
        humidity: Math.round(60 + Math.random() * 30), // 60-90%
        wind_speed: Math.round((2 + Math.random() * 8) * 10) / 10, // 2-10 m/s
        pressure: Math.round(1010 + (Math.random() - 0.5) * 20), // 1000-1020 hPa
      })
    }

    return NextResponse.json({ hourly: hourlyData })
  } catch (error) {
    console.error("Historical weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 })
  }
}
