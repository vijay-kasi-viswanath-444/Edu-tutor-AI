"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Brain, Settings, Play, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function NewQuizPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizConfig, setQuizConfig] = useState({
    subject: "",
    topic: "",
    difficulty: "intermediate",
    questionCount: 5,
    questionType: "multiple-choice",
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Pre-fill from URL parameters
    const subject = searchParams.get("subject")
    const topic = searchParams.get("topic")
    const course = searchParams.get("course")

    if (subject) {
      setQuizConfig((prev) => ({ ...prev, subject }))
    }
    if (topic) {
      setQuizConfig((prev) => ({ ...prev, topic }))
    }
  }, [searchParams])

  const handleConfigChange = (field: string, value: string | number) => {
    setQuizConfig((prev) => ({ ...prev, [field]: value }))
  }

  const generateQuiz = async () => {
    if (!quizConfig.subject || !quizConfig.topic) {
      alert("Please fill in all required fields")
      return
    }

    setIsGenerating(true)

    try {
      // Simulate quiz generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create mock quiz data
      const mockQuestions = Array.from({ length: quizConfig.questionCount }, (_, index) => ({
        question: `Sample ${quizConfig.difficulty} question ${index + 1} about ${quizConfig.topic} in ${quizConfig.subject}`,
        options: [
          `Option A for question ${index + 1}`,
          `Option B for question ${index + 1}`,
          `Option C for question ${index + 1}`,
          `Option D for question ${index + 1}`,
        ],
        correct: Math.floor(Math.random() * 4),
        explanation: `This is the explanation for question ${index + 1} about ${quizConfig.topic}.`,
      }))

      // Store quiz data and redirect to quiz page
      const quizSession = {
        id: Math.random().toString(36).substr(2, 9),
        config: quizConfig,
        questions: mockQuestions,
        startTime: new Date().toISOString(),
        answers: [],
        currentQuestion: 0,
      }

      localStorage.setItem("current_quiz", JSON.stringify(quizSession))
      router.push("/student/quiz/take")
    } catch (error) {
      console.error("Error generating quiz:", error)
      alert("Failed to generate quiz. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EduTutor AI
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
            <p className="text-gray-600">Generate a personalized quiz based on your preferences</p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-emerald-600" />
                Quiz Configuration
              </CardTitle>
              <CardDescription>Customize your quiz settings for the best learning experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Selection */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select value={quizConfig.subject} onValueChange={(value) => handleConfigChange("subject", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Calculus derivatives, Photosynthesis, Shakespeare's sonnets"
                  value={quizConfig.topic}
                  onChange={(e) => handleConfigChange("topic", e.target.value)}
                />
                <p className="text-sm text-gray-500">Be specific about what you want to practice</p>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select
                  value={quizConfig.difficulty}
                  onValueChange={(value) => handleConfigChange("difficulty", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Beginner
                        </Badge>
                        <span className="text-sm text-gray-600">Basic concepts</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="intermediate">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Intermediate
                        </Badge>
                        <span className="text-sm text-gray-600">Moderate challenge</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="advanced">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Advanced
                        </Badge>
                        <span className="text-sm text-gray-600">Complex problems</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Questions */}
              <div className="space-y-4">
                <Label>Number of Questions: {quizConfig.questionCount}</Label>
                <Slider
                  value={[quizConfig.questionCount]}
                  onValueChange={(value) => handleConfigChange("questionCount", value[0])}
                  max={15}
                  min={3}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>3 questions</span>
                  <span>15 questions</span>
                </div>
              </div>

              {/* Question Type */}
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={quizConfig.questionType}
                  onValueChange={(value) => handleConfigChange("questionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="mixed">Mixed Types</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                <Button
                  onClick={generateQuiz}
                  disabled={isGenerating || !quizConfig.subject || !quizConfig.topic}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </div>

              {/* Info */}
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Brain className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800 mb-1">Smart Quiz Generation</p>
                    <p className="text-sm text-emerald-700">
                      Our system will create personalized questions based on your topic, difficulty level, and learning
                      profile. Each quiz is unique and tailored to help you learn effectively.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
