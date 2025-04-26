"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet default icon issue
const fixLeafletIcon = () => {
  // Only run on the client
  if (typeof window === "undefined") return

  // Delete the default icon settings
  delete (L.Icon.Default.prototype as any)._getIconUrl

  // Set up custom icon paths that work in this environment
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })
}

interface MapComponentProps {
  location: { lat: number; lng: number }
}

export default function MapComponent({ location }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const circleRef = useRef<L.Circle | null>(null)

  useEffect(() => {
    // Fix Leaflet icon issue
    fixLeafletIcon()

    // Initialize map if it doesn't exist yet
    if (!mapRef.current && mapContainerRef.current) {
      // Create the map
      mapRef.current = L.map(mapContainerRef.current).setView([location.lat, location.lng], 15)

      // Add the tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)

      // Create a custom icon for better visibility
      const userIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      // Add marker for user location
      markerRef.current = L.marker([location.lat, location.lng], { icon: userIcon }).addTo(mapRef.current)

      // Add accuracy circle
      circleRef.current = L.circle([location.lat, location.lng], {
        radius: 100, // Default radius, will be updated with actual accuracy
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(mapRef.current)
    }

    // Update marker and circle position when location changes
    if (mapRef.current && markerRef.current && circleRef.current) {
      markerRef.current.setLatLng([location.lat, location.lng])
      circleRef.current.setLatLng([location.lat, location.lng])
      mapRef.current.setView([location.lat, location.lng], mapRef.current.getZoom())
    }

    // Set up continuous location tracking
    let watchId: number | null = null
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords

          // Update marker and circle
          if (mapRef.current && markerRef.current && circleRef.current) {
            markerRef.current.setLatLng([latitude, longitude])
            circleRef.current.setLatLng([latitude, longitude])
            circleRef.current.setRadius(accuracy)
            mapRef.current.setView([latitude, longitude], mapRef.current.getZoom())
          }
        },
        (error) => {
          console.error("Error watching position:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    }

    // Clean up
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [location])

  return <div ref={mapContainerRef} className="absolute inset-0 z-10" style={{ height: "100%", width: "100%" }} />
}
