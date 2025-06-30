"""
EduTutor AI Quiz Generation System
Simulates IBM Watsonx and Granite model integration for dynamic quiz creation
"""

import json
import random
from datetime import datetime
from typing import List, Dict, Any

class GraniteQuizGenerator:
    """Simulates IBM Granite model for quiz generation"""
    
    def __init__(self):
        self.model_name = "granite-13b-instruct"
        self.difficulty_levels = ["beginner", "intermediate", "advanced"]
        
        # Sample question templates by subject
        self.question_templates = {
            "mathematics": {
                "beginner": [
                    {"template": "Solve: {equation}", "type": "algebra"},
                    {"template": "What is {operation} of {numbers}?", "type": "arithmetic"},
                    {"template": "Find the area of a {shape} with {dimensions}", "type": "geometry"}
                ],
                "intermediate": [
                    {"template": "Find the derivative of {function}", "type": "calculus"},
                    {"template": "Solve the system: {system}", "type": "linear_algebra"},
                    {"template": "What is the integral of {function}?", "type": "calculus"}
                ],
                "advanced": [
                    {"template": "Prove that {theorem}", "type": "proof"},
                    {"template": "Solve the differential equation: {equation}", "type": "differential_equations"},
                    {"template": "Find the limit: {limit_expression}", "type": "analysis"}
                ]
            },
            "physics": {
                "beginner": [
                    {"template": "A ball is thrown with velocity {velocity}. Find {quantity}", "type": "kinematics"},
                    {"template": "What is the force when mass = {mass} and acceleration = {acceleration}?", "type": "dynamics"},
                    {"template": "Calculate the work done when force = {force} and distance = {distance}", "type": "energy"}
                ],
                "intermediate": [
                    {"template": "A pendulum has length {length}. Find its period", "type": "oscillations"},
                    {"template": "Calculate the electric field at distance {distance} from charge {charge}", "type": "electromagnetism"},
                    {"template": "Find the heat transferred when {conditions}", "type": "thermodynamics"}
                ],
                "advanced": [
                    {"template": "Derive the wave equation for {system}", "type": "wave_mechanics"},
                    {"template": "Calculate the quantum energy levels for {system}", "type": "quantum_mechanics"},
                    {"template": "Find the relativistic momentum when {conditions}", "type": "relativity"}
                ]
            },
            "computer_science": {
                "beginner": [
                    {"template": "What is the time complexity of {algorithm}?", "type": "algorithms"},
                    {"template": "Which data structure is best for {operation}?", "type": "data_structures"},
                    {"template": "What does this code output: {code}", "type": "programming"}
                ],
                "intermediate": [
                    {"template": "Implement {algorithm} using {language}", "type": "implementation"},
                    {"template": "Design a database schema for {scenario}", "type": "databases"},
                    {"template": "What is the space complexity of {algorithm}?", "type": "complexity_analysis"}
                ],
                "advanced": [
                    {"template": "Prove the correctness of {algorithm}", "type": "algorithm_analysis"},
                    {"template": "Design a distributed system for {requirements}", "type": "system_design"},
                    {"template": "Optimize this code for {constraints}", "type": "optimization"}
                ]
            }
        }
    
    def generate_quiz(self, subject: str, difficulty: str, num_questions: int = 5, 
                     student_performance: Dict = None) -> Dict[str, Any]:
        """
        Generate a personalized quiz based on subject, difficulty, and student performance
        """
        print(f"🧠 Generating quiz with Granite model...")
        print(f"Subject: {subject}, Difficulty: {difficulty}, Questions: {num_questions}")
        
        if student_performance:
            print(f"📊 Analyzing student performance data...")
            difficulty = self._adapt_difficulty(difficulty, student_performance)
        
        questions = []
        templates = self.question_templates.get(subject, {}).get(difficulty, [])
        
        for i in range(num_questions):
            template = random.choice(templates)
            question = self._generate_question_from_template(template, subject, difficulty)
            questions.append(question)
        
        quiz_data = {
            "id": f"quiz_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "subject": subject,
            "difficulty": difficulty,
            "total_questions": num_questions,
            "estimated_time": num_questions * 3,  # 3 minutes per question
            "questions": questions,
            "generated_by": "granite-13b-instruct",
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"✅ Quiz generated successfully!")
        return quiz_data
    
    def _adapt_difficulty(self, base_difficulty: str, performance: Dict) -> str:
        """Adapt difficulty based on student performance"""
        avg_score = performance.get("average_score", 75)
        recent_trend = performance.get("recent_trend", "stable")
        
        if avg_score > 90 and recent_trend == "improving":
            difficulty_map = {"beginner": "intermediate", "intermediate": "advanced", "advanced": "advanced"}
        elif avg_score < 60 and recent_trend == "declining":
            difficulty_map = {"advanced": "intermediate", "intermediate": "beginner", "beginner": "beginner"}
        else:
            return base_difficulty
        
        return difficulty_map.get(base_difficulty, base_difficulty)
    
    def _generate_question_from_template(self, template: Dict, subject: str, difficulty: str) -> Dict[str, Any]:
        """Generate a specific question from a template"""
        question_type = template["type"]
        
        # Sample question generation based on type
        if subject == "mathematics" and question_type == "algebra":
            equation = f"{random.randint(2, 5)}x + {random.randint(1, 10)} = {random.randint(10, 25)}"
            correct_x = (int(equation.split('=')[1].strip()) - int(equation.split('+')[1].split('=')[0].strip())) // int(equation.split('x')[0])
            
            return {
                "question": f"Solve: {equation}",
                "options": [f"x = {correct_x}", f"x = {correct_x + 1}", f"x = {correct_x - 1}", f"x = {correct_x + 2}"],
                "correct_answer": 0,
                "explanation": f"Isolate x by subtracting and dividing: x = {correct_x}",
                "difficulty": difficulty,
                "type": question_type,
                "points": 10 if difficulty == "beginner" else 15 if difficulty == "intermediate" else 20
            }
        
        elif subject == "physics" and question_type == "dynamics":
            mass = random.randint(2, 10)
            acceleration = random.randint(2, 8)
            force = mass * acceleration
            
            return {
                "question": f"What is the force when mass = {mass} kg and acceleration = {acceleration} m/s²?",
                "options": [f"{force} N", f"{force + 5} N", f"{force - 3} N", f"{force * 2} N"],
                "correct_answer": 0,
                "explanation": f"Using F = ma: F = {mass} × {acceleration} = {force} N",
                "difficulty": difficulty,
                "type": question_type,
                "points": 10 if difficulty == "beginner" else 15 if difficulty == "intermediate" else 20
            }
        
        elif subject == "computer_science" and question_type == "algorithms":
            algorithms = ["Binary Search", "Quick Sort", "Merge Sort", "Linear Search"]
            algorithm = random.choice(algorithms)
            complexities = {"Binary Search": "O(log n)", "Quick Sort": "O(n log n)", "Merge Sort": "O(n log n)", "Linear Search": "O(n)"}
            correct = complexities[algorithm]
            
            options = [correct, "O(n²)", "O(1)", "O(n³)"]
            random.shuffle(options)
            correct_index = options.index(correct)
            
            return {
                "question": f"What is the average time complexity of {algorithm}?",
                "options": options,
                "correct_answer": correct_index,
                "explanation": f"{algorithm} has {correct} average time complexity",
                "difficulty": difficulty,
                "type": question_type,
                "points": 10 if difficulty == "beginner" else 15 if difficulty == "intermediate" else 20
            }
        
        # Default fallback question
        return {
            "question": f"Sample {subject} question ({difficulty} level)",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "explanation": "This is a sample explanation",
            "difficulty": difficulty,
            "type": question_type,
            "points": 10
        }

class WatsonxAnalyzer:
    """Simulates IBM Watsonx for student performance analysis"""
    
    def __init__(self):
        self.model_name = "watsonx-foundation-model"
    
    def analyze_student_performance(self, student_data: Dict) -> Dict[str, Any]:
        """Analyze student performance and provide insights"""
        print(f"🔍 Analyzing student performance with Watsonx...")
        
        quiz_history = student_data.get("quiz_history", [])
        if not quiz_history:
            return {"status": "insufficient_data"}
        
        # Calculate performance metrics
        scores = [quiz["score"] for quiz in quiz_history]
        avg_score = sum(scores) / len(scores)
        recent_scores = scores[-5:] if len(scores) >= 5 else scores
        recent_avg = sum(recent_scores) / len(recent_scores)
        
        # Determine trend
        if len(scores) >= 3:
            if recent_avg > avg_score + 5:
                trend = "improving"
            elif recent_avg < avg_score - 5:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "insufficient_data"
        
        # Subject analysis
        subject_performance = {}
        for quiz in quiz_history:
            subject = quiz.get("subject", "unknown")
            if subject not in subject_performance:
                subject_performance[subject] = []
            subject_performance[subject].append(quiz["score"])
        
        subject_averages = {
            subject: sum(scores) / len(scores) 
            for subject, scores in subject_performance.items()
        }
        
        # Generate insights
        insights = self._generate_insights(avg_score, trend, subject_averages)
        
        analysis = {
            "student_id": student_data.get("student_id"),
            "overall_performance": {
                "average_score": round(avg_score, 2),
                "recent_average": round(recent_avg, 2),
                "trend": trend,
                "total_quizzes": len(quiz_history)
            },
            "subject_performance": subject_averages,
            "insights": insights,
            "recommendations": self._generate_recommendations(avg_score, trend, subject_averages),
            "analysis_timestamp": datetime.now().isoformat()
        }
        
        print(f"✅ Analysis complete!")
        return analysis
    
    def _generate_insights(self, avg_score: float, trend: str, subject_performance: Dict) -> List[str]:
        """Generate AI insights based on performance data"""
        insights = []
        
        if avg_score >= 90:
            insights.append("🌟 Excellent overall performance! You're mastering the concepts well.")
        elif avg_score >= 80:
            insights.append("👍 Good performance overall. Keep up the consistent work!")
        elif avg_score >= 70:
            insights.append("📈 Decent performance with room for improvement.")
        else:
            insights.append("🎯 Focus needed - let's work on strengthening your foundation.")
        
        if trend == "improving":
            insights.append("📈 Great news! Your performance is trending upward.")
        elif trend == "declining":
            insights.append("⚠️ Your recent scores show a declining trend. Let's address this.")
        
        # Subject-specific insights
        if subject_performance:
            best_subject = max(subject_performance, key=subject_performance.get)
            worst_subject = min(subject_performance, key=subject_performance.get)
            
            insights.append(f"🏆 Strongest subject: {best_subject} ({subject_performance[best_subject]:.1f}%)")
            if subject_performance[worst_subject] < 75:
                insights.append(f"🎯 Focus area: {worst_subject} ({subject_performance[worst_subject]:.1f}%)")
        
        return insights
    
    def _generate_recommendations(self, avg_score: float, trend: str, subject_performance: Dict) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        
        if avg_score < 70:
            recommendations.append("📚 Review fundamental concepts before attempting new topics")
            recommendations.append("🕐 Spend more time on practice problems")
        
        if trend == "declining":
            recommendations.append("🔄 Take a diagnostic quiz to identify knowledge gaps")
            recommendations.append("👨‍🏫 Consider reaching out to your instructor for help")
        
        if subject_performance:
            weak_subjects = [subject for subject, score in subject_performance.items() if score < 75]
            for subject in weak_subjects:
                recommendations.append(f"📖 Focus additional study time on {subject}")
        
        if avg_score >= 85:
            recommendations.append("🚀 Ready for more challenging topics!")
            recommendations.append("🎯 Consider advanced practice problems")
        
        return recommendations

# Example usage and testing
if __name__ == "__main__":
    # Initialize AI components
    quiz_generator = GraniteQuizGenerator()
    performance_analyzer = WatsonxAnalyzer()
    
    # Sample student performance data
    sample_student_data = {
        "student_id": "student_123",
        "quiz_history": [
            {"subject": "mathematics", "score": 85, "date": "2024-01-10"},
            {"subject": "physics", "score": 78, "date": "2024-01-12"},
            {"subject": "mathematics", "score": 92, "date": "2024-01-15"},
            {"subject": "computer_science", "score": 95, "date": "2024-01-18"},
            {"subject": "physics", "score": 82, "date": "2024-01-20"}
        ]
    }
    
    # Analyze student performance
    print("=" * 50)
    print("STUDENT PERFORMANCE ANALYSIS")
    print("=" * 50)
    analysis = performance_analyzer.analyze_student_performance(sample_student_data)
    print(json.dumps(analysis, indent=2))
    
    # Generate personalized quiz
    print("\n" + "=" * 50)
    print("PERSONALIZED QUIZ GENERATION")
    print("=" * 50)
    
    performance_data = {
        "average_score": analysis["overall_performance"]["average_score"],
        "recent_trend": analysis["overall_performance"]["trend"]
    }
    
    quiz = quiz_generator.generate_quiz(
        subject="mathematics",
        difficulty="intermediate",
        num_questions=3,
        student_performance=performance_data
    )
    
    print(json.dumps(quiz, indent=2))
