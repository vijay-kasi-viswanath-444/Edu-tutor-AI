"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Brain,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  Bell,
  Settings,
  LogOut,
  Plus,
  Eye,
  Globe,
  Video,
  Award,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { GoogleClassroomSync } from "../../components/shared/google-classroom-sync"

interface User {
  id: string
  email: string
  name: string
  userType: string
  googleClassroomSynced?: boolean
}

interface Student {
  id: string
  name: string
  email: string
  averageScore: number
  quizzesCompleted: number
  lastActive: string
  status: "active" | "struggling" | "excelling"
}

interface ClassData {
  id: string
  name: string
  subject: string
  studentCount: number
  averageScore: number
  activeQuizzes: number
  lastActivity: string
}

export default function EducatorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<ClassData[]>([])
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: string }>>([])
  const [totalStudents, setTotalStudents] = useState(156)
  const [activeQuizzes, setActiveQuizzes] = useState(12)
  const [avgClassScore, setAvgClassScore] = useState(82)
  const [upcomingSessions, setUpcomingSessions] = useState(5)
  const router = useRouter()

  const addNotification = (message: string, type = "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications((prev) => [...prev, { id, message, type }])

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  useEffect(() => {
    const userData = localStorage.getItem("edututor_user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== "educator") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)

    // Load mock data
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Alex Johnson",
        email: "alex.johnson@school.edu",
        averageScore: 85,
        quizzesCompleted: 23,
        lastActive: "2024-01-15T10:30:00Z",
        status: "active",
      },
      {
        id: "2",
        name: "Sarah Chen",
        email: "sarah.chen@school.edu",
        averageScore: 92,
        quizzesCompleted: 28,
        lastActive: "2024-01-15T09:15:00Z",
        status: "excelling",
      },
      {
        id: "3",
        name: "Mike Rodriguez",
        email: "mike.rodriguez@school.edu",
        averageScore: 68,
        quizzesCompleted: 15,
        lastActive: "2024-01-14T16:45:00Z",
        status: "struggling",
      },
      {
        id: "4",
        name: "Emma Davis",
        email: "emma.davis@school.edu",
        averageScore: 78,
        quizzesCompleted: 19,
        lastActive: "2024-01-15T08:20:00Z",
        status: "active",
      },
      {
        id: "5",
        name: "James Wilson",
        email: "james.wilson@school.edu",
        averageScore: 95,
        quizzesCompleted: 31,
        lastActive: "2024-01-15T11:45:00Z",
        status: "excelling",
      },
    ]

    const mockClasses: ClassData[] = [
      {
        id: "1",
        name: "Advanced Mathematics",
        subject: "Mathematics",
        studentCount: 28,
        averageScore: 84,
        activeQuizzes: 3,
        lastActivity: "2 hours ago",
      },
      {
        id: "2",
        name: "Physics 101",
        subject: "Physics",
        studentCount: 32,
        averageScore: 79,
        activeQuizzes: 2,
        lastActivity: "4 hours ago",
      },
      {
        id: "3",
        name: "Computer Science Fundamentals",
        subject: "Computer Science",
        studentCount: 25,
        averageScore: 88,
        activeQuizzes: 4,
        lastActivity: "1 hour ago",
      },
    ]

    setStudents(mockStudents)
    setClasses(mockClasses)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("edututor_user")
    router.push("/")
  }

  const handleCreateQuiz = (classId?: string) => {
    addNotification("Redirecting to quiz creation...", "info")
    router.push("/educator/quiz/create" + (classId ? `?classId=${classId}` : ""))
  }

  const handleViewStudents = (classId: string) => {
    addNotification("Loading student details...", "info")
    // In a real app, this would navigate to a detailed student view
    console.log("Viewing students for class:", classId)
  }

  const handleScheduleSession = () => {
    addNotification("Opening session scheduler...", "info")
    router.push("/educator/sessions/schedule")
  }

  const handleViewAnalytics = () => {
    addNotification("Loading analytics dashboard...", "info")
    router.push("/educator/analytics")
  }

  const handleGoogleClassroomSync = async () => {
    addNotification("Syncing with Google Classroom...", "info")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    addNotification("Successfully synced classroom data!", "success")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excelling":
        return "bg-emerald-100 text-emerald-800"
      case "struggling":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "excelling":
        return "Excelling"
      case "struggling":
        return "Needs Help"
      default:
        return "Active"
    }
  }

  const performanceData = [
    { date: "Mon", "Class Average": 78, "Top Performers": 92, "Struggling Students": 45 },
    { date: "Tue", "Class Average": 82, "Top Performers": 94, "Struggling Students": 48 },
    { date: "Wed", "Class Average": 79, "Top Performers": 91, "Struggling Students": 52 },
    { date: "Thu", "Class Average": 85, "Top Performers": 96, "Struggling Students": 49 },
    { date: "Fri", "Class Average": 83, "Top Performers": 93, "Struggling Students": 55 },
    { date: "Sat", "Class Average": 87, "Top Performers": 97, "Struggling Students": 58 },
    { date: "Sun", "Class Average": 84, "Top Performers": 95, "Struggling Students": 54 },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg border ${
                notification.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : notification.type === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : notification.type === "warning"
                      ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                      : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  EduTutor AI
                </span>
                <p className="text-sm text-gray-600">Educator Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}! 👨‍🏫</h1>
          <p className="text-gray-600">Monitor your students' progress and manage your classes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-emerald-600">{totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Quizzes</p>
                  <p className="text-2xl font-bold text-teal-600">{activeQuizzes}</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Class Score</p>
                  <p className="text-2xl font-bold text-green-600">{avgClassScore}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                  <p className="text-2xl font-bold text-orange-600">{upcomingSessions}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your classes and students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleCreateQuiz()}
                    className="h-20 flex-col space-y-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Create New Quiz</span>
                  </Button>
                  <Button
                    onClick={handleScheduleSession}
                    variant="outline"
                    className="h-20 flex-col space-y-2 bg-transparent border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Calendar className="w-6 h-6" />
                    <span>Schedule Session</span>
                  </Button>
                  <Button
                    onClick={handleViewAnalytics}
                    variant="outline"
                    className="h-20 flex-col space-y-2 bg-transparent border-teal-200 text-teal-600 hover:bg-teal-50"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button
                    onClick={handleGoogleClassroomSync}
                    variant="outline"
                    className="h-20 flex-col space-y-2 bg-transparent border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Globe className="w-6 h-6" />
                    <span>Sync Classroom</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Student Performance */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>Monitor your students' progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-medium">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.quizzesCompleted} quizzes completed</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(student.status)}>{getStatusText(student.status)}</Badge>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">{student.averageScore}%</p>
                          <p className="text-sm text-gray-600">Average</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleViewStudents(student.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Classes Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Your Classes</CardTitle>
                <CardDescription>Overview of all your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {classes.map((classData) => (
                    <Card key={classData.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{classData.name}</h4>
                          <Badge variant="secondary">{classData.subject}</Badge>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Students:</span>
                            <span className="font-medium">{classData.studentCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Avg Score:</span>
                            <span className="font-medium">{classData.averageScore}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Active Quizzes:</span>
                            <span className="font-medium">{classData.activeQuizzes}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleCreateQuiz(classData.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Quiz
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewStudents(classData.id)}
                            className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Google Classroom Sync */}
            <GoogleClassroomSync user={user} onSync={handleGoogleClassroomSync} addNotification={addNotification} />

            {/* Upcoming Sessions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-emerald-900">Math Tutoring</p>
                      <Video className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-sm text-emerald-600">3:00 PM - 4:00 PM</p>
                    <p className="text-xs text-emerald-500">5 students enrolled</p>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-teal-900">Physics Lab</p>
                      <Users className="w-4 h-4 text-teal-600" />
                    </div>
                    <p className="text-sm text-teal-600">5:00 PM - 6:30 PM</p>
                    <p className="text-xs text-teal-500">12 students enrolled</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Sarah Chen completed Math Quiz</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">New student joined Physics 101</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Quiz deadline reminder sent</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <p className="text-sm font-medium text-emerald-900">Great Progress!</p>
                    </div>
                    <p className="text-xs text-emerald-600">Class average improved by 8% this week</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <p className="text-sm font-medium text-orange-900">Attention Needed</p>
                    </div>
                    <p className="text-xs text-orange-600">3 students need additional support</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
