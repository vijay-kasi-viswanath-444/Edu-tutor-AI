"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { Edit3, Eye } from "lucide-react"

interface EditingUser {
  id: string
  name: string
  avatar: string
  color: string
  action: "editing" | "viewing"
  element?: string
}

interface LiveEditingIndicatorProps {
  questionId?: string
  collaborators: Array<{
    id: string
    name: string
    avatar: string
    status: string
    cursor?: { x: number; y: number; color: string }
  }>
  currentUserId: string
}

export function LiveEditingIndicator({ questionId, collaborators, currentUserId }: LiveEditingIndicatorProps) {
  const [editingUsers, setEditingUsers] = useState<EditingUser[]>([])

  useEffect(() => {
    // Simulate live editing detection
    const activeUsers = collaborators
      .filter((c) => c.status === "online" && c.id !== currentUserId)
      .map((c) => ({
        id: c.id,
        name: c.name,
        avatar: c.avatar,
        color: c.cursor?.color || "#3B82F6",
        action: Math.random() > 0.7 ? ("editing" as const) : ("viewing" as const),
        element: questionId ? `question-${questionId}` : undefined,
      }))

    setEditingUsers(activeUsers)

    // Update every 2 seconds to simulate real-time changes
    const interval = setInterval(() => {
      const updatedUsers = activeUsers.map((user) => ({
        ...user,
        action: Math.random() > 0.6 ? ("editing" as const) : ("viewing" as const),
      }))
      setEditingUsers(updatedUsers)
    }, 2000)

    return () => clearInterval(interval)
  }, [collaborators, currentUserId, questionId])

  const editingCount = editingUsers.filter((u) => u.action === "editing").length
  const viewingCount = editingUsers.filter((u) => u.action === "viewing").length

  if (editingUsers.length === 0) return null

  return (
    <div className="flex items-center space-x-2">
      <AnimatePresence>
        {editingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-1"
          >
            <div className="flex -space-x-1">
              {editingUsers
                .filter((u) => u.action === "editing")
                .slice(0, 3)
                .map((user) => (
                  <motion.div key={user.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
                    <Avatar className="w-6 h-6 border-2 border-white">
                      <AvatarFallback className="text-xs text-white" style={{ backgroundColor: user.color }}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white flex items-center justify-center">
                      <Edit3 className="w-2 h-2 text-white" />
                    </div>
                  </motion.div>
                ))}
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
              <Edit3 className="w-3 h-3 mr-1" />
              {editingCount} editing
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-1"
          >
            <Badge variant="outline" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              {viewingCount} viewing
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
