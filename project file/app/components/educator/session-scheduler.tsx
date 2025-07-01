"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Video, ArrowLeft, Plus, Edit, Trash2, MapPin, Bell } from "lucide-react"
import type { User } from "../../page"

interface SessionSchedulerProps {
  user: User
  onBack: () => void
  addNotification: (message: string, type?: "info" | "success" | "warning" | "error") => void
}

interface Session {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  type: "live" | "recorded" | "hybrid"
  subject: string
  maxStudents: number
  enrolledStudents: number
  meetingLink?: string
  location?: string
}

export function SessionScheduler({ user, onBack, addNotification }: SessionSchedulerProps) {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      title: "Advanced Calculus Review",
      description: "Comprehensive review of integration techniques and applications",
      date: "2024-01-20",
      time: "14:00",
      duration: 90,
      type: "live",
      subject: "Mathematics",
      maxStudents: 25,
      enrolledStudents: 18,
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "2",
      title: "Quantum Physics Fundamentals",
      description: "Introduction to quantum mechanics principles and wave functions",
      date: "2024-01-22",
      time: "10:00",
      duration: 120,
      type: "hybrid",
      subject: "Physics",
      maxStudents: 20,
      enrolledStudents: 15,
      location: "Room 204, Physics Building",
    },
    {
      id: "3",
      title: "Data Structures Workshop",
      description: "Hands-on practice with trees, graphs, and advanced algorithms",
      date: "2024-01-25",
      time: "16:00",
      duration: 180,
      type: "live",
      subject: "Computer Science",
      maxStudents: 30,
      enrolledStudents: 22,
      meetingLink: "https://zoom.us/j/123456789",
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    type: "live" as "live" | "recorded" | "hybrid",
    subject: "",
    maxStudents: 25,
    meetingLink: "",
    location: "",
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateSession = () => {
    if (!formData.title || !formData.date || !formData.time || !formData.subject) {
      addNotification("Please fill in all required fields", "warning")
      return
    }

    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      enrolledStudents: 0,
    }

    setSessions((prev) => [...prev, newSession])
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 60,
      type: "live",
      subject: "",
      maxStudents: 25,
      meetingLink: "",
      location: "",
    })
    setShowCreateForm(false)
    addNotification("Session scheduled successfully!", "success")
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
    setFormData({
      title: session.title,
      description: session.description,
      date: session.date,
      time: session.time,
      duration: session.duration,
      type: session.type,
      subject: session.subject,
      maxStudents: session.maxStudents,
      meetingLink: session.meetingLink || "",
      location: session.location || "",
    })
    setShowCreateForm(true)
  }

  const handleUpdateSession = () => {
    if (!editingSession) return

    setSessions((prev) =>
      prev.map((session) => (session.id === editingSession.id ? { ...session, ...formData } : session)),
    )

    setEditingSession(null)
    setShowCreateForm(false)
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 60,
      type: "live",
      subject: "",
      maxStudents: 25,
      meetingLink: "",
      location: "",
    })
    addNotification("Session updated successfully!", "success")
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId))
    addNotification("Session deleted successfully!", "info")
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "live":
        return "bg-green-100 text-green-700"
      case "recorded":
        return "bg-blue-100 text-blue-700"
      case "hybrid":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "live":
        return <Video className="w-4 h-4" />
      case "recorded":
        return <Clock className="w-4 h-4" />
      case "hybrid":
        return <Users className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Session Scheduler</h1>
              <p className="text-gray-600">Schedule and manage live learning sessions</p>
            </div>
          </div>

          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session Form */}
          {showCreateForm && (
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-2xl sticky top-6">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-xl text-gray-800">
                    {editingSession ? "Edit Session" : "Schedule New Session"}
                  </CardTitle>
                  <CardDescription>
                    {editingSession ? "Update session details" : "Create a new learning session"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700 font-medium">
                      Session Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Advanced Calculus Review"
                      className="border-gray-200 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Brief description of the session content"
                      className="border-gray-200 focus:border-indigo-500 min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-700 font-medium">
                        Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="border-gray-200 focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-gray-700 font-medium">
                        Time *
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange("time", e.target.value)}
                        className="border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-gray-700 font-medium">
                        Duration (min)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value))}
                        min="30"
                        max="300"
                        step="15"
                        className="border-gray-200 focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxStudents" className="text-gray-700 font-medium">
                        Max Students
                      </Label>
                      <Input
                        id="maxStudents"
                        type="number"
                        value={formData.maxStudents}
                        onChange={(e) => handleInputChange("maxStudents", Number.parseInt(e.target.value))}
                        min="1"
                        max="100"
                        className="border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      Subject *
                    </Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger className="border-gray-200 focus:border-indigo-500">
                        <SelectValue placeholder="Choose subject" />
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

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-gray-700 font-medium">
                      Session Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "live" | "recorded" | "hybrid") => handleInputChange("type", value)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-indigo-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="live">
                          <div className="flex items-center space-x-2">
                            <Video className="w-4 h-4 text-green-600" />
                            <span>Live Online</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="hybrid">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span>Hybrid (Online + In-person)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="recorded">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>Recorded Session</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.type === "live" || formData.type === "hybrid") && (
                    <div className="space-y-2">
                      <Label htmlFor="meetingLink" className="text-gray-700 font-medium">
                        Meeting Link
                      </Label>
                      <Input
                        id="meetingLink"
                        value={formData.meetingLink}
                        onChange={(e) => handleInputChange("meetingLink", e.target.value)}
                        placeholder="https://meet.google.com/..."
                        className="border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {formData.type === "hybrid" && (
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700 font-medium">
                        Physical Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Room 204, Physics Building"
                        className="border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={editingSession ? handleUpdateSession : handleCreateSession}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      {editingSession ? "Update Session" : "Schedule Session"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false)
                        setEditingSession(null)
                        setFormData({
                          title: "",
                          description: "",
                          date: "",
                          time: "",
                          duration: 60,
                          type: "live",
                          subject: "",
                          maxStudents: 25,
                          meetingLink: "",
                          location: "",
                        })
                      }}
                      className="border-gray-300 text-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sessions List */}
          <div className={showCreateForm ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Scheduled Sessions</h2>
                <Badge variant="outline" className="border-indigo-200 text-indigo-600">
                  {sessions.length} sessions
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {sessions.map((session) => (
                  <Card key={session.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">{session.title}</h3>
                            <Badge variant="secondary" className={getTypeColor(session.type)}>
                              <div className="flex items-center space-x-1">
                                {getTypeIcon(session.type)}
                                <span className="capitalize">{session.type}</span>
                              </div>
                            </Badge>
                            <Badge variant="outline" className="border-purple-200 text-purple-600">
                              {session.subject}
                            </Badge>
                          </div>
                          {session.description && <p className="text-gray-600 mb-4">{session.description}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSession(session)}
                            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSession(session.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formatDate(session.date)}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {formatTime(session.time)} ({session.duration} min)
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {session.enrolledStudents}/{session.maxStudents} students
                          </span>
                        </div>

                        {session.location && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{session.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-[200px]">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${(session.enrolledStudents / session.maxStudents) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round((session.enrolledStudents / session.maxStudents) * 100)}% full
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {session.meetingLink && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                              onClick={() => {
                                navigator.clipboard.writeText(session.meetingLink!)
                                addNotification("Meeting link copied to clipboard!", "success")
                              }}
                            >
                              <Video className="w-4 h-4 mr-1" />
                              Copy Link
                            </Button>
                          )}

                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                            onClick={() => addNotification("Notification sent to all enrolled students!", "success")}
                          >
                            <Bell className="w-4 h-4 mr-1" />
                            Notify Students
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {sessions.length === 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-12 text-center">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Sessions Scheduled</h3>
                      <p className="text-gray-500 mb-6">Create your first learning session to get started</p>
                      <Button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule Your First Session
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
