"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Bluetooth, RefreshCw } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileLayout } from "@/components/mobile-layout"

interface Device {
  id: string
  name: string
  type: string
  lastSeen: string
  connected: boolean
}

export default function FindDevicesPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<Device[]>([])

  const startScan = () => {
    setIsScanning(true)

    // Simulate finding devices
    setTimeout(() => {
      setDevices([
        {
          id: "1",
          name: "CruzLink Helmet",
          type: "Safety Helmet",
          lastSeen: "Just now",
          connected: true,
        },
        {
          id: "2",
          name: "Smartphone",
          type: "Phone",
          lastSeen: "2 minutes ago",
          connected: true,
        },
        {
          id: "3",
          name: "Smart Watch",
          type: "Wearable",
          lastSeen: "5 minutes ago",
          connected: false,
        },
      ])
      setIsScanning(false)
    }, 2000)
  }

  useEffect(() => {
    startScan()
  }, [])

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4 border-b">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Find Devices</h1>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium">Nearby Devices</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={startScan}
              disabled={isScanning}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
              {isScanning ? "Scanning..." : "Scan"}
            </Button>
          </div>

          {isScanning ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bluetooth className="h-12 w-12 text-blue-500 animate-pulse mb-4" />
              <p className="text-sm text-gray-500">Scanning for nearby devices...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {devices.map((device) => (
                <Card key={device.id} className={device.connected ? "border-blue-200" : ""}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{device.name}</h3>
                        <p className="text-xs text-gray-500">{device.type}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs ${device.connected ? "text-blue-600" : "text-gray-500"}`}>
                          {device.connected ? "Connected" : "Not connected"}
                        </span>
                        <span className="text-xs text-gray-400">{device.lastSeen}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  )
}
