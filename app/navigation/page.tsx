"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, MapPin, Clock, ChevronRight, Navigation } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileLayout } from "@/components/mobile-layout"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// Dynamically import the NavigationMap component with no SSR
const NavigationMap = dynamic(() => import("@/components/navigation-map"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Navigation className="h-12 w-12 text-blue-500 animate-pulse mb-4" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading navigation...</p>
    </div>
  ),
})

export default function NavigationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [destination, setDestination] = useState<{ name: string; lat: number; lng: number } | null>(null)
  const [route, setRoute] = useState<any>(null)
  const { toast } = useToast()

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ lat: latitude, lng: longitude })
        },
        (err) => {
          console.error("Error getting location:", err)
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
    }
  }, [toast])

  const startNavigation = (place: { name: string; address: string }) => {
    // In a real app, you would geocode the address to get coordinates
    // For this demo, we'll use hardcoded coordinates
    const destinationCoords = { lat: 37.7694, lng: -122.4862 } // Example: Golden Gate Park
    setDestination({ name: place.name, ...destinationCoords })

    // Set route data (in a real app, this would include turn-by-turn directions)
    setRoute({
      distance: "2.5 miles",
      duration: "12 min",
      steps: [
        { instruction: "Head north on Market Street", distance: "0.5 miles", duration: "3 min" },
        { instruction: "Turn right onto Oak Street", distance: "1.2 miles", duration: "6 min" },
        { instruction: "Turn left onto Stanyan Street", distance: "0.8 miles", duration: "3 min" },
      ],
    })

    setIsNavigating(true)
  }

  const stopNavigation = () => {
    setIsNavigating(false)
    setDestination(null)
    setRoute(null)
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
          <h1 className="text-lg font-semibold">Navigation</h1>
        </div>

        {isNavigating ? (
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-100 dark:bg-gray-800 flex-1 relative">
              {/* Navigation Map */}
              {currentLocation && destination && (
                <NavigationMap currentLocation={currentLocation} destination={destination} />
              )}

              <div className="absolute top-4 left-4 right-4 z-20">
                <Card className="shadow-lg">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium">{destination?.name || "Destination"}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {route?.distance} away • {route?.duration}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={stopNavigation}>
                        End
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute bottom-4 left-4 right-20 z-20">
                <Card className="bg-blue-600 text-white shadow-lg dark:bg-blue-700">
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-1 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 text-blue-600"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{route?.steps[0].instruction}</h3>
                        <p className="text-xs text-blue-100">{route?.steps[0].distance}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="p-3 border-t dark:border-gray-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                  <span className="text-sm">ETA: 10:45 AM</span>
                </div>
                <div className="text-sm font-medium">{route?.distance} left</div>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="search" className="flex-1">
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="search" className="flex-1">
                  Search
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex-1">
                  Recent
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex-1">
                  Saved
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="search" className="p-4 flex-1">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for a destination..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Card
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() =>
                    startNavigation({
                      name: "Coffee Shop",
                      address: "123 Main St, San Francisco",
                    })
                  }
                >
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Coffee Shop</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">123 Main St, San Francisco</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() =>
                    startNavigation({
                      name: "City Park",
                      address: "Golden Gate Park, San Francisco",
                    })
                  }
                >
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">City Park</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Golden Gate Park, San Francisco</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() =>
                    startNavigation({
                      name: "Tech Museum",
                      address: "789 Howard St, San Francisco",
                    })
                  }
                >
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Tech Museum</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">789 Howard St, San Francisco</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recent" className="p-4">
              <div className="space-y-3">
                <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Work</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 9:15 AM</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          startNavigation({
                            name: "Work",
                            address: "456 Office Blvd, San Francisco",
                          })
                        }
                      >
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Home</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 6:30 PM</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          startNavigation({
                            name: "Home",
                            address: "123 Home St, San Francisco",
                          })
                        }
                      >
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Gym</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Apr 19, 7:00 PM</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          startNavigation({
                            name: "Gym",
                            address: "789 Fitness Ave, San Francisco",
                          })
                        }
                      >
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="p-4">
              <div className="space-y-3">
                <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-red-600 dark:text-red-400"
                        >
                          <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Home</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">123 Home St, San Francisco</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          startNavigation({
                            name: "Home",
                            address: "123 Home St, San Francisco",
                          })
                        }
                      >
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        >
                          <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" />
                          <path d="M9 22V12h6v10" />
                          <path d="M2 10.6L12 2l10 8.6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Work</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">456 Office Blvd, San Francisco</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          startNavigation({
                            name: "Work",
                            address: "456 Office Blvd, San Francisco",
                          })
                        }
                      >
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-green-600 dark:text-green-400"
                        >
                          <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
                          <path d="M2 20h20" />
                          <path d="M14 12v.01" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">Gym</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">789 Fitness Ave, San Francisco</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          startNavigation({
                            name: "Gym",
                            address: "789 Fitness Ave, San Francisco",
                          })
                        }
                      >
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full mt-2" variant="outline">
                  Add New Location
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MobileLayout>
  )
}
