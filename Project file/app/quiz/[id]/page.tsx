"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, Lightbulb, Target } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Mock quiz data - in real app, this would be fetched based on course ID
  const [quiz] = useState({
    id: params.id,
    title: "Calculus Integration - Adaptive Quiz",
    subject: "Advanced Mathematics",
    totalQuestions: 10,
    timeLimit: 30,
    difficulty: "Intermediate",
    questions: [
      {
        id: 1,
        question: "What is the integral of 2x with respect to x?",
        options: ["x² + C", "2x² + C", "x²/2 + C", "2x + C"],
        correct: 0,
        explanation: "The integral of 2x is x² + C, where C is the constant of integration.",
        difficulty: "Easy",
      },
      {
        id: 2,
        question: "Evaluate ∫(3x² + 2x - 1)dx",
        options: ["x³ + x² - x + C", "3x³ + 2x² - x + C", "x³ + x² + x + C", "3x³ + x² - x + C"],
        correct: 0,
        explanation: "Using the power rule: ∫3x²dx = x³, ∫2xdx = x², ∫(-1)dx = -x",
        difficulty: "Medium",
      },
      {
        id: 3,
        question: "What is ∫e^x dx?",
        options: ["e^x + C", "xe^x + C", "e^(x+1) + C", "ln(e^x) + C"],
        correct: 0,
        explanation: "The integral of e^x is e^x + C, as the derivative of e^x is e^x.",
        difficulty: "Easy",
      },
    ],
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit()
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

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const handleSubmit = () => {
    // Calculate score
    let correctAnswers = 0
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.options[question.correct]) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100)
    setScore(finalScore)
    setIsSubmitted(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {score >= 80 ? (
                <CheckCircle className="h-16 w-16 text-green-600" />
              ) : score >= 60 ? (
                <Target className="h-16 w-16 text-yellow-600" />
              ) : (
                <XCircle className="h-16 w-16 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <span className={score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"}>
                  {score}%
                </span>
              </div>
              <p className="text-gray-600">
                You got {quiz.questions.filter((_, index) => selectedAnswers[index] === _.options[_.correct]).length}{" "}
                out of {quiz.questions.length} questions correct
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Feedback
              </h3>
              <p className="text-blue-700 text-sm">
                {score >= 80
                  ? "Excellent work! You have a strong understanding of integration concepts. Ready for more advanced topics."
                  : score >= 60
                    ? "Good progress! Focus on practicing more complex integration problems to improve your skills."
                    : "Keep practicing! Review the fundamental rules of integration and try some basic problems first."}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Question Review:</h3>
              {quiz.questions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.options[question.correct]
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">Question {index + 1}</p>
                      <p className="text-sm text-gray-600">{question.question}</p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {question.options[question.correct]}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push("/student")} className="flex-1 bg-blue-600 text-white">
                Back to Dashboard
              </Button>
              <Button variant="outline" className="flex-1 bg-white text-gray-700">
                Review Explanations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Brain className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">{quiz.title}</h1>
              <p className="text-sm text-gray-600">{quiz.subject}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800">{quiz.difficulty}</Badge>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className={timeRemaining < 300 ? "text-red-600 font-semibold" : "text-gray-600"}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quiz.totalQuestions}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentQuestionIndex + 1) / quiz.totalQuestions) * 100)}% Complete
              </span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / quiz.totalQuestions) * 100} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
                <Badge variant="outline" className="bg-white text-gray-700">
                  {currentQuestion.difficulty}
                </Badge>
              </div>
              <CardDescription className="text-base text-gray-900 mt-4">{currentQuestion.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswers[currentQuestionIndex] || ""}
                onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* AI Hint */}
          {selectedAnswers[currentQuestionIndex] && (
            <Card className="mb-8 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">AI Hint</h3>
                    <p className="text-sm text-yellow-700">
                      Remember to apply the power rule: ∫x^n dx = x^(n+1)/(n+1) + C
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-white text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${
                    index === currentQuestionIndex
                      ? "bg-blue-600 text-white"
                      : selectedAnswers[index]
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                className="bg-green-600 text-white"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={!selectedAnswers[currentQuestionIndex]}
                className="bg-blue-600 text-white"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
