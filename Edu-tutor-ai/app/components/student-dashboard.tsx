"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Brain, Trophy, Clock, Target, TrendingUp, Play, Star, Zap, LogOut } from "lucide-react"

interface StudentDashboardProps {
  onStartQuiz: () => void
  onLogout: () => void
}

export function StudentDashboard({ onStartQuiz, onLogout }: StudentDashboardProps) {
  const courses = [
    { name: "Advanced Mathematics", progress: 78, color: "bg-purple-500", nextTopic: "Calculus Integration" },
    { name: "Physics Fundamentals", progress: 65, color: "bg-green-500", nextTopic: "Quantum Mechanics" },
    { name: "Computer Science", progress: 92, color: "bg-orange-500", nextTopic: "Data Structures" },
    { name: "Chemistry Lab", progress: 45, color: "bg-pink-500", nextTopic: "Organic Compounds" },
  ]

  const recentQuizzes = [
    { subject: "Mathematics", score: 85, date: "2 hours ago", difficulty: "Advanced" },
    { subject: "Physics", score: 92, date: "1 day ago", difficulty: "Intermediate" },
    { subject: "Chemistry", score: 78, date: "2 days ago", difficulty: "Beginner" },
  ]

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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-green-600 text-white">JS</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, John!</h1>
              <p className="text-gray-600">Ready to continue your learning journey?</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={onStartQuiz}
              className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start New Quiz
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Quizzes</p>
                  <p className="text-3xl font-bold">127</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Average Score</p>
                  <p className="text-3xl font-bold">85%</p>
                </div>
                <Trophy className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Study Streak</p>
                  <p className="text-3xl font-bold">12 days</p>
                </div>
                <Zap className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100">Time Studied</p>
                  <p className="text-3xl font-bold">24h</p>
                </div>
                <Clock className="w-8 h-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Progress */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Course Progress
                </CardTitle>
                <CardDescription>Your learning progress across all courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {courses.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${course.color}`} />
                        <span className="font-medium text-gray-800">{course.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-sm text-gray-500">Next: {course.nextTopic}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Quizzes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Recent Quizzes
              </CardTitle>
              <CardDescription>Your latest quiz performances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentQuizzes.map((quiz, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800">{quiz.subject}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-500">{quiz.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-gray-800">{quiz.score}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Personalized suggestions based on your learning patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Focus Area</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your Physics scores suggest reviewing Quantum Mechanics fundamentals
                </p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Start Practice
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-white border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Strength Building</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Excellent progress in Computer Science! Try advanced algorithms
                </p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Challenge Yourself
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
