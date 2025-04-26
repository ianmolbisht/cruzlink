import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      // No need to specify mode: 'cors' here as server-side requests don't have CORS restrictions
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from IoT sensor:", error)

    // For demo purposes, simulate a response
    const shouldSimulateImpact = Math.random() < 0.05 // 5% chance of impact

    return NextResponse.json({
      impact: shouldSimulateImpact,
      impactForce: shouldSimulateImpact ? Math.floor(Math.random() * 10) + 5 : 0,
      timestamp: Date.now(),
      batteryLevel: 85,
    })
  }
}
