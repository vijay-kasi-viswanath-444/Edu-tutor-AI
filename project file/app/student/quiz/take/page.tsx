"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TakeQuizPage() {
  const [quizSession, setQuizSession] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedQuiz = localStorage.getItem("current_quiz")
    if (savedQuiz) {
      const quiz = JSON.parse(savedQuiz)
      setQuizSession(quiz)
      setAnswers(new Array(quiz.questions.length).fill(-1))
      setTimeLeft(quiz.questions.length * 60) // 1 minute per question
    } else {
      router.push("/student/dashboard")
    }
  }, [router])

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
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
    }
  }, [timeLeft, isCompleted])

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

      if (currentQuestion < quizSession.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        handleComplete()
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1] !== -1 ? answers[currentQuestion - 1] : null)
    }
  }

  const handleComplete = () => {
    setIsCompleted(true)
    calculateResults()
  }

  const calculateResults = () => {
    let correct = 0
    const results = quizSession.questions.map((question: any, index: number) => {
      const isCorrect = answers[index] === question.correct
      if (isCorrect) correct++

      return {
        question: question.question,
        selectedAnswer: answers[index],
        correctAnswer: question.correct,
        options: question.options,
        isCorrect,
        explanation: question.explanation,
      }
    })

    const score = Math.round((correct / quizSession.questions.length) * 100)
    const completedQuiz = {
      id: quizSession.id,
      config: quizSession.config,
      results,
      score,
      correctAnswers: correct,
      totalQuestions: quizSession.questions.length,
      completedAt: new Date().toISOString(),
      timeSpent: quizSession.questions.length * 60 - timeLeft,
    }

    // Save to quiz history
    const quizHistory = JSON.parse(localStorage.getItem("quiz_history") || "[]")
    quizHistory.unshift(completedQuiz)
    localStorage.setItem("quiz_history", JSON.stringify(quizHistory.slice(0, 50))) // Keep last 50 quizzes

    // Clean up current quiz
    localStorage.removeItem("current_quiz")

    setShowResults(true)
  }

  const handleReturnToDashboard = () => {
    router.push("/student/dashboard")
  }

  if (!quizSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (showResults) {
    const quizHistory = JSON.parse(localStorage.getItem("quiz_history") || "[]")
    const latestResult = quizHistory[0]

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  latestResult.score >= 80 ? "bg-green-100" : latestResult.score >= 60 ? "bg-yellow-100" : "bg-red-100"
                }`}
              >
                {latestResult.score >= 80 ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                )}
              </div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
              <CardDescription>
                {latestResult.config.subject} - {latestResult.config.topic}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div
                  className={`text-4xl font-bold mb-2 ${
                    latestResult.score >= 80
                      ? "text-green-600"
                      : latestResult.score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {latestResult.score}%
                </div>
                <p className="text-gray-600">
                  {latestResult.correctAnswers} out of {latestResult.totalQuestions} correct
                </p>
                <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-600">
                  <span>
                    Time: {Math.floor(latestResult.timeSpent / 60)}:
                    {(latestResult.timeSpent % 60).toString().padStart(2, "0")}
                  </span>
                  <span>Difficulty: {latestResult.config.difficulty}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question Review</h3>
                {latestResult.results.map((result: any, index: number) => (
                  <Card
                    key={index}
                    className={`border-l-4 ${
                      result.isCorrect ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Badge variant={result.isCorrect ? "default" : "destructive"}>
                          {result.isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{result.question}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">Your answer:</span>
                          <span
                            className={result.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}
                          >
                            {result.selectedAnswer !== -1 ? result.options[result.selectedAnswer] : "No answer"}
                          </span>
                        </div>
                        {!result.isCorrect && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Correct answer:</span>
                            <span className="text-green-600 font-medium">{result.options[result.correctAnswer]}</span>
                          </div>
                        )}
                        {result.explanation && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                            <strong>Explanation:</strong> {result.explanation}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={handleReturnToDashboard} variant="outline">
                  Back to Dashboard
                </Button>
                <Button
                  onClick={() => router.push("/student/quiz/new")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Take Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const question = quizSession.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizSession.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">{quizSession.config.subject}</span>
              <p className="text-sm text-gray-600">{quizSession.config.topic}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="outline">{quizSession.config.difficulty}</Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quizSession.questions.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
            <CardDescription className="text-base font-medium text-gray-900 mt-4">{question.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
              className="space-y-4"
            >
              {question.options.map((option: string, index: number) => (
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
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentQuestion === quizSession.questions.length - 1 ? "Complete Quiz" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
