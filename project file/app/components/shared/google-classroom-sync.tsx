"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, FolderSyncIcon as Sync, CheckCircle, Users, BookOpen, Calendar } from "lucide-react"

interface GoogleClassroomSyncProps {
  user: any
  onSync: () => Promise<void>
  addNotification: (message: string, type?: "info" | "success" | "warning" | "error") => void
}

export function GoogleClassroomSync({ user, onSync, addNotification }: GoogleClassroomSyncProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(user?.googleClassroomSynced || false)
  const [syncedCourses, setSyncedCourses] = useState([
    {
      id: "gc_1",
      name: "AP Calculus BC",
      teacher: "Dr. Smith",
      students: 24,
      assignments: 12,
      lastSync: "2 hours ago",
    },
    {
      id: "gc_2",
      name: "AP Physics C",
      teacher: "Prof. Johnson",
      students: 18,
      assignments: 8,
      lastSync: "1 day ago",
    },
    {
      id: "gc_3",
      name: "Computer Science A",
      teacher: "Ms. Davis",
      students: 28,
      assignments: 15,
      lastSync: "3 hours ago",
    },
  ])

  const handleSync = async () => {
    setIsLoading(true)
    try {
      addNotification("Syncing with Google Classroom...", "info")

      // Simulate sync process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update sync times
      setSyncedCourses((courses) =>
        courses.map((course) => ({
          ...course,
          lastSync: "Just now",
        })),
      )

      await onSync()
      addNotification("Successfully synced with Google Classroom!", "success")
    } catch (error) {
      addNotification("Failed to sync with Google Classroom", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    addNotification("Connecting to Google Classroom...", "info")

    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsConnected(true)
      addNotification("Connected to Google Classroom successfully!", "success")

      // Update user data
      const userData = JSON.parse(localStorage.getItem("edututor_user") || "{}")
      userData.googleClassroomSynced = true
      localStorage.setItem("edututor_user", JSON.stringify(userData))
    } catch (error) {
      addNotification("Failed to connect to Google Classroom", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    addNotification("Disconnected from Google Classroom", "info")

    // Update user data
    const userData = JSON.parse(localStorage.getItem("edututor_user") || "{}")
    userData.googleClassroomSynced = false
    localStorage.setItem("edututor_user", JSON.stringify(userData))
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <Globe className="w-5 h-5 mr-2 text-emerald-600" />
          Google Classroom Integration
        </CardTitle>
        <CardDescription>Sync your courses and assignments from Google Classroom</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Globe className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Connect Google Classroom</h3>
              <p className="text-sm text-gray-600 mb-4">Sync your courses, assignments, and student data seamlessly</p>
            </div>
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
            >
              {isLoading ? (
                <>
                  <Sync className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Connect with Google
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-gray-800">Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSync}
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  <Sync className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  {isLoading ? "Syncing..." : "Sync Now"}
                </Button>
                <Button
                  onClick={handleDisconnect}
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Disconnect
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Synced Courses</h4>
              {syncedCourses.map((course) => (
                <div key={course.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-800">{course.name}</h5>
                    <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                      Synced
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{course.assignments} assignments</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Last sync: {course.lastSync}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-emerald-800 mb-1">Auto-Sync Enabled</h4>
                  <p className="text-sm text-emerald-700">
                    Your Google Classroom data syncs automatically every 6 hours. New assignments and student
                    enrollments will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
