import { Battery } from "lucide-react"

interface BatteryStatusProps {
  percentage: number
}

export function BatteryStatus({ percentage }: BatteryStatusProps) {
  let color = "text-green-500"

  if (percentage < 20) {
    color = "text-red-500"
  } else if (percentage < 50) {
    color = "text-amber-500"
  }

  return (
    <div className="flex items-center">
      <Battery className={`h-4 w-4 mr-1 ${color}`} />
      <span className={`text-xs font-medium ${color}`}>{percentage}%</span>
    </div>
  )
}
