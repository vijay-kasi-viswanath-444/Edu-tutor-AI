"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Brain,
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Play,
  RefreshCw,
  Calendar,
  CheckCircle,
  Clock,
  Send,
  Bot,
} from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Advanced Mathematics",
      teacher: "Dr. Smith",
      progress: 75,
      lastQuiz: "Calculus Integration",
      score: 88,
      nextTopic: "Differential Equations",
    },
    {
      id: 2,
      name: "Physics 101",
      teacher: "Prof. Johnson",
      progress: 60,
      lastQuiz: "Newton's Laws",
      score: 92,
      nextTopic: "Thermodynamics",
    },
    {
      id: 3,
      name: "Computer Science",
      teacher: "Ms. Davis",
      progress: 85,
      lastQuiz: "Data Structures",
      score: 95,
      nextTopic: "Algorithms",
    },
  ])

  const [recentQuizzes, setRecentQuizzes] = useState([
    {
      id: 1,
      subject: "Mathematics",
      topic: "Calculus Integration",
      score: 88,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Newton's Laws",
      score: 92,
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: 3,
      subject: "Computer Science",
      topic: "Data Structures",
      score: 95,
      date: "2024-01-13",
      status: "completed",
    },
  ])

  const [scheduledQuizzes, setScheduledQuizzes] = useState([])
  const [completedQuizzes, setCompletedQuizzes] = useState([])
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      message:
        "Hi! I'm your AI study assistant powered by ChatGPT. I can help you with Mathematics, Physics, Computer Science, and more. What would you like to learn about?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [googleClassroomConnected, setGoogleClassroomConnected] = useState(false)
  const [liveSessions, setLiveSessions] = useState([])
  const [showLiveSessions, setShowLiveSessions] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      window.location.href = "/auth"
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.userType !== "student") {
      window.location.href = "/auth"
      return
    }

    // Update the displayed name
    const nameElement = document.getElementById("student-name")
    if (nameElement && userData.fullName) {
      nameElement.textContent = userData.fullName
    }

    // Load scheduled and completed quizzes
    const loadQuizzes = () => {
      const allQuizzes = JSON.parse(localStorage.getItem("scheduledQuizzes") || "[]")
      const results = JSON.parse(localStorage.getItem("quizResults") || "[]")

      // Separate completed and pending quizzes
      const completedQuizIds = results.map((result: any) => result.quizId)
      const pending = allQuizzes.filter((quiz: any) => !completedQuizIds.includes(quiz.id))
      const completed = allQuizzes
        .filter((quiz: any) => completedQuizIds.includes(quiz.id))
        .map((quiz: any) => {
          const result = results.find((r: any) => r.quizId === quiz.id)
          return { ...quiz, result }
        })

      setScheduledQuizzes(pending)
      setCompletedQuizzes(completed)
    }

    loadQuizzes()
    // Refresh every 30 seconds to check for new quizzes
    const interval = setInterval(loadQuizzes, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      window.location.href = "/auth"
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.userType !== "student") {
      window.location.href = "/auth"
      return
    }

    // Update the displayed name
    const nameElement = document.getElementById("student-name")
    if (nameElement && userData.fullName) {
      nameElement.textContent = userData.fullName
    }

    // Load scheduled and completed quizzes
    const loadQuizzes = () => {
      const allQuizzes = JSON.parse(localStorage.getItem("scheduledQuizzes") || "[]")
      const results = JSON.parse(localStorage.getItem("quizResults") || "[]")

      // Separate completed and pending quizzes
      const completedQuizIds = results.map((result: any) => result.quizId)
      const pending = allQuizzes.filter((quiz: any) => !completedQuizIds.includes(quiz.id))
      const completed = allQuizzes
        .filter((quiz: any) => completedQuizIds.includes(quiz.id))
        .map((quiz: any) => {
          const result = results.find((r: any) => r.quizId === quiz.id)
          return { ...quiz, result }
        })

      setScheduledQuizzes(pending)
      setCompletedQuizzes(completed)
    }

    loadQuizzes()
    // Refresh every 30 seconds to check for new quizzes
    const interval = setInterval(loadQuizzes, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Check Google Classroom connection status
    const googleConnected = localStorage.getItem("googleClassroomConnected")
    if (googleConnected === "true") {
      setGoogleClassroomConnected(true)
      setLiveSessions([
        {
          id: 1,
          title: "Advanced Mathematics - Live Session",
          teacher: "Dr. Smith",
          status: "active",
          startTime: new Date().toISOString(),
          meetLink: "https://meet.google.com/abc-defg-hij",
        },
        {
          id: 2,
          title: "Physics 101 - Q&A Session",
          teacher: "Prof. Johnson",
          status: "scheduled",
          startTime: new Date(Date.now() + 3600000).toISOString(),
          meetLink: "https://meet.google.com/xyz-uvwx-yzab",
        },
      ])
    }
  }, [])

  const generateQuiz = async (courseId: number) => {
    setIsGeneratingQuiz(true)
    // Simulate AI quiz generation
    setTimeout(() => {
      setIsGeneratingQuiz(false)
      // Redirect to quiz interface
      window.location.href = `/quiz/${courseId}`
    }, 3000)
  }

  const startScheduledQuiz = (quizId: number) => {
    // Find the quiz and redirect to quiz page
    const quiz = scheduledQuizzes.find((q: any) => q.id === quizId)
    if (quiz) {
      // Store quiz data for the quiz page
      localStorage.setItem("currentQuiz", JSON.stringify(quiz))
      window.location.href = `/quiz/scheduled/${quizId}`
    }
  }

  const getQuizStatus = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()

    // Check if quiz is available (current time is past due date)
    if (now >= due) {
      return {
        label: "Available Now",
        color: "bg-green-100 text-green-800",
        canStart: true,
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
      }
    }
    if (diffDays <= 1) {
      return {
        label: `Starts in ${diffHours}h`,
        color: "bg-blue-100 text-blue-800",
        canStart: false,
      }
    }
    return {
      label: `Starts in ${diffDays}d`,
      color: "bg-gray-100 text-gray-800",
      canStart: false,
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: currentMessage,
      timestamp: new Date().toLocaleTimeString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsTyping(true)

    // Simulate ChatGPT API call
    try {
      const aiResponse = await generateChatGPTResponse(currentMessage)

      setTimeout(() => {
        const aiMessage = {
          id: chatMessages.length + 2,
          type: "ai",
          message: aiResponse,
          timestamp: new Date().toLocaleTimeString(),
        }
        setChatMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      }, 1500)
    } catch (error) {
      setTimeout(() => {
        const errorMessage = {
          id: chatMessages.length + 2,
          type: "ai",
          message: "I'm sorry, I'm having trouble connecting right now. Please try asking your question again.",
          timestamp: new Date().toLocaleTimeString(),
        }
        setChatMessages((prev) => [...prev, errorMessage])
        setIsTyping(false)
      }, 1000)
    }
  }

  const generateChatGPTResponse = async (question: string) => {
    // Simulate ChatGPT-like responses with educational focus
    const lowerQuestion = question.toLowerCase()

    // Advanced Mathematics responses
    if (lowerQuestion.includes("derivative") || lowerQuestion.includes("differentiation")) {
      return "Great question about derivatives! The derivative represents the rate of change of a function. Here are the key rules:\n\n• Power Rule: d/dx(x^n) = nx^(n-1)\n• Product Rule: d/dx(uv) = u'v + uv'\n• Chain Rule: d/dx(f(g(x))) = f'(g(x)) × g'(x)\n\nFor example: d/dx(x³) = 3x²\n\nWould you like me to work through a specific derivative problem with you?"
    }

    if (lowerQuestion.includes("integral") || lowerQuestion.includes("integration")) {
      return "Integration is the reverse process of differentiation! Here are the fundamental concepts:\n\n• Basic Rule: ∫x^n dx = x^(n+1)/(n+1) + C\n• Substitution Method: Used when you can identify u and du\n• Integration by Parts: ∫u dv = uv - ∫v du\n\nExample: ∫2x dx = x² + C\n\nWhat specific integration technique would you like me to explain further?"
    }

    if (lowerQuestion.includes("limit") || lowerQuestion.includes("calculus")) {
      return "Limits are fundamental to calculus! They describe the behavior of functions as inputs approach certain values.\n\n• Basic limit: lim(x→a) f(x) = L\n• L'Hôpital's Rule: For 0/0 or ∞/∞ forms\n• Important limit: lim(x→0) sin(x)/x = 1\n\nLimits help us define derivatives and integrals. What specific limit problem are you working on?"
    }

    // Physics responses
    if (lowerQuestion.includes("newton") || lowerQuestion.includes("force") || lowerQuestion.includes("motion")) {
      return "Newton's Laws are the foundation of classical mechanics:\n\n• **First Law (Inertia)**: Objects at rest stay at rest, objects in motion stay in motion, unless acted upon by a net force\n• **Second Law**: F = ma (Force equals mass times acceleration)\n• **Third Law**: For every action, there's an equal and opposite reaction\n\nThese laws explain everything from walking to rocket propulsion! What specific application would you like to explore?"
    }

    if (lowerQuestion.includes("energy") || lowerQuestion.includes("kinetic") || lowerQuestion.includes("potential")) {
      return "Energy is a fundamental concept in physics! Here are the key types:\n\n• **Kinetic Energy**: KE = ½mv² (energy of motion)\n• **Potential Energy**: PE = mgh (gravitational) or ½kx² (elastic)\n• **Conservation of Energy**: Total energy in an isolated system remains constant\n\nExample: A ball at height h has PE = mgh. When dropped, this converts to KE = ½mv² at the bottom.\n\nWhat energy problem can I help you solve?"
    }

    if (lowerQuestion.includes("wave") || lowerQuestion.includes("frequency") || lowerQuestion.includes("wavelength")) {
      return "Waves are fascinating! Here are the key relationships:\n\n• **Wave equation**: v = fλ (velocity = frequency × wavelength)\n• **Period**: T = 1/f (time for one complete cycle)\n• **Types**: Mechanical waves (sound) vs Electromagnetic waves (light)\n\nSound waves in air travel at ~343 m/s, while light travels at 3×10⁸ m/s!\n\nWhat specific wave phenomenon would you like to understand better?"
    }

    // Computer Science responses
    if (
      lowerQuestion.includes("algorithm") ||
      lowerQuestion.includes("complexity") ||
      lowerQuestion.includes("big o")
    ) {
      return "Algorithm complexity is crucial for efficient programming! Here's a breakdown:\n\n• **O(1)**: Constant time - accessing array element\n• **O(log n)**: Logarithmic - binary search\n• **O(n)**: Linear - simple loop through array\n• **O(n log n)**: Efficient sorting (merge sort, heap sort)\n• **O(n²)**: Quadratic - nested loops (bubble sort)\n\nBig O describes worst-case performance. Which algorithm would you like me to analyze?"
    }

    if (
      lowerQuestion.includes("data structure") ||
      lowerQuestion.includes("stack") ||
      lowerQuestion.includes("queue") ||
      lowerQuestion.includes("tree")
    ) {
      return "Data structures organize data efficiently! Here are the main types:\n\n• **Array**: Random access, fixed size - O(1) access\n• **Stack**: LIFO (Last In, First Out) - think of plates\n• **Queue**: FIFO (First In, First Out) - think of a line\n• **Linked List**: Dynamic size, sequential access\n• **Tree**: Hierarchical structure - great for searching\n• **Hash Table**: Key-value pairs - O(1) average lookup\n\nWhich data structure would you like to explore in detail?"
    }

    if (lowerQuestion.includes("programming") || lowerQuestion.includes("code") || lowerQuestion.includes("function")) {
      return "Programming is problem-solving with code! Here are fundamental concepts:\n\n• **Variables**: Store data values\n• **Functions**: Reusable blocks of code\n• **Loops**: Repeat operations (for, while)\n• **Conditionals**: Make decisions (if, else)\n• **Recursion**: Function calling itself\n\nGood programming practices:\n✓ Write clear, readable code\n✓ Use meaningful variable names\n✓ Comment your code\n✓ Test thoroughly\n\nWhat programming concept can I help clarify?"
    }

    // General study help
    if (lowerQuestion.includes("study") || lowerQuestion.includes("learn") || lowerQuestion.includes("tips")) {
      return "Here are proven study strategies for STEM subjects:\n\n**Active Learning:**\n• Solve practice problems regularly\n• Teach concepts to others\n• Create concept maps\n\n**Spaced Repetition:**\n• Review material at increasing intervals\n• Use flashcards for formulas/definitions\n\n**Problem-Solving:**\n• Break complex problems into steps\n• Check your work\n• Learn from mistakes\n\nWhat specific subject or topic would you like study tips for?"
    }

    if (lowerQuestion.includes("help") || lowerQuestion.includes("explain") || lowerQuestion.includes("understand")) {
      return "I'm here to help you understand any concept! I can assist with:\n\n📐 **Mathematics**: Calculus, Algebra, Statistics, Geometry\n⚛️ **Physics**: Mechanics, Thermodynamics, Electromagnetism, Quantum\n💻 **Computer Science**: Algorithms, Data Structures, Programming\n🧪 **Chemistry**: Organic, Inorganic, Physical Chemistry\n🧬 **Biology**: Cell Biology, Genetics, Ecology\n\nJust ask me about any specific topic, formula, or concept you're struggling with. I'll break it down step by step!"
    }

    // Homework and assignment help
    if (
      lowerQuestion.includes("homework") ||
      lowerQuestion.includes("assignment") ||
      lowerQuestion.includes("problem")
    ) {
      return "I'd be happy to help with your assignment! Here's how I can assist:\n\n• **Explain concepts** behind the problems\n• **Guide you through** problem-solving steps\n• **Check your approach** and suggest improvements\n• **Provide examples** of similar problems\n\nRemember: I'll help you understand, but the learning comes from working through problems yourself!\n\nWhat specific problem or concept are you working on?"
    }

    // Default response with educational focus
    return `That's an interesting question! I'm designed to help students excel in their studies. I can provide detailed explanations, work through problems step-by-step, and help you understand complex concepts in:\n\n• Mathematics (Calculus, Algebra, Statistics)\n• Physics (Mechanics, Thermodynamics, Electromagnetism)\n• Computer Science (Algorithms, Programming, Data Structures)\n• Chemistry and Biology\n\nCould you be more specific about what you'd like to learn? For example:\n- "Explain derivatives in calculus"\n- "How do I solve physics momentum problems?"\n- "What's the difference between stacks and queues?"\n\nI'm here to make learning easier and more engaging for you!`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">EduTutor AI</span>
            </Link>
            <Badge className="bg-blue-100 text-blue-800">Student Portal</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-white text-gray-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Classroom
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLiveSessions(true)}
              className="bg-green-50 text-green-700 border-green-200"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Live Sessions
            </Button>
            <Dialog open={showAIAssistant} onOpenChange={setShowAIAssistant}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Bot className="h-4 w-4 mr-2" />
                  ChatGPT Assistant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    ChatGPT Study Assistant
                  </DialogTitle>
                  <DialogDescription>
                    Powered by ChatGPT - Ask me anything about Math, Physics, Computer Science, and more!
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 py-4 max-h-96">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] p-3 rounded-lg ${
                          msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 border"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 border p-3 rounded-lg">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Input
                    placeholder="Ask me about your studies..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !isTyping && sendMessage()}
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={sendMessage}
                    size="sm"
                    className="bg-blue-600 text-white"
                    disabled={isTyping || !currentMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="text-sm text-gray-600">
              Welcome back,{" "}
              <span className="font-semibold" id="student-name">
                Student
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("currentUser")
                window.location.href = "/"
              }}
              className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-green-600">92%</p>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Quizzes Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{completedQuizzes.length + recentQuizzes.length}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Study Streak</p>
                  <p className="text-2xl font-bold text-orange-600">7 days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="scheduled-quizzes">Scheduled Quizzes</TabsTrigger>
            <TabsTrigger value="completed-quizzes">Completed Quizzes</TabsTrigger>
            <TabsTrigger value="quizzes">Recent Quizzes</TabsTrigger>
            <TabsTrigger value="progress">Progress Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <Badge variant="outline">{course.teacher}</Badge>
                    </div>
                    <CardDescription>
                      Last quiz: {course.lastQuiz} - Score: {course.score}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Course Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Next Topic:</p>
                          <p className="font-medium">{course.nextTopic}</p>
                        </div>
                        <Button
                          onClick={() => generateQuiz(course.id)}
                          disabled={isGeneratingQuiz}
                          className="bg-blue-600 text-white"
                        >
                          {isGeneratingQuiz ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Start Quiz
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Recommendations */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Focus on Differential Equations</p>
                      <p className="text-sm text-gray-600">
                        Based on your calculus performance, this topic needs attention
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Excellent progress in Computer Science</p>
                      <p className="text-sm text-gray-600">You're ready for advanced algorithm challenges</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Try the ChatGPT Assistant!</p>
                      <p className="text-sm text-gray-600">Get instant help with homework and concept explanations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled-quizzes" className="space-y-6">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Scheduled Quizzes
                </CardTitle>
                <CardDescription>Upcoming quizzes assigned by your educators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledQuizzes.length > 0 ? (
                    scheduledQuizzes.map((quiz: any) => {
                      const status = getQuizStatus(quiz.dueDate)
                      return (
                        <div key={quiz.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                          <div className="flex-1">
                            <h3 className="font-semibold">{quiz.title}</h3>
                            <p className="text-sm text-gray-600">
                              {quiz.subject} • {quiz.numQuestions} questions • {quiz.timeLimit || 30} minutes
                            </p>
                            <p className="text-xs text-gray-500">
                              Scheduled: {new Date(quiz.dueDate).toLocaleString()}
                            </p>
                            {quiz.description && <p className="text-xs text-gray-400 mt-1">{quiz.description}</p>}
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={status.color}>{status.label}</Badge>
                            {status.canStart ? (
                              <Button onClick={() => startScheduledQuiz(quiz.id)} className="bg-green-600 text-white">
                                <Play className="h-4 w-4 mr-2" />
                                Start Quiz
                              </Button>
                            ) : (
                              <Button disabled variant="outline" className="bg-gray-50 text-gray-400">
                                <Clock className="h-4 w-4 mr-2" />
                                Not Available
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No scheduled quizzes at the moment</p>
                      <p className="text-sm text-gray-400">Check back later for new assignments</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed-quizzes" className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-50 to-green-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  Completed Quizzes
                </CardTitle>
                <CardDescription>Your quiz results - showing percentage scores only</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedQuizzes.length > 0 ? (
                    completedQuizzes.map((quiz: any) => (
                      <div key={quiz.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div className="flex items-center gap-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{quiz.title}</h3>
                            <p className="text-sm text-gray-600">
                              {quiz.subject} • Completed: {new Date(quiz.result?.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`text-lg px-4 py-2 ${
                              quiz.result?.score >= 90
                                ? "bg-green-100 text-green-800"
                                : quiz.result?.score >= 80
                                  ? "bg-blue-100 text-blue-800"
                                  : quiz.result?.score >= 70
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {quiz.result?.score}%
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No completed quizzes yet</p>
                      <p className="text-sm text-gray-400">Complete some quizzes to see your results here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <h3 className="font-semibold">{quiz.topic}</h3>
                          <p className="text-sm text-gray-600">{quiz.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={`text-lg px-4 py-2 ${
                              quiz.score >= 90
                                ? "bg-green-100 text-green-800"
                                : quiz.score >= 80
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {quiz.score}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {quiz.date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Your quiz scores over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Performance chart would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Strengths</CardTitle>
                  <CardDescription>Areas where you excel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Computer Science</span>
                        <span className="text-sm text-gray-600">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Physics</span>
                        <span className="text-sm text-gray-600">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Mathematics</span>
                        <span className="text-sm text-gray-600">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Live Sessions Dialog */}
      <Dialog open={showLiveSessions} onOpenChange={setShowLiveSessions}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Live Sessions
            </DialogTitle>
            <DialogDescription>Join live sessions and virtual meetings with your teachers</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {liveSessions.length > 0 ? (
              liveSessions.map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex-1">
                    <h3 className="font-semibold">{session.title}</h3>
                    <p className="text-sm text-gray-600">Teacher: {session.teacher}</p>
                    <p className="text-xs text-gray-500">
                      {session.status === "active" ? "Started" : "Starts"}:{" "}
                      {new Date(session.startTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        session.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }
                    >
                      {session.status === "active" ? "Live Now" : "Scheduled"}
                    </Badge>
                    <Button
                      onClick={() => window.open(session.meetLink, "_blank")}
                      className={session.status === "active" ? "bg-green-600 text-white" : "bg-blue-600 text-white"}
                    >
                      {session.status === "active" ? "Join Now" : "Join Meeting"}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No live sessions available</p>
                <p className="text-sm text-gray-400">Check back later for scheduled sessions</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
