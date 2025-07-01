"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface PerformanceChartProps {
  data: Array<{
    date: string
    [key: string]: string | number
  }>
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const colors = {
    Mathematics: "#8b5cf6",
    Physics: "#6366f1",
    "Computer Science": "#3b82f6",
    "Class Average": "#10b981",
    "Top Performers": "#f59e0b",
    "Struggling Students": "#ef4444",
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Performance Analytics
        </CardTitle>
        <CardDescription>Weekly performance trends across subjects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              {Object.keys(data[0] || {})
                .filter((key) => key !== "date")
                .map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[key as keyof typeof colors] || "#64748b"}
                    strokeWidth={2}
                    dot={{ fill: colors[key as keyof typeof colors] || "#64748b", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors[key as keyof typeof colors] || "#64748b", strokeWidth: 2 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
