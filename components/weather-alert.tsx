"use client"

import { AlertTriangle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface WeatherAlertProps {
  onClose: () => void
}

export function WeatherAlert({ onClose }: WeatherAlertProps) {
  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <div className="flex-1">
        <AlertTitle className="text-amber-800 text-sm">Weather Alert</AlertTitle>
        <AlertDescription className="text-amber-700 text-xs">
          Light rain expected in your area. Ride carefully.
        </AlertDescription>
      </div>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </Alert>
  )
}
