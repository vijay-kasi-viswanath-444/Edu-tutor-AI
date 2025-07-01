"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Cursor {
  id: string
  x: number
  y: number
  user: {
    name: string
    color: string
    avatar: string
  }
  lastUpdate: number
}

interface RealTimeCursorsProps {
  collaborators: Array<{
    id: string
    name: string
    avatar: string
    status: string
    cursor?: { x: number; y: number; color: string }
  }>
  currentUserId: string
}

export function RealTimeCursors({ collaborators, currentUserId }: RealTimeCursorsProps) {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Simulate sending cursor position to other users
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // In a real implementation, this would send to a WebSocket or real-time service
        console.log("Cursor position:", { x, y, userId: currentUserId })
      }
    }

    // Simulate receiving cursor updates from other users
    const simulateCursorUpdates = () => {
      const onlineCollaborators = collaborators.filter((c) => c.status === "online" && c.id !== currentUserId)

      const newCursors: Record<string, Cursor> = {}

      onlineCollaborators.forEach((collaborator) => {
        if (collaborator.cursor) {
          newCursors[collaborator.id] = {
            id: collaborator.id,
            x: collaborator.cursor.x,
            y: collaborator.cursor.y,
            user: {
              name: collaborator.name,
              color: collaborator.cursor.color,
              avatar: collaborator.avatar,
            },
            lastUpdate: Date.now(),
          }
        }
      })

      setCursors(newCursors)
    }

    document.addEventListener("mousemove", handleMouseMove)

    // Simulate cursor updates every 100ms
    const interval = setInterval(simulateCursorUpdates, 100)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      clearInterval(interval)
    }
  }, [collaborators, currentUserId])

  // Clean up old cursors
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now()
      setCursors((prev) => {
        const filtered: Record<string, Cursor> = {}
        Object.entries(prev).forEach(([id, cursor]) => {
          if (now - cursor.lastUpdate < 5000) {
            // Keep cursors for 5 seconds
            filtered[id] = cursor
          }
        })
        return filtered
      })
    }, 1000)

    return () => clearInterval(cleanup)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {Object.values(cursors).map((cursor) => (
          <motion.div
            key={cursor.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute pointer-events-none"
            style={{
              left: cursor.x,
              top: cursor.y,
              transform: "translate(-2px, -2px)",
            }}
          >
            {/* Cursor */}
            <div className="relative">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="drop-shadow-lg">
                <path d="M2 2L18 8L8 12L2 18V2Z" fill={cursor.user.color} stroke="white" strokeWidth="1" />
              </svg>

              {/* User label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-5 left-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg"
                style={{ backgroundColor: cursor.user.color }}
              >
                {cursor.user.name}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
