"use client"

import { useState } from "react"
import { ArrowLeft, Sun, Bell, Shield, HardHat, Bluetooth, Volume2, Palette, AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileLayout } from "@/components/mobile-layout"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [voiceCommands, setVoiceCommands] = useState(true)
  const [autoSOS, setAutoSOS] = useState(true)

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
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="flex-1">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1">
                General
              </TabsTrigger>
              <TabsTrigger value="helmet" className="flex-1">
                Helmet
              </TabsTrigger>
              <TabsTrigger value="safety" className="flex-1">
                Safety
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="p-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 text-amber-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Dark Mode</h3>
                      <p className="text-xs text-gray-500">Toggle dark theme</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Notifications</h3>
                      <p className="text-xs text-gray-500">Enable push notifications</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Voice Commands</h3>
                      <p className="text-xs text-gray-500">Control app with voice</p>
                    </div>
                  </div>
                  <Switch checked={voiceCommands} onCheckedChange={setVoiceCommands} />
                </div>

                <div className="pt-2">
                  <div className="flex items-center mb-2">
                    <Palette className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="text-sm font-medium">App Theme</h3>
                  </div>
                  <Select defaultValue="red">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">Red (Default)</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
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
                      className="h-5 w-5 text-orange-500 mr-2"
                    >
                      <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                      <circle cx="17" cy="7" r="5" />
                    </svg>
                    <h3 className="text-sm font-medium">Language</h3>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" variant="outline">
              Reset All Settings
            </Button>
          </TabsContent>

          <TabsContent value="helmet" className="p-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <HardHat className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-sm font-medium">Helmet Mode</h3>
                  </div>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Mode</SelectItem>
                      <SelectItem value="traffic">Traffic Mode</SelectItem>
                      <SelectItem value="sport">Sport Mode</SelectItem>
                      <SelectItem value="quiet">Quiet Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Speaker Volume</h3>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-gray-500" />
                    <Slider defaultValue={[75]} max={100} step={1} className="flex-1" />
                    <span className="text-xs w-8 text-right">75%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bluetooth className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Auto-Connect</h3>
                      <p className="text-xs text-gray-500">Connect to phone automatically</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-amber-500 mr-2"
                    >
                      <path d="M12 2v8" />
                      <path d="m4.93 10.93 1.41 1.41" />
                      <path d="M2 18h2" />
                      <path d="M20 18h2" />
                      <path d="m19.07 10.93-1.41 1.41" />
                      <path d="M22 22H2" />
                      <path d="m8 22 4-10 4 10" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium">LED Lights</h3>
                      <p className="text-xs text-gray-500">Enable helmet LED lights</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="pt-2">
                  <Button className="w-full" variant="outline">
                    Check for Firmware Updates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="p-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Automatic SOS</h3>
                      <p className="text-xs text-gray-500">Trigger SOS on crash detection</p>
                    </div>
                  </div>
                  <Switch checked={autoSOS} onCheckedChange={setAutoSOS} />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Crash Detection Sensitivity</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">Low</span>
                    <Slider defaultValue={[70]} max={100} step={1} className="flex-1" />
                    <span className="text-xs">High</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Safety Alerts</h3>
                      <p className="text-xs text-gray-500">Weather and traffic warnings</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 mr-2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium">Privacy Mode</h3>
                      <p className="text-xs text-gray-500">Limit location sharing</p>
                    </div>
                  </div>
                  <Switch />
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
                      className="h-5 w-5 text-blue-500 mr-2"
                    >
                      <path d="M2 12h10" />
                      <path d="M9 4v16" />
                      <path d="m3 9 3 3-3 3" />
                    </svg>
                    <h3 className="text-sm font-medium">Emergency Response Type</h3>
                  </div>
                  <Select defaultValue="contacts">
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
              </CardContent>
            </Card>

            <Button className="w-full" variant="outline">
              Test Emergency Features
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
