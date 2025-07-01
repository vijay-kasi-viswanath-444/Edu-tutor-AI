"use client"

import { Brain } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            EduTutor AI
          </h2>
          <p className="text-gray-600">Loading your personalized learning experience...</p>
        </div>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
