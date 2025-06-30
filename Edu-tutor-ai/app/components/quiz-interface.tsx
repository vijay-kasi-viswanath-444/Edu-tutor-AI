"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Brain, CheckCircle, XCircle, Lightbulb, Target, Zap } from "lucide-react"

interface QuizInterfaceProps {
  onBack: () => void
}

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: string
  topic: string
}

export function QuizInterface({ onBack }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [quizCompleted, setQuizCompleted] = useState(false)

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the derivative of x² + 3x + 2?",
      options: ["2x + 3", "x² + 3", "2x + 2", "3x + 2"],
      correct: 0,
      explanation: "Using the power rule: d/dx(x²) = 2x, d/dx(3x) = 3, d/dx(2) = 0",
      difficulty: "Intermediate",
      topic: "Calculus",
    },
    {
      id: 2,
      question: "Which of the following is a fundamental force in physics?",
      options: ["Centrifugal force", "Electromagnetic force", "Fictitious force", "Applied force"],
      correct: 1,
      explanation: "Electromagnetic force is one of the four fundamental forces in nature.",
      difficulty: "Beginner",
      topic: "Physics",
    },
    {
      id: 3,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1,
      explanation:
        "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
      difficulty: "Intermediate",
      topic: "Computer Science",
    },
  ]

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setQuizCompleted(true)
    }
  }, [timeLeft, quizCompleted])

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleSubmitAnswer = () => {
    setShowFeedback(true)
    if (Number.parseInt(selectedAnswer) === currentQ.correct) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setShowFeedback(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "bg-red-100 text-red-700"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-green-100 text-green-700"
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (quizCompleted) {
    const finalScore = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-0 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-green-50">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Quiz Completed!</CardTitle>
            <CardDescription>Great job on completing the quiz</CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <div className={`text-6xl font-bold ${getScoreColor(finalScore)}`}>{finalScore}%</div>
              <p className="text-gray-600">
                You scored {score} out of {questions.length} questions correctly
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{questions.length - score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{formatTime(300 - timeLeft)}</div>
                <div className="text-sm text-gray-600">Time Used</div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={onBack}
                className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                Review Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-orange-800">{formatTime(timeLeft)}</span>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Quiz Progress</span>
              <span className="text-sm font-semibold text-gray-800">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">AI-Generated Question</CardTitle>
                  <CardDescription>Powered by IBM Watsonx</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={getDifficultyColor(currentQ.difficulty)}>
                  {currentQ.difficulty}
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-600">
                  {currentQ.topic}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQ.question}</h3>

            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect} className="space-y-4">
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="text-purple-600" />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {!showFeedback && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 px-8"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Submit Answer
                </Button>
              </div>
            )}

            {showFeedback && (
              <div className="mt-8 space-y-4">
                <div
                  className={`p-4 rounded-lg border ${
                    Number.parseInt(selectedAnswer) === currentQ.correct
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {Number.parseInt(selectedAnswer) === currentQ.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span
                      className={`font-semibold ${
                        Number.parseInt(selectedAnswer) === currentQ.correct ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {Number.parseInt(selectedAnswer) === currentQ.correct ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-gray-600 mt-0.5" />
                    <p className="text-gray-700">{currentQ.explanation}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8"
                  >
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Next Question
                        <Zap className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Finish Quiz
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-gray-800">AI Learning Insights</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600">
                  <strong className="text-purple-600">Strength:</strong> You're excelling in algebraic manipulation
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">
                  <strong className="text-green-600">Suggestion:</strong> Practice more integration techniques
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
