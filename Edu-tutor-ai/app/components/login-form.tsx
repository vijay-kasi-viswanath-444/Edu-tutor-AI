"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Brain, Users, Zap } from "lucide-react"

interface LoginFormProps {
  onLogin: (type: "student" | "educator") => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (type: "student" | "educator") => {
    setIsLoading(true)
    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    onLogin(type)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                EduTutor AI
              </h1>
            </div>
            <p className="text-xl text-gray-600">Personalized Learning with Generative AI and LMS Integration</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-purple-100 border border-purple-200">
              <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">Dynamic Quizzes</h3>
              <p className="text-sm text-purple-600">AI-generated quizzes tailored to your learning pace</p>
            </div>
            <div className="p-4 rounded-lg bg-green-100 border border-green-200">
              <Zap className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">Real-time Feedback</h3>
              <p className="text-sm text-green-600">Instant assessment and personalized insights</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-100 border border-orange-200">
              <Users className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-orange-800">Google Classroom</h3>
              <p className="text-sm text-orange-600">Seamless integration with your existing courses</p>
            </div>
            <div className="p-4 rounded-lg bg-pink-100 border border-pink-200">
              <Brain className="w-8 h-8 text-pink-600 mb-2" />
              <h3 className="font-semibold text-pink-800">IBM Watsonx</h3>
              <p className="text-sm text-pink-600">Powered by advanced AI models</p>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back</CardTitle>
            <CardDescription>Choose your role to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger
                  value="student"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Student
                </TabsTrigger>
                <TabsTrigger
                  value="educator"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Educator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input id="student-email" type="email" placeholder="student@school.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input id="student-password" type="password" />
                </div>
                <Button
                  onClick={() => handleLogin("student")}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  {isLoading ? "Signing in..." : "Sign In as Student"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                  disabled={isLoading}
                >
                  Sign in with Google Classroom
                </Button>
              </TabsContent>

              <TabsContent value="educator" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="educator-email">Email</Label>
                  <Input id="educator-email" type="email" placeholder="teacher@school.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educator-password">Password</Label>
                  <Input id="educator-password" type="password" />
                </div>
                <Button
                  onClick={() => handleLogin("educator")}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isLoading ? "Signing in..." : "Sign In as Educator"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                  disabled={isLoading}
                >
                  Sign in with Google Classroom
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
