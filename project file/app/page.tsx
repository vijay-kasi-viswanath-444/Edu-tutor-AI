"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  BookOpen,
  Users,
  TrendingUp,
  Zap,
  Target,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  GraduationCap,
  ChevronRight,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
} from "lucide-react"
import { StudentDashboard } from "./components/student/student-dashboard"
import { EducatorDashboard } from "./components/educator/educator-dashboard"
import { QuizInterface } from "./components/quiz/quiz-interface"
import { DiagnosticTest } from "./components/student/diagnostic-test"
import { SessionScheduler } from "./components/educator/session-scheduler"
import { NotificationBar } from "./components/ui/notification-bar"

export type ViewType = "landing" | "login" | "register" | "student" | "educator" | "quiz" | "diagnostic" | "scheduler"

interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
}

export default function EduTutorAI() {
  const [currentView, setCurrentView] = useState<ViewType>("landing")
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
    role: "student" | "educator"
    diagnosticResults?: { overallScore: number; strengths: string[]; weaknesses: string[]; learningLevel: string }
  } | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem("edututor_user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setCurrentView(userData.role === "student" ? "student" : "educator")
    }
  }, [])

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notifications])

  const addNotification = (message: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
    }
    setNotifications((prev) => [...prev, notification])
  }

  const handleLogin = (email: string, password: string, role: "student" | "educator") => {
    // Demo authentication
    const demoUsers = {
      "student@demo.com": { name: "Alex Johnson", role: "student" as const },
      "educator@demo.com": { name: "Dr. Sarah Wilson", role: "educator" as const },
    }

    if (email in demoUsers && password === "password") {
      const userData: {
        id: string
        name: string
        email: string
        role: "student" | "educator"
        diagnosticResults?: { overallScore: number; strengths: string[]; weaknesses: string[]; learningLevel: string }
      } = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        ...demoUsers[email as keyof typeof demoUsers],
      }

      setUser(userData)
      localStorage.setItem("edututor_user", JSON.stringify(userData))
      setCurrentView(userData.role === "student" ? "student" : "educator")
      addNotification(`Welcome back, ${userData.name}!`, "success")
    } else {
      addNotification("Invalid credentials. Use demo@example.com / password", "error")
    }
  }

  const handleRegister = (name: string, email: string, password: string, role: "student" | "educator") => {
    const userData: {
      id: string
      name: string
      email: string
      role: "student" | "educator"
      diagnosticResults?: { overallScore: number; strengths: string[]; weaknesses: string[]; learningLevel: string }
    } = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    }

    setUser(userData)
    localStorage.setItem("edututor_user", JSON.stringify(userData))
    setCurrentView(role === "student" ? "diagnostic" : role)
    addNotification(`Account created successfully! Welcome, ${name}!`, "success")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("edututor_user")
    setCurrentView("landing")
    addNotification("Logged out successfully", "info")
  }

  const navigateTo = (view: ViewType) => {
    setCurrentView(view)
  }

  // Landing Page
  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <NotificationBar notifications={notifications} />

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">EduTutor AI</h1>
                  <p className="text-sm text-gray-600">Personalized Learning Platform</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigateTo("login")}
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => navigateTo("register")}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge className="bg-emerald-100 text-emerald-800 mb-6">
                <Zap className="w-4 h-4 mr-1" />
                AI-Powered Education
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Personalized Learning with{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Generative AI
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your educational experience with AI-powered personalized quizzes, real-time progress tracking,
                and intelligent learning recommendations tailored to your unique learning style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigateTo("register")}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigateTo("login")}
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Powerful Features for Modern Learning</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform adapts to your learning style and provides personalized educational experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">AI-Generated Quizzes</CardTitle>
                  <CardDescription>
                    Dynamic quiz generation tailored to your learning level and progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />
                      Adaptive difficulty levels
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />
                      Subject-specific questions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />
                      Instant feedback
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Progress Analytics</CardTitle>
                  <CardDescription>
                    Comprehensive tracking of your learning journey with detailed insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                      Performance metrics
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                      Learning patterns
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                      Goal tracking
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Dual Role Support</CardTitle>
                  <CardDescription>
                    Separate interfaces for students and educators with specialized tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Student dashboard
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Educator analytics
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Class management
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Google Classroom Sync</CardTitle>
                  <CardDescription>Seamless integration with Google Classroom for enhanced workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-cyan-600 mr-2" />
                      Auto-sync classes
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-cyan-600 mr-2" />
                      Grade passback
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-cyan-600 mr-2" />
                      Assignment import
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Adaptive Learning</CardTitle>
                  <CardDescription>
                    AI adjusts content difficulty based on your performance and learning pace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-indigo-600 mr-2" />
                      Personalized paths
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-indigo-600 mr-2" />
                      Smart recommendations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-indigo-600 mr-2" />
                      Learning optimization
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Real-time Feedback</CardTitle>
                  <CardDescription>
                    Instant explanations and guidance to accelerate your learning process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                      Immediate results
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                      Detailed explanations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                      Learning tips
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Learning Experience?</h2>
              <p className="text-xl text-emerald-100 mb-8">
                Join thousands of students and educators who are already using EduTutor AI to achieve better learning
                outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigateTo("register")}
                  className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-4 text-lg shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigateTo("login")}
                  className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
                >
                  Sign In
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EduTutor AI</span>
            </div>
            <div className="text-center text-gray-400">
              <p>&copy; 2024 EduTutor AI. All rights reserved.</p>
              <p className="mt-2">Empowering education through artificial intelligence.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Login Page
  if (currentView === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
        <NotificationBar notifications={notifications} />

        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Welcome Back</CardTitle>
            <CardDescription>Sign in to your EduTutor AI account</CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleLogin(
                  formData.get("email") as string,
                  formData.get("password") as string,
                  formData.get("role") as "student" | "educator",
                )
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 border-gray-200 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 border-gray-200 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700">
                  I am a...
                </Label>
                <Select name="role" defaultValue="student">
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>Student</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="educator">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-teal-600" />
                        <span>Educator</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 shadow-lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-medium text-emerald-800 mb-2">Demo Credentials</h4>
              <div className="text-sm text-emerald-700 space-y-1">
                <p>
                  <strong>Student:</strong> student@demo.com / password
                </p>
                <p>
                  <strong>Educator:</strong> educator@demo.com / password
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigateTo("register")}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign up here
                </button>
              </p>
              <button onClick={() => navigateTo("landing")} className="text-gray-500 hover:text-gray-700 text-sm mt-2">
                ← Back to home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Register Page
  if (currentView === "register") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
        <NotificationBar notifications={notifications} />

        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Create Account</CardTitle>
            <CardDescription>Join EduTutor AI and start your learning journey</CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleRegister(
                  formData.get("name") as string,
                  formData.get("email") as string,
                  formData.get("password") as string,
                  formData.get("role") as "student" | "educator",
                )
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 border-gray-200 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 border-gray-200 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10 border-gray-200 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700">
                  I am a...
                </Label>
                <Select name="role" defaultValue="student">
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>Student</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="educator">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-teal-600" />
                        <span>Educator</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 shadow-lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigateTo("login")}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign in here
                </button>
              </p>
              <button onClick={() => navigateTo("landing")} className="text-gray-500 hover:text-gray-700 text-sm mt-2">
                ← Back to home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render appropriate dashboard based on user role and current view
  if (user) {
    switch (currentView) {
      case "student":
        return (
          <StudentDashboard
            user={user}
            onLogout={handleLogout}
            navigateTo={navigateTo}
            addNotification={addNotification}
          />
        )
      case "educator":
        return (
          <EducatorDashboard
            user={user}
            onLogout={handleLogout}
            navigateTo={navigateTo}
            addNotification={addNotification}
          />
        )
      case "quiz":
        return <QuizInterface user={user} onBack={() => navigateTo("student")} addNotification={addNotification} />
      case "diagnostic":
        return (
          <DiagnosticTest
            user={user}
            onComplete={(results) => {
              const updatedUser = { ...user, diagnosticResults: results }
              setUser(updatedUser)
              localStorage.setItem("edututor_user", JSON.stringify(updatedUser))
              navigateTo("student")
            }}
            onBack={() => navigateTo("student")}
            addNotification={addNotification}
          />
        )
      case "scheduler":
        return <SessionScheduler user={user} onBack={() => navigateTo("educator")} addNotification={addNotification} />
      default:
        return null
    }
  }

  return null
}
