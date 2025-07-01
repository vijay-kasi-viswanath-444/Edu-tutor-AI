"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, CheckCircle, Target, Zap } from "lucide-react"
import type { User } from "../../page"

interface DiagnosticTestProps {
  user: User
  onComplete: (results: any) => void
  addNotification: (message: string, type?: "info" | "success" | "warning" | "error") => void
}

interface Question {
  id: number
  subject: string
  question: string
  options: string[]
  correct: number
  difficulty: "basic" | "intermediate" | "advanced"
}

const diagnosticQuestions: Question[] = [
  {
    id: 1,
    subject: "Mathematics",
    question: "What is the derivative of f(x) = 3x² + 2x - 1?",
    options: ["6x + 2", "3x² + 2", "6x - 1", "3x + 2"],
    correct: 0,
    difficulty: "intermediate",
  },
  {
    id: 2,
    subject: "Physics",
    question: "Which of the following is NOT a fundamental force in physics?",
    options: ["Gravitational force", "Electromagnetic force", "Centrifugal force", "Strong nuclear force"],
    correct: 2,
    difficulty: "intermediate",
  },
  {
    id: 3,
    subject: "Computer Science",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
    difficulty: "intermediate",
  },
  {
    id: 4,
    subject: "Mathematics",
    question: "What is the integral of 2x dx?",
    options: ["x² + C", "2x² + C", "x²/2 + C", "2x + C"],
    correct: 0,
    difficulty: "basic",
  },
  {
    id: 5,
    subject: "Physics",
    question: "What is the unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correct: 1,
    difficulty: "basic",
  },
  {
    id: 6,
    subject: "Computer Science",
    question: "Which data structure uses LIFO (Last In, First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correct: 1,
    difficulty: "basic",
  },
  {
    id: 7,
    subject: "Mathematics",
    question: "If log₂(x) = 3, what is the value of x?",
    options: ["6", "8", "9", "12"],
    correct: 1,
    difficulty: "advanced",
  },
  {
    id: 8,
    subject: "Physics",
    question: "What is the Heisenberg Uncertainty Principle?",
    options: [
      "Energy cannot be created or destroyed",
      "Position and momentum cannot be precisely determined simultaneously",
      "Every action has an equal and opposite reaction",
      "Objects at rest stay at rest",
    ],
    correct: 1,
    difficulty: "advanced",
  },
]

export function DiagnosticTest({ user, onComplete, addNotification }: DiagnosticTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = selectedAnswer
      setAnswers(newAnswers)
      setSelectedAnswer(null)

      if (currentQuestion < diagnosticQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        handleComplete()
      }
    }
  }

  const handleComplete = () => {
    // Calculate results
    let correct = 0
    const subjectScores: { [key: string]: { correct: number; total: number } } = {}

    diagnosticQuestions.forEach((question, index) => {
      if (!subjectScores[question.subject]) {
        subjectScores[question.subject] = { correct: 0, total: 0 }
      }
      subjectScores[question.subject].total++

      if (answers[index] === question.correct) {
        correct++
        subjectScores[question.subject].correct++
      }
    })

    const overallScore = Math.round((correct / diagnosticQuestions.length) * 100)

    // Determine learning level
    let learningLevel = "beginner"
    if (overallScore >= 80) learningLevel = "advanced"
    else if (overallScore >= 60) learningLevel = "intermediate"

    const results = {
      overallScore,
      learningLevel,
      subjectScores,
      completedAt: new Date().toISOString(),
      timeSpent: 1800 - timeLeft,
      strengths: Object.entries(subjectScores)
        .filter(([_, scores]) => scores.correct / scores.total >= 0.7)
        .map(([subject]) => subject),
      weaknesses: Object.entries(subjectScores)
        .filter(([_, scores]) => scores.correct / scores.total < 0.5)
        .map(([subject]) => subject),
    }

    setIsCompleted(true)
    onComplete(results)
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white">
          <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Diagnostic Test Complete!</CardTitle>
            <CardDescription>Your personalized learning profile has been created</CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Processing...
            </div>
            <p className="text-gray-600 mb-8">Analyzing your responses to create your personalized learning path</p>
            <div className="animate-pulse">
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = diagnosticQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / diagnosticQuestions.length) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "advanced":
        return "bg-red-100 text-red-700"
      case "intermediate":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-green-100 text-green-700"
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Diagnostic Assessment</h1>
              <p className="text-gray-600">Personalizing your learning experience</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-800">{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="outline" className="border-purple-200 text-purple-600">
              Question {currentQuestion + 1} of {diagnosticQuestions.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Assessment Progress</span>
              <span className="text-sm font-semibold text-gray-800">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-purple-600" />
                <div>
                  <CardTitle className="text-xl text-gray-800">{question.subject}</CardTitle>
                  <CardDescription>AI-Generated Assessment Question</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className={getDifficultyColor(question.difficulty)}>
                {question.difficulty}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 leading-relaxed">{question.question}</h3>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="text-purple-600" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700 font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="border-gray-300 text-gray-600"
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8"
              >
                {currentQuestion === diagnosticQuestions.length - 1 ? (
                  <>
                    Complete Assessment
                    <Zap className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Next Question"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 border-0 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Assessment Instructions</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  This diagnostic assessment helps us understand your current knowledge level across Mathematics,
                  Physics, and Computer Science. Answer each question to the best of your ability. The results will be
                  used to personalize your learning experience and adapt future quiz difficulty.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
