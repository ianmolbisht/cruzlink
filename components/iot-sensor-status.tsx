"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle, WifiOff } from "lucide-react"
import { iotSensorMonitor } from "@/services/iot-sensor"

export function IoTSensorStatus() {
  const [status, setStatus] = useState<{ status: string; error: string | null }>({
    status: "disconnected",
    error: null,
  })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const checkStatus = () => {
      const currentStatus = iotSensorMonitor.getConnectionStatus()
      setStatus(currentStatus)
    }

    // Check status immediately
    checkStatus()

    // Then check every 3 seconds
    const interval = setInterval(checkStatus, 3000)

    // Auto-hide after 10 seconds if connected
    const hideTimer = setTimeout(() => {
      if (status.status === "connected") {
        setVisible(false)
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(hideTimer)
    }
  }, [status.status])

  if (!visible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-2 rounded-lg shadow-md flex items-center gap-2 text-sm ${
        status.status === "connected"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          : status.status === "error"
            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      }`}
      onClick={() => setVisible(false)}
    >
      {status.status === "connected" ? (
        <CheckCircle className="h-4 w-4" />
      ) : status.status === "error" ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <WifiOff className="h-4 w-4" />
      )}
      <span>
        {status.status === "connected"
          ? "IoT Sensor Connected"
          : status.status === "error"
            ? "IoT Sensor Error"
            : "IoT Sensor Disconnected"}
      </span>
    </div>
  )
}
