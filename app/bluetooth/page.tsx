"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Bluetooth, RefreshCw, Volume2, Headphones, Smartphone, Laptop } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileLayout } from "@/components/mobile-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface Device {
  id: string
  name: string
  type: string
  icon: React.ReactNode
  lastSeen: string
  connected: boolean
}

export default function BluetoothPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<Device[]>([])
  const [volume, setVolume] = useState(70)

  const startScan = () => {
    setIsScanning(true)

    // Simulate finding devices
    setTimeout(() => {
      setDevices([
        {
          id: "1",
          name: "CruzLink Helmet",
          type: "Safety Helmet",
          icon: <Headphones className="h-5 w-5 text-blue-500" />,
          lastSeen: "Just now",
          connected: true,
        },
        {
          id: "2",
          name: "iPhone 13",
          type: "Smartphone",
          icon: <Smartphone className="h-5 w-5 text-gray-500" />,
          lastSeen: "2 minutes ago",
          connected: true,
        },
        {
          id: "3",
          name: "MacBook Pro",
          type: "Laptop",
          icon: <Laptop className="h-5 w-5 text-gray-500" />,
          lastSeen: "5 minutes ago",
          connected: false,
        },
        {
          id: "4",
          name: "Bluetooth Speaker",
          type: "Audio",
          icon: <Volume2 className="h-5 w-5 text-gray-500" />,
          lastSeen: "Yesterday",
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
          <h1 className="text-lg font-semibold">Bluetooth Devices</h1>
        </div>

        <Tabs defaultValue="devices" className="flex-1">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="devices" className="flex-1">
                Devices
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex-1">
                Audio
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="devices" className="p-4 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium">Connected Devices</h2>
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
                        <div className="flex items-center">
                          {device.icon}
                          <div className="ml-3">
                            <h3 className="font-medium text-sm">{device.name}</h3>
                            <p className="text-xs text-gray-500">{device.type}</p>
                          </div>
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

                <Button className="w-full mt-2" variant="outline">
                  Add New Device
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="audio" className="p-4">
            <Card>
              <CardContent className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Volume</h3>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-gray-500" />
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0])}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-right">{volume}%</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Audio Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Navigation Voice</h4>
                        <p className="text-xs text-gray-500">Turn-by-turn directions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Safety Alerts</h4>
                        <p className="text-xs text-gray-500">Audio warnings for hazards</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Voice Assistant</h4>
                        <p className="text-xs text-gray-500">Voice command responses</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Media Audio</h4>
                        <p className="text-xs text-gray-500">Music and podcasts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="p-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Bluetooth</h3>
                    <p className="text-xs text-gray-500">Enable/disable Bluetooth</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Auto-Connect</h3>
                    <p className="text-xs text-gray-500">Connect to known devices automatically</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Visible to Others</h3>
                    <p className="text-xs text-gray-500">Allow other devices to find this helmet</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Power Saving</h3>
                    <p className="text-xs text-gray-500">Reduce Bluetooth power consumption</p>
                  </div>
                  <Switch />
                </div>

                <Button className="w-full mt-2" variant="outline">
                  Forget All Devices
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
