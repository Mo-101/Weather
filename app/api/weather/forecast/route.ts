import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // Hardcode OpenWeather API key directly
    const OPENWEATHER_API_KEY = "b8e2c0b5c8f4a8d2e1f3c4b5a6d7e8f9"

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch forecast data")
    }

    const data = await response.json()

    // Process 5-day forecast data
    const dailyForecasts = []
    const processedDates = new Set()

    for (const item of data.list) {
      const date = new Date(item.dt * 1000).toDateString()

      if (!processedDates.has(date) && dailyForecasts.length < 5) {
        processedDates.add(date)

        // Find min/max temps for the day
        const dayItems = data.list.filter((listItem: any) => new Date(listItem.dt * 1000).toDateString() === date)

        const temps = dayItems.map((dayItem: any) => dayItem.main.temp)
        const minTemp = Math.min(...temps)
        const maxTemp = Math.max(...temps)

        dailyForecasts.push({
          dt: item.dt,
          temp: {
            day: item.main.temp,
            night: item.main.temp,
            min: minTemp,
            max: maxTemp,
          },
          weather: item.weather,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          pop: item.pop || 0,
        })
      }
    }

    return NextResponse.json({ daily: dailyForecasts })
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json({ error: "Failed to fetch forecast data" }, { status: 500 })
  }
}
