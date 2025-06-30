import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, BookOpen, BarChart3, Zap, Shield, Globe, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EduTutor AI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#scenarios" className="text-gray-600 hover:text-blue-600 transition-colors">
              Use Cases
            </Link>
            <Link href="/student" className="text-gray-600 hover:text-blue-600 transition-colors">
              Student Portal
            </Link>
            <Link href="/auth?tab=educator" className="text-gray-600 hover:text-blue-600 transition-colors">
              Educator Login
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild className="bg-white text-gray-700">
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button asChild className="bg-blue-600 text-white">
              <Link href="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            Powered by IBM Watsonx & Granite Models
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Personalized Learning with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Generative AI
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionary AI-powered education platform that creates dynamic quizzes, provides instant feedback, and
            integrates seamlessly with Google Classroom for personalized learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-blue-600 text-white">
              <Link href="/student">Start Learning</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white text-gray-700">
              <Link href="/educator">Educator Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful AI-Driven Features</h2>
            <p className="text-xl text-gray-600">Everything you need for personalized education</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Dynamic Quiz Generation</CardTitle>
                <CardDescription>
                  AI-powered quiz creation using IBM Granite models for personalized learning experiences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Comprehensive performance tracking with insights from Pinecone vector database
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <Globe className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Google Classroom Integration</CardTitle>
                <CardDescription>
                  Seamless synchronization with Google Classroom for automatic course and student data import
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <Zap className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Instant Feedback</CardTitle>
                <CardDescription>
                  AI-powered assessment with immediate feedback and personalized recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Adaptive Testing</CardTitle>
                <CardDescription>
                  Diagnostic tests that adapt difficulty based on student performance and learning patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Educator Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive teacher portal with student progress monitoring and curriculum insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Scenarios Section */}
      <section id="scenarios" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real-World Use Cases</h2>
            <p className="text-xl text-gray-600">See how EduTutor AI transforms education</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Personalized Learning Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Students sync their Google Classroom courses, receive AI-generated quizzes on key topics, and get
                  instant feedback for a highly personalized learning journey.
                </p>
                <Button variant="outline" asChild className="bg-blue-50 text-blue-700">
                  <Link href="/student">Try Student Portal</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Educator Dashboard & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Teachers access real-time performance data, quiz history, and AI-powered insights to personalize
                  instruction and monitor student progress effectively.
                </p>
                <Button variant="outline" asChild className="bg-purple-50 text-purple-700">
                  <Link href="/educator">View Dashboard</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Zap className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Diagnostic Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  New students take AI-generated diagnostic tests that adapt quiz difficulty and topic relevance based
                  on their performance and learning level.
                </p>
                <Button variant="outline" asChild className="bg-green-50 text-green-700">
                  <Link href="/diagnostic">Take Diagnostic</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Globe className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Seamless Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Direct Google Classroom synchronization enables automatic quiz topic generation and maintains
                  alignment with academic curriculum requirements.
                </p>
                <Button variant="outline" asChild className="bg-orange-50 text-orange-700">
                  <Link href="/integration">Setup Integration</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Education?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students already using EduTutor AI to create personalized learning
            experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6" />
                <span className="text-xl font-bold">EduTutor AI</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing education with AI-powered personalized learning experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/student" className="hover:text-white">
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link href="/educator" className="hover:text-white">
                    Educator Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/diagnostic" className="hover:text-white">
                    Diagnostic Testing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Quiz Generation</li>
                <li>Google Classroom Sync</li>
                <li>Real-time Analytics</li>
                <li>Adaptive Learning</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Technology</h3>
              <ul className="space-y-2 text-gray-400">
                <li>IBM Watsonx</li>
                <li>Granite Models</li>
                <li>Pinecone Vector DB</li>
                <li>Google Classroom API</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduTutor AI. All rights reserved. Powered by IBM Cloud.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
