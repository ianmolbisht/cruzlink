"use client"

import { useState } from "react"
import Link from "next/link"
import { HardHat, MapPin, Bluetooth, Phone, Music, Heart, Navigation, User, Mic, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EnhancedSOSButton } from "@/components/enhanced-sos-button"
import { MobileLayout } from "@/components/mobile-layout"
import { WeatherAlert } from "@/components/weather-alert"
import { BatteryStatus } from "@/components/battery-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { VoiceAssistant } from "@/components/voice-assistant"
import { CrashDetectionSimulator } from "@/components/crash-detection-simulator"
import { IoTSensorStatus } from "@/components/iot-sensor-status"

export function Dashboard() {
  const [showWeatherAlert, setShowWeatherAlert] = useState(true)
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false)

  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-between h-full">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HardHat className="h-6 w-6 text-red-500" />
              <h1 className="text-xl font-bold">CruzLink</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowVoiceAssistant(true)}>
                <Mic className="h-5 w-5" />
                <span className="sr-only">Voice Assistant</span>
              </Button>
              <ThemeToggle />
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            </div>
          </div>

          {showWeatherAlert && <WeatherAlert onClose={() => setShowWeatherAlert(false)} />}

          <div className="grid grid-cols-3 gap-3 mb-6">
            <Link href="/map">
              <Card className="h-24">
                <CardContent className="flex flex-col items-center justify-center h-full p-2">
                  <MapPin className="h-6 w-6 text-green-500 mb-1" />
                  <span className="text-xs font-medium text-center">Location</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/bluetooth">
              <Card className="h-24">
                <CardContent className="flex flex-col items-center justify-center h-full p-2">
                  <Bluetooth className="h-6 w-6 text-blue-500 mb-1" />
                  <span className="text-xs font-medium text-center">Devices</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/navigation">
              <Card className="h-24">
                <CardContent className="flex flex-col items-center justify-center h-full p-2">
                  <Navigation className="h-6 w-6 text-purple-500 mb-1" />
                  <span className="text-xs font-medium text-center">Navigate</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/contacts">
              <Card className="h-24">
                <CardContent className="flex flex-col items-center justify-center h-full p-2">
                  <Phone className="h-6 w-6 text-indigo-500 mb-1" />
                  <span className="text-xs font-medium text-center">Contacts</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/health">
              <Card className="h-24">
                <CardContent className="flex flex-col items-center justify-center h-full p-2">
                  <Heart className="h-6 w-6 text-red-500 mb-1" />
                  <span className="text-xs font-medium text-center">Health</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/crash-detection">
              <Card className="h-24">
                <CardContent className="flex flex-col items-center justify-center h-full p-2">
                  <AlertTriangle className="h-6 w-6 text-amber-500 mb-1" />
                  <span className="text-xs font-medium text-center">Crash Detection</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          <EnhancedSOSButton />
        </div>

        <div className="w-full p-4">
          <div className="flex justify-between items-center mb-3">
            <BatteryStatus percentage={85} />
            <div className="flex items-center">
              <Bluetooth className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-xs text-blue-600 font-medium dark:text-blue-400">Connected</span>
            </div>
          </div>

          <Link href="/music">
            <Card className="bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
              <CardContent className="p-3 flex items-center">
                <Music className="h-5 w-5 text-gray-700 mr-3 dark:text-gray-300" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Now Playing</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Safety First - Podcast</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Play/Pause</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {showVoiceAssistant && <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />}
      <CrashDetectionSimulator />
      <IoTSensorStatus />
    </MobileLayout>
  )
}
