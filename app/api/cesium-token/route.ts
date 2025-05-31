import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return the Cesium token from server-side environment variable
    const token = process.env.NEXT_PUBLIC_CESIUM_TOKEN

    if (!token) {
      return NextResponse.json({ error: "Cesium token not configured" }, { status: 500 })
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error fetching Cesium token:", error)
    return NextResponse.json({ error: "Failed to fetch Cesium token" }, { status: 500 })
  }
}
