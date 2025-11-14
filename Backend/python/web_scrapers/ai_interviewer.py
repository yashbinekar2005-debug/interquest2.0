import requests
from bs4 import BeautifulSoup
import random
import re
import time

class AIInterviewer:
    def __init__(self):
        self.question_banks = {}
        self.user_sessions = {}
    
    def generate_questions(self, field, level, user_id=None):
        """Generate dynamic interview questions"""
        try:
            # Get questions from web scraping simulation
            questions = self.scrape_interview_questions(field, level)
            
            # Ensure variety in questions
            if user_id and user_id in self.user_sessions:
                asked_questions = self.user_sessions[user_id].get('asked_questions', set())
                available_questions = [q for q in questions if q not in asked_questions]
                
                if available_questions:
                    questions = available_questions
                else:
                    # Reset if we've asked most questions
                    self.user_sessions[user_id]['asked_questions'] = set()
            
            # Update session
            if user_id:
                if user_id not in self.user_sessions:
                    self.user_sessions[user_id] = {
                        'field': field,
                        'level': level,
                        'asked_questions': set(),
                        'session_start': time.time()
                    }
                
                # Select next question
                if questions:
                    next_question = random.choice(questions)
                    self.user_sessions[user_id]['asked_questions'].add(next_question)
                    return [next_question]
            
            return questions[:3]  # Return 3 questions
            
        except Exception as e:
            print(f"Question generation error: {e}")
            return self.get_curated_questions(field, level)
    
    def scrape_interview_questions(self, field, level):
        """Simulate scraping interview questions from the web"""
        try:
            # Simulate web scraping delay
            time.sleep(0.5)
            
            # Field-specific question banks with web-scraped like variety
            field_questions = {
                'software': {
                    'beginner': [
                        "What inspired you to pursue software development?",
                        "Can you walk me through a simple project you've built?",
                        "What programming languages are you most comfortable with and why?",
                        "How do you approach learning new technologies?",
                        "What version control systems have you used?",
                        "Describe your experience with debugging code.",
                        "How do you ensure your code is maintainable?",
                        "What development tools are you familiar with?"
                    ],
                    'intermediate': [
                        "Explain the concept of object-oriented programming.",
                        "How would you optimize a slow database query?",
                        "What experience do you have with REST APIs?",
                        "Describe your experience with testing frameworks.",
                        "How do you handle technical debt in projects?",
                        "What's your experience with cloud platforms?",
                        "Explain the difference between SQL and NoSQL databases.",
                        "How do you approach code reviews?"
                    ],
                    'advanced': [
                        "How would you design a scalable microservices architecture?",
                        "Explain the CAP theorem and its implications.",
                        "What strategies would you use for database sharding?",
                        "How do you ensure application security?",
                        "Describe your experience with containerization.",
                        "What's your approach to system design?",
                        "How do you handle distributed system failures?",
                        "Explain different caching strategies and when to use them."
                    ]
                },
                'data': {
                    'beginner': [
                        "What got you interested in data science?",
                        "What data analysis tools are you familiar with?",
                        "How do you handle missing data in a dataset?",
                        "What's your experience with data visualization?",
                        "Can you explain what correlation means?",
                        "What Python libraries have you used for data analysis?",
                        "How do you ensure data quality?",
                        "What types of data have you worked with?"
                    ],
                    'intermediate': [
                        "Explain the bias-variance tradeoff.",
                        "How do you evaluate machine learning models?",
                        "What's your experience with feature engineering?",
                        "Describe a data cleaning process you've implemented.",
                        "How do you handle imbalanced datasets?",
                        "What A/B testing experience do you have?",
                        "Explain cross-validation techniques.",
                        "How do you communicate data insights to non-technical stakeholders?"
                    ],
                    'advanced': [
                        "How would you design a recommendation system?",
                        "Explain different regularization techniques.",
                        "What's your experience with deep learning?",
                        "How do you handle high-dimensional data?",
                        "Describe your experience with big data technologies.",
                        "What ensemble methods have you used?",
                        "How do you approach time series forecasting?",
                        "Explain the concept of transfer learning."
                    ]
                },
                'marketing': {
                    'beginner': [
                        "What interests you about marketing?",
                        "What social media platforms are you familiar with?",
                        "How would you measure campaign success?",
                        "What marketing tools have you used?",
                        "How do you stay updated on marketing trends?",
                        "What makes a good marketing campaign?",
                        "How do you analyze competitor strategies?",
                        "What's your experience with content creation?"
                    ],
                    'intermediate': [
                        "How would you develop a content strategy?",
                        "What's your experience with SEO?",
                        "How do you measure ROI on marketing campaigns?",
                        "Describe your experience with marketing analytics.",
                        "How do you approach target audience segmentation?",
                        "What A/B testing experience do you have?",
                        "How do you optimize conversion rates?",
                        "What's your experience with email marketing?"
                    ],
                    'advanced': [
                        "How would you develop a comprehensive marketing strategy?",
                        "What's your experience with marketing automation?",
                        "How do you allocate marketing budgets across channels?",
                        "Describe your experience with brand management.",
                        "How do you measure customer lifetime value?",
                        "What's your approach to international marketing?",
                        "How do you handle PR crises?",
                        "What experience do you have with marketing technology stacks?"
                    ]
                }
            }
            
            # Get questions for the specific field and level
            if field.lower() in field_questions and level in field_questions[field.lower()]:
                questions = field_questions[field.lower()][level]
                # Shuffle to ensure variety
                random.shuffle(questions)
                return questions[:5]  # Return 5 questions
            else:
                return self.get_curated_questions(field, level)
                
        except Exception as e:
            print(f"Question scraping error: {e}")
            return self.get_curated_questions(field, level)
    
    def get_curated_questions(self, field, level):
        """Fallback curated questions"""
        common_questions = [
            "Tell me about yourself and your background.",
            "Why are you interested in this position?",
            "What are your strengths and weaknesses?",
            "Where do you see yourself in 5 years?",
            "Why should we hire you?",
            "How do you handle challenges or setbacks?",
            "What motivates you in your work?",
            "Describe a time you worked in a team.",
            "How do you prioritize your tasks?",
            "What are you most proud of in your career so far?"
        ]
        
        # Add field-specific common questions
        if 'software' in field.lower():
            common_questions.extend([
                "What programming projects have you worked on?",
                "How do you stay updated with technology trends?",
                "What's your experience with agile development?"
            ])
        elif 'data' in field.lower():
            common_questions.extend([
                "What data analysis projects have you completed?",
                "How do you ensure data accuracy?",
                "What's your experience with data visualization?"
            ])
        
        random.shuffle(common_questions)
        return common_questions[:5]
    
    def evaluate_answer(self, question, answer, field, level):
        """Evaluate interview answers"""
        # Simple evaluation based on answer quality indicators
        answer_length = len(answer.split())
        has_examples = 'example' in answer.lower() or 'experience' in answer.lower()
        has_technical_terms = any(term in answer.lower() for term in self.get_field_terms(field))
        
        # Calculate scores
        length_score = min(answer_length / 50, 1.0)
        example_score = 1.0 if has_examples else 0.3
        technical_score = 1.0 if has_technical_terms else 0.5
        
        overall_score = (length_score + example_score + technical_score) / 3
        
        # Generate feedback
        feedback = self.generate_feedback(overall_score, answer_length, has_examples, has_technical_terms)
        
        return {
            'score': round(overall_score * 100),
            'feedback': feedback,
            'details': {
                'completeness': round(length_score * 100),
                'examples': round(example_score * 100),
                'relevance': round(technical_score * 100)
            }
        }
    
    def get_field_terms(self, field):
        """Get field-specific technical terms"""
        terms = {
            'software': ['code', 'programming', 'development', 'algorithm', 'debug', 'test', 'framework'],
            'data': ['analysis', 'data', 'statistics', 'model', 'algorithm', 'insight', 'visualization'],
            'marketing': ['campaign', 'audience', 'conversion', 'brand', 'engagement', 'ROI', 'metrics']
        }
        return terms.get(field.lower(), [])
    
    def generate_feedback(self, score, length, has_examples, has_technical):
        """Generate constructive feedback"""
        if score > 0.8:
            return "Excellent answer! You provided specific examples and used relevant terminology effectively."
        elif score > 0.6:
            return "Good answer. Consider adding more specific examples or technical details to strengthen your response."
        elif score > 0.4:
            return "Decent answer. Try to provide more concrete examples and use field-specific terminology."
        else:
            return "Your answer could be more detailed. Focus on providing specific examples and using relevant technical terms from the field."