"use client"

import { useState } from "react"
import { AlertTriangle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { iotSensorMonitor } from "@/services/iot-sensor"
import { useToast } from "@/components/ui/use-toast"

export function CrashDetectionSimulator() {
  const [impactForce, setImpactForce] = useState(10)
  const [isOpen, setIsOpen] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const { toast } = useToast()

  const simulateImpact = () => {
    setIsSimulating(true)

    // Visual feedback
    toast({
      title: "Simulating Crash",
      description: `Sending impact with force: ${impactForce}`,
      variant: "destructive",
    })

    // Trigger the impact
    iotSensorMonitor.simulateImpact(impactForce)

    // Reset after a short delay
    setTimeout(() => {
      setIsSimulating(false)
    }, 2000)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
        Test Crash
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Crash Simulator
        </h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
          ✕
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Impact Force: {impactForce}</label>
          <Slider value={[impactForce]} min={1} max={20} step={1} onValueChange={(value) => setImpactForce(value[0])} />
        </div>

        <Button variant="destructive" size="sm" className="w-full" onClick={simulateImpact} disabled={isSimulating}>
          {isSimulating ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              Simulating...
            </>
          ) : (
            <>Simulate Crash</>
          )}
        </Button>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          This will trigger the SOS countdown as if a real impact was detected.
        </p>
      </div>
    </div>
  )
}
