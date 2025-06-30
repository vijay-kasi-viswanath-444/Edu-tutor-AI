"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Calendar,
  BarChart3,
  Settings,
  Download,
  Eye,
  Clock,
  LogOut,
} from "lucide-react"

interface EducatorDashboardProps {
  onLogout: () => void
}

export function EducatorDashboard({ onLogout }: EducatorDashboardProps) {
  const classes = [
    { name: "Advanced Mathematics", students: 28, avgScore: 82, lastActivity: "2 hours ago" },
    { name: "Physics Fundamentals", students: 24, avgScore: 75, lastActivity: "4 hours ago" },
    { name: "Computer Science", students: 32, avgScore: 88, lastActivity: "1 hour ago" },
  ]

  const recentActivity = [
    { student: "Alice Johnson", action: "Completed Quiz", subject: "Mathematics", score: 95, time: "10 min ago" },
    { student: "Bob Smith", action: "Started Quiz", subject: "Physics", score: null, time: "15 min ago" },
    { student: "Carol Davis", action: "Completed Quiz", subject: "Computer Science", score: 87, time: "25 min ago" },
    { student: "David Wilson", action: "Requested Help", subject: "Mathematics", score: null, time: "30 min ago" },
  ]

  const strugglingStudents = [
    { name: "Emma Brown", subject: "Physics", avgScore: 45, trend: "declining" },
    { name: "Frank Miller", subject: "Mathematics", avgScore: 52, trend: "stable" },
    { name: "Grace Lee", subject: "Computer Science", avgScore: 48, trend: "improving" },
  ]

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Educator Dashboard</h1>
            <p className="text-gray-600">Monitor student progress and performance insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
              <Settings className="w-4 h-4 mr-2" />
              Settings
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

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Students</p>
                  <p className="text-3xl font-bold">84</p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Active Quizzes</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Avg Performance</p>
                  <p className="text-3xl font-bold">78%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Need Attention</p>
                  <p className="text-3xl font-bold">7</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Overview */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  Class Performance Overview
                </CardTitle>
                <CardDescription>Performance metrics across all your classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {classes.map((classItem, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{classItem.name}</h4>
                        <p className="text-sm text-gray-600">{classItem.students} students</p>
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
                        className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
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
              {strugglingStudents.map((student, index) => (
                <div key={index} className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{student.name}</h4>
                    <Badge variant="secondary" className={`text-xs ${getTrendColor(student.trend)}`}>
                      {student.trend}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{student.subject}</p>
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
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Recent Student Activity
            </CardTitle>
            <CardDescription>Real-time updates on student quiz activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-green-600 text-white text-sm">
                        {getInitials(activity.student)}
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
      </div>
    </div>
  )
}
