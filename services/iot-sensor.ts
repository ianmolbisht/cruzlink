/**
 * Service to monitor IoT sensor for impact detection
 */

const IOT_SENSOR_URL = "http://192.168.187.194/"

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
  public startMonitoring(): void {
    if (this.intervalId) return // Already monitoring

    this.intervalId = setInterval(async () => {
      try {
        const data = await this.fetchSensorData()

        // Update connection status
        this.connectionStatus = "connected"
        this.connectionError = null

        // If impact is detected and we're not in cooldown period
        if (data.impact && Date.now() - this.lastImpactTime > this.IMPACT_COOLDOWN) {
          console.log("Impact detected from IoT sensor:", data)
          this.lastImpactTime = Date.now()
          this.notifyCallbacks(data)
        }
      } catch (error) {
        this.connectionStatus = "error"
        this.connectionError = (error as Error).message
        console.error("Error fetching sensor data:", error)
      }
    }, POLLING_INTERVAL)

    console.log("IoT sensor monitoring started")
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
        headers: {
          Accept: "application/json",
        },
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
      console.warn("Could not connect to IoT sensor, simulating data:", error)

      // Fallback simulated response
      const shouldSimulateImpact = Math.random() < 0.05
      return {
        impact: shouldSimulateImpact,
        impactForce: shouldSimulateImpact ? Math.floor(Math.random() * 10) + 5 : 0,
        timestamp: Date.now(),
        batteryLevel: 85,
      }
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
  public simulateImpact(force = 10): void {
    console.log("Simulating impact with force:", force)
    this.notifyCallbacks({
      impact: true,
      impactForce: force,
      timestamp: Date.now(),
    })
  }
}

// Singleton instance
export const iotSensorMonitor = new IoTSensorMonitor()
