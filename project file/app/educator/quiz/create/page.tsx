"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Brain, Settings, Play, Loader2, ArrowLeft, Plus, Trash2, Save, Eye, Target, Zap } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, MessageCircle, History, Share2, UserPlus, Clock, CheckCircle2 } from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer"
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: "beginner" | "intermediate" | "advanced"
  points: number
}

interface QuizConfig {
  title: string
  description: string
  subject: string
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  timeLimit: number
  totalPoints: number
  dueDate: string
  classId?: string
  isPublished: boolean
}

export default function CreateQuizPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("config")
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    title: "",
    description: "",
    subject: "",
    topic: "",
    difficulty: "intermediate",
    timeLimit: 30,
    totalPoints: 0,
    dueDate: "",
    isPublished: false,
  })

  const [collaborators, setCollaborators] = useState([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@school.edu",
      avatar: "SJ",
      role: "owner",
      status: "online",
      lastSeen: new Date(),
    },
    {
      id: "2",
      name: "Prof. Michael Chen",
      email: "m.chen@school.edu",
      avatar: "MC",
      role: "editor",
      status: "online",
      lastSeen: new Date(),
    },
  ])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [versionHistory, setVersionHistory] = useState([])
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const classId = searchParams.get("classId")
    if (classId) {
      setQuizConfig((prev) => ({ ...prev, classId }))
    }
  }, [searchParams])

  const handleConfigChange = (field: keyof QuizConfig, value: any) => {
    setQuizConfig((prev) => ({ ...prev, [field]: value }))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      difficulty: quizConfig.difficulty,
      points: 1,
    }
    setQuestions((prev) => [...prev, newQuestion])
    setActiveTab("questions")
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const generateQuestions = async () => {
    if (!quizConfig.subject || !quizConfig.topic) {
      alert("Please fill in subject and topic first")
      return
    }

    setIsGenerating(true)

    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const generatedQuestions: Question[] = [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: "multiple-choice",
          question: `What is a fundamental concept in ${quizConfig.topic}?`,
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          correctAnswer: 0,
          explanation: `This is a key concept in ${quizConfig.topic} that students should understand.`,
          difficulty: quizConfig.difficulty,
          points: 2,
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: "multiple-choice",
          question: `Which principle applies to ${quizConfig.topic}?`,
          options: ["Principle 1", "Principle 2", "Principle 3", "Principle 4"],
          correctAnswer: 1,
          explanation: `This principle is essential for understanding ${quizConfig.topic}.`,
          difficulty: quizConfig.difficulty,
          points: 2,
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: "true-false",
          question: `${quizConfig.topic} is an important topic in ${quizConfig.subject}.`,
          correctAnswer: "true",
          explanation: `Yes, ${quizConfig.topic} is indeed fundamental to ${quizConfig.subject}.`,
          difficulty: quizConfig.difficulty,
          points: 1,
        },
      ]

      setQuestions(generatedQuestions)
      setActiveTab("questions")

      // Update total points
      const totalPoints = generatedQuestions.reduce((sum, q) => sum + q.points, 0)
      setQuizConfig((prev) => ({ ...prev, totalPoints }))
    } catch (error) {
      console.error("Error generating questions:", error)
      alert("Failed to generate questions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const saveQuiz = async (publish = false) => {
    if (!quizConfig.title || questions.length === 0) {
      alert("Please add a title and at least one question")
      return
    }

    setIsSaving(true)

    try {
      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const quiz = {
        id: Math.random().toString(36).substr(2, 9),
        ...quizConfig,
        questions,
        isPublished: publish,
        createdAt: new Date().toISOString(),
        totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
      }

      // Save to localStorage (in real app, this would be an API call)
      const savedQuizzes = JSON.parse(localStorage.getItem("educator_quizzes") || "[]")
      savedQuizzes.push(quiz)
      localStorage.setItem("educator_quizzes", JSON.stringify(savedQuizzes))

      alert(publish ? "Quiz published successfully!" : "Quiz saved as draft!")
      router.push("/educator/dashboard")
    } catch (error) {
      console.error("Error saving quiz:", error)
      alert("Failed to save quiz. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const previewQuiz = () => {
    if (questions.length === 0) {
      alert("Please add at least one question to preview")
      return
    }

    // Store quiz for preview
    const previewData = { config: quizConfig, questions }
    localStorage.setItem("quiz_preview", JSON.stringify(previewData))

    // Open preview in new tab
    window.open("/educator/quiz/preview", "_blank")
  }

  const addCollaborator = (email: string, role: "editor" | "viewer") => {
    const newCollaborator = {
      id: Math.random().toString(36).substr(2, 9),
      name: email
        .split("@")[0]
        .replace(".", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      avatar: email.substring(0, 2).toUpperCase(),
      role,
      status: "offline",
      lastSeen: new Date(),
    }
    setCollaborators((prev) => [...prev, newCollaborator])
  }

  const addComment = (questionId?: string) => {
    if (!newComment.trim()) return

    const comment = {
      id: Math.random().toString(36).substr(2, 9),
      text: newComment,
      author: collaborators[0],
      questionId,
      timestamp: new Date(),
      resolved: false,
    }
    setComments((prev) => [...prev, comment])
    setNewComment("")
  }

  const saveVersion = () => {
    const version = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      author: collaborators[0],
      changes: `Updated ${questions.length} questions`,
      config: { ...quizConfig },
      questions: [...questions],
    }
    setVersionHistory((prev) => [version, ...prev])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Quiz Creator
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Collaborators */}
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((collaborator) => (
                  <Avatar key={collaborator.id} className="w-8 h-8 border-2 border-white">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                      {collaborator.avatar}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {collaborators.length > 3 && (
                <span className="text-sm text-gray-600">+{collaborators.length - 3} more</span>
              )}
            </div>

            <Button
              onClick={() => setShareDialogOpen(true)}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button
              onClick={() => setShowComments(!showComments)}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments ({comments.length})
            </Button>

            <Button
              onClick={previewQuiz}
              variant="outline"
              className="border-teal-200 text-teal-600 hover:bg-teal-50 bg-transparent"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => saveQuiz(false)}
              disabled={isSaving}
              variant="outline"
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button
              onClick={() => saveQuiz(true)}
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Publish Quiz
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-gray-200">
              <TabsTrigger value="config" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                Configuration
              </TabsTrigger>
              <TabsTrigger
                value="questions"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Questions ({questions.length})
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="collaborate"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Collaborate
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-emerald-600" />
                    Quiz Configuration
                  </CardTitle>
                  <CardDescription>Set up the basic information for your quiz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Quiz Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter quiz title"
                        value={quizConfig.title}
                        onChange={(e) => handleConfigChange("title", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select
                        value={quizConfig.subject}
                        onValueChange={(value) => handleConfigChange("subject", value)}
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
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this quiz covers"
                      value={quizConfig.description}
                      onChange={(e) => handleConfigChange("description", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic *</Label>
                      <Input
                        id="topic"
                        placeholder="e.g., Calculus, Photosynthesis, etc."
                        value={quizConfig.topic}
                        onChange={(e) => handleConfigChange("topic", e.target.value)}
                      />
                    </div>

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
                            </div>
                          </SelectItem>
                          <SelectItem value="intermediate">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Intermediate
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="advanced">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                Advanced
                              </Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={generateQuestions}
                      disabled={isGenerating || !quizConfig.subject || !quizConfig.topic}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating Questions...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Generate Questions with AI
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Quiz Questions</h2>
                <Button onClick={addQuestion} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {questions.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding questions manually or generate them using AI</p>
                    <div className="flex justify-center space-x-4">
                      <Button onClick={addQuestion} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Manually
                      </Button>
                      <Button
                        onClick={generateQuestions}
                        disabled={!quizConfig.subject || !quizConfig.topic}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Generate with AI
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="capitalize">
                              {question.type.replace("-", " ")}
                            </Badge>
                            <Badge variant="secondary">{question.points} pts</Badge>
                            <Button
                              onClick={() => removeQuestion(question.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value) => updateQuestion(question.id, { type: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                              <SelectItem value="true-false">True/False</SelectItem>
                              <SelectItem value="short-answer">Short Answer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Question Text</Label>
                          <Textarea
                            placeholder="Enter your question"
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                            rows={2}
                          />
                        </div>

                        {question.type === "multiple-choice" && (
                          <div className="space-y-3">
                            <Label>Answer Options</Label>
                            <RadioGroup
                              value={question.correctAnswer.toString()}
                              onValueChange={(value) =>
                                updateQuestion(question.id, { correctAnswer: Number.parseInt(value) })
                              }
                            >
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-3">
                                  <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-${optionIndex}`} />
                                  <Input
                                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || [])]
                                      newOptions[optionIndex] = e.target.value
                                      updateQuestion(question.id, { options: newOptions })
                                    }}
                                    className="flex-1"
                                  />
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        )}

                        {question.type === "true-false" && (
                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <RadioGroup
                              value={question.correctAnswer.toString()}
                              onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value })}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id={`${question.id}-true`} />
                                <Label htmlFor={`${question.id}-true`}>True</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id={`${question.id}-false`} />
                                <Label htmlFor={`${question.id}-false`}>False</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Points</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={question.points}
                              onChange={(e) =>
                                updateQuestion(question.id, { points: Number.parseInt(e.target.value) || 1 })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <Select
                              value={question.difficulty}
                              onValueChange={(value) => updateQuestion(question.id, { difficulty: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Explanation (Optional)</Label>
                          <Textarea
                            placeholder="Explain why this is the correct answer"
                            value={question.explanation}
                            onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quiz Settings</CardTitle>
                  <CardDescription>Configure timing, scoring, and availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Time Limit (minutes): {quizConfig.timeLimit}</Label>
                      <Slider
                        value={[quizConfig.timeLimit]}
                        onValueChange={(value) => handleConfigChange("timeLimit", value[0])}
                        max={120}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>5 min</span>
                        <span>120 min</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="datetime-local"
                        value={quizConfig.dueDate}
                        onChange={(e) => handleConfigChange("dueDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-emerald-800">Total Points</h4>
                        <p className="text-sm text-emerald-600">
                          {questions.reduce((sum, q) => sum + q.points, 0)} points from {questions.length} questions
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {questions.reduce((sum, q) => sum + q.points, 0)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="collaborate" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Collaborators Management */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Collaborators
                    </CardTitle>
                    <CardDescription>Manage who can edit this quiz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {collaborators.map((collaborator) => (
                        <div
                          key={collaborator.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                  {collaborator.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                  collaborator.status === "online" ? "bg-green-500" : "bg-gray-400"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{collaborator.name}</p>
                              <p className="text-sm text-gray-600">{collaborator.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={collaborator.role === "owner" ? "default" : "secondary"}>
                              {collaborator.role}
                            </Badge>
                            {collaborator.status === "online" && (
                              <div className="flex items-center space-x-1 text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs">Online</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter email address"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addCollaborator(e.target.value, "editor")
                              e.target.value = ""
                            }
                          }}
                        />
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Version History */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="w-5 h-5 mr-2 text-purple-600" />
                      Version History
                    </CardTitle>
                    <CardDescription>Track changes and restore previous versions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {versionHistory.length === 0 ? (
                          <div className="text-center py-8">
                            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">No version history yet</p>
                            <Button onClick={saveVersion} size="sm" className="mt-2">
                              Save Current Version
                            </Button>
                          </div>
                        ) : (
                          versionHistory.map((version) => (
                            <div
                              key={version.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-purple-600 text-white text-xs">
                                    {version.author.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">{version.changes}</p>
                                  <p className="text-xs text-gray-600">
                                    by {version.author.name} • {version.timestamp.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                Restore
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Comments Section */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                    Comments & Discussions
                  </CardTitle>
                  <CardDescription>Collaborate with your team on quiz content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No comments yet. Start a discussion!</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-green-600 text-white text-xs">
                              {comment.author.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900">{comment.author.name}</span>
                              <span className="text-xs text-gray-500">{comment.timestamp.toLocaleString()}</span>
                              {comment.questionId && (
                                <Badge variant="outline" className="text-xs">
                                  Question {questions.findIndex((q) => q.id === comment.questionId) + 1}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700">{comment.text}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button size="sm" variant="ghost" className="text-xs">
                                Reply
                              </Button>
                              {!comment.resolved && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs text-green-600"
                                  onClick={() => {
                                    setComments((prev) =>
                                      prev.map((c) => (c.id === comment.id ? { ...c, resolved: true } : c)),
                                    )
                                  }}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex space-x-2 pt-4 border-t">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addComment()
                        }
                      }}
                    />
                    <Button onClick={() => addComment()} disabled={!newComment.trim()}>
                      Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
