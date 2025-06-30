"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Brain, Target, BookOpen, Zap, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DiagnosticPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<{ [key: string]: any }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)

  const diagnosticSteps = [
    {
      id: "subjects",
      title: "Subject Preferences",
      description: "Select the subjects you want to focus on",
      type: "multiple-choice",
      question: "Which subjects are you most interested in learning?",
      options: [
        { id: "math", label: "Mathematics", icon: "📐" },
        { id: "physics", label: "Physics", icon: "⚛️" },
        { id: "chemistry", label: "Chemistry", icon: "🧪" },
        { id: "biology", label: "Biology", icon: "🧬" },
        { id: "computer-science", label: "Computer Science", icon: "💻" },
        { id: "english", label: "English Literature", icon: "📚" },
      ],
    },
    {
      id: "level",
      title: "Academic Level",
      description: "Help us understand your current academic level",
      type: "single-choice",
      question: "What is your current academic level?",
      options: [
        { id: "high-school", label: "High School (9-12)", description: "Grades 9-12" },
        { id: "undergraduate", label: "Undergraduate", description: "Bachelor's degree level" },
        { id: "graduate", label: "Graduate", description: "Master's or PhD level" },
        { id: "professional", label: "Professional Development", description: "Continuing education" },
      ],
    },
    {
      id: "learning-style",
      title: "Learning Preferences",
      description: "Tell us how you learn best",
      type: "single-choice",
      question: "Which learning style suits you best?",
      options: [
        { id: "visual", label: "Visual Learner", description: "Learn through diagrams, charts, and images" },
        { id: "auditory", label: "Auditory Learner", description: "Learn through listening and discussion" },
        { id: "kinesthetic", label: "Kinesthetic Learner", description: "Learn through hands-on activities" },
        { id: "reading", label: "Reading/Writing", description: "Learn through text and written materials" },
      ],
    },
    {
      id: "math-assessment",
      title: "Mathematics Assessment",
      description: "Quick assessment of your math skills",
      type: "quiz",
      questions: [
        {
          question: "Solve: 2x + 5 = 13",
          options: ["x = 4", "x = 6", "x = 8", "x = 9"],
          correct: 0,
          difficulty: "basic",
        },
        {
          question: "What is the derivative of x²?",
          options: ["x", "2x", "x²", "2x²"],
          correct: 1,
          difficulty: "intermediate",
        },
        {
          question: "Evaluate: ∫(3x² + 2x)dx",
          options: ["x³ + x² + C", "6x + 2 + C", "x³ + x² + C", "3x³ + x² + C"],
          correct: 0,
          difficulty: "advanced",
        },
      ],
    },
  ]

  const handleResponse = (stepId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [stepId]: value,
    }))
  }

  const nextStep = () => {
    if (currentStep < diagnosticSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeAssessment()
    }
  }

  const completeAssessment = () => {
    // Simulate AI analysis of responses
    const analysisResults = {
      recommendedLevel: "Intermediate",
      strongSubjects: ["Computer Science", "Mathematics"],
      focusAreas: ["Physics concepts", "Advanced calculus"],
      learningPath: [
        { subject: "Mathematics", topics: ["Differential Equations", "Linear Algebra"], difficulty: "Intermediate" },
        { subject: "Physics", topics: ["Mechanics", "Thermodynamics"], difficulty: "Beginner" },
        { subject: "Computer Science", topics: ["Algorithms", "Data Structures"], difficulty: "Advanced" },
      ],
      adaptiveSettings: {
        quizDifficulty: "adaptive",
        questionTypes: ["multiple-choice", "problem-solving"],
        feedbackLevel: "detailed",
      },
    }

    setResults(analysisResults)
    setIsCompleted(true)
  }

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">Diagnostic Complete</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Results Header */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">Your Personalized Learning Profile</CardTitle>
                <CardDescription>
                  Based on your responses, we've created a customized learning experience just for you
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Recommended Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Recommended Starting Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">{results.recommendedLevel}</Badge>
                  <p className="text-gray-600">
                    This level will provide the right balance of challenge and support for your learning journey.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Subject Strengths */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.strongSubjects.map((subject: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="font-medium">{subject}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertCircle className="h-5 w-5" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.focusAreas.map((area: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        <span className="font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Path */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Your Personalized Learning Path
                </CardTitle>
                <CardDescription>AI-curated topics and difficulty levels based on your assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.learningPath.map((path: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{path.subject}</h3>
                        <Badge
                          className={
                            path.difficulty === "Advanced"
                              ? "bg-red-100 text-red-800"
                              : path.difficulty === "Intermediate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {path.difficulty}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {path.topics.map((topic: string, topicIndex: number) => (
                          <Badge key={topicIndex} variant="outline" className="bg-white text-gray-700">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/student")} className="bg-blue-600 text-white px-8 py-3">
                Start Learning Journey
              </Button>
              <Button variant="outline" onClick={() => window.print()} className="bg-white text-gray-700 px-8 py-3">
                Save Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentStepData = diagnosticSteps[currentStep]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">Diagnostic Assessment</span>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Step {currentStep + 1} of {diagnosticSteps.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Assessment Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentStep + 1) / diagnosticSteps.length) * 100)}% Complete
              </span>
            </div>
            <Progress value={((currentStep + 1) / diagnosticSteps.length) * 100} className="h-2" />
          </div>

          {/* Current Step */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-medium">{currentStepData.question}</h3>

              {currentStepData.type === "multiple-choice" && (
                <div className="grid md:grid-cols-2 gap-3">
                  {currentStepData.options?.map((option: any) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={responses[currentStepData.id]?.includes(option.id) || false}
                        onCheckedChange={(checked) => {
                          const current = responses[currentStepData.id] || []
                          if (checked) {
                            handleResponse(currentStepData.id, [...current, option.id])
                          } else {
                            handleResponse(
                              currentStepData.id,
                              current.filter((id: string) => id !== option.id),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={option.id} className="flex items-center gap-2 cursor-pointer">
                        <span className="text-lg">{option.icon}</span>
                        <span>{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {currentStepData.type === "single-choice" && (
                <RadioGroup
                  value={responses[currentStepData.id] || ""}
                  onValueChange={(value) => handleResponse(currentStepData.id, value)}
                  className="space-y-3"
                >
                  {currentStepData.options?.map((option: any) => (
                    <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          {option.description && <div className="text-sm text-gray-600">{option.description}</div>}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentStepData.type === "quiz" && (
                <div className="space-y-6">
                  {currentStepData.questions?.map((question: any, qIndex: number) => (
                    <Card key={qIndex} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Question {qIndex + 1}: {question.question}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit bg-white text-gray-700">
                          {question.difficulty}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={responses[`${currentStepData.id}-${qIndex}`] || ""}
                          onValueChange={(value) => handleResponse(`${currentStepData.id}-${qIndex}`, value)}
                          className="space-y-2"
                        >
                          {question.options.map((option: string, oIndex: number) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`q${qIndex}-o${oIndex}`} />
                              <Label htmlFor={`q${qIndex}-o${oIndex}`} className="cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="bg-white text-gray-700"
                >
                  Previous
                </Button>

                <Button onClick={nextStep} disabled={!responses[currentStepData.id]} className="bg-blue-600 text-white">
                  {currentStep === diagnosticSteps.length - 1 ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Complete Assessment
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
