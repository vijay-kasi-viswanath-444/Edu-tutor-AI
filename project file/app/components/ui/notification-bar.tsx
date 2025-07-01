"use client"
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
}

interface NotificationBarProps {
  notifications: Notification[]
}

export function NotificationBar({ notifications }: NotificationBarProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />
      case "warning":
        return <AlertTriangle className="w-5 h-5" />
      case "error":
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-in slide-in-from-right-full duration-300 ${getStyles(notification.type)}`}
        >
          {getIcon(notification.type)}
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
        </div>
      ))}
    </div>
  )
}
