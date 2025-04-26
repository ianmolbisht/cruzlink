"use client"

import { useState } from "react"
import { ArrowLeft, Heart, Activity, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileLayout } from "@/components/mobile-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function HealthPage() {
  const [heartRate, setHeartRate] = useState(72)
  const [temperature, setTemperature] = useState(98.6)
  const [fatigue, setFatigue] = useState(15) // percentage

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
          <h1 className="text-lg font-semibold">Health Monitoring</h1>
        </div>

        <Tabs defaultValue="vitals" className="flex-1">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="vitals" className="flex-1">
                Vitals
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">
                Activity
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex-1">
                Alerts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="vitals" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Heart className="h-8 w-8 text-red-500 mb-2" />
                    <h3 className="text-sm font-medium text-center">Heart Rate</h3>
                    <div className="text-2xl font-bold text-red-600 mt-2">{heartRate}</div>
                    <p className="text-xs text-gray-500">BPM</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-amber-500 mb-2"
                    >
                      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                    </svg>
                    <h3 className="text-sm font-medium text-center">Temperature</h3>
                    <div className="text-2xl font-bold text-amber-600 mt-2">{temperature}</div>
                    <p className="text-xs text-gray-500">°F</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Fatigue Level</h3>
                  <span className={`text-xs font-medium ${fatigue > 50 ? "text-red-500" : "text-green-500"}`}>
                    {fatigue > 50 ? "High" : "Low"}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      fatigue > 75
                        ? "bg-red-600"
                        : fatigue > 50
                          ? "bg-amber-500"
                          : fatigue > 25
                            ? "bg-yellow-400"
                            : "bg-green-500"
                    }`}
                    style={{ width: `${fatigue}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500 mt-2">Based on movement patterns and ride duration</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Health Monitoring</h3>
                    <p className="text-xs text-gray-500">Track vital signs</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Connect Wearables</h3>
                    <p className="text-xs text-gray-500">Sync with smartwatch</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="p-4 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 text-green-500 mr-1" />
                    Today's Activity
                  </h3>
                  <span className="text-xs text-gray-500">April 20, 2025</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Distance</span>
                      <span className="font-medium">12.4 miles</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "62%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Duration</span>
                      <span className="font-medium">1h 45m</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avg. Speed</span>
                      <span className="font-medium">18 mph</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-3">Recent Trips</h3>

                <div className="space-y-3">
                  <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Home to Work</h4>
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-500">8.2 miles • 45 min</p>
                        <p className="text-xs text-gray-500">Today</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Work to Home</h4>
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-500">8.5 miles • 50 min</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Weekend Ride</h4>
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-500">24.3 miles • 2h 10m</p>
                        <p className="text-xs text-gray-500">Apr 18</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="p-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Fatigue Alerts</h3>
                    <p className="text-xs text-gray-500">Alert when fatigue detected</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Heart Rate Alerts</h3>
                    <p className="text-xs text-gray-500">Alert for abnormal heart rate</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Break Reminders</h3>
                    <p className="text-xs text-gray-500">Remind to take breaks</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Health Emergency</h3>
                    <p className="text-xs text-gray-500">Auto-alert for health emergencies</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-3">Recent Alerts</h3>

                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Break Reminder</h4>
                      <p className="text-xs text-amber-700">You've been riding for 2 hours. Consider taking a break.</p>
                      <p className="text-xs text-amber-600 mt-1">Today, 2:45 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Elevated Heart Rate</h4>
                      <p className="text-xs text-red-700">Your heart rate reached 145 BPM during your ride.</p>
                      <p className="text-xs text-red-600 mt-1">Yesterday, 5:30 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
