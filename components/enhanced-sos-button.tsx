"use client"

import { useState, useEffect, useRef } from "react"
import { AlertCircle, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { iotSensorMonitor } from "@/services/iot-sensor"

export function EnhancedSOSButton() {
  const [isPressed, setIsPressed] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [countdown, setCountdown] = useState(15) // 15 seconds countdown
  const [sosActivated, setSosActivated] = useState(false)
  const [pulsate, setPulsate] = useState(true)
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: "Emergency Services", phone: "911" },
    { name: "John Smith", phone: "+1 (555) 123-4567" },
  ])
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Pulsating animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsate((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Set up IoT sensor monitoring
  useEffect(() => {
    // Start monitoring the IoT sensor
    iotSensorMonitor.startMonitoring()

    // Register impact callback
    const handleImpact = (data: any) => {
      console.log("Impact detected from IoT sensor:", data)
      // Only trigger if not already in SOS mode
      if (!showDialog) {
        handleSOSPress(true) // Pass true to indicate it's from IoT sensor

        toast({
          title: "Crash Detected!",
          description: `Impact detected with force: ${data.impactForce || "Unknown"}. Starting SOS countdown.`,
          variant: "destructive",
        })
      }
    }

    iotSensorMonitor.onImpact(handleImpact)

    // Clean up on unmount
    return () => {
      iotSensorMonitor.stopMonitoring()
      iotSensorMonitor.removeCallback(handleImpact)
    }
  }, [showDialog, toast])

  const handleSOSPress = (fromSensor = false) => {
    console.log("SOS button pressed, fromSensor:", fromSensor)
    setIsPressed(true)
    setShowDialog(true)

    // Reset countdown to 15 seconds
    let count = 15
    setCountdown(count)

    // Clear any existing timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
    }

    // Start new countdown
    countdownTimerRef.current = setInterval(() => {
      count -= 1
      setCountdown(count)

      if (count <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current)
          countdownTimerRef.current = null
        }
        setSosActivated(true)
        simulateEmergencyAlerts()
      }
    }, 1000)
  }

  const simulateEmergencyAlerts = async () => {
    // Get current location
    let locationStr = "Unknown location"

    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          })
        })

        const { latitude, longitude } = position.coords
        locationStr = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      }
    } catch (error) {
      console.error("Failed to get location:", error)
    }

    // Simulate emergency call
    toast({
      title: "Emergency Call Simulated",
      description: `Would call ${emergencyContacts[0].name} at ${emergencyContacts[0].phone}`,
    })

    // Simulate SMS to all emergency contacts
    toast({
      title: "Emergency SMS Simulated",
      description: `Would send alert messages to ${emergencyContacts.length} emergency contacts with location: ${locationStr}`,
    })

    // Log the actions for debugging
    console.log("Emergency alerts simulated:", {
      location: locationStr,
      contacts: emergencyContacts,
    })
  }

  const cancelSOS = () => {
    setShowDialog(false)
    setIsPressed(false)
    setSosActivated(false)
    setCountdown(15) // Reset to 15 seconds

    // Clear countdown timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
  }

  return (
    <>
      <motion.div
        animate={{
          boxShadow: pulsate ? "0 0 0 0 rgba(239, 68, 68, 0)" : "0 0 0 20px rgba(239, 68, 68, 0)",
          scale: pulsate ? 1 : 1.05,
        }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="relative"
      >
        <Button
          className={`h-40 w-40 rounded-full text-white text-2xl font-bold shadow-lg transition-all duration-300 ${
            isPressed
              ? "bg-red-700 scale-95 shadow-inner"
              : "bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
          }`}
          onClick={() => handleSOSPress(false)}
        >
          SOS
        </Button>
        <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 blur-md -z-10"></div>
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              {sosActivated ? "SOS Alert Activated" : "SOS Alert Countdown"}
            </DialogTitle>
            <DialogDescription>
              {sosActivated
                ? "Emergency services have been notified. Help is on the way."
                : `Emergency alert will be sent in ${countdown} seconds. Tap cancel to stop.`}
            </DialogDescription>
          </DialogHeader>

          {sosActivated ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4 relative">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-500"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>

              <div className="w-full space-y-4 mt-2">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{contact.phone}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        toast({
                          title: "Call Simulated",
                          description: `Would call ${contact.name} at ${contact.phone}`,
                        })
                      }}
                    >
                      Call
                    </Button>
                  </div>
                ))}

                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Location Shared</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">With emergency contacts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">{countdown}</span>
                </div>
                <svg className="absolute top-0 left-0" width="96" height="96">
                  <circle
                    cx="48"
                    cy="48"
                    r="46"
                    fill="none"
                    stroke="rgb(239 68 68)"
                    strokeWidth="4"
                    strokeDasharray="289.02652413026095"
                    strokeDashoffset={289.02652413026095 * (countdown / 15)} // 15 second countdown
                    transform="rotate(-90 48 48)"
                  />
                </svg>
              </div>
            </div>
          )}

          <DialogFooter>
            {sosActivated ? (
              <Button onClick={cancelSOS} className="w-full">
                Close
              </Button>
            ) : (
              <Button onClick={cancelSOS} variant="outline" className="w-full">
                Cancel SOS
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
