/**
 * Service to monitor IoT sensor for impact detection
 */

const IOT_SENSOR_URL = "http://192.168.187.194/status"

// Polling interval in milliseconds (checks every second)
const POLLING_INTERVAL = 1000

type SensorData = {
  impact: boolean
  impactForce?: number
  timestamp?: number
  batteryLevel?: number
}

type SensorCallback = (data: SensorData) => void

export class IoTSensorMonitor {
  private intervalId: NodeJS.Timeout | null = null
  private callbacks: SensorCallback[] = []
  private lastImpactTime = 0
  private readonly IMPACT_COOLDOWN = 30000 // 30 seconds cooldown between impact detections
  private connectionStatus: "connected" | "disconnected" | "error" = "disconnected"
  private connectionError: string | null = null

  constructor() {
    this.intervalId = null
  }

  /**
   * Start monitoring the IoT sensor
   */
  private lastFetchFailedAt = 0

public startMonitoring(): void {
  if (this.intervalId) return // Already monitoring

  this.intervalId = setInterval(async () => {
    const now = Date.now()

    // If last fetch failed, wait 10 seconds before trying again
    if (this.connectionStatus === "error" && now - this.lastFetchFailedAt < 10000) {
      return // skip this poll
    }

    try {
      const data = await this.fetchSensorData()

      // Successful fetch
      if (this.connectionStatus !== "connected") {
        this.connectionStatus = "connected"
        this.connectionError = null
        console.log("[IoT Monitor] Connected to IoT sensor")
      }

      if (data.impact && now - this.lastImpactTime > this.IMPACT_COOLDOWN) {
        console.log("[IoT Monitor] Impact detected:", data)
        this.lastImpactTime = now
        this.notifyCallbacks(data)
      }
    } catch (error) {
      // Fetch failed
      if (this.connectionStatus !== "error") {
        console.warn("[IoT Monitor] Failed to connect to IoT sensor:", (error as Error).message)
      }
      this.connectionStatus = "error"
      this.connectionError = (error as Error).message
      this.lastFetchFailedAt = Date.now() // mark failure time
    }
  }, POLLING_INTERVAL)

  console.log("[IoT Monitor] Monitoring started")
}


  /**
   * Stop monitoring the IoT sensor
   */
  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      this.connectionStatus = "disconnected"
      console.log("IoT sensor monitoring stopped")
    }
  }

  /**
   * Register a callback for impact detection
   */
  public onImpact(callback: SensorCallback): void {
    this.callbacks.push(callback)
  }

  /**
   * Remove a callback
   */
  public removeCallback(callback: SensorCallback): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback)
  }

  /**
   * Get current connection status
   */
  public getConnectionStatus(): { status: string; error: string | null } {
    return {
      status: this.connectionStatus,
      error: this.connectionError,
    }
  }

  /**
   * Fetch the latest sensor data
   */
  private async fetchSensorData(): Promise<SensorData> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
  
    try {
      const response = await fetch(IOT_SENSOR_URL, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        mode: "cors",
      })
      
      clearTimeout(timeoutId)
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json()
      return data as SensorData
    } catch (error) {
      clearTimeout(timeoutId)
      throw error // ❗ Don't simulate here
    }
  }
  
  /**
   * Notify all registered callbacks about the impact
   */
  private notifyCallbacks(data: SensorData): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error("Error in impact callback:", error)
      }
    })
  }

  /**
   * Simulate an impact event (for testing)
   */
 
}

// Singleton instance
export const iotSensorMonitor = new IoTSensorMonitor()
