"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Brain, Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, Lightbulb, Target, Bot, Send } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export default function ScheduledQuizPage() {
  const params = useParams()
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes default
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [quiz, setQuiz] = useState<any>(null)
  const [showAIHelper, setShowAIHelper] = useState(false)
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      type: "ai",
      message:
        "Hi! I'm here to help you during your quiz. I can provide hints and explanations, but I won't give direct answers. What do you need help with?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [currentAIMessage, setCurrentAIMessage] = useState("")

  useEffect(() => {
    // Load quiz data from localStorage
    const quizData = localStorage.getItem("currentQuiz")
    if (quizData) {
      const parsedQuiz = JSON.parse(quizData)
      setQuiz(parsedQuiz)
      setTimeRemaining((parsedQuiz.timeLimit || 30) * 60) // Convert minutes to seconds
    } else {
      // Redirect back if no quiz data
      router.push("/student")
    }
  }, [router])

  useEffect(() => {
    if (!quiz) return

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
  }, [quiz])

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
    if (!quiz) return

    // Calculate score
    let correctAnswers = 0
    quiz.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.options[question.correct]) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100)
    setScore(finalScore)
    setIsSubmitted(true)

    // Get current user info
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

    // Save detailed quiz result for educator analytics
    const detailedQuizResult = {
      quizId: quiz.id,
      studentId: currentUser.id || currentUser.email,
      studentName: currentUser.fullName || "Unknown Student",
      studentEmail: currentUser.email,
      title: quiz.title,
      subject: quiz.subject,
      score: finalScore,
      correctAnswers: correctAnswers,
      totalQuestions: quiz.questions.length,
      completedAt: new Date().toISOString(),
      answers: selectedAnswers,
      timeSpent: quiz.timeLimit * 60 - timeRemaining,
      timeLimit: quiz.timeLimit,
      difficulty: quiz.difficulty,
      questionDetails: quiz.questions.map((question: any, index: number) => ({
        questionId: index + 1,
        question: question.question,
        selectedAnswer: selectedAnswers[index],
        correctAnswer: question.options[question.correct],
        isCorrect: selectedAnswers[index] === question.options[question.correct],
        difficulty: question.difficulty || quiz.difficulty,
        topic: question.type || quiz.subject,
      })),
    }

    // Save basic result for student view (percentage only)
    const studentQuizResult = {
      quizId: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      score: finalScore,
      completedAt: new Date().toISOString(),
      answers: selectedAnswers,
      timeSpent: quiz.timeLimit * 60 - timeRemaining,
    }

    // Store detailed results for educator
    const existingDetailedResults = JSON.parse(localStorage.getItem("detailedQuiz Results") || "[]")
    existingDetailedResults.push(detailedQuizResult)
    localStorage.setItem("detailedQuizResults", JSON.stringify(existingDetailedResults))

    // Store basic results for student
    const existingResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
    existingResults.push(studentQuizResult)
    localStorage.setItem("quizResults", JSON.stringify(existingResults))

    // Update quiz completion count
    const allQuizzes = JSON.parse(localStorage.getItem("scheduledQuizzes") || "[]")
    const updatedQuizzes = allQuizzes.map((q: any) => {
      if (q.id === quiz.id) {
        return { ...q, completions: (q.completions || 0) + 1 }
      }
      return q
    })
    localStorage.setItem("scheduledQuizzes", JSON.stringify(updatedQuizzes))
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

  const sendAIMessage = () => {
    if (!currentAIMessage.trim()) return

    const userMessage = {
      id: aiMessages.length + 1,
      type: "user",
      message: currentAIMessage,
      timestamp: new Date().toLocaleTimeString(),
    }

    setAiMessages((prev) => [...prev, userMessage])

    // Generate AI response based on current question
    setTimeout(() => {
      const aiResponse = generateQuizAIResponse(currentAIMessage, quiz?.questions[currentQuestionIndex])
      const aiMessage = {
        id: aiMessages.length + 2,
        type: "ai",
        message: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
      }
      setAiMessages((prev) => [...prev, aiMessage])
    }, 1000)

    setCurrentAIMessage("")
  }

  const generateQuizAIResponse = (question: string, currentQuestion: any) => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("answer") || lowerQuestion.includes("correct")) {
      return "I can't give you the direct answer, but I can help you understand the concept! Let me break down the question for you."
    }

    if (lowerQuestion.includes("hint") || lowerQuestion.includes("help")) {
      if (currentQuestion) {
        // Provide subject-specific hints
        if (quiz.subject === "Mathematics") {
          return "For math problems, try to identify what mathematical concept is being tested. Look for keywords like 'derivative', 'integral', or 'solve'. Break the problem into steps."
        } else if (quiz.subject === "Physics") {
          return "In physics, identify the given values and what you need to find. Think about which formula or law applies. Remember units are important!"
        } else if (quiz.subject === "Computer Science") {
          return "For CS questions, think about the fundamental concepts. Is this about time complexity, data structures, or algorithms? Consider the efficiency and behavior."
        }
      }
      return "Look at the question carefully. What concept is being tested? Try to eliminate obviously wrong answers first."
    }

    if (lowerQuestion.includes("explain") || lowerQuestion.includes("understand")) {
      return "I'd be happy to explain the concept! Can you tell me which part of the question you're finding confusing? Is it the terminology, the approach, or the calculation?"
    }

    if (lowerQuestion.includes("time") || lowerQuestion.includes("stuck")) {
      return "Don't worry! Take a deep breath. Read the question again slowly. If you're really stuck, make your best educated guess and move on. You can always come back to it."
    }

    return "I'm here to guide you! Try to think through the problem step by step. What do you know about this topic from your studies? I can help clarify concepts without giving away the answer."
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading quiz...</p>
        </div>
      </div>
    )
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
            <CardDescription>Here are your results for {quiz.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <span className={score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"}>
                  {score}%
                </span>
              </div>
              <p className="text-gray-600">
                You got{" "}
                {
                  quiz.questions.filter((_: any, index: number) => selectedAnswers[index] === _.options[_.correct])
                    .length
                }{" "}
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
                  ? "Excellent work! You have a strong understanding of the concepts. Keep up the great work!"
                  : score >= 60
                    ? "Good effort! Review the topics you missed and practice similar problems to improve."
                    : "Keep studying! Focus on understanding the fundamental concepts and practice regularly."}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Question Review:</h3>
              {quiz.questions.map((question: any, index: number) => {
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
                      {question.explanation && <p className="text-sm text-blue-600 mt-1">💡 {question.explanation}</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push("/student")} className="flex-1 bg-blue-600 text-white">
                Back to Dashboard
              </Button>
              <Button variant="outline" className="flex-1 bg-white text-gray-700" onClick={() => setShowAIHelper(true)}>
                Ask AI About Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  const getQuizStatus = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const expirationTime = new Date(due.getTime() + 2 * 60 * 60 * 1000) // 2 hours after due date

    // Check if quiz has expired
    if (now > expirationTime) {
      return {
        label: "Expired",
        color: "bg-red-100 text-red-800",
        canStart: false,
        expired: true,
      }
    }

    // Check if quiz is available (current time is past due date but not expired)
    if (now >= due) {
      return {
        label: "Available Now",
        color: "bg-green-100 text-green-800",
        canStart: true,
        expired: false,
      }
    }

    const diffMs = due.getTime() - now.getTime()
    const diffHours = Math.ceil(diffMs / (1000 * 3600))
    const diffDays = Math.ceil(diffMs / (1000 * 3600 * 24))

    if (diffHours <= 2) {
      return {
        label: `Starts in ${diffHours}h`,
        color: "bg-orange-100 text-orange-800",
        canStart: false,
        expired: false,
      }
    }
    if (diffDays <= 1) {
      return {
        label: `Starts in ${diffHours}h`,
        color: "bg-blue-100 text-blue-800",
        canStart: false,
        expired: false,
      }
    }
    return {
      label: `Starts in ${diffDays}d`,
      color: "bg-gray-100 text-gray-800",
      canStart: false,
      expired: false,
    }
  }

  const scheduledQuizzes = JSON.parse(localStorage.getItem("scheduledQuizzes") || "[]")

  const startScheduledQuiz = (quizId: number) => {
    // Find the quiz and check if it's expired
    const quiz = scheduledQuizzes.find((q: any) => q.id === quizId)
    if (quiz) {
      const status = getQuizStatus(quiz.dueDate)
      if (status.expired) {
        alert("This quiz has expired and is no longer available.")
        return
      }

      // Store quiz data for the quiz page
      localStorage.setItem("currentQuiz", JSON.stringify(quiz))
      window.location.href = `/quiz/scheduled/${quizId}`
    }
  }

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
            <Badge className="bg-blue-100 text-blue-800">{quiz.difficulty || "Intermediate"}</Badge>
            <Button
              variant="outline"
              onClick={() => setShowAIHelper(true)}
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Helper
            </Button>
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
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% Complete
              </span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
                <Badge variant="outline" className="bg-white text-gray-700">
                  {currentQuestion.difficulty || "Intermediate"}
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
                {currentQuestion.options.map((option: string, index: number) => (
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
                      {quiz.subject === "Mathematics" && "Remember to check your calculation steps carefully."}
                      {quiz.subject === "Physics" && "Consider the units and physical meaning of your answer."}
                      {quiz.subject === "Computer Science" &&
                        "Think about the efficiency and behavior of the solution."}
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
              {quiz.questions.map((_: any, index: number) => (
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

      {/* AI Helper Dialog */}
      <Dialog open={showAIHelper} onOpenChange={setShowAIHelper}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-600" />
              Quiz AI Helper
            </DialogTitle>
            <DialogDescription>I can help you understand concepts, but I won't give direct answers!</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 max-h-96">
            {aiMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === "user" ? "bg-blue-600 text-white" : "bg-purple-100 text-purple-800"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Input
              placeholder="Ask for help with concepts..."
              value={currentAIMessage}
              onChange={(e) => setCurrentAIMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendAIMessage()}
              className="flex-1"
            />
            <Button onClick={sendAIMessage} size="sm" className="bg-purple-600 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
