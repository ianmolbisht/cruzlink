"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Navigation, LocateFixed, Share2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { MobileLayout } from "@/components/mobile-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center">
      <MapPin className="h-12 w-12 text-green-500 animate-pulse mb-4" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
    </div>
  ),
})

export default function MapPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trackingEnabled, setTrackingEnabled] = useState(true)
  const [geofencingEnabled, setGeofencingEnabled] = useState(false)
  const { toast } = useToast()

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          setLoading(false)

          toast({
            title: "Location Found",
            description: "Your current location has been detected.",
          })
        },
        (err) => {
          console.error("Error getting location:", err)
          setError(`Error getting location: ${err.message}`)
          setLoading(false)

          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Unable to access your location. Please check your permissions.",
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setLoading(false)

      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
      })
    }
  }, [toast])

  const refreshLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          setLoading(false)
        },
        (err) => {
          console.error("Error refreshing location:", err)
          setError(`Error refreshing location: ${err.message}`)
          setLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    }
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
          <h1 className="text-lg font-semibold">Location & Tracking</h1>
        </div>

        <Tabs defaultValue="map" className="flex-1 flex flex-col">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="map" className="flex-1">
                Map
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex-1">
                Tracking
              </TabsTrigger>
              <TabsTrigger value="geofence" className="flex-1">
                Geofence
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="map" className="flex-1 p-4 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <MapPin className="h-12 w-12 text-green-500 animate-pulse mb-4" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Getting your location...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={refreshLocation}>Try Again</Button>
              </div>
            ) : (
              <>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg flex-1 relative overflow-hidden mb-4">
                  {/* Map Component */}
                  {location && <MapComponent location={location} />}

                  <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
                    <Button
                      size="icon"
                      className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md"
                      onClick={refreshLocation}
                    >
                      <LocateFixed className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md"
                      onClick={() => {
                        if (location) {
                          // Create shareable location link
                          const locationUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`

                          // Use Web Share API if available
                          if (navigator.share) {
                            navigator.share({
                              title: "My Location",
                              text: "Here is my current location",
                              url: locationUrl,
                            })
                          } else {
                            // Fallback to clipboard
                            navigator.clipboard.writeText(locationUrl)
                            toast({
                              title: "Location Copied",
                              description: "Location link copied to clipboard",
                            })
                          }
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-medium">Current Location</h2>
                    <Button variant="outline" size="sm" onClick={refreshLocation} className="h-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-1"
                      >
                        <path d="M21 2v6h-6" />
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                        <path d="M3 22v-6h6" />
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                      </svg>
                      Refresh
                    </Button>
                  </div>

                  <div className="text-sm">
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span>{location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : "Unknown"}</span>
                    </div>
                    <div className="flex items-center">
                      <Navigation className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span>Current Location</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                    Share My Location
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="tracking" className="flex-1 p-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Real-time Tracking</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Allow others to track your location</p>
                  </div>
                  <Switch checked={trackingEnabled} onCheckedChange={setTrackingEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Location History</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Save your location history</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">High Accuracy</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Uses more battery</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Who can see my location</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="emergency-contacts" className="rounded" defaultChecked />
                      <Label htmlFor="emergency-contacts" className="text-xs">
                        Emergency Contacts
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="family" className="rounded" defaultChecked />
                      <Label htmlFor="family" className="text-xs">
                        Family
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="friends" className="rounded" />
                      <Label htmlFor="friends" className="text-xs">
                        Friends
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geofence" className="flex-1 p-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Geofencing</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Get alerts when entering or leaving areas
                    </p>
                  </div>
                  <Switch checked={geofencingEnabled} onCheckedChange={setGeofencingEnabled} />
                </div>

                {geofencingEnabled && (
                  <>
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">My Geofences</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium">Home</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">500m radius</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium">Work</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">300m radius</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>

                      <Button className="w-full mt-3" variant="outline">
                        Add New Geofence
                      </Button>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">Alert Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="enter-alert" className="rounded" defaultChecked />
                          <Label htmlFor="enter-alert" className="text-xs">
                            Alert when entering
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="leave-alert" className="rounded" defaultChecked />
                          <Label htmlFor="leave-alert" className="text-xs">
                            Alert when leaving
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="notify-contacts" className="rounded" />
                          <Label htmlFor="notify-contacts" className="text-xs">
                            Notify emergency contacts
                          </Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
