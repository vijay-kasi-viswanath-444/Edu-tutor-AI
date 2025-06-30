"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Brain,
  Users,
  BookOpen,
  BarChart3,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  RefreshCw,
  Send,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, XCircle } from "lucide-react"

export default function EducatorDashboard() {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Advanced Mathematics - Period 3",
      students: 28,
      avgScore: 85,
      recentActivity: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Physics 101 - Period 5",
      students: 24,
      avgScore: 78,
      recentActivity: "1 day ago",
      status: "active",
    },
    {
      id: 3,
      name: "Computer Science - Period 7",
      students: 22,
      avgScore: 92,
      recentActivity: "3 hours ago",
      status: "active",
    },
  ])

  const [students, setStudents] = useState([])
  const [allRegisteredStudents, setAllRegisteredStudents] = useState([])

  const [assignedQuizzes, setAssignedQuizzes] = useState([
    {
      id: 1,
      title: "Integration Techniques Quiz",
      subject: "Mathematics",
      class: "Advanced Mathematics - Period 3",
      dueDate: "2024-01-25T14:00",
      difficulty: "intermediate",
      numQuestions: 10,
      completions: 15,
      totalStudents: 28,
      status: "active",
      createdDate: "Jan 20, 2024",
      timeLimit: 30,
      description: "Quiz on integration techniques and applications",
    },
    {
      id: 2,
      title: "Thermodynamics Assessment",
      subject: "Physics",
      class: "Physics 101 - Period 5",
      dueDate: "2024-01-28T10:30",
      difficulty: "beginner",
      numQuestions: 10,
      completions: 8,
      totalStudents: 24,
      status: "active",
      createdDate: "Jan 22, 2024",
      timeLimit: 25,
      description: "Basic thermodynamics concepts",
    },
    {
      id: 3,
      title: "Algorithm Complexity Quiz",
      subject: "Computer Science",
      class: "Computer Science - Period 7",
      dueDate: "2024-01-30T16:00",
      difficulty: "advanced",
      numQuestions: 15,
      completions: 0,
      totalStudents: 22,
      status: "scheduled",
      createdDate: "Jan 23, 2024",
      timeLimit: 40,
      description: "Advanced algorithm analysis and complexity",
    },
  ])

  const [showCreateQuiz, setShowCreateQuiz] = useState(false)
  const [showEditQuiz, setShowEditQuiz] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null)
  const [quizForm, setQuizForm] = useState({
    title: "",
    subject: "",
    class: "",
    dueDate: "",
    difficulty: "",
    numQuestions: "10",
    description: "",
    timeLimit: "30",
  })

  const [showStudentDetails, setShowStudentDetails] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showGoogleSync, setShowGoogleSync] = useState(false)
  const [googleClassroomConnected, setGoogleClassroomConnected] = useState(false)
  const [liveSessions, setLiveSessions] = useState([])

  const [showCreateLiveSession, setShowCreateLiveSession] = useState(false)
  const [liveSessionForm, setLiveSessionForm] = useState({
    title: "",
    description: "",
    class: "",
    scheduledDate: "",
    duration: "60",
    type: "lecture",
    recordSession: false,
    allowStudentVideo: true,
    allowStudentAudio: false,
  })

  const [showAllStudents, setShowAllStudents] = useState(false)
  const [studentSearchTerm, setStudentSearchTerm] = useState("")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      window.location.href = "/auth"
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.userType !== "educator") {
      window.location.href = "/auth"
      return
    }

    // Update the displayed name
    const nameElement = document.getElementById("educator-name")
    if (nameElement && userData.fullName) {
      nameElement.textContent = userData.fullName
    }

    // Load students from educator portal storage
    const loadStudents = () => {
      const educatorStudents = JSON.parse(localStorage.getItem("educatorStudents") || "[]")
      const studentRegistry = JSON.parse(localStorage.getItem("studentRegistry") || "[]")
      const detailedResults = JSON.parse(localStorage.getItem("detailedQuizResults") || "[]")

      // Update students with quiz results
      const updatedStudents = educatorStudents.map((student: any) => {
        const studentResults = detailedResults.filter(
          (result: any) => result.studentEmail === student.email || result.studentName === student.name,
        )

        if (studentResults.length > 0) {
          const latestResult = studentResults[studentResults.length - 1]
          const avgScore = Math.round(
            studentResults.reduce((sum: number, result: any) => sum + result.score, 0) / studentResults.length,
          )

          return {
            ...student,
            lastQuiz: latestResult.title,
            score: latestResult.score,
            progress: Math.min(95, avgScore + 10),
            lastActive: new Date(latestResult.completedAt).toLocaleString(),
            status: avgScore >= 85 ? "excellent" : avgScore >= 70 ? "on-track" : "needs-attention",
            totalQuizzes: studentResults.length,
            averageScore: avgScore,
            totalTimeSpent: studentResults.reduce((sum: number, result: any) => sum + result.timeSpent, 0),
            detailedResults: studentResults,
          }
        }
        return student
      })

      setStudents(updatedStudents)
      setAllRegisteredStudents(studentRegistry)
    }

    loadStudents()

    // Load assigned quizzes from localStorage
    const savedQuizzes = localStorage.getItem("scheduledQuizzes")
    if (savedQuizzes) {
      const parsedQuizzes = JSON.parse(savedQuizzes)
      setAssignedQuizzes(parsedQuizzes)
    }

    // Load live sessions from localStorage
    const savedSessions = localStorage.getItem("liveSessions")
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions)
      setLiveSessions(parsedSessions)
    }

    // Refresh data every 30 seconds
    const interval = setInterval(loadStudents, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleGoogleClassroomSync = async () => {
    setShowGoogleSync(true)
    // Simulate Google Classroom API connection
    setTimeout(() => {
      setGoogleClassroomConnected(true)
      setLiveSessions([
        {
          id: 1,
          title: "Advanced Mathematics - Live Session",
          participants: 15,
          status: "active",
          startTime: new Date().toISOString(),
          meetLink: "https://meet.google.com/abc-defg-hij",
        },
        {
          id: 2,
          title: "Physics 101 - Q&A Session",
          participants: 8,
          status: "scheduled",
          startTime: new Date(Date.now() + 3600000).toISOString(),
          meetLink: "https://meet.google.com/xyz-uvwx-yzab",
        },
      ])
      setShowGoogleSync(false)
    }, 2000)
  }

  const openStudentDetails = (student: any) => {
    setSelectedStudent(student)
    setShowStudentDetails(true)
  }

  const handleCreateQuiz = () => {
    // Generate 10 random MCQ questions based on subject
    const generatedQuestions = generateRandomQuestions(quizForm.subject, Number.parseInt(quizForm.numQuestions))

    const newQuiz = {
      id: Date.now(), // Use timestamp as unique ID
      title: quizForm.title,
      subject: quizForm.subject,
      class: quizForm.class,
      dueDate: quizForm.dueDate,
      difficulty: quizForm.difficulty,
      numQuestions: Number.parseInt(quizForm.numQuestions),
      timeLimit: Number.parseInt(quizForm.timeLimit),
      description: quizForm.description,
      questions: generatedQuestions,
      completions: 0,
      totalStudents: classes.find((c) => c.name === quizForm.class)?.students || 0,
      status: "scheduled",
      createdDate: new Date().toLocaleDateString(),
    }

    const updatedQuizzes = [...assignedQuizzes, newQuiz]
    setAssignedQuizzes(updatedQuizzes)

    // Store in localStorage to sync with student portal
    localStorage.setItem("scheduledQuizzes", JSON.stringify(updatedQuizzes))

    setShowCreateQuiz(false)
    resetQuizForm()
  }

  const handleEditQuiz = () => {
    if (!editingQuiz) return

    // Regenerate questions if subject or number changed
    let updatedQuestions = editingQuiz.questions
    if (
      quizForm.subject !== editingQuiz.subject ||
      Number.parseInt(quizForm.numQuestions) !== editingQuiz.numQuestions
    ) {
      updatedQuestions = generateRandomQuestions(quizForm.subject, Number.parseInt(quizForm.numQuestions))
    }

    const updatedQuiz = {
      ...editingQuiz,
      title: quizForm.title,
      subject: quizForm.subject,
      class: quizForm.class,
      dueDate: quizForm.dueDate,
      difficulty: quizForm.difficulty,
      numQuestions: Number.parseInt(quizForm.numQuestions),
      timeLimit: Number.parseInt(quizForm.timeLimit),
      description: quizForm.description,
      questions: updatedQuestions,
      totalStudents: classes.find((c) => c.name === quizForm.class)?.students || 0,
    }

    const updatedQuizzes = assignedQuizzes.map((quiz) => (quiz.id === editingQuiz.id ? updatedQuiz : quiz))
    setAssignedQuizzes(updatedQuizzes)

    // Update localStorage
    localStorage.setItem("scheduledQuizzes", JSON.stringify(updatedQuizzes))

    setShowEditQuiz(false)
    setEditingQuiz(null)
    resetQuizForm()
  }

  const handleDeleteQuiz = (quizId: number) => {
    const updatedQuizzes = assignedQuizzes.filter((quiz) => quiz.id !== quizId)
    setAssignedQuizzes(updatedQuizzes)
    localStorage.setItem("scheduledQuizzes", JSON.stringify(updatedQuizzes))
  }

  const openEditDialog = (quiz: any) => {
    setEditingQuiz(quiz)
    setQuizForm({
      title: quiz.title,
      subject: quiz.subject,
      class: quiz.class,
      dueDate: quiz.dueDate,
      difficulty: quiz.difficulty,
      numQuestions: quiz.numQuestions.toString(),
      description: quiz.description || "",
      timeLimit: quiz.timeLimit?.toString() || "30",
    })
    setShowEditQuiz(true)
  }

  const resetQuizForm = () => {
    setQuizForm({
      title: "",
      subject: "",
      class: "",
      dueDate: "",
      difficulty: "",
      numQuestions: "10",
      description: "",
      timeLimit: "30",
    })
  }

  const handleCreateLiveSession = async () => {
    const newSession = {
      id: Date.now(),
      title: liveSessionForm.title,
      description: liveSessionForm.description,
      class: liveSessionForm.class,
      scheduledDate: liveSessionForm.scheduledDate,
      duration: Number.parseInt(liveSessionForm.duration),
      type: liveSessionForm.type,
      recordSession: liveSessionForm.recordSession,
      allowStudentVideo: liveSessionForm.allowStudentVideo,
      allowStudentAudio: liveSessionForm.allowStudentAudio,
      status: new Date(liveSessionForm.scheduledDate) <= new Date() ? "active" : "scheduled",
      participants: 0,
      maxParticipants: classes.find((c) => c.name === liveSessionForm.class)?.students || 0,
      meetLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
      createdAt: new Date().toISOString(),
      createdBy: JSON.parse(localStorage.getItem("currentUser") || "{}").fullName || "Educator",
    }

    const updatedSessions = [...liveSessions, newSession]
    setLiveSessions(updatedSessions)
    localStorage.setItem("liveSessions", JSON.stringify(updatedSessions))

    setShowCreateLiveSession(false)
    resetLiveSessionForm()
  }

  const resetLiveSessionForm = () => {
    setLiveSessionForm({
      title: "",
      description: "",
      class: "",
      scheduledDate: "",
      duration: "60",
      type: "lecture",
      recordSession: false,
      allowStudentVideo: true,
      allowStudentAudio: false,
    })
  }

  const handleDeleteLiveSession = (sessionId: number) => {
    const updatedSessions = liveSessions.filter((session: any) => session.id !== sessionId)
    setLiveSessions(updatedSessions)
    localStorage.setItem("liveSessions", JSON.stringify(updatedSessions))
  }

  const startLiveSession = (session: any) => {
    // Update session status to active
    const updatedSessions = liveSessions.map((s: any) =>
      s.id === session.id ? { ...s, status: "active", actualStartTime: new Date().toISOString() } : s,
    )
    setLiveSessions(updatedSessions)
    localStorage.setItem("liveSessions", JSON.stringify(updatedSessions))

    // Open Google Meet
    window.open(session.meetLink, "_blank")
  }

  // Add this function to generate random questions
  const generateRandomQuestions = (subject: string, numQuestions: number) => {
    const questionBank = {
      Mathematics: [
        {
          question: "What is the derivative of x²?",
          options: ["2x", "x", "x²", "2x²"],
          correct: 0,
          explanation: "Using the power rule: d/dx(x²) = 2x",
        },
        {
          question: "Solve: 2x + 5 = 13",
          options: ["x = 4", "x = 6", "x = 8", "x = 9"],
          correct: 0,
          explanation: "2x = 13 - 5 = 8, so x = 4",
        },
        {
          question: "What is ∫2x dx?",
          options: ["x² + C", "2x² + C", "x²/2 + C", "2x + C"],
          correct: 0,
          explanation: "The integral of 2x is x² + C",
        },
        {
          question: "What is the slope of the line y = 3x + 2?",
          options: ["3", "2", "5", "1"],
          correct: 0,
          explanation: "In y = mx + b form, m is the slope, so slope = 3",
        },
        {
          question: "Evaluate: lim(x→0) sin(x)/x",
          options: ["1", "0", "∞", "undefined"],
          correct: 0,
          explanation: "This is a standard limit that equals 1",
        },
        {
          question: "What is the second derivative of x³?",
          options: ["6x", "3x²", "x²", "3x"],
          correct: 0,
          explanation: "First derivative: 3x², second derivative: 6x",
        },
        {
          question: "Solve: x² - 5x + 6 = 0",
          options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 0, 5"],
          correct: 0,
          explanation: "Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3",
        },
      ],
      Physics: [
        {
          question: "What is Newton's second law?",
          options: ["F = ma", "E = mc²", "v = u + at", "P = mv"],
          correct: 0,
          explanation: "Newton's second law states that Force equals mass times acceleration",
        },
        {
          question: "What is the unit of force?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correct: 0,
          explanation: "Force is measured in Newtons (N)",
        },
        {
          question: "What is the acceleration due to gravity on Earth?",
          options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "9.0 m/s²"],
          correct: 0,
          explanation: "Standard acceleration due to gravity is 9.8 m/s²",
        },
        {
          question: "What is the formula for kinetic energy?",
          options: ["½mv²", "mgh", "mv", "ma"],
          correct: 0,
          explanation: "Kinetic energy = ½ × mass × velocity²",
        },
        {
          question: "What is Ohm's law?",
          options: ["V = IR", "P = IV", "E = hf", "F = qE"],
          correct: 0,
          explanation: "Ohm's law: Voltage = Current × Resistance",
        },
        {
          question: "What is the formula for momentum?",
          options: ["p = mv", "p = ma", "p = ½mv²", "p = mgh"],
          correct: 0,
          explanation: "Momentum = mass × velocity",
        },
        {
          question: "What is the unit of power?",
          options: ["Watt", "Joule", "Newton", "Pascal"],
          correct: 0,
          explanation: "Power is measured in Watts (W)",
        },
      ],
      "Computer Science": [
        {
          question: "What is the time complexity of binary search?",
          options: ["O(log n)", "O(n)", "O(n²)", "O(1)"],
          correct: 0,
          explanation: "Binary search divides the search space in half each time",
        },
        {
          question: "Which data structure uses LIFO principle?",
          options: ["Stack", "Queue", "Array", "Tree"],
          correct: 0,
          explanation: "Stack follows Last In, First Out (LIFO) principle",
        },
        {
          question: "What does HTML stand for?",
          options: [
            "HyperText Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language",
          ],
          correct: 0,
          explanation: "HTML stands for HyperText Markup Language",
        },
        {
          question: "Which sorting algorithm has O(n log n) average time complexity?",
          options: ["Merge Sort", "Bubble Sort", "Selection Sort", "Insertion Sort"],
          correct: 0,
          explanation: "Merge Sort consistently performs at O(n log n)",
        },
        {
          question: "What is a primary key in databases?",
          options: ["Unique identifier for records", "Foreign key reference", "Index for faster queries", "Backup key"],
          correct: 0,
          explanation: "Primary key uniquely identifies each record in a table",
        },
        {
          question: "What is the time complexity of accessing an array element?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
          correct: 0,
          explanation: "Array access by index is constant time O(1)",
        },
        {
          question: "Which data structure uses FIFO principle?",
          options: ["Queue", "Stack", "Tree", "Graph"],
          correct: 0,
          explanation: "Queue follows First In, First Out (FIFO) principle",
        },
      ],
    }

    const questions = questionBank[subject] || questionBank.Mathematics
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, numQuestions).map((q, index) => ({
      id: index + 1,
      ...q,
      difficulty: "intermediate",
      points: 10,
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "on-track":
        return "bg-blue-100 text-blue-800"
      case "needs-attention":
        return "bg-red-100 text-red-800"
      case "new-student":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4" />
      case "on-track":
        return <Clock className="h-4 w-4" />
      case "needs-attention":
        return <AlertCircle className="h-4 w-4" />
      case "new-student":
        return <UserPlus className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getQuizStatusBadge = (quiz: any) => {
    const now = new Date()
    const dueDate = new Date(quiz.dueDate)
    const expirationTime = new Date(dueDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours after due date

    if (now > expirationTime) {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>
    } else if (now >= dueDate) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Scheduled</Badge>
    }
  }

  const filteredStudents = allRegisteredStudents.filter(
    (student: any) =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold">EduTutor AI</span>
            </Link>
            <Badge className="bg-purple-100 text-purple-800">Educator Dashboard</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleGoogleClassroomSync}
              className={`${googleClassroomConnected ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${showGoogleSync ? "animate-spin" : ""}`} />
              {googleClassroomConnected ? "Google Classroom Connected" : "Sync Google Classroom"}
            </Button>
            <Button variant="outline" className="bg-white text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Dialog open={showAllStudents} onOpenChange={setShowAllStudents}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Users className="h-4 w-4 mr-2" />
                  All Students ({allRegisteredStudents.length})
                </Button>
              </DialogTrigger>
            </Dialog>
            <div className="text-sm text-gray-600">
              Welcome,{" "}
              <span className="font-semibold" id="educator-name">
                Educator
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
                  <p className="text-sm text-gray-600">Registered Students</p>
                  <p className="text-2xl font-bold text-gray-900">{allRegisteredStudents.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-blue-600">{students.length}</p>
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
                  <p className="text-2xl font-bold text-green-600">
                    {students.length > 0
                      ? Math.round(
                          students.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / students.length,
                        )
                      : 0}
                    %
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Quizzes</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {assignedQuizzes.filter((q) => new Date(q.dueDate) <= new Date()).length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Active Students</TabsTrigger>
            <TabsTrigger value="quiz-management">Quiz Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="detailed-analytics">Detailed Analytics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="live-sessions">Live Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Student Activity</CardTitle>
                  <CardDescription>Latest student signups and logins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allRegisteredStudents.slice(0, 5).map((student: any) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {student.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800 mb-2">
                            {student.loginCount > 1 ? "Active" : "New"}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            {student.lastLogin ? new Date(student.lastLogin).toLocaleDateString() : "Just joined"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Quiz Activity</CardTitle>
                  <CardDescription>Latest quiz completions across all classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">Calculus Integration Quiz</p>
                        <p className="text-sm text-gray-600">Advanced Mathematics • 15 completions</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">85% avg</Badge>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">Data Structures Quiz</p>
                        <p className="text-sm text-gray-600">Computer Science • 12 completions</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">92% avg</Badge>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div className="flex-1">
                        <p className="font-medium">Newton's Laws Quiz</p>
                        <p className="text-sm text-gray-600">Physics 101 • 8 completions</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">78% avg</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Active Students</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search students..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" className="bg-white text-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {students.length > 0 ? (
                students.map((student: any) => (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <p className="text-xs text-gray-500">Last active: {student.lastActive}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Last Quiz</p>
                            <p className="font-semibold">{student.lastQuiz || "No quizzes yet"}</p>
                            <Badge
                              className={`mt-1 ${student.score >= 90 ? "bg-green-100 text-green-800" : student.score >= 80 ? "bg-blue-100 text-blue-800" : student.score > 0 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {student.score || 0}%
                            </Badge>
                          </div>

                          <div className="text-center min-w-[100px]">
                            <p className="text-sm text-gray-600">Progress</p>
                            <Progress value={student.progress || 0} className="w-20 h-2 mt-1" />
                            <p className="text-xs text-gray-500 mt-1">{student.progress || 0}%</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(student.status)}>
                              {getStatusIcon(student.status)}
                              <span className="ml-1 capitalize">{student.status?.replace("-", " ") || "New"}</span>
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white text-gray-700"
                              onClick={() => openStudentDetails(student)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active students yet</p>
                  <p className="text-sm text-gray-400">Students will appear here after taking quizzes</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Rest of the tabs remain the same... */}

          {/* Quiz management content remains the same */}

          {/* Analytics content remains the same */}

          {/* Detailed analytics content remains the same */}

          {/* Insights content remains the same */}

          {/* Live sessions content remains the same */}

          <TabsContent value="quiz-management" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Quiz Management</h2>
              <Dialog open={showCreateQuiz} onOpenChange={setShowCreateQuiz}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Quiz</DialogTitle>
                    <DialogDescription>Generate an AI-powered quiz for your students</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quiz-title">Quiz Title</Label>
                        <Input
                          id="quiz-title"
                          placeholder="e.g., Integration Techniques Quiz"
                          value={quizForm.title}
                          onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quiz-subject">Subject</Label>
                        <Select
                          value={quizForm.subject}
                          onValueChange={(value) => setQuizForm({ ...quizForm, subject: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                            <SelectItem value="Biology">Biology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quiz-class">Class</Label>
                        <Select
                          value={quizForm.class}
                          onValueChange={(value) => setQuizForm({ ...quizForm, class: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.name}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quiz-due-date">Due Date & Time</Label>
                        <Input
                          id="quiz-due-date"
                          type="datetime-local"
                          value={quizForm.dueDate}
                          onChange={(e) => setQuizForm({ ...quizForm, dueDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quiz-difficulty">Difficulty</Label>
                        <Select
                          value={quizForm.difficulty}
                          onValueChange={(value) => setQuizForm({ ...quizForm, difficulty: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="adaptive">Adaptive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quiz-questions">Number of Questions</Label>
                        <Select
                          value={quizForm.numQuestions}
                          onValueChange={(value) => setQuizForm({ ...quizForm, numQuestions: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Questions</SelectItem>
                            <SelectItem value="10">10 Questions</SelectItem>
                            <SelectItem value="15">15 Questions</SelectItem>
                            <SelectItem value="20">20 Questions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quiz-time-limit">Time Limit (minutes)</Label>
                        <Select
                          value={quizForm.timeLimit}
                          onValueChange={(value) => setQuizForm({ ...quizForm, timeLimit: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="20">20 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quiz-description">Description (Optional)</Label>
                      <Textarea
                        id="quiz-description"
                        placeholder="Brief description of the quiz topics..."
                        value={quizForm.description}
                        onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={handleCreateQuiz}
                        className="flex-1 bg-purple-600 text-white"
                        disabled={!quizForm.title || !quizForm.subject || !quizForm.class || !quizForm.dueDate}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Quiz
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateQuiz(false)
                          resetQuizForm()
                        }}
                        className="bg-white text-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Active Quizzes */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Quizzes</CardTitle>
                <CardDescription>Manage your assigned quizzes and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">
                          {quiz.subject} • {quiz.class}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(quiz.dueDate).toLocaleString()} • {quiz.completions}/{quiz.totalStudents}{" "}
                          completed • {quiz.timeLimit} min
                        </p>
                        {quiz.description && <p className="text-xs text-gray-400 mt-1">{quiz.description}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={(quiz.completions / quiz.totalStudents) * 100} className="w-20 h-2" />
                        {getQuizStatusBadge(quiz)}
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(quiz)}
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="bg-white text-gray-700">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setShowCreateQuiz(true)}
              >
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Create Quiz</h3>
                  <p className="text-sm text-gray-600">Generate AI-powered quizzes for your students</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Schedule Quiz</h3>
                  <p className="text-sm text-gray-600">Set due dates and availability windows</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">View Results</h3>
                  <p className="text-sm text-gray-600">Analyze quiz performance and insights</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Performance Trends</CardTitle>
                  <CardDescription>Average scores over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.map((classItem) => (
                      <div key={classItem.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{classItem.name}</span>
                          <span className="text-sm text-gray-600">{classItem.avgScore}%</span>
                        </div>
                        <Progress value={classItem.avgScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Topic Difficulty Analysis</CardTitle>
                  <CardDescription>Areas where students struggle most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Differential Equations</span>
                      <div className="flex items-center gap-2">
                        <Progress value={65} className="w-20 h-2" />
                        <span className="text-sm text-red-600">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Thermodynamics</span>
                      <div className="flex items-center gap-2">
                        <Progress value={72} className="w-20 h-2" />
                        <span className="text-sm text-yellow-600">72%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Data Structures</span>
                      <div className="flex items-center gap-2">
                        <Progress value={88} className="w-20 h-2" />
                        <span className="text-sm text-green-600">88%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Integration Techniques</span>
                      <div className="flex items-center gap-2">
                        <Progress value={78} className="w-20 h-2" />
                        <span className="text-sm text-yellow-600">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Newton's Laws</span>
                      <div className="flex items-center gap-2">
                        <Progress value={82} className="w-20 h-2" />
                        <span className="text-sm text-blue-600">82%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                    <p className="text-sm text-gray-600">Students complete assigned quizzes</p>
                    <Progress value={87} className="mt-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Time Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">24m</div>
                    <p className="text-sm text-gray-600">Average quiz completion time</p>
                    <div className="mt-3 text-xs text-gray-500">Range: 15m - 45m</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Improvement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">+12%</div>
                    <p className="text-sm text-gray-600">Average score improvement</p>
                    <div className="mt-3 text-xs text-green-600">↗ Trending upward</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed-analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Detailed Quiz Analytics
                </CardTitle>
                <CardDescription>Comprehensive analysis of student quiz performance</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const detailedResults = JSON.parse(localStorage.getItem("detailedQuizResults") || "[]")

                  if (detailedResults.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No quiz results available yet</p>
                        <p className="text-sm text-gray-400">
                          Results will appear here after students complete quizzes
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-6">
                      {detailedResults.map((result: any, index: number) => (
                        <div key={index} className="border rounded-lg p-6 bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{result.title}</h3>
                              <p className="text-sm text-gray-600">
                                Student: {result.studentName} • Subject: {result.subject}
                              </p>
                              <p className="text-xs text-gray-500">
                                Completed: {new Date(result.completedAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={`text-lg px-4 py-2 ${
                                  result.score >= 90
                                    ? "bg-green-100 text-green-800"
                                    : result.score >= 80
                                      ? "bg-blue-100 text-blue-800"
                                      : result.score >= 70
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                              >
                                {result.score}%
                              </Badge>
                              <p className="text-sm text-gray-500 mt-1">
                                {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm font-medium text-gray-700">Time Performance</p>
                              <p className="text-lg">
                                {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                              </p>
                              <p className="text-xs text-gray-500">of {result.timeLimit} minutes allowed</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm font-medium text-gray-700">Difficulty Level</p>
                              <p className="text-lg capitalize">{result.difficulty}</p>
                              <p className="text-xs text-gray-500">{result.totalQuestions} questions</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700">Question-by-Question Analysis:</h4>
                            <div className="grid gap-2">
                              {result.questionDetails.map((question: any, qIndex: number) => (
                                <div
                                  key={qIndex}
                                  className={`p-3 rounded border-l-4 ${
                                    question.isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        Q{question.questionId}: {question.question}
                                      </p>
                                      <p className="text-xs text-gray-600 mt-1">
                                        Student answered: <span className="font-medium">{question.selectedAnswer}</span>
                                      </p>
                                      {!question.isCorrect && (
                                        <p className="text-xs text-green-700 mt-1">
                                          Correct answer: <span className="font-medium">{question.correctAnswer}</span>
                                        </p>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      {question.isCorrect ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Teaching Insights
                </CardTitle>
                <CardDescription>Personalized recommendations based on student performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold text-green-700 mb-2">🎯 Focus Areas Identified</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • <strong>Differential Equations:</strong> 40% of students scoring below 70% - consider
                        additional practice sessions
                      </li>
                      <li>
                        • <strong>Newton's Laws:</strong> Conceptual understanding gaps detected - recommend visual
                        demonstrations
                      </li>
                      <li>
                        • <strong>Integration Techniques:</strong> Students struggle with substitution methods - provide
                        more examples
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold text-blue-700 mb-2">📈 Student Progress Patterns</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • <strong>High Performers:</strong> 25% of students consistently score above 90% - ready for
                        advanced challenges
                      </li>
                      <li>
                        • <strong>Improving Students:</strong> 45% show steady improvement trends - continue current
                        support strategy
                      </li>
                      <li>
                        • <strong>At-Risk Students:</strong> 15% need immediate intervention - schedule one-on-one
                        sessions
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold text-purple-700 mb-2">🔄 Adaptive Recommendations</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Generate more visual-based quizzes for Physics concepts</li>
                      <li>• Increase difficulty level for Computer Science advanced students</li>
                      <li>• Create remedial quizzes for struggling Mathematics students</li>
                      <li>• Implement peer tutoring for collaborative learning</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold text-orange-700 mb-2">⚡ Quick Actions</h3>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      <Button variant="outline" className="bg-blue-50 text-blue-700">
                        <Brain className="h-4 w-4 mr-2" />
                        Generate Remedial Quiz
                      </Button>
                      <Button variant="outline" className="bg-green-50 text-green-700">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Create Advanced Challenge
                      </Button>
                      <Button variant="outline" className="bg-purple-50 text-purple-700">
                        <Users className="h-4 w-4 mr-2" />
                        Schedule Group Session
                      </Button>
                      <Button variant="outline" className="bg-orange-50 text-orange-700">
                        <Send className="h-4 w-4 mr-2" />
                        Send Progress Reports
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live-sessions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Google Classroom Live Sessions</h2>
              <div className="flex gap-3">
                {googleClassroomConnected && (
                  <Dialog open={showCreateLiveSession} onOpenChange={setShowCreateLiveSession}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Live Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Schedule Google Classroom Live Session</DialogTitle>
                        <DialogDescription>Create and schedule a live session for your students</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="session-title">Session Title</Label>
                            <Input
                              id="session-title"
                              placeholder="e.g., Advanced Calculus Review"
                              value={liveSessionForm.title}
                              onChange={(e) => setLiveSessionForm({ ...liveSessionForm, title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="session-class">Class</Label>
                            <Select
                              value={liveSessionForm.class}
                              onValueChange={(value) => setLiveSessionForm({ ...liveSessionForm, class: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                {classes.map((cls) => (
                                  <SelectItem key={cls.id} value={cls.name}>
                                    {cls.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="session-description">Description</Label>
                          <Textarea
                            id="session-description"
                            placeholder="Brief description of the live session..."
                            value={liveSessionForm.description}
                            onChange={(e) => setLiveSessionForm({ ...liveSessionForm, description: e.target.value })}
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="session-date">Scheduled Date & Time</Label>
                            <Input
                              id="session-date"
                              type="datetime-local"
                              value={liveSessionForm.scheduledDate}
                              onChange={(e) =>
                                setLiveSessionForm({ ...liveSessionForm, scheduledDate: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="session-duration">Duration (minutes)</Label>
                            <Select
                              value={liveSessionForm.duration}
                              onValueChange={(value) => setLiveSessionForm({ ...liveSessionForm, duration: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                                <SelectItem value="90">90 minutes</SelectItem>
                                <SelectItem value="120">120 minutes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="session-type">Session Type</Label>
                            <Select
                              value={liveSessionForm.type}
                              onValueChange={(value) => setLiveSessionForm({ ...liveSessionForm, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lecture">Lecture</SelectItem>
                                <SelectItem value="discussion">Discussion</SelectItem>
                                <SelectItem value="qa">Q&A Session</SelectItem>
                                <SelectItem value="review">Review Session</SelectItem>
                                <SelectItem value="office-hours">Office Hours</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Session Settings</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="record-session"
                                checked={liveSessionForm.recordSession}
                                onChange={(e) =>
                                  setLiveSessionForm({ ...liveSessionForm, recordSession: e.target.checked })
                                }
                                className="rounded"
                              />
                              <Label htmlFor="record-session" className="text-sm">
                                Record this session
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="allow-student-video"
                                checked={liveSessionForm.allowStudentVideo}
                                onChange={(e) =>
                                  setLiveSessionForm({ ...liveSessionForm, allowStudentVideo: e.target.checked })
                                }
                                className="rounded"
                              />
                              <Label htmlFor="allow-student-video" className="text-sm">
                                Allow student video
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="allow-student-audio"
                                checked={liveSessionForm.allowStudentAudio}
                                onChange={(e) =>
                                  setLiveSessionForm({ ...liveSessionForm, allowStudentAudio: e.target.checked })
                                }
                                className="rounded"
                              />
                              <Label htmlFor="allow-student-audio" className="text-sm">
                                Allow student audio by default
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                          <Button
                            onClick={handleCreateLiveSession}
                            className="flex-1 bg-green-600 text-white"
                            disabled={
                              !liveSessionForm.title || !liveSessionForm.class || !liveSessionForm.scheduledDate
                            }
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Live Session
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowCreateLiveSession(false)
                              resetLiveSessionForm()
                            }}
                            className="bg-white text-gray-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Button
                  variant="outline"
                  onClick={handleGoogleClassroomSync}
                  className={`${googleClassroomConnected ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${showGoogleSync ? "animate-spin" : ""}`} />
                  {googleClassroomConnected ? "Refresh Sessions" : "Connect Google Classroom"}
                </Button>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Live Session Management
                </CardTitle>
                <CardDescription>
                  Schedule, manage, and conduct live sessions with Google Classroom integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!googleClassroomConnected ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Connect Google Classroom to manage live sessions</p>
                    <Button onClick={handleGoogleClassroomSync} className="bg-blue-600 text-white">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Connect Google Classroom
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {liveSessions.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No live sessions scheduled</p>
                        <Button onClick={() => setShowCreateLiveSession(true)} className="bg-green-600 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule Your First Live Session
                        </Button>
                      </div>
                    ) : (
                      liveSessions.map((session: any) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{session.title}</h3>
                              <Badge className="text-xs capitalize">{session.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{session.class}</p>
                            <p className="text-xs text-gray-500">
                              Scheduled: {new Date(session.scheduledDate).toLocaleString()} • {session.duration} minutes
                            </p>
                            {session.description && <p className="text-xs text-gray-400 mt-1">{session.description}</p>}
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>
                                👥 {session.participants}/{session.maxParticipants} participants
                              </span>
                              {session.recordSession && <span>🎥 Recording enabled</span>}
                              {session.allowStudentVideo && <span>📹 Student video allowed</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={
                                session.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : session.status === "completed"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-blue-100 text-blue-800"
                              }
                            >
                              {session.status === "active"
                                ? "🔴 Live"
                                : session.status === "completed"
                                  ? "Completed"
                                  : "Scheduled"}
                            </Badge>
                            <div className="flex gap-1">
                              {session.status === "scheduled" && new Date(session.scheduledDate) <= new Date() && (
                                <Button
                                  onClick={() => startLiveSession(session)}
                                  className="bg-green-600 text-white"
                                  size="sm"
                                >
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Start Live
                                </Button>
                              )}
                              {session.status === "active" && (
                                <Button
                                  onClick={() => window.open(session.meetLink, "_blank")}
                                  className="bg-red-600 text-white"
                                  size="sm"
                                >
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Join Live
                                </Button>
                              )}
                              {session.status === "scheduled" && (
                                <Button
                                  onClick={() => window.open(session.meetLink, "_blank")}
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-50 text-blue-700"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteLiveSession(session.id)}
                                className="bg-red-50 text-red-700 border-red-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {liveSessions.length > 0 && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-3">Quick Actions</h3>
                        <div className="grid md:grid-cols-4 gap-2">
                          <Button
                            onClick={() => setShowCreateLiveSession(true)}
                            variant="outline"
                            className="bg-white text-blue-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            New Session
                          </Button>
                          <Button variant="outline" className="bg-white text-blue-700">
                            <Calendar className="h-4 w-4 mr-2" />
                            View Calendar
                          </Button>
                          <Button variant="outline" className="bg-white text-blue-700">
                            <Download className="h-4 w-4 mr-2" />
                            Export Schedule
                          </Button>
                          <Button variant="outline" className="bg-white text-blue-700">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Session Analytics
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Session Statistics */}
            {googleClassroomConnected && liveSessions.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Sessions</p>
                        <p className="text-2xl font-bold text-blue-600">{liveSessions.length}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Sessions</p>
                        <p className="text-2xl font-bold text-green-600">
                          {liveSessions.filter((s: any) => s.status === "active").length}
                        </p>
                      </div>
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="h-3 w-3 bg-green-600 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Participants</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {liveSessions.reduce((sum: number, s: any) => sum + s.participants, 0)}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* All Students Dialog */}
      <Dialog open={showAllStudents} onOpenChange={setShowAllStudents}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              All Registered Students ({allRegisteredStudents.length})
            </DialogTitle>
            <DialogDescription>Complete list of all students who have signed up on the platform</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students by name or email..."
                  className="pl-10"
                  value={studentSearchTerm}
                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="bg-white text-gray-700">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student: any) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {student.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500">
                          Joined: {new Date(student.joinedDate || student.firstLogin).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={
                            student.loginCount > 5
                              ? "bg-green-100 text-green-800"
                              : student.loginCount > 1
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                          }
                        >
                          {student.loginCount > 5 ? "Active" : student.loginCount > 1 ? "Regular" : "New"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {student.loginCount} login{student.loginCount !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last: {student.lastLogin ? new Date(student.lastLogin).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No students found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search terms</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={() => setShowAllStudents(false)} className="flex-1 bg-purple-600 text-white">
                Close
              </Button>
              <Button variant="outline" className="bg-white text-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Details Dialog */}
      <Dialog open={showStudentDetails} onOpenChange={setShowStudentDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Student Details: {selectedStudent?.name}
            </DialogTitle>
            <DialogDescription>Comprehensive view of student performance and learning analytics</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6 py-4">
              {/* Student Overview */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                        {selectedStudent.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <h3 className="font-semibold">{selectedStudent.name}</h3>
                      <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined:{" "}
                        {new Date(selectedStudent.joinedDate || selectedStudent.firstLogin).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold text-green-600">{selectedStudent.averageScore || 0}%</p>
                      <p className="text-xs text-gray-500">{selectedStudent.totalQuizzes || 0} quizzes completed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Study Time</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.floor((selectedStudent.totalTimeSpent || 0) / 60)}h{" "}
                        {(selectedStudent.totalTimeSpent || 0) % 60}m
                      </p>
                      <p className="text-xs text-gray-500">across all quizzes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Login History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Login Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedStudent.loginHistory && selectedStudent.loginHistory.length > 0 ? (
                      selectedStudent.loginHistory
                        .slice(-5)
                        .reverse()
                        .map((login: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm capitalize">{login.action}</span>
                            <span className="text-xs text-gray-500">{new Date(login.timestamp).toLocaleString()}</span>
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-500 text-sm">No login history available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quiz History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quiz History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedStudent.detailedResults && selectedStudent.detailedResults.length > 0 ? (
                      selectedStudent.detailedResults.map((result: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{result.title}</h4>
                            <p className="text-sm text-gray-600">{result.subject}</p>
                            <p className="text-xs text-gray-500">{new Date(result.completedAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`${
                                result.score >= 90
                                  ? "bg-green-100 text-green-800"
                                  : result.score >= 80
                                    ? "bg-blue-100 text-blue-800"
                                    : result.score >= 70
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {result.score}%
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No quiz history available</p>
                        <p className="text-sm text-gray-400">Student hasn't completed any quizzes yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-blue-600 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1 bg-white text-gray-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="bg-white text-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Quiz Dialog and other dialogs remain the same... */}
    </div>
  )
}
