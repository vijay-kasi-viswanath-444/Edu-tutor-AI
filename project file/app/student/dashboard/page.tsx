"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  BookOpen,
  Calculator,
  Atom,
  Code,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Play,
  BarChart3,
  Users,
  Globe,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface User {
  id: string
  email: string
  name: string
  userType: string
}

interface QuizResult {
  id: string
  subject: string
  score: number
  totalQuestions: number
  completedAt: string
  difficulty: string
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [currentStreak, setCurrentStreak] = useState(7)
  const [totalPoints, setTotalPoints] = useState(1250)
  const [completedQuizzes, setCompletedQuizzes] = useState(23)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("edututor_user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== "student") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)

    // Load mock quiz results
    const mockResults: QuizResult[] = [
      {
        id: "1",
        subject: "Mathematics",
        score: 85,
        totalQuestions: 10,
        completedAt: "2024-01-15T10:30:00Z",
        difficulty: "Intermediate",
      },
      {
        id: "2",
        subject: "Physics",
        score: 92,
        totalQuestions: 8,
        completedAt: "2024-01-14T14:20:00Z",
        difficulty: "Advanced",
      },
      {
        id: "3",
        subject: "Computer Science",
        score: 78,
        totalQuestions: 12,
        completedAt: "2024-01-13T16:45:00Z",
        difficulty: "Beginner",
      },
    ]

    setQuizResults(mockResults)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("edututor_user")
    router.push("/")
  }

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "Mathematics":
        return <Calculator className="w-5 h-5" />
      case "Physics":
        return <Atom className="w-5 h-5" />
      case "Computer Science":
        return <Code className="w-5 h-5" />
      default:
        return <BookOpen className="w-5 h-5" />
    }
  }

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Mathematics":
        return "from-blue-500 to-blue-600"
      case "Physics":
        return "from-green-500 to-green-600"
      case "Computer Science":
        return "from-purple-500 to-purple-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduTutor AI
                </span>
                <p className="text-sm text-gray-600">Student Dashboard</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-600">{currentStreak} days</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-blue-600">{totalPoints.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quizzes Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedQuizzes}</p>
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
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-purple-600">85%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
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
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Start Learning</span>
                </CardTitle>
                <CardDescription>Choose a subject to begin your next quiz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link href="/student/quiz/mathematics">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-200">
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${getSubjectColor("Mathematics")} rounded-xl flex items-center justify-center mx-auto mb-4`}
                        >
                          <Calculator className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Mathematics</h3>
                        <p className="text-sm text-gray-600">Algebra, Calculus, Geometry</p>
                        <Badge variant="secondary" className="mt-2">
                          12 topics
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/student/quiz/physics">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-200">
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${getSubjectColor("Physics")} rounded-xl flex items-center justify-center mx-auto mb-4`}
                        >
                          <Atom className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Physics</h3>
                        <p className="text-sm text-gray-600">Mechanics, Thermodynamics</p>
                        <Badge variant="secondary" className="mt-2">
                          8 topics
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/student/quiz/computer-science">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-purple-200">
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${getSubjectColor("Computer Science")} rounded-xl flex items-center justify-center mx-auto mb-4`}
                        >
                          <Code className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Computer Science</h3>
                        <p className="text-sm text-gray-600">Programming, Algorithms</p>
                        <Badge variant="secondary" className="mt-2">
                          15 topics
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Quiz Results */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Quiz Results</CardTitle>
                <CardDescription>Your latest quiz performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${getSubjectColor(result.subject)} rounded-lg flex items-center justify-center`}
                        >
                          {getSubjectIcon(result.subject)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{result.subject}</h4>
                          <p className="text-sm text-gray-600">
                            {result.score}/{result.totalQuestions} correct • {result.difficulty}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {Math.round((result.score / result.totalQuestions) * 100)}%
                        </p>
                        <p className="text-sm text-gray-600">{new Date(result.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Mathematics</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Physics</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Computer Science</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Upcoming Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Math Tutoring</p>
                    <p className="text-sm text-blue-600">Today, 3:00 PM</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">Physics Lab</p>
                    <p className="text-sm text-green-600">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Classroom Sync */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Google Classroom</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Sync Classroom Data
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">Last synced: 2 hours ago</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
