"use client"

import { useEffect, useRef } from "react"

interface NavigationMapProps {
  currentLocation: { lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
}

export default function NavigationMap({ currentLocation, destination }: NavigationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run this code on the client side
    if (typeof window === "undefined" || !mapContainerRef.current) return

    // Create a simple map representation instead of using Leaflet
    const renderMap = () => {
      const container = mapContainerRef.current
      if (!container) return

      // Clear previous content
      container.innerHTML = ""

      // Create map elements
      const mapBackground = document.createElement("div")
      mapBackground.className = "absolute inset-0 bg-gray-200 dark:bg-gray-700"
      container.appendChild(mapBackground)

      // Create grid lines to simulate a map
      const gridContainer = document.createElement("div")
      gridContainer.className = "absolute inset-0 opacity-20"
      container.appendChild(gridContainer)

      for (let i = 0; i < 10; i++) {
        const horizontalLine = document.createElement("div")
        horizontalLine.className = "absolute w-full h-px bg-gray-500"
        horizontalLine.style.top = `${i * 10}%`
        gridContainer.appendChild(horizontalLine)

        const verticalLine = document.createElement("div")
        verticalLine.className = "absolute h-full w-px bg-gray-500"
        verticalLine.style.left = `${i * 10}%`
        gridContainer.appendChild(verticalLine)
      }

      // Create user location marker
      const userMarker = document.createElement("div")
      userMarker.className =
        "absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
      userMarker.style.left = "30%"
      userMarker.style.top = "60%"

      // Add pulse effect for user location
      const userPulse = document.createElement("div")
      userPulse.className =
        "absolute w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-ping transform -translate-x-1/2 -translate-y-1/2"
      userPulse.style.left = "30%"
      userPulse.style.top = "60%"

      // Create destination marker
      const destMarker = document.createElement("div")
      destMarker.className =
        "absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
      destMarker.style.left = "70%"
      destMarker.style.top = "30%"

      // Create route line
      const routeLine = document.createElement("div")
      routeLine.className = "absolute h-px bg-blue-500 origin-top-left"
      routeLine.style.width = "56.6%" // Calculated based on the distance between points
      routeLine.style.height = "4px"
      routeLine.style.left = "30%"
      routeLine.style.top = "60%"
      routeLine.style.transform = "rotate(-45deg)"

      container.appendChild(routeLine)
      container.appendChild(userPulse)
      container.appendChild(userMarker)
      container.appendChild(destMarker)

      // Add destination label
      const destLabel = document.createElement("div")
      destLabel.className = "absolute bg-white dark:bg-gray-800 text-xs p-1 rounded shadow transform -translate-x-1/2"
      destLabel.textContent = destination.name
      destLabel.style.left = "70%"
      destLabel.style.top = "25%"
      container.appendChild(destLabel)
    }

    renderMap()

    // Re-render when location changes
    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = ""
      }
    }
  }, [currentLocation, destination])

  return (
    <div
      ref={mapContainerRef}
      className="absolute inset-0 z-10 overflow-hidden"
      style={{ height: "100%", width: "100%" }}
    />
  )
}
