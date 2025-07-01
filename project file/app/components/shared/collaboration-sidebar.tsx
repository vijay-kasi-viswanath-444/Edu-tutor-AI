"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Users, MessageCircle, Clock, CheckCircle2, AlertCircle, Send, X, Minimize2, Maximize2 } from "lucide-react"

interface Collaborator {
  id: string
  name: string
  email: string
  avatar: string
  role: "owner" | "editor" | "viewer"
  status: "online" | "offline"
  lastSeen: Date
  cursor?: { x: number; y: number; color: string }
}

interface Comment {
  id: string
  text: string
  author: Collaborator
  questionId?: string
  timestamp: Date
  resolved: boolean
  replies?: Comment[]
}

interface Activity {
  id: string
  type: "edit" | "comment" | "join" | "leave"
  user: Collaborator
  timestamp: Date
  description: string
}

interface CollaborationSidebarProps {
  isOpen: boolean
  onToggle: () => void
  collaborators: Collaborator[]
  comments: Comment[]
  activities: Activity[]
  onAddComment: (text: string, questionId?: string) => void
  onResolveComment: (commentId: string) => void
  currentUser: Collaborator
}

export function CollaborationSidebar({
  isOpen,
  onToggle,
  collaborators,
  comments,
  activities,
  onAddComment,
  onResolveComment,
  currentUser,
}: CollaborationSidebarProps) {
  const [newComment, setNewComment] = useState("")
  const [activeTab, setActiveTab] = useState<"collaborators" | "comments" | "activity">("collaborators")
  const [isMinimized, setIsMinimized] = useState(false)

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  const unresolvedComments = comments.filter((c) => !c.resolved)
  const onlineCollaborators = collaborators.filter((c) => c.status === "online")

  if (!isOpen) return null

  return (
    <div
      className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-xl z-50 transition-all duration-300 ${
        isMinimized ? "w-16" : "w-80"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
        {!isMinimized && (
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-gray-800">Collaboration</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button onClick={onToggle} variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("collaborators")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "collaborators"
                  ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{onlineCollaborators.length}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === "comments"
                  ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{unresolvedComments.length}</span>
              </div>
              {unresolvedComments.length > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "activity"
                  ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "collaborators" && (
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-3">Online ({onlineCollaborators.length})</h3>
                    <div className="space-y-3">
                      {onlineCollaborators.map((collaborator) => (
                        <div key={collaborator.id} className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs">
                                {collaborator.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {collaborator.name}
                              {collaborator.id === currentUser.id && " (You)"}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={collaborator.role === "owner" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {collaborator.role}
                              </Badge>
                              {collaborator.cursor && (
                                <div className="flex items-center space-x-1">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: collaborator.cursor.color }}
                                  />
                                  <span className="text-xs text-gray-500">Editing</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {collaborators.filter((c) => c.status === "offline").length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-3">
                          Offline ({collaborators.filter((c) => c.status === "offline").length})
                        </h3>
                        <div className="space-y-3">
                          {collaborators
                            .filter((c) => c.status === "offline")
                            .map((collaborator) => (
                              <div key={collaborator.id} className="flex items-center space-x-3 opacity-60">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                  <AvatarFallback className="bg-gray-400 text-white text-xs">
                                    {collaborator.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-700 truncate">{collaborator.name}</p>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {collaborator.role}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      Last seen {collaborator.lastSeen.toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            )}

            {activeTab === "comments" && (
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No comments yet</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
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
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
                                <span className="text-xs text-gray-500">{comment.timestamp.toLocaleTimeString()}</span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{comment.text}</p>
                              <div className="flex items-center space-x-2">
                                {comment.questionId && (
                                  <Badge variant="outline" className="text-xs">
                                    Q{comment.questionId}
                                  </Badge>
                                )}
                                {!comment.resolved && (
                                  <Button
                                    onClick={() => onResolveComment(comment.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs text-green-600 hover:bg-green-50 p-1 h-auto"
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Resolve
                                  </Button>
                                )}
                                {comment.resolved && (
                                  <div className="flex items-center space-x-1 text-green-600">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span className="text-xs">Resolved</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Add Comment */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment()
                        }
                      }}
                      className="text-sm"
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No recent activity</p>
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {activity.user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user.name}</span> {activity.description}
                          </p>
                          <p className="text-xs text-gray-500">{activity.timestamp.toLocaleString()}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {activity.type === "edit" && <AlertCircle className="w-4 h-4 text-orange-500" />}
                          {activity.type === "comment" && <MessageCircle className="w-4 h-4 text-blue-500" />}
                          {activity.type === "join" && <Users className="w-4 h-4 text-green-500" />}
                          {activity.type === "leave" && <Users className="w-4 h-4 text-red-500" />}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="p-2 space-y-2">
          <div className="flex flex-col items-center space-y-1">
            <div className="relative">
              <Users className="w-6 h-6 text-emerald-600" />
              {onlineCollaborators.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">
                  {onlineCollaborators.length}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="relative">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              {unresolvedComments.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unresolvedComments.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
