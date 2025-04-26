"use client"

import { useEffect, useRef, useState } from "react"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function SOSButton() {
  const [isPressed, setIsPressed] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [sosActivated, setSosActivated] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/sos-audio.mp3")
  }, [])

  const handleSOSPress = () => {
    setIsPressed(true)
    setShowDialog(true)
  
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback failed:", err)
      })
    }
  
    let count = 5
    setCountdown(count)
  
    const timer = setInterval(() => {
      count -= 1
      setCountdown(count)
  
      if (count <= 0) {
        clearInterval(timer)
        setSosActivated(true)
      }
    }, 1000)
  
    return () => clearInterval(timer)
  }
  

  const cancelSOS = () => {
    setShowDialog(false)
    setIsPressed(false)
    setSosActivated(false)
    setCountdown(5)
  }

  return (
    <>
      <Button
        className={`h-40 w-40 rounded-full text-white text-xl font-bold shadow-lg transition-all duration-300 ${
          isPressed ? "bg-red-700 scale-95 shadow-inner" : "bg-red-600 hover:bg-red-700 hover:scale-105"
        }`}
        onClick={handleSOSPress}
      >
        SOS
      </Button>

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
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-500 animate-pulse" />
              </div>
              <p className="text-center text-sm text-gray-500">
                Your current location and helmet ID have been shared with emergency contacts.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-red-600">{countdown}</span>
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
                    strokeDashoffset={289.02652413026095 * (countdown / 5)}
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
