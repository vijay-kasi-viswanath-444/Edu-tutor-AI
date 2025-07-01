"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const diagnosticQuestions = [
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
    subject: "Science",
    question: "Which of the following is NOT a fundamental force in physics?",
    options: ["Gravitational force", "Electromagnetic force", "Centrifugal force", "Strong nuclear force"],
    correct: 2,
    difficulty: "intermediate",
  },
  {
    id: 3,
    subject: "English",
    question: "Identify the literary device used in: 'The wind whispered through the trees'",
    options: ["Metaphor", "Personification", "Simile", "Alliteration"],
    correct: 1,
    difficulty: "basic",
  },
  {
    id: 4,
    subject: "History",
    question: "The Renaissance period primarily began in which country?",
    options: ["France", "England", "Italy", "Germany"],
    correct: 2,
    difficulty: "basic",
  },
  {
    id: 5,
    subject: "Mathematics",
    question: "If log₂(x) = 3, what is the value of x?",
    options: ["6", "8", "9", "12"],
    correct: 1,
    difficulty: "advanced",
  },
]

export default function DiagnosticTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

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

    // Store diagnostic results
    const diagnosticResults = {
      overallScore,
      learningLevel,
      subjectScores,
      completedAt: new Date().toISOString(),
      timeSpent: 1800 - timeLeft,
    }

    const userData = JSON.parse(localStorage.getItem("edututor_user") || "{}")
    userData.diagnosticResults = diagnosticResults
    userData.isNewUser = false
    localStorage.setItem("edututor_user", JSON.stringify(userData))

    setIsCompleted(true)
  }

  const handleGoToDashboard = () => {
    router.push("/student/dashboard")
  }

  if (isCompleted) {
    const userData = JSON.parse(localStorage.getItem("edututor_user") || "{}")
    const results = userData.diagnosticResults

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Diagnostic Test Complete!</CardTitle>
              <CardDescription>Your personalized learning profile has been created</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{results.overallScore}%</div>
                <p className="text-gray-600">Overall Score</p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">
                    Learning Level: <span className="capitalize">{results.learningLevel}</span>
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(results.subjectScores).map(([subject, scores]: [string, any]) => (
                  <div key={subject} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">{subject}</h3>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        {scores.correct}/{scores.total} correct
                      </span>
                      <span>{Math.round((scores.correct / scores.total) * 100)}%</span>
                    </div>
                    <Progress value={(scores.correct / scores.total) * 100} className="mt-2" />
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Continue to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const question = diagnosticQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / diagnosticQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Diagnostic Test</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <span>
              Question {currentQuestion + 1} of {diagnosticQuestions.length}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% Complete</p>
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {question.subject} - {question.difficulty}
              </CardTitle>
            </div>
            <CardDescription className="text-base font-medium text-gray-900 mt-4">{question.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentQuestion === diagnosticQuestions.length - 1 ? "Complete Test" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 border-0 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> This diagnostic test helps us understand your current knowledge level
              across different subjects. Answer each question to the best of your ability. The results will be used to
              personalize your learning experience.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
