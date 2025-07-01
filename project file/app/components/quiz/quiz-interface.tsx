"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Clock,
  Brain,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  Zap,
  Calculator,
  Atom,
  Code,
  Trophy,
} from "lucide-react"

interface QuizInterfaceProps {
  user: any
  onBack: () => void
  addNotification: (message: string, type?: "info" | "success" | "warning" | "error") => void
}

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: string
  topic: string
  subject: string
}

const subjectThemes = {
  Mathematics: {
    color: "emerald",
    icon: Calculator,
    gradient: "from-emerald-500 to-emerald-600",
    bgGradient: "from-emerald-50 to-emerald-100",
  },
  Physics: {
    color: "teal",
    icon: Atom,
    gradient: "from-teal-500 to-teal-600",
    bgGradient: "from-teal-50 to-teal-100",
  },
  "Computer Science": {
    color: "green",
    icon: Code,
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100",
  },
}

// Mock quiz data for different subjects and topics
const mockQuizData = {
  Mathematics: {
    Calculus: [
      {
        question: "What is the derivative of x² + 3x + 2?",
        options: ["2x + 3", "x² + 3", "2x + 2", "x + 3"],
        correct: 0,
        explanation:
          "The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant is 0. So the answer is 2x + 3.",
      },
      {
        question: "What is the integral of 2x?",
        options: ["x² + C", "2x² + C", "x²/2 + C", "2x + C"],
        correct: 0,
        explanation: "The integral of 2x is x² + C, where C is the constant of integration.",
      },
      {
        question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
        options: ["0", "1", "2", "undefined"],
        correct: 2,
        explanation:
          "Factor the numerator: (x² - 1) = (x + 1)(x - 1). Cancel (x - 1) terms to get x + 1. As x approaches 1, the limit is 1 + 1 = 2.",
      },
      {
        question: "What is the second derivative of x³?",
        options: ["3x²", "6x", "x²", "3x"],
        correct: 1,
        explanation: "The first derivative of x³ is 3x². The second derivative is the derivative of 3x², which is 6x.",
      },
      {
        question: "What is the chain rule formula?",
        options: [
          "(f + g)' = f' + g'",
          "(fg)' = f'g + fg'",
          "(f(g(x)))' = f'(g(x)) · g'(x)",
          "(f/g)' = (f'g - fg')/g²",
        ],
        correct: 2,
        explanation:
          "The chain rule states that the derivative of a composite function f(g(x)) is f'(g(x)) multiplied by g'(x).",
      },
    ],
    Algebra: [
      {
        question: "Solve for x: 2x + 5 = 13",
        options: ["x = 4", "x = 6", "x = 8", "x = 9"],
        correct: 0,
        explanation: "Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4.",
      },
      {
        question: "What is the quadratic formula?",
        options: [
          "x = -b ± √(b² - 4ac) / 2a",
          "x = b ± √(b² + 4ac) / 2a",
          "x = -b ± √(b² + 4ac) / a",
          "x = b ± √(b² - 4ac) / a",
        ],
        correct: 0,
        explanation: "The quadratic formula for ax² + bx + c = 0 is x = (-b ± √(b² - 4ac)) / 2a.",
      },
      {
        question: "Factor x² - 9",
        options: ["(x - 3)(x - 3)", "(x + 3)(x + 3)", "(x - 3)(x + 3)", "Cannot be factored"],
        correct: 2,
        explanation: "This is a difference of squares: x² - 9 = x² - 3² = (x - 3)(x + 3).",
      },
      {
        question: "What is the slope of the line y = 3x + 2?",
        options: ["2", "3", "5", "1"],
        correct: 1,
        explanation: "In the slope-intercept form y = mx + b, the coefficient of x (which is 3) represents the slope.",
      },
      {
        question: "Simplify: (x²)³",
        options: ["x⁵", "x⁶", "x⁹", "3x²"],
        correct: 1,
        explanation: "When raising a power to a power, multiply the exponents: (x²)³ = x^(2×3) = x⁶.",
      },
    ],
    Geometry: [
      {
        question: "What is the area of a circle with radius 5?",
        options: ["10π", "25π", "5π", "50π"],
        correct: 1,
        explanation: "The area of a circle is πr². With radius 5, the area is π(5)² = 25π.",
      },
      {
        question: "What is the sum of interior angles in a triangle?",
        options: ["90°", "180°", "270°", "360°"],
        correct: 1,
        explanation: "The sum of interior angles in any triangle is always 180°.",
      },
      {
        question: "What is the Pythagorean theorem?",
        options: ["a + b = c", "a² + b² = c²", "a × b = c", "a² - b² = c²"],
        correct: 1,
        explanation:
          "The Pythagorean theorem states that in a right triangle, a² + b² = c², where c is the hypotenuse.",
      },
      {
        question: "What is the volume of a cube with side length 3?",
        options: ["9", "18", "27", "12"],
        correct: 2,
        explanation: "The volume of a cube is side³. With side length 3, the volume is 3³ = 27.",
      },
      {
        question: "How many sides does a hexagon have?",
        options: ["5", "6", "7", "8"],
        correct: 1,
        explanation: "A hexagon is a polygon with 6 sides. The prefix 'hex' means six.",
      },
    ],
  },
  Physics: {
    Mechanics: [
      {
        question: "What is Newton's second law of motion?",
        options: ["F = ma", "E = mc²", "v = u + at", "P = mv"],
        correct: 0,
        explanation: "Newton's second law states that Force equals mass times acceleration (F = ma).",
      },
      {
        question: "What is the unit of force in the SI system?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correct: 0,
        explanation: "The Newton (N) is the SI unit of force, defined as kg⋅m/s².",
      },
      {
        question: "What is the acceleration due to gravity on Earth?",
        options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11.2 m/s²"],
        correct: 0,
        explanation: "The standard acceleration due to gravity on Earth is approximately 9.8 m/s².",
      },
      {
        question: "What is kinetic energy?",
        options: [
          "Energy due to position",
          "Energy due to motion",
          "Energy due to temperature",
          "Energy due to pressure",
        ],
        correct: 1,
        explanation: "Kinetic energy is the energy an object possesses due to its motion, calculated as KE = ½mv².",
      },
      {
        question: "What is the formula for momentum?",
        options: ["p = mv", "p = ma", "p = Ft", "p = mgh"],
        correct: 0,
        explanation: "Momentum is defined as the product of mass and velocity: p = mv.",
      },
    ],
    Thermodynamics: [
      {
        question: "What is the first law of thermodynamics?",
        options: [
          "Energy cannot be created or destroyed",
          "Entropy always increases",
          "Heat flows from hot to cold",
          "PV = nRT",
        ],
        correct: 0,
        explanation:
          "The first law of thermodynamics states that energy cannot be created or destroyed, only transformed from one form to another.",
      },
      {
        question: "What is absolute zero?",
        options: ["-273.15°C", "0°C", "-100°C", "-200°C"],
        correct: 0,
        explanation:
          "Absolute zero is -273.15°C (or 0 Kelvin), the theoretical temperature at which all molecular motion stops.",
      },
      {
        question: "What is heat capacity?",
        options: [
          "Amount of heat needed to raise temperature by 1°C",
          "Maximum temperature an object can reach",
          "Rate of heat transfer",
          "Amount of heat an object contains",
        ],
        correct: 0,
        explanation:
          "Heat capacity is the amount of heat energy required to raise the temperature of an object by 1°C.",
      },
      {
        question: "What is an isothermal process?",
        options: ["Constant temperature", "Constant pressure", "Constant volume", "Constant entropy"],
        correct: 0,
        explanation: "An isothermal process occurs at constant temperature throughout the process.",
      },
      {
        question: "What is entropy?",
        options: ["Measure of disorder", "Amount of energy", "Rate of change", "Temperature difference"],
        correct: 0,
        explanation: "Entropy is a measure of the disorder or randomness in a system.",
      },
    ],
    Electromagnetism: [
      {
        question: "What is Ohm's law?",
        options: ["V = IR", "P = IV", "F = qE", "B = μI"],
        correct: 0,
        explanation: "Ohm's law states that voltage equals current times resistance: V = IR.",
      },
      {
        question: "What is the unit of electric current?",
        options: ["Ampere", "Volt", "Ohm", "Watt"],
        correct: 0,
        explanation: "The Ampere (A) is the SI unit of electric current.",
      },
      {
        question: "What creates a magnetic field?",
        options: ["Moving electric charges", "Static electric charges", "Gravitational force", "Nuclear force"],
        correct: 0,
        explanation: "Moving electric charges (electric current) create magnetic fields.",
      },
      {
        question: "What is electromagnetic induction?",
        options: [
          "Generation of EMF by changing magnetic field",
          "Attraction between magnets",
          "Flow of electric current",
          "Storage of electric charge",
        ],
        correct: 0,
        explanation:
          "Electromagnetic induction is the generation of electromotive force (EMF) by changing magnetic fields.",
      },
      {
        question: "What is the speed of light in vacuum?",
        options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"],
        correct: 0,
        explanation: "The speed of light in vacuum is approximately 3 × 10⁸ meters per second.",
      },
    ],
  },
  "Computer Science": {
    Algorithms: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1,
        explanation:
          "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
      },
      {
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
        correct: 1,
        explanation:
          "Quick Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting.",
      },
      {
        question: "What is a greedy algorithm?",
        options: [
          "Always chooses the locally optimal solution",
          "Uses dynamic programming",
          "Explores all possible solutions",
          "Uses recursion",
        ],
        correct: 0,
        explanation:
          "A greedy algorithm makes the locally optimal choice at each step, hoping to find a global optimum.",
      },
      {
        question: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct: 2,
        explanation: "Merge sort requires O(n) additional space for the temporary arrays used during merging.",
      },
      {
        question: "What is dynamic programming?",
        options: [
          "Breaking problems into overlapping subproblems",
          "Using loops instead of recursion",
          "Optimizing memory usage",
          "Parallel processing",
        ],
        correct: 0,
        explanation:
          "Dynamic programming solves problems by breaking them into overlapping subproblems and storing results to avoid redundant calculations.",
      },
    ],
    "Data Structures": [
      {
        question: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct: 1,
        explanation: "A stack follows the Last In, First Out (LIFO) principle.",
      },
      {
        question: "What is the average time complexity for searching in a hash table?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct: 0,
        explanation: "Hash tables provide O(1) average-case time complexity for search, insert, and delete operations.",
      },
      {
        question: "What is a binary tree?",
        options: [
          "Tree with exactly 2 nodes",
          "Tree where each node has at most 2 children",
          "Tree with 2 levels",
          "Tree with 2 roots",
        ],
        correct: 1,
        explanation:
          "A binary tree is a tree data structure where each node has at most two children, referred to as left and right child.",
      },
      {
        question: "What is the main advantage of a linked list over an array?",
        options: ["Faster access to elements", "Dynamic size", "Better cache performance", "Less memory usage"],
        correct: 1,
        explanation:
          "Linked lists can grow or shrink during runtime, providing dynamic size allocation unlike fixed-size arrays.",
      },
      {
        question: "What is a heap?",
        options: ["A sorted array", "A complete binary tree with heap property", "A hash table", "A linked list"],
        correct: 1,
        explanation:
          "A heap is a complete binary tree where each parent node satisfies the heap property (min-heap or max-heap).",
      },
    ],
    Programming: [
      {
        question: "What is recursion in programming?",
        options: ["A loop structure", "A function calling itself", "A data type", "A sorting algorithm"],
        correct: 1,
        explanation: "Recursion is a programming technique where a function calls itself to solve a problem.",
      },
      {
        question: "What is object-oriented programming?",
        options: [
          "Programming with objects and classes",
          "Programming with functions only",
          "Programming with arrays",
          "Programming with loops",
        ],
        correct: 0,
        explanation:
          "Object-oriented programming is a paradigm based on objects and classes, featuring encapsulation, inheritance, and polymorphism.",
      },
      {
        question: "What is the difference between '==' and '===' in JavaScript?",
        options: [
          "No difference",
          "'==' checks type and value, '===' checks only value",
          "'==' checks only value, '===' checks type and value",
          "Both are assignment operators",
        ],
        correct: 2,
        explanation:
          "'==' performs type coercion and compares values, while '===' compares both type and value without coercion.",
      },
      {
        question: "What is a variable scope?",
        options: [
          "Variable's data type",
          "Variable's memory location",
          "Region where variable is accessible",
          "Variable's initial value",
        ],
        correct: 2,
        explanation:
          "Variable scope refers to the region of code where a variable is accessible and can be referenced.",
      },
      {
        question: "What is polymorphism?",
        options: [
          "Having multiple forms",
          "Using multiple variables",
          "Creating multiple functions",
          "Defining multiple classes",
        ],
        correct: 0,
        explanation:
          "Polymorphism allows objects of different types to be treated as instances of the same type through a common interface.",
      },
    ],
  },
}

export function QuizInterface({ user, onBack, addNotification }: QuizInterfaceProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])

  const topics = {
    Mathematics: ["Calculus", "Algebra", "Geometry", "Statistics", "Trigonometry", "Linear Algebra"],
    Physics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Quantum Physics", "Optics", "Nuclear Physics"],
    "Computer Science": [
      "Algorithms",
      "Data Structures",
      "Programming",
      "Database Systems",
      "Machine Learning",
      "Software Engineering",
    ],
  }

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && quizStarted && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quizStarted) {
      handleQuizComplete()
    }
  }, [timeLeft, quizStarted, quizCompleted])

  const generateQuiz = async () => {
    if (!selectedSubject || !selectedTopic || !selectedDifficulty) {
      addNotification("Please select subject, topic, and difficulty level", "warning")
      return
    }

    setIsGenerating(true)
    addNotification("Generating personalized quiz...", "info")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Get questions from mock data
      const subjectData = mockQuizData[selectedSubject as keyof typeof mockQuizData]
      const topicQuestions = subjectData?.[selectedTopic as keyof typeof subjectData] || []

      if (topicQuestions.length === 0) {
        // Fallback to general questions if specific topic not found
        const fallbackQuestions = [
          {
            question: `What is a fundamental concept in ${selectedTopic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct: 0,
            explanation: `This is a basic concept in ${selectedTopic} that forms the foundation for more advanced topics.`,
          },
          {
            question: `Which principle is most important in ${selectedTopic}?`,
            options: ["Principle 1", "Principle 2", "Principle 3", "Principle 4"],
            correct: 1,
            explanation: `This principle is crucial for understanding ${selectedTopic} applications.`,
          },
          {
            question: `How is ${selectedTopic} applied in real-world scenarios?`,
            options: ["Application A", "Application B", "Application C", "Application D"],
            correct: 2,
            explanation: `${selectedTopic} has many practical applications in various fields.`,
          },
          {
            question: `What is the relationship between ${selectedTopic} and other areas of ${selectedSubject}?`,
            options: ["Relationship 1", "Relationship 2", "Relationship 3", "Relationship 4"],
            correct: 0,
            explanation: `${selectedTopic} connects to many other areas within ${selectedSubject}.`,
          },
          {
            question: `What are the key challenges in mastering ${selectedTopic}?`,
            options: ["Challenge A", "Challenge B", "Challenge C", "Challenge D"],
            correct: 3,
            explanation: `Understanding these challenges helps in better learning ${selectedTopic}.`,
          },
        ]

        const formattedQuestions: Question[] = fallbackQuestions.map((q, index) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation,
          difficulty: selectedDifficulty,
          topic: selectedTopic,
          subject: selectedSubject,
        }))

        setQuestions(formattedQuestions)
      } else {
        // Use actual mock data
        const selectedQuestions = topicQuestions.slice(0, 5) // Take first 5 questions
        const formattedQuestions: Question[] = selectedQuestions.map((q, index) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation,
          difficulty: selectedDifficulty,
          topic: selectedTopic,
          subject: selectedSubject,
        }))

        setQuestions(formattedQuestions)
      }

      setTimeLeft(300) // 5 minutes
      setQuizStarted(true)
      setAnswers(new Array(5).fill(-1))
      addNotification("Quiz generated successfully! Good luck!", "success")
    } catch (error) {
      console.error("Error generating quiz:", error)
      addNotification("Failed to generate quiz. Please try again.", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleSubmitAnswer = () => {
    setShowFeedback(true)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = Number.parseInt(selectedAnswer)
    setAnswers(newAnswers)

    if (Number.parseInt(selectedAnswer) === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setShowFeedback(false)
    } else {
      handleQuizComplete()
    }
  }

  const handleQuizComplete = () => {
    setQuizCompleted(true)
    const finalScore = Math.round((score / questions.length) * 100)

    // Save quiz result
    const quizResult = {
      id: Math.random().toString(36).substr(2, 9),
      subject: selectedSubject,
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      score: finalScore,
      correctAnswers: score,
      totalQuestions: questions.length,
      timeSpent: 300 - timeLeft,
      completedAt: new Date().toISOString(),
      answers: answers,
    }

    const quizHistory = JSON.parse(localStorage.getItem("quiz_history") || "[]")
    quizHistory.unshift(quizResult)
    localStorage.setItem("quiz_history", JSON.stringify(quizHistory.slice(0, 50)))

    addNotification(
      `Quiz completed! You scored ${finalScore}%`,
      finalScore >= 80 ? "success" : finalScore >= 60 ? "info" : "warning",
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "bg-red-100 text-red-700"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-green-100 text-green-700"
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const currentTheme = selectedSubject
    ? subjectThemes[selectedSubject as keyof typeof subjectThemes]
    : subjectThemes.Mathematics

  // Quiz Setup Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Badge className="bg-emerald-100 text-emerald-800">AI-Powered Quiz Generator</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quiz Setup */}
            <Card className="border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Create Your Quiz</CardTitle>
                    <CardDescription>Personalized AI-generated questions</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 font-medium">
                    Subject
                  </Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">
                        <div className="flex items-center space-x-2">
                          <Calculator className="w-4 h-4 text-emerald-600" />
                          <span>Mathematics</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Physics">
                        <div className="flex items-center space-x-2">
                          <Atom className="w-4 h-4 text-teal-600" />
                          <span>Physics</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Computer Science">
                        <div className="flex items-center space-x-2">
                          <Code className="w-4 h-4 text-green-600" />
                          <span>Computer Science</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedSubject && (
                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-gray-700 font-medium">
                      Topic
                    </Label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics[selectedSubject as keyof typeof topics]?.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-gray-700 font-medium">
                    Difficulty Level
                  </Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                      <SelectValue placeholder="Choose difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span>Beginner - Basic concepts</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Intermediate">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span>Intermediate - Moderate challenge</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Advanced">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span>Advanced - Complex problems</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateQuiz}
                  disabled={isGenerating || !selectedSubject || !selectedTopic || !selectedDifficulty}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg py-6 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-pulse" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview/Info */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <Target className="w-5 h-5 mr-2 text-emerald-600" />
                    Quiz Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                    <Brain className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="font-medium text-emerald-800">Smart Questions</h4>
                      <p className="text-sm text-emerald-600">Curated questions tailored to your level</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
                    <Clock className="w-5 h-5 text-teal-600" />
                    <div>
                      <h4 className="font-medium text-teal-800">Timed Assessment</h4>
                      <p className="text-sm text-teal-600">5 minutes to complete 5 questions</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800">Instant Feedback</h4>
                      <p className="text-sm text-green-600">Detailed explanations for each answer</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-cyan-50 rounded-lg">
                    <Trophy className="w-5 h-5 text-cyan-600" />
                    <div>
                      <h4 className="font-medium text-cyan-800">Performance Tracking</h4>
                      <p className="text-sm text-cyan-600">Track your progress over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {user.diagnosticResults && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-800">Your Learning Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Learning Level:</span>
                        <Badge className="bg-emerald-100 text-emerald-800 capitalize">
                          {user.diagnosticResults.learningLevel}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Overall Score:</span>
                        <span className="font-semibold text-gray-800">{user.diagnosticResults.overallScore}%</span>
                      </div>
                      {user.diagnosticResults.strengths?.length > 0 && (
                        <div>
                          <span className="text-gray-600 text-sm">Strengths:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.diagnosticResults.strengths.map((strength: string) => (
                              <Badge
                                key={strength}
                                variant="outline"
                                className="text-xs border-green-200 text-green-700"
                              >
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Completed Screen
  if (quizCompleted) {
    const finalScore = Math.round((score / questions.length) * 100)
    const IconComponent = currentTheme.icon

    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <Card className="w-full max-w-3xl border-0 shadow-2xl">
          <CardHeader className={`text-center bg-gradient-to-r ${currentTheme.bgGradient} rounded-t-lg`}>
            <div
              className={`w-20 h-20 bg-gradient-to-r ${currentTheme.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
            >
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-gray-800">Quiz Completed!</CardTitle>
            <CardDescription className="text-lg">
              {selectedSubject} - {selectedTopic}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 text-center space-y-8">
            <div className="space-y-4">
              <div className={`text-7xl font-bold ${getScoreColor(finalScore)}`}>{finalScore}%</div>
              <p className="text-xl text-gray-600">
                You scored {score} out of {questions.length} questions correctly
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{questions.length - score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{formatTime(300 - timeLeft)}</div>
                <div className="text-sm text-gray-600">Time Used</div>
              </div>
            </div>

            {/* Performance Feedback */}
            <div
              className={`p-6 rounded-lg ${finalScore >= 80 ? "bg-green-50 border border-green-200" : finalScore >= 60 ? "bg-yellow-50 border border-yellow-200" : "bg-red-50 border border-red-200"}`}
            >
              <h3
                className={`font-semibold mb-2 ${finalScore >= 80 ? "text-green-800" : finalScore >= 60 ? "text-yellow-800" : "text-red-800"}`}
              >
                {finalScore >= 80
                  ? "🎉 Excellent Performance!"
                  : finalScore >= 60
                    ? "👍 Good Job!"
                    : "💪 Keep Practicing!"}
              </h3>
              <p
                className={`text-sm ${finalScore >= 80 ? "text-green-700" : finalScore >= 60 ? "text-yellow-700" : "text-red-700"}`}
              >
                {finalScore >= 80
                  ? "Outstanding work! You have a strong grasp of this topic. Consider trying more advanced questions."
                  : finalScore >= 60
                    ? "Good progress! Review the explanations and practice similar questions to improve further."
                    : "This topic needs more attention. Review the fundamentals and try easier questions first."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onBack}
                className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-8`}
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => {
                  setQuizStarted(false)
                  setQuizCompleted(false)
                  setCurrentQuestion(0)
                  setScore(0)
                  setSelectedAnswer("")
                  setShowFeedback(false)
                  setAnswers([])
                }}
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-8"
              >
                Take Another Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Quiz Taking Screen
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const IconComponent = currentTheme.icon

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Quiz
          </Button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-orange-800">{formatTime(timeLeft)}</span>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Quiz Progress</span>
              <span className="text-sm font-semibold text-gray-800">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className={`bg-gradient-to-r ${currentTheme.bgGradient}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${currentTheme.gradient} rounded-lg flex items-center justify-center shadow-lg`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">{question.subject}</CardTitle>
                  <CardDescription className="text-base">
                    {question.topic} - Question {currentQuestion + 1}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">{question.question}</h3>

            <RadioGroup
              value={selectedAnswer}
              onValueChange={handleAnswerSelect}
              className="space-y-4"
              disabled={showFeedback}
            >
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    showFeedback
                      ? index === question.correct
                        ? "border-green-500 bg-green-50"
                        : index === Number.parseInt(selectedAnswer) && index !== question.correct
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="text-emerald-600"
                    disabled={showFeedback}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-gray-700 font-medium text-lg"
                  >
                    {option}
                  </Label>
                  {showFeedback && index === question.correct && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {showFeedback && index === Number.parseInt(selectedAnswer) && index !== question.correct && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </RadioGroup>

            {!showFeedback && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-8 py-3 text-lg shadow-lg`}
                >
                  <Target className="w-5 h-5 mr-2" />
                  Submit Answer
                </Button>
              </div>
            )}

            {showFeedback && (
              <div className="mt-8 space-y-6">
                <div
                  className={`p-6 rounded-xl border ${
                    Number.parseInt(selectedAnswer) === question.correct
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    {Number.parseInt(selectedAnswer) === question.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span
                      className={`font-semibold text-lg ${
                        Number.parseInt(selectedAnswer) === question.correct ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {Number.parseInt(selectedAnswer) === question.correct ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-gray-600 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleNextQuestion}
                    className={`bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white px-8 py-3 text-lg shadow-lg`}
                  >
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Next Question
                        <Zap className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Complete Quiz
                        <Trophy className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Insights */}
        <Card className={`mt-6 border-0 shadow-lg bg-gradient-to-r ${currentTheme.bgGradient}`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-emerald-600" />
              <h4 className="font-semibold text-gray-800">Learning Insights</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong className="text-emerald-600">Adaptive Learning:</strong> Questions are tailored to your{" "}
                  {user.diagnosticResults?.learningLevel || "current"} level
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong className="text-emerald-600">Progress Tracking:</strong> Your performance helps improve future
                  recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
