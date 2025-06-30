"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Mail, Lock, GraduationCap, Users, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState("student")
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "login"
  const tab = searchParams.get("tab") || "student"
  const [authMode, setAuthMode] = useState(mode)

  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  // Demo credentials for easy testing
  const demoCredentials = {
    student: { email: "student@demo.com", password: "student123" },
    educator: { email: "educator@demo.com", password: "educator123" },
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (userType: string) => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (authMode === "signup") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveStudentToEducatorPortal = (userData: any) => {
    if (userData.userType === "student") {
      // Get existing students from educator portal
      const existingStudents = JSON.parse(localStorage.getItem("educatorStudents") || "[]")

      // Check if student already exists
      const existingStudentIndex = existingStudents.findIndex((student: any) => student.email === userData.email)

      const studentData = {
        id: userData.id || Date.now(),
        name: userData.fullName,
        email: userData.email,
        class: "General Class", // Default class, can be updated later
        lastQuiz: "No quizzes taken yet",
        score: 0,
        progress: 0,
        status: "new-student",
        lastActive: new Date().toLocaleString(),
        joinedDate: userData.createdAt || new Date().toISOString(),
        totalQuizzes: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        strongTopics: [],
        weakTopics: [],
        detailedResults: [],
        loginHistory: [
          {
            timestamp: new Date().toISOString(),
            action: authMode === "signup" ? "signup" : "login",
          },
        ],
      }

      if (existingStudentIndex >= 0) {
        // Update existing student with new login
        existingStudents[existingStudentIndex] = {
          ...existingStudents[existingStudentIndex],
          lastActive: new Date().toLocaleString(),
          loginHistory: [
            ...(existingStudents[existingStudentIndex].loginHistory || []),
            {
              timestamp: new Date().toISOString(),
              action: "login",
            },
          ],
        }
      } else {
        // Add new student
        existingStudents.push(studentData)
      }

      // Save updated students list
      localStorage.setItem("educatorStudents", JSON.stringify(existingStudents))

      // Also save to a general student registry
      const studentRegistry = JSON.parse(localStorage.getItem("studentRegistry") || "[]")
      const registryIndex = studentRegistry.findIndex((student: any) => student.email === userData.email)

      if (registryIndex >= 0) {
        studentRegistry[registryIndex] = {
          ...studentRegistry[registryIndex],
          lastLogin: new Date().toISOString(),
          loginCount: (studentRegistry[registryIndex].loginCount || 0) + 1,
        }
      } else {
        studentRegistry.push({
          ...studentData,
          loginCount: 1,
          firstLogin: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        })
      }

      localStorage.setItem("studentRegistry", JSON.stringify(studentRegistry))
    }
  }

  const handleSubmit = async (e: React.FormEvent, userType: string) => {
    e.preventDefault()

    if (!validateForm(userType)) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (authMode === "signup") {
        // Check if user already exists
        const existingUser = localStorage.getItem(`user_${userType}_${formData.email}`)
        if (existingUser) {
          setErrors({ general: "An account with this email already exists" })
          setIsLoading(false)
          return
        }

        // Store user credentials in localStorage with proper structure
        const userData = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          userType: userType,
          createdAt: new Date().toISOString(),
        }

        // Store user data
        localStorage.setItem(`user_${userType}_${formData.email}`, JSON.stringify(userData))
        localStorage.setItem("currentUser", JSON.stringify(userData))

        // Also store in a general users list for easier lookup
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
        allUsers.push(userData)
        localStorage.setItem("allUsers", JSON.stringify(allUsers))

        // Save student details to educator portal
        saveStudentToEducatorPortal(userData)

        // Redirect to appropriate dashboard after signup
        if (userType === "student") {
          router.push("/student")
        } else {
          router.push("/educator")
        }
      } else {
        // Login logic - Enhanced credential checking
        let loginSuccessful = false
        let userData = null

        // Check demo credentials first
        const isDemoLogin =
          (userType === "student" &&
            formData.email === demoCredentials.student.email &&
            formData.password === demoCredentials.student.password) ||
          (userType === "educator" &&
            formData.email === demoCredentials.educator.email &&
            formData.password === demoCredentials.educator.password)

        if (isDemoLogin) {
          userData = {
            email: formData.email,
            userType: userType,
            fullName: userType === "student" ? "Demo Student" : "Demo Educator",
            id: "demo_" + userType,
          }
          loginSuccessful = true
        } else {
          // Check stored user credentials
          const storedUser = localStorage.getItem(`user_${userType}_${formData.email}`)

          if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            // Verify password and userType match
            if (parsedUser.password === formData.password && parsedUser.userType === userType) {
              userData = parsedUser
              loginSuccessful = true
            }
          }

          // Also check in general users list as fallback
          if (!loginSuccessful) {
            const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
            const foundUser = allUsers.find(
              (user: any) =>
                user.email === formData.email && user.password === formData.password && user.userType === userType,
            )

            if (foundUser) {
              userData = foundUser
              loginSuccessful = true
            }
          }
        }

        if (loginSuccessful && userData) {
          localStorage.setItem("currentUser", JSON.stringify(userData))

          // Save student details to educator portal on login
          saveStudentToEducatorPortal(userData)

          // Redirect to appropriate dashboard after login
          if (userType === "student") {
            router.push("/student")
          } else {
            router.push("/educator")
          }
        } else {
          setErrors({
            general: `Invalid ${userType} credentials. Please check your email and password.`,
          })
        }
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (userType: "student" | "educator") => {
    setFormData({
      ...formData,
      email: demoCredentials[userType].email,
      password: demoCredentials[userType].password,
    })
    // Clear any existing errors
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EduTutor AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {authMode === "signup" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {authMode === "signup"
              ? "Join our personalized learning platform"
              : "Sign in to your personalized learning platform"}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Student
            </TabsTrigger>
            <TabsTrigger value="educator" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Educator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Student Portal</CardTitle>
                <CardDescription>
                  {authMode === "signup"
                    ? "Create your student account to access personalized quizzes"
                    : "Access your personalized quizzes and learning materials"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errors.general && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{errors.general}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={(e) => handleSubmit(e, "student")} className="space-y-4">
                  {authMode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="student-name">Full Name</Label>
                      <Input
                        id="student-name"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="student-email"
                        name="email"
                        type="email"
                        placeholder="student@school.edu"
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="student-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  {authMode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="student-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="student-confirm-password"
                          name="confirmPassword"
                          type="password"
                          className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-blue-600 text-white" disabled={isLoading}>
                    {isLoading
                      ? "Processing..."
                      : authMode === "signup"
                        ? "Create Student Account"
                        : "Sign In as Student"}
                  </Button>
                </form>

                {authMode === "login" && (
                  <div className="mt-4 space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-blue-50 text-blue-700 border-blue-200"
                      onClick={() => fillDemoCredentials("student")}
                    >
                      Use Demo Student Account
                    </Button>
                    <p className="text-xs text-gray-500 text-center">Demo: student@demo.com / student123</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="educator">
            <Card>
              <CardHeader>
                <CardTitle>Educator Dashboard</CardTitle>
                <CardDescription>
                  {authMode === "signup"
                    ? "Create your educator account to monitor student progress"
                    : "Monitor student progress and manage your classes"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errors.general && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{errors.general}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={(e) => handleSubmit(e, "educator")} className="space-y-4">
                  {authMode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="educator-name">Full Name</Label>
                      <Input
                        id="educator-name"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="educator-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="educator-email"
                        name="email"
                        type="email"
                        placeholder="teacher@school.edu"
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educator-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="educator-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  {authMode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="educator-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="educator-confirm-password"
                          name="confirmPassword"
                          type="password"
                          className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-purple-600 text-white" disabled={isLoading}>
                    {isLoading
                      ? "Processing..."
                      : authMode === "signup"
                        ? "Create Educator Account"
                        : "Sign In as Educator"}
                  </Button>
                </form>

                {authMode === "login" && (
                  <div className="mt-4 space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-purple-50 text-purple-700 border-purple-200"
                      onClick={() => fillDemoCredentials("educator")}
                    >
                      Use Demo Educator Account
                    </Button>
                    <p className="text-xs text-gray-500 text-center">Demo: educator@demo.com / educator123</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {authMode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setAuthMode(authMode === "signup" ? "login" : "signup")
                setErrors({}) // Clear errors when switching modes
                setFormData({ email: "", password: "", confirmPassword: "", fullName: "" }) // Reset form
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              {authMode === "signup" ? "Sign in here" : "Sign up here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
