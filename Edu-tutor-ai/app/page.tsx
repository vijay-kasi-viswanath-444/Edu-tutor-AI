"use client"

import { useState } from "react"
import { StudentDashboard } from "./components/student-dashboard"
import { EducatorDashboard } from "./components/educator-dashboard"
import { QuizInterface } from "./components/quiz-interface"
import { LoginForm } from "./components/login-form"

type ViewType = "login" | "student" | "educator" | "quiz"
type UserType = "student" | "educator"

export default function EduTutorAI() {
  const [currentView, setCurrentView] = useState<ViewType>("login")
  const [userType, setUserType] = useState<UserType>("student")

  const handleLogin = (type: UserType) => {
    setUserType(type)
    setCurrentView(type)
  }

  const startQuiz = () => {
    setCurrentView("quiz")
  }

  const backToDashboard = () => {
    setCurrentView(userType)
  }

  const logout = () => {
    setCurrentView("login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-green-50 to-orange-50">
      {currentView === "login" && <LoginForm onLogin={handleLogin} />}
      {currentView === "student" && <StudentDashboard onStartQuiz={startQuiz} onLogout={logout} />}
      {currentView === "educator" && <EducatorDashboard onLogout={logout} />}
      {currentView === "quiz" && <QuizInterface onBack={backToDashboard} />}
    </div>
  )
}
