"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Brain, Trophy, Clock, Target, TrendingUp, Play, Star, Zap, LogOut } from "lucide-react"
import { GoogleClassroomSync } from "../shared/google-classroom-sync"
import { PerformanceChart } from "../shared/performance-chart"
import type { User, ViewType } from "../../page"

interface StudentDashboardProps {
  user: User
  onLogout: () => void
  navigateTo: (view: ViewType) => void
  addNotification: (message: string, type?: "info" | "success" | "warning" | "error") => void
}

export function StudentDashboard({ user, onLogout, navigateTo, addNotification }: StudentDashboardProps) {
  const [courses, setCourses] = useState([
    {
      id: "1",
      name: "Advanced Mathematics",
      progress: 78,
      color: "bg-emerald-500",
      nextTopic: "Calculus Integration",
      totalQuizzes: 12,
      averageScore: 85,
    },
    {
      id: "2",
      name: "Physics Fundamentals",
      progress: 65,
      color: "bg-teal-500",
      nextTopic: "Quantum Mechanics",
      totalQuizzes: 8,
      averageScore: 78,
    },
    {
      id: "3",
      name: "Computer Science",
      progress: 92,
      color: "bg-green-500",
      nextTopic: "Data Structures",
      totalQuizzes: 15,
      averageScore: 91,
    },
  ])

  const [recentQuizzes] = useState([
    { id: "1", subject: "Mathematics", topic: "Derivatives", score: 85, date: "2 hours ago", difficulty: "Advanced" },
    { id: "2", subject: "Physics", topic: "Newton's Laws", score: 92, date: "1 day ago", difficulty: "Intermediate" },
    {
      id: "3",
      subject: "Computer Science",
      topic: "Algorithms",
      score: 88,
      date: "2 days ago",
      difficulty: "Advanced",
    },
    { id: "4", subject: "Mathematics", topic: "Integrals", score: 76, date: "3 days ago", difficulty: "Intermediate" },
  ])

  const [performanceData] = useState([
    { date: "Mon", Mathematics: 85, Physics: 78, "Computer Science": 91 },
    { date: "Tue", Mathematics: 88, Physics: 82, "Computer Science": 89 },
    { date: "Wed", Mathematics: 82, Physics: 85, "Computer Science": 94 },
    { date: "Thu", Mathematics: 90, Physics: 79, "Computer Science": 92 },
    { date: "Fri", Mathematics: 87, Physics: 88, "Computer Science": 96 },
    { date: "Sat", Mathematics: 91, Physics: 84, "Computer Science": 93 },
    { date: "Sun", Mathematics: 89, Physics: 87, "Computer Science": 95 },
  ])

  const handleGoogleClassroomSync = async () => {
    addNotification("Syncing with Google Classroom...", "info")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock synced courses
    const syncedCourses = [
      {
        id: "gc_1",
        name: "AP Calculus BC",
        progress: 45,
        color: "bg-cyan-500",
        nextTopic: "Series and Sequences",
        totalQuizzes: 6,
        averageScore: 82,
      },
      {
        id: "gc_2",
        name: "AP Physics C",
        progress: 38,
        color: "bg-blue-500",
        nextTopic: "Electromagnetic Induction",
        totalQuizzes: 4,
        averageScore: 79,
      },
    ]

    setCourses((prev) => [...prev, ...syncedCourses])
    addNotification("Successfully synced 2 courses from Google Classroom!", "success")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "bg-red-100 text-red-700"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-green-100 text-green-700"
    }
  }

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "Mathematics":
        return "📐"
      case "Physics":
        return "⚛️"
      case "Computer Science":
        return "💻"
      default:
        return "📚"
    }
  }

  const totalQuizzes = recentQuizzes.length
  const averageScore = Math.round(recentQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes)
  const studyStreak = 12 // Mock data
  const timeStudied = "24h" // Mock data

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 ring-2 ring-emerald-200">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Ready to continue your learning journey?</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigateTo("quiz")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>

              <Button
                variant="outline"
                onClick={onLogout}
                className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Total Quizzes</p>
                  <p className="text-3xl font-bold">{totalQuizzes}</p>
                </div>
                <BookOpen className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Average Score</p>
                  <p className="text-3xl font-bold">{averageScore}%</p>
                </div>
                <Trophy className="w-8 h-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Study Streak</p>
                  <p className="text-3xl font-bold">{studyStreak} days</p>
                </div>
                <Zap className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm">Time Studied</p>
                  <p className="text-3xl font-bold">{timeStudied}</p>
                </div>
                <Clock className="w-8 h-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              My Courses
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Quiz History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Progress */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-800">
                      <Target className="w-5 h-5 mr-2 text-emerald-600" />
                      Course Progress
                    </CardTitle>
                    <CardDescription>Your learning progress across all courses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {courses.map((course) => (
                      <div key={course.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${course.color}`} />
                            <span className="font-medium text-gray-800">{course.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-600">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Next: {course.nextTopic}</span>
                          <span>
                            {course.totalQuizzes} quizzes • {course.averageScore}% avg
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* AI Recommendations */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <Brain className="w-5 h-5 mr-2 text-emerald-600" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription>Personalized suggestions for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-2">🎯 Focus Area</h4>
                    <p className="text-sm text-emerald-700 mb-3">
                      Your Physics scores suggest reviewing Quantum Mechanics fundamentals
                    </p>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Start Practice
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-50 border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">🚀 Strength Building</h4>
                    <p className="text-sm text-teal-700 mb-3">
                      Excellent progress in Computer Science! Try advanced algorithms
                    </p>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      Challenge Yourself
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">📈 Next Steps</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Ready for calculus integration? Your derivative skills are strong!
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Continue Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-800">
                      <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                      My Courses
                    </CardTitle>
                    <CardDescription>All your enrolled courses and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map((course) => (
                        <Card key={course.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-4 h-4 rounded-full ${course.color}`} />
                              <Badge variant="outline" className="text-xs">
                                {course.progress}% Complete
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">{course.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">Next: {course.nextTopic}</p>
                            <Progress value={course.progress} className="h-2 mb-4" />
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{course.totalQuizzes} quizzes</span>
                              <span>{course.averageScore}% avg</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <GoogleClassroomSync user={user} onSync={handleGoogleClassroomSync} addNotification={addNotification} />
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceChart data={performanceData} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Mathematics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">87%</div>
                  <p className="text-sm text-gray-600 mb-4">Average Score</p>
                  <Progress value={87} className="h-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Physics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600 mb-2">83%</div>
                  <p className="text-sm text-gray-600 mb-4">Average Score</p>
                  <Progress value={83} className="h-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Computer Science</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">93%</div>
                  <p className="text-sm text-gray-600 mb-4">Average Score</p>
                  <Progress value={93} className="h-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                  Recent Quiz Results
                </CardTitle>
                <CardDescription>Your latest quiz performances and scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getSubjectIcon(quiz.subject)}</div>
                        <div>
                          <h4 className="font-medium text-gray-800">{quiz.topic}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {quiz.subject}
                            </Badge>
                            <Badge variant="secondary" className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                              {quiz.difficulty}
                            </Badge>
                            <span className="text-xs text-gray-500">{quiz.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-gray-800 text-lg">{quiz.score}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
