"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface QuizResult {
  score: number
  totalQuestions: number
  timeSpent: number
  correctAnswers: number[]
  userAnswers: (number | null)[]
}

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const subject = params.subject as string

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [startTime, setStartTime] = useState<number>(0)

  const subjectNames: { [key: string]: string } = {
    mathematics: "Mathematics",
    physics: "Physics",
    "computer-science": "Computer Science",
  }

  const subjectColors: { [key: string]: string } = {
    mathematics: "from-blue-500 to-blue-600",
    physics: "from-green-500 to-green-600",
    "computer-science": "from-purple-500 to-purple-600",
  }

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("edututor_user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userData)
    if (user.userType !== "student") {
      router.push("/auth/login")
      return
    }

    generateQuiz()
  }, [subject, router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleQuizComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [quizStarted, quizCompleted, timeRemaining])

  const generateQuiz = async () => {
    setIsLoading(true)

    // Simulate AI quiz generation with mock data
    const mockQuestions: Question[] = [
      {
        id: "1",
        question:
          subject === "mathematics"
            ? "What is the derivative of x² + 3x + 2?"
            : subject === "physics"
              ? "What is Newton's second law of motion?"
              : "What is the time complexity of binary search?",
        options:
          subject === "mathematics"
            ? ["2x + 3", "x² + 3", "2x + 2", "x + 3"]
            : subject === "physics"
              ? ["F = ma", "E = mc²", "v = u + at", "P = mv"]
              : ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: subject === "mathematics" ? 0 : subject === "physics" ? 0 : 1,
        explanation:
          subject === "mathematics"
            ? "The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant is 0."
            : subject === "physics"
              ? "Newton's second law states that Force equals mass times acceleration (F = ma)."
              : "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
        difficulty: "intermediate",
      },
      {
        id: "2",
        question:
          subject === "mathematics"
            ? "What is the integral of 2x?"
            : subject === "physics"
              ? "What is the unit of force in the SI system?"
              : "Which data structure uses LIFO principle?",
        options:
          subject === "mathematics"
            ? ["x² + C", "2x² + C", "x²/2 + C", "2x + C"]
            : subject === "physics"
              ? ["Newton", "Joule", "Watt", "Pascal"]
              : ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: subject === "mathematics" ? 0 : subject === "physics" ? 0 : 1,
        explanation:
          subject === "mathematics"
            ? "The integral of 2x is x² + C, where C is the constant of integration."
            : subject === "physics"
              ? "The Newton (N) is the SI unit of force, defined as kg⋅m/s²."
              : "A stack follows the Last In, First Out (LIFO) principle.",
        difficulty: "beginner",
      },
      {
        id: "3",
        question:
          subject === "mathematics"
            ? "What is the solution to the equation 2x + 5 = 13?"
            : subject === "physics"
              ? "What is the acceleration due to gravity on Earth?"
              : "What is recursion in programming?",
        options:
          subject === "mathematics"
            ? ["x = 4", "x = 6", "x = 8", "x = 9"]
            : subject === "physics"
              ? ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11.2 m/s²"]
              : ["A loop structure", "A function calling itself", "A data type", "A sorting algorithm"],
        correctAnswer: subject === "mathematics" ? 0 : subject === "physics" ? 0 : 1,
        explanation:
          subject === "mathematics"
            ? "Solving 2x + 5 = 13: 2x = 13 - 5 = 8, so x = 4."
            : subject === "physics"
              ? "The standard acceleration due to gravity on Earth is approximately 9.8 m/s²."
              : "Recursion is a programming technique where a function calls itself to solve a problem.",
        difficulty: "beginner",
      },
    ]

    setQuestions(mockQuestions)
    setUserAnswers(new Array(mockQuestions.length).fill(null))
    setIsLoading(false)
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(Date.now())
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers]
      newAnswers[currentQuestionIndex] = selectedAnswer
      setUserAnswers(newAnswers)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1])
    } else {
      handleQuizComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1])
    }
  }

  const handleQuizComplete = () => {
    const endTime = Date.now()
    const timeSpent = Math.floor((endTime - startTime) / 1000)

    const correctAnswers: number[] = []
    let score = 0

    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers.push(index)
        score++
      }
    })

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      timeSpent,
      correctAnswers,
      userAnswers,
    }

    setQuizResult(result)
    setQuizCompleted(true)

    // Save result to localStorage
    const existingResults = JSON.parse(localStorage.getItem("quiz_results") || "[]")
    existingResults.push({
      id: Date.now().toString(),
      subject: subjectNames[subject],
      score,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
      difficulty: "Mixed",
    })
    localStorage.setItem("quiz_results", JSON.stringify(existingResults))
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800"
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Generating your personalized quiz...</p>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduTutor AI
              </span>
            </div>
          </div>

          {/* Quiz Introduction */}
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div
                className={`w-20 h-20 bg-gradient-to-br ${subjectColors[subject]} rounded-2xl flex items-center justify-center mx-auto mb-6`}
              >
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">{subjectNames[subject]} Quiz</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Test your knowledge with AI-generated questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-blue-900 mb-2">Questions</h3>
                  <p className="text-blue-600">{questions.length} Questions</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-900 mb-2">Time Limit</h3>
                  <p className="text-green-600">30 Minutes</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-purple-900 mb-2">Difficulty</h3>
                  <p className="text-purple-600">Adaptive</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Quiz Instructions:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Read each question carefully before selecting your answer</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>You can navigate between questions using the Previous/Next buttons</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Your progress is automatically saved</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>You'll receive detailed feedback after completing the quiz</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={startQuiz}
                  size="lg"
                  className={`bg-gradient-to-r ${subjectColors[subject]} hover:opacity-90 px-12 py-4 text-lg`}
                >
                  Start Quiz
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (quizCompleted && quizResult) {
    const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 bg-gradient-to-br ${subjectColors[subject]} rounded-2xl flex items-center justify-center mx-auto mb-6`}
            >
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
            <p className="text-gray-600">Here's how you performed</p>
          </div>

          {/* Results Summary */}
          <Card className="border-0 shadow-2xl mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Your Results</CardTitle>
              <div className={`text-6xl font-bold ${getScoreColor(percentage)} mt-4`}>{percentage}%</div>
              <Badge className={`mt-2 ${getScoreBadgeColor(percentage)}`}>
                {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Practicing!"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{quizResult.score}</p>
                  <p className="text-blue-800">Correct Answers</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{quizResult.totalQuestions}</p>
                  <p className="text-green-800">Total Questions</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{formatTime(quizResult.timeSpent)}</p>
                  <p className="text-purple-800">Time Spent</p>
                </div>
              </div>

              {/* Question Review */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Question Review</h3>
                {questions.map((question, index) => {
                  const isCorrect = quizResult.userAnswers[index] === question.correctAnswer
                  const userAnswer = quizResult.userAnswers[index]

                  return (
                    <Card
                      key={question.id}
                      className={`border-2 ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? "bg-green-500" : "bg-red-500"}`}
                          >
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <XCircle className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Question {index + 1}: {question.question}
                            </h4>
                            <div className="space-y-2 mb-4">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    optionIndex === question.correctAnswer
                                      ? "border-green-500 bg-green-100 text-green-800"
                                      : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                                        ? "border-red-500 bg-red-100 text-red-800"
                                        : "border-gray-200 bg-white text-gray-700"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                                    <span>{option}</span>
                                    {optionIndex === question.correctAnswer && (
                                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                                    )}
                                    {optionIndex === userAnswer && userAnswer !== question.correctAnswer && (
                                      <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                              <p className="text-sm text-blue-800">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  onClick={() => router.push("/student/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Back to Dashboard
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Quiz
            </Button>
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 bg-gradient-to-br ${subjectColors[subject]} rounded-lg flex items-center justify-center`}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">{subjectNames[subject]}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <Badge variant="secondary">
              {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-2xl mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge className={`${getScoreBadgeColor(75)}`}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </Badge>
              <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1}</span>
            </div>
            <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-900">
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (selectedAnswer !== null) {
                    const newAnswers = [...userAnswers]
                    newAnswers[currentQuestionIndex] = selectedAnswer
                    setUserAnswers(newAnswers)
                  }
                  setCurrentQuestionIndex(index)
                  setSelectedAnswer(userAnswers[index])
                }}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? `bg-gradient-to-r ${subjectColors[subject]} text-white`
                    : userAnswers[index] !== null
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className={`bg-gradient-to-r ${subjectColors[subject]} hover:opacity-90`}
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
