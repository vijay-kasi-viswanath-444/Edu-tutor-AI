"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CollaborationSidebar } from "@/components/shared/collaboration-sidebar"
import { RealTimeCursors } from "@/components/shared/real-time-cursors"
import { LiveEditingIndicator } from "@/components/shared/live-editing-indicator"
import { ArrowLeft, Users, MessageCircle, Share2, Play, Save, Clock, CheckCircle2, AlertTriangle } from "lucide-react"

export default function CollaborativeQuizPage() {
  const params = useParams()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)

  const [collaborators] = useState([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@school.edu",
      avatar: "SJ",
      role: "owner" as const,
      status: "online" as const,
      lastSeen: new Date(),
      cursor: { x: 150, y: 200, color: "#3B82F6" },
    },
    {
      id: "2",
      name: "Prof. Michael Chen",
      email: "m.chen@school.edu",
      avatar: "MC",
      role: "editor" as const,
      status: "online" as const,
      lastSeen: new Date(),
      cursor: { x: 300, y: 150, color: "#10B981" },
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      email: "e.rodriguez@school.edu",
      avatar: "ER",
      role: "editor" as const,
      status: "offline" as const,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  ])

  const [comments, setComments] = useState([
    {
      id: "1",
      text: "Should we make this question more challenging?",
      author: collaborators[1],
      questionId: "q1",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      resolved: false,
    },
    {
      id: "2",
      text: "The explanation could be clearer here.",
      author: collaborators[0],
      questionId: "q2",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      resolved: false,
    },
  ])

  const [activities] = useState([
    {
      id: "1",
      type: "edit" as const,
      user: collaborators[1],
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      description: "edited Question 3",
    },
    {
      id: "2",
      type: "comment" as const,
      user: collaborators[0],
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      description: "commented on Question 2",
    },
    {
      id: "3",
      type: "join" as const,
      user: collaborators[1],
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      description: "joined the collaboration",
    },
  ])

  const currentUser = collaborators[0] // Simulate current user

  useEffect(() => {
    // Load quiz data
    const loadQuiz = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockQuiz = {
          id: params.id,
          title: "Advanced Calculus Quiz",
          subject: "Mathematics",
          topic: "Derivatives and Integrals",
          difficulty: "advanced",
          questions: [
            {
              id: "q1",
              question: "What is the derivative of x² + 3x + 2?",
              type: "multiple-choice",
              options: ["2x + 3", "x² + 3", "2x + 2", "x + 3"],
              correct: 0,
              explanation:
                "The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant is 0.",
            },
            {
              id: "q2",
              question: "What is the integral of 2x?",
              type: "multiple-choice",
              options: ["x² + C", "2x² + C", "x²/2 + C", "2x + C"],
              correct: 0,
              explanation: "The integral of 2x is x² + C, where C is the constant of integration.",
            },
          ],
          collaborators: collaborators.length,
          lastModified: new Date(),
          status: "draft",
        }

        setQuiz(mockQuiz)
      } catch (error) {
        console.error("Error loading quiz:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [params.id])

  const handleAddComment = (text: string, questionId?: string) => {
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      author: currentUser,
      questionId,
      timestamp: new Date(),
      resolved: false,
    }
    setComments((prev) => [newComment, ...prev])
  }

  const handleResolveComment = (commentId: string) => {
    setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, resolved: true } : comment)))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading collaborative quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 mb-4">
            The quiz you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.back()} className="bg-emerald-600 hover:bg-emerald-700">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Real-time cursors */}
      <RealTimeCursors collaborators={collaborators} currentUserId={currentUser.id} />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{quiz.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{quiz.subject}</span>
                  <span>•</span>
                  <span>{quiz.topic}</span>
                  <span>•</span>
                  <Badge variant="outline" className="capitalize">
                    {quiz.difficulty}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Live collaboration indicators */}
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {collaborators
                    .filter((c) => c.status === "online")
                    .slice(0, 3)
                    .map((collaborator) => (
                      <Avatar key={collaborator.id} className="w-8 h-8 border-2 border-white">
                        <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs">
                          {collaborator.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                </div>
                <span className="text-sm text-gray-600">
                  {collaborators.filter((c) => c.status === "online").length} online
                </span>
              </div>

              <Button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Collaborate
              </Button>

              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>

              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <Play className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className={`transition-all duration-300 ${sidebarOpen ? "mr-80" : "mr-0"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Quiz Status */}
            <Card className="mb-6 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-gray-800">Collaborative Editing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Last saved: {quiz.lastModified.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <LiveEditingIndicator collaborators={collaborators} currentUserId={currentUser.id} />
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {quiz.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <Card key={question.id} className="border-0 shadow-lg relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <LiveEditingIndicator
                          questionId={question.id}
                          collaborators={collaborators}
                          currentUserId={currentUser.id}
                        />
                        <Badge variant="outline" className="capitalize">
                          {question.type.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-lg text-gray-800">{question.question}</p>
                    </div>

                    {question.type === "multiple-choice" && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              optionIndex === question.correct
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-700">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span className="text-gray-800">{option}</span>
                              {optionIndex === question.correct && (
                                <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.explanation && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
                        <p className="text-blue-700">{question.explanation}</p>
                      </div>
                    )}

                    {/* Question-specific comments */}
                    {comments.filter((c) => c.questionId === question.id).length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Comments ({comments.filter((c) => c.questionId === question.id).length})
                        </h4>
                        <div className="space-y-2">
                          {comments
                            .filter((c) => c.questionId === question.id)
                            .map((comment) => (
                              <div
                                key={comment.id}
                                className={`p-3 rounded-lg border ${
                                  comment.resolved ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                                }`}
                              >
                                <div className="flex items-start space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="bg-emerald-600 text-white text-xs">
                                      {comment.author.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
                                      <span className="text-xs text-gray-500">
                                        {comment.timestamp.toLocaleTimeString()}
                                      </span>
                                      {comment.resolved && (
                                        <Badge variant="outline" className="text-xs text-green-600">
                                          Resolved
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-700">{comment.text}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Sidebar */}
      <CollaborationSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        collaborators={collaborators}
        comments={comments}
        activities={activities}
        onAddComment={handleAddComment}
        onResolveComment={handleResolveComment}
        currentUser={currentUser}
      />
    </div>
  )
}
