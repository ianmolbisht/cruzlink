"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, AlertTriangle, Shield, SettingsIcon, Bell, WifiOff, CheckCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileLayout } from "@/components/mobile-layout"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { iotSensorMonitor } from "@/services/iot-sensor"
import { useToast } from "@/components/ui/use-toast"

export default function CrashDetectionPage() {
  const [crashDetectionEnabled, setCrashDetectionEnabled] = useState(true)
  const [sensitivity, setSensitivity] = useState(70)
  const [autoSOSEnabled, setAutoSOSEnabled] = useState(true)
  const [notifyContacts, setNotifyContacts] = useState(true)
  const [sensorStatus, setSensorStatus] = useState<{ status: string; error: string | null }>({
    status: "disconnected",
    error: null,
  })
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check sensor status periodically
    const checkStatus = () => {
      const status = iotSensorMonitor.getConnectionStatus()
      setSensorStatus(status)
    }

    checkStatus() // Check immediately
    const interval = setInterval(checkStatus, 3000)

    return () => clearInterval(interval)
  }, [])

  const testCrashDetection = () => {
    if (crashDetectionEnabled) {
      iotSensorMonitor.simulateImpact(sensitivity / 10)
      toast({
        title: "Test Initiated",
        description: "Simulating crash detection with current sensitivity settings",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Crash Detection Disabled",
        description: "Enable crash detection to run a test",
      })
    }
  }

  const testConnection = () => {
    setIsTestingConnection(true)

    // Simulate connection test
    toast({
      title: "Testing Connection",
      description: "Attempting to connect to IoT sensor...",
    })

    // Start monitoring if not already
    iotSensorMonitor.startMonitoring()

    // Check status after a delay
    setTimeout(() => {
      const status = iotSensorMonitor.getConnectionStatus()
      setSensorStatus(status)

      if (status.status === "connected") {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to IoT sensor",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: status.error || "Could not connect to IoT sensor",
        })
      }

      setIsTestingConnection(false)
    }, 2000)
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4 border-b dark:border-gray-800">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Crash Detection</h1>
        </div>

        <div className="p-4 flex-1 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium">Crash Detection</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Detect impacts and falls</p>
                  </div>
                </div>
                <Switch checked={crashDetectionEnabled} onCheckedChange={setCrashDetectionEnabled} />
              </div>

              {crashDetectionEnabled && (
                <>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Sensitivity</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">Low</span>
                      <Slider
                        value={[sensitivity]}
                        min={10}
                        max={100}
                        step={5}
                        onValueChange={(value) => setSensitivity(value[0])}
                        className="flex-1"
                      />
                      <span className="text-xs">High</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Higher sensitivity may trigger more false alarms
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium">Automatic SOS</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Trigger SOS on crash detection</p>
                      </div>
                    </div>
                    <Switch checked={autoSOSEnabled} onCheckedChange={setAutoSOSEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-amber-500 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium">Notify Contacts</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Alert emergency contacts</p>
                      </div>
                    </div>
                    <Switch checked={notifyContacts} onCheckedChange={setNotifyContacts} />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center mb-2">
                      <SettingsIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="text-sm font-medium">Response Type</h3>
                    </div>
                    <Select defaultValue="both">
                      <SelectTrigger>
                        <SelectValue placeholder="Select response type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contacts">Notify Contacts Only</SelectItem>
                        <SelectItem value="services">Emergency Services Only</SelectItem>
                        <SelectItem value="both">Both Contacts & Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-purple-500 mr-2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                      <h3 className="text-sm font-medium">Countdown Duration</h3>
                    </div>
                    <Select defaultValue="15">
                      <SelectTrigger>
                        <SelectValue placeholder="Select countdown duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Time before SOS is triggered after crash detection
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">IoT Sensor Connection</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {sensorStatus.status === "connected" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <WifiOff className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <div>
                      <h4 className="text-sm font-medium">Sensor Status</h4>
                      <p
                        className={`text-xs ${sensorStatus.status === "connected" ? "text-green-500" : "text-red-500"}`}
                      >
                        {sensorStatus.status === "connected"
                          ? "Connected"
                          : sensorStatus.status === "error"
                            ? "Error: " + (sensorStatus.error || "Unknown error")
                            : "Disconnected"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={testConnection} disabled={isTestingConnection}>
                    {isTestingConnection ? "Testing..." : "Test Connection"}
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Sensor Address</h4>
                  <div className="flex">
                    <input
                      type="text"
                      value="http://192.168.1.13/"
                      readOnly
                      className="flex-1 text-xs p-2 border rounded-l-md bg-gray-50 dark:bg-gray-800"
                    />
                    <Button variant="secondary" size="sm" className="rounded-l-none">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button className="w-full" onClick={testCrashDetection}>
              Test Crash Detection
            </Button>
            <Button variant="outline" className="w-full">
              View Crash History
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
