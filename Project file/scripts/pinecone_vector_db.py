"""
Pinecone Vector Database Integration for EduTutor AI
Handles student performance data, quiz embeddings, and similarity search
"""

import json
import numpy as np
import random
from datetime import datetime
from typing import List, Dict, Any, Tuple

class MockPineconeClient:
    """Mock Pinecone client for demonstration purposes"""
    
    def __init__(self, api_key: str = None, environment: str = "us-west1-gcp"):
        self.api_key = api_key or "mock-pinecone-key-12345"
        self.environment = environment
        self.indexes = {}
        print(f"🔌 Connected to Pinecone environment: {environment}")
    
    def create_index(self, name: str, dimension: int, metric: str = "cosine"):
        """Create a new vector index"""
        self.indexes[name] = {
            "name": name,
            "dimension": dimension,
            "metric": metric,
            "vectors": {},
            "metadata": {},
            "created_at": datetime.now().isoformat()
        }
        print(f"📊 Created index '{name}' with dimension {dimension}")
        return True
    
    def upsert(self, index_name: str, vectors: List[Tuple]):
        """Insert or update vectors in the index"""
        if index_name not in self.indexes:
            raise ValueError(f"Index '{index_name}' does not exist")
        
        index = self.indexes[index_name]
        for vector_id, embedding, metadata in vectors:
            index["vectors"][vector_id] = embedding
            index["metadata"][vector_id] = metadata
        
        print(f"📝 Upserted {len(vectors)} vectors to index '{index_name}'")
        return {"upserted_count": len(vectors)}
    
    def query(self, index_name: str, vector: List[float], top_k: int = 10, 
              include_metadata: bool = True) -> Dict:
        """Query similar vectors"""
        if index_name not in self.indexes:
            raise ValueError(f"Index '{index_name}' does not exist")
        
        index = self.indexes[index_name]
        similarities = []
        
        # Calculate cosine similarity with all vectors
        for vec_id, stored_vector in index["vectors"].items():
            similarity = self._cosine_similarity(vector, stored_vector)
            similarities.append({
                "id": vec_id,
                "score": similarity,
                "metadata": index["metadata"].get(vec_id, {}) if include_metadata else {}
            })
        
        # Sort by similarity and return top_k
        similarities.sort(key=lambda x: x["score"], reverse=True)
        return {"matches": similarities[:top_k]}
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

class EduTutorVectorDB:
    """EduTutor AI Vector Database Manager"""
    
    def __init__(self, api_key: str = None):
        self.client = MockPineconeClient(api_key)
        self.embedding_dimension = 384  # Typical for educational embeddings
        self.indexes = {
            "student-performance": "student_performance_index",
            "quiz-content": "quiz_content_index", 
            "learning-topics": "learning_topics_index"
        }
        self._initialize_indexes()
    
    def _initialize_indexes(self):
        """Initialize all required indexes"""
        for index_type, index_name in self.indexes.items():
            self.client.create_index(index_name, self.embedding_dimension)
    
    def store_student_performance(self, student_id: str, performance_data: Dict) -> bool:
        """Store student performance data as vectors"""
        print(f"💾 Storing performance data for student {student_id}...")
        
        # Create performance embedding
        performance_vector = self._create_performance_embedding(performance_data)
        
        # Prepare metadata
        metadata = {
            "student_id": student_id,
            "timestamp": datetime.now().isoformat(),
            "average_score": performance_data.get("average_score", 0),
            "subject_scores": performance_data.get("subject_scores", {}),
            "learning_style": performance_data.get("learning_style", "unknown"),
            "difficulty_preference": performance_data.get("difficulty_preference", "adaptive"),
            "total_quizzes": performance_data.get("total_quizzes", 0),
            "recent_trend": performance_data.get("recent_trend", "stable")
        }
        
        # Store in vector database
        vectors = [(f"student_{student_id}_{int(datetime.now().timestamp())}", 
                   performance_vector, metadata)]
        
        result = self.client.upsert(self.indexes["student-performance"], vectors)
        print(f"✅ Stored performance data for student {student_id}")
        return result["upserted_count"] > 0
    
    def store_quiz_content(self, quiz_id: str, quiz_data: Dict) -> bool:
        """Store quiz content as vectors for similarity matching"""
        print(f"📚 Storing quiz content for quiz {quiz_id}...")
        
        # Create quiz content
