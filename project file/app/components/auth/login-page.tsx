"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, Mail, Lock, Users, BookOpen, Zap, Globe, GraduationCap } from "lucide-react"
import type { User, UserRole } from "../../page"

interface LoginPageProps {
  onLogin: (user: User) => void
  addNotification: (message: string, type?: "info" | "success" | "warning" | "error") => void
}

const LoginPage = ({ onLogin, addNotification }: LoginPageProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateDemoEmail = () => {
    const timestamp = Date.now()
    return `demo_user_${timestamp}@edututor.ai`
  }

  const handleLogin = async (role: UserRole, isDemo = false) => {
    setIsLoading(true)

    try {
      const userEmail = isDemo ? generateDemoEmail() : email
      const userName = isDemo ? `Demo ${role === "student" ? "Student" : "Educator"}` : userEmail.split("@")[0]

      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userEmail,
        name: userName,
        role,
        isDemo,
        hasCompletedDiagnostic: isDemo ? false : Math.random() > 0.5,
        googleClassroomSynced: false,
      }

      onLogin(user)
    } catch (error) {
      addNotification("Login failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async (role: UserRole) => {
    addNotification("Google authentication would be implemented here with OAuth 2.0", "info")
    // Simulate Google login
    await handleLogin(role, false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  EduTutor AI
                </h1>
                <p className="text-gray-600">Personalized Learning Platform</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Transform Education with AI-Powered Learning</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Experience personalized education with adaptive AI quizzes, real-time insights, and seamless Google
                Classroom integration.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-purple-50 border border-purple-100 shadow-sm">
              <BookOpen className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-purple-800 mb-2">Adaptive Quizzes</h3>
              <p className="text-sm text-purple-600">
                AI-generated questions that adapt to your learning pace and style
              </p>
            </div>

            <div className="p-6 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm">
              <Zap className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-indigo-800 mb-2">Real-time Feedback</h3>
              <p className="text-sm text-indigo-600">Instant assessment with detailed explanations and insights</p>
            </div>

            <div className="p-6 rounded-xl bg-green-50 border border-green-100 shadow-sm">
              <Globe className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">Google Classroom</h3>
              <p className="text-sm text-green-600">Seamless integration with your existing classroom workflow</p>
            </div>

            <div className="p-6 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
              <Users className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-orange-800 mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-orange-600">Comprehensive insights for educators and students</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              Adaptive Learning
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Real-time Sync
            </Badge>
          </div>
        </div>

        {/* Login Section */}
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-800">Welcome to EduTutor AI</CardTitle>
            <CardDescription className="text-gray-600">Choose your role and sign in to get started</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="student"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger
                  value="educator"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Educator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email" className="text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="student-email"
                        type="email"
                        placeholder="student@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-password" className="text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleLogin("student")}
                    disabled={isLoading || !email || !password}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                  >
                    {isLoading ? "Signing in..." : "Sign In as Student"}
                  </Button>

                  <Button
                    onClick={() => handleGoogleLogin("student")}
                    variant="outline"
                    disabled={isLoading}
                    className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Continue with Google
                  </Button>

                  <Button
                    onClick={() => handleLogin("student", true)}
                    variant="outline"
                    disabled={isLoading}
                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Try Demo Account
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="educator" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="educator-email" className="text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="educator-email"
                        type="email"
                        placeholder="teacher@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educator-password" className="text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="educator-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleLogin("educator")}
                    disabled={isLoading || !email || !password}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg"
                  >
                    {isLoading ? "Signing in..." : "Sign In as Educator"}
                  </Button>

                  <Button
                    onClick={() => handleGoogleLogin("educator")}
                    variant="outline"
                    disabled={isLoading}
                    className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Continue with Google
                  </Button>

                  <Button
                    onClick={() => handleLogin("educator", true)}
                    variant="outline"
                    disabled={isLoading}
                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Try Demo Account
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
