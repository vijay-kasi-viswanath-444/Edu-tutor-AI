"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Calendar,
  BarChart3,
  Download,
  Eye,
  Clock,
  LogOut,
  Plus,
} from "lucide-react"
import { GoogleClassroomSync } from "../shared/google-classroom-sync"
import { PerformanceChart } from "../shared/performance-chart"
import type { User, ViewType } from "../../page"

interface EducatorDashboardProps {
  user: User
  onLogout: () => void
  navigateTo: (view: ViewType) => void
  addNotification: (message: string, type?: "info" | "success" | "warning" | "error") => void
}

export function EducatorDashboard({ user, onLogout, navigateTo, addNotification }: EducatorDashboardProps) {
  const [classes] = useState([
    {
      id: "1",
      name: "Advanced Mathematics",
      students: 28,
      avgScore: 82,
      lastActivity: "2 hours ago",
      subject: "Mathematics",
      activeQuizzes: 3,
    },
    {
      id: "2",
      name: "Physics Fundamentals",
      students: 24,
      avgScore: 75,
      lastActivity: "4 hours ago",
      subject: "Physics",
      activeQuizzes: 2,
    },
    {
      id: "3",
      name: "Computer Science",
      students: 32,
      avgScore: 88,
      lastActivity: "1 hour ago",
      subject: "Computer Science",
      activeQuizzes: 4,
    },
  ])

  const [recentActivity] = useState([
    {
      id: "1",
      student: "Alice Johnson",
      action: "Completed Quiz",
      subject: "Mathematics",
      score: 95,
      time: "10 min ago",
      avatar: "AJ",
    },
    {
      id: "2",
      student: "Bob Smith",
      action: "Started Quiz",
      subject: "Physics",
      score: null,
      time: "15 min ago",
      avatar: "BS",
    },
    {
      id: "3",
      student: "Carol Davis",
      action: "Completed Quiz",
      subject: "Computer Science",
      score: 87,
      time: "25 min ago",
      avatar: "CD",
    },
    {
      id: "4",
      student: "David Wilson",
      action: "Requested Help",
      subject: "Mathematics",
      score: null,
      time: "30 min ago",
      avatar: "DW",
    },
  ])

  const [strugglingStudents] = useState([
    {
      id: "1",
      name: "Emma Brown",
      subject: "Physics",
      avgScore: 45,
      trend: "declining",
      avatar: "EB",
      lastActive: "2 days ago",
    },
    {
      id: "2",
      name: "Frank Miller",
      subject: "Mathematics",
      avgScore: 52,
      trend: "stable",
      avatar: "FM",
      lastActive: "1 day ago",
    },
    {
      id: "3",
      name: "Grace Lee",
      subject: "Computer Science",
      avgScore: 48,
      trend: "improving",
      avatar: "GL",
      lastActive: "3 hours ago",
    },
  ])

  const [performanceData] = useState([
    { date: "Mon", "Class Average": 78, "Top Performers": 92, "Struggling Students": 45 },
    { date: "Tue", "Class Average": 82, "Top Performers": 94, "Struggling Students": 48 },
    { date: "Wed", "Class Average": 79, "Top Performers": 91, "Struggling Students": 52 },
    { date: "Thu", "Class Average": 85, "Top Performers": 96, "Struggling Students": 49 },
    { date: "Fri", "Class Average": 83, "Top Performers": 93, "Struggling Students": 55 },
    { date: "Sat", "Class Average": 87, "Top Performers": 97, "Struggling Students": 58 },
    { date: "Sun", "Class Average": 84, "Top Performers": 95, "Struggling Students": 54 },
  ])

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "declining":
        return "bg-red-100 text-red-700"
      case "improving":
        return "bg-green-100 text-green-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  const handleGoogleClassroomSync = async () => {
    addNotification("Syncing with Google Classroom...", "info")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    addNotification("Successfully synced classroom data!", "success")
  }

  const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0)
  const totalQuizzes = classes.reduce((sum, cls) => sum + cls.activeQuizzes, 0)
  const averagePerformance = Math.round(classes.reduce((sum, cls) => sum + cls.avgScore, 0) / classes.length)
  const needAttention = strugglingStudents.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 ring-2 ring-teal-200">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Educator Dashboard</h1>
                <p className="text-gray-600">Monitor student progress and insights</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigateTo("scheduler")}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>

              <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50 bg-transparent">
                Schedule Session
              </Button>

              <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Data
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
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Total Students</p>
                  <p className="text-3xl font-bold">{totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Active Quizzes</p>
                  <p className="text-3xl font-bold">{totalQuizzes}</p>
                </div>
                <BookOpen className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Avg Performance</p>
                  <p className="text-3xl font-bold">{averagePerformance}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Need Attention</p>
                  <p className="text-3xl font-bold">{needAttention}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              My Classes
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Students
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Class Performance Overview */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-800">
                      <BarChart3 className="w-5 h-5 mr-2 text-teal-600" />
                      Class Performance Overview
                    </CardTitle>
                    <CardDescription>Performance metrics across all your classes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {classes.map((classItem) => (
                      <div key={classItem.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-800">{classItem.name}</h4>
                            <p className="text-sm text-gray-600">
                              {classItem.students} students • {classItem.activeQuizzes} active quizzes
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">{classItem.avgScore}%</div>
                            <p className="text-xs text-gray-500">Average Score</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Progress value={classItem.avgScore} className="flex-1 mr-4" />
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{classItem.lastActivity}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-teal-600 border-teal-200 hover:bg-teal-50 bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                            <Plus className="w-4 h-4 mr-1" />
                            Create Quiz
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Students Needing Attention */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                    Students Needing Attention
                  </CardTitle>
                  <CardDescription>Students who may need additional support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {strugglingStudents.map((student) => (
                    <div key={student.id} className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-red-200 text-red-700 text-xs">
                              {student.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-800">{student.name}</h4>
                            <p className="text-xs text-gray-600">{student.subject}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className={`text-xs ${getTrendColor(student.trend)}`}>
                          {student.trend}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-red-600">{student.avgScore}% avg</span>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                  Recent Student Activity
                </CardTitle>
                <CardDescription>Real-time updates on student quiz activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm">
                            {activity.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">{activity.student}</p>
                          <p className="text-sm text-gray-600">
                            {activity.action} - {activity.subject}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.score && <div className="text-lg font-bold text-green-600">{activity.score}%</div>}
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-800">
                      <BookOpen className="w-5 h-5 mr-2 text-teal-600" />
                      My Classes
                    </CardTitle>
                    <CardDescription>Manage your classes and create new quizzes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classes.map((classItem) => (
                        <Card key={classItem.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <Badge variant="outline" className="text-xs">
                                {classItem.subject}
                              </Badge>
                              <div className="text-right">
                                <div className="text-lg font-bold text-teal-600">{classItem.avgScore}%</div>
                                <p className="text-xs text-gray-500">Class Average</p>
                              </div>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">{classItem.name}</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                              <div className="flex justify-between">
                                <span>Students:</span>
                                <span className="font-medium">{classItem.students}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Active Quizzes:</span>
                                <span className="font-medium">{classItem.activeQuizzes}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Last Activity:</span>
                                <span className="font-medium">{classItem.lastActivity}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                                <Plus className="w-4 h-4 mr-1" />
                                Create Quiz
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full border-teal-200 text-teal-600 bg-transparent"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Students
                              </Button>
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

          <TabsContent value="students" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Users className="w-5 h-5 mr-2 text-teal-600" />
                  All Students
                </CardTitle>
                <CardDescription>Complete overview of student performance and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock student data */}
                  {[
                    {
                      name: "Alice Johnson",
                      class: "Advanced Mathematics",
                      score: 95,
                      quizzes: 12,
                      trend: "improving",
                    },
                    { name: "Bob Smith", class: "Physics Fundamentals", score: 78, quizzes: 8, trend: "stable" },
                    { name: "Carol Davis", class: "Computer Science", score: 87, quizzes: 15, trend: "improving" },
                    { name: "David Wilson", class: "Advanced Mathematics", score: 72, quizzes: 10, trend: "declining" },
                    { name: "Emma Brown", class: "Physics Fundamentals", score: 45, quizzes: 6, trend: "declining" },
                    { name: "Frank Miller", class: "Computer Science", score: 91, quizzes: 14, trend: "stable" },
                  ].map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-800">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">{student.score}%</div>
                          <p className="text-xs text-gray-500">Average</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">{student.quizzes}</div>
                          <p className="text-xs text-gray-500">Quizzes</p>
                        </div>
                        <Badge variant="secondary" className={`text-xs ${getTrendColor(student.trend)}`}>
                          {student.trend}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-teal-200 text-teal-600 bg-transparent">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <PerformanceChart data={performanceData} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Mathematics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">82%</div>
                  <p className="text-sm text-gray-600 mb-4">Class Average</p>
                  <Progress value={82} className="h-2 mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Score:</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lowest Score:</span>
                      <span className="font-medium">45%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Physics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600 mb-2">75%</div>
                  <p className="text-sm text-gray-600 mb-4">Class Average</p>
                  <Progress value={75} className="h-2 mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Score:</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lowest Score:</span>
                      <span className="font-medium">38%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Computer Science</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">88%</div>
                  <p className="text-sm text-gray-600 mb-4">Class Average</p>
                  <Progress value={88} className="h-2 mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Score:</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lowest Score:</span>
                      <span className="font-medium">62%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                  AI-Powered Learning Insights
                </CardTitle>
                <CardDescription>Intelligent recommendations based on student performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 mb-2">Strong Performance Areas</h3>
                        <p className="text-sm text-green-700 mb-4">
                          Students are excelling in Computer Science algorithms and Mathematical calculus. Consider
                          introducing more advanced topics in these areas to maintain engagement.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-green-100 text-green-800">Data Structures: 94% avg</Badge>
                          <Badge className="bg-green-100 text-green-800">Calculus: 89% avg</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-800 mb-2">Areas for Improvement</h3>
                        <p className="text-sm text-yellow-700 mb-4">
                          Physics concepts show lower average scores, particularly in quantum mechanics. Recommend
                          additional practice sessions and simplified explanations for complex topics.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">Quantum Mechanics: 58% avg</Badge>
                          <Badge className="bg-yellow-100 text-yellow-800">Electromagnetic Theory: 62% avg</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-800 mb-2">Learning Patterns</h3>
                        <p className="text-sm text-blue-700 mb-4">
                          Students perform best during morning hours (9-11 AM) with 15% higher scores. Quiz completion
                          rates are highest on Tuesdays and Wednesdays.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-100 text-blue-800">Morning Performance: +15%</Badge>
                          <Badge className="bg-blue-100 text-blue-800">Mid-week Engagement: +22%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-800 mb-2">Personalization Recommendations</h3>
                        <p className="text-sm text-emerald-700 mb-4">
                          AI suggests creating differentiated learning paths: Advanced track for top 25% performers,
                          remedial support for students scoring below 60%, and peer tutoring programs.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-emerald-100 text-emerald-800">Advanced Track: 7 students</Badge>
                          <Badge className="bg-emerald-100 text-emerald-800">Remedial Support: 12 students</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Recommended Actions</CardTitle>
                <CardDescription>AI-generated suggestions to improve learning outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Create Advanced Mathematics Track</h4>
                      <p className="text-sm text-gray-600">For students scoring above 85% consistently</p>
                    </div>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      Implement
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Schedule Physics Review Session</h4>
                      <p className="text-sm text-gray-600">Focus on quantum mechanics and electromagnetic concepts</p>
                    </div>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      Schedule
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Generate Adaptive Quizzes</h4>
                      <p className="text-sm text-gray-600">Based on individual learning levels and weak areas</p>
                    </div>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      Generate
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Set Up Peer Tutoring Program</h4>
                      <p className="text-sm text-gray-600">Match high-performing students with those needing support</p>
                    </div>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      Set Up
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
