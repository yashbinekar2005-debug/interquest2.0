// AI Interviewer functionality

document.addEventListener('DOMContentLoaded', function() {
    const interviewForm = document.getElementById('interview-form');
    const interviewQuestion = document.getElementById('interview-question');
    const answerInput = document.getElementById('answer-input');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const avatarMouth = document.querySelector('.avatar-mouth');
    
    let currentQuestionIndex = 0;
    let interviewQuestions = [];
    let userAnswers = [];
    let interviewField = '';
    let interviewLevel = '';
    
    if (interviewForm) {
        interviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            interviewField = document.getElementById('interview-field').value;
            interviewLevel = document.getElementById('interview-level').value;
            
            if (!interviewField || !interviewLevel) {
                alert('Please select both field and experience level');
                return;
            }
            
            startInterview(interviewField, interviewLevel);
        });
    }
    
    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', function() {
            submitAnswer();
        });
    }
    
    function startInterview(field, level) {
        // Reset interview state
        currentQuestionIndex = 0;
        userAnswers = [];
        
        // Get questions based on field and level
        interviewQuestions = getInterviewQuestions(field, level);
        
        // Update UI for interview in progress
        document.querySelector('.interviewer-setup').style.display = 'none';
        document.querySelector('.interview-interface').style.opacity = '1';
        
        // Show first question
        showQuestion(currentQuestionIndex);
        
        // Animate avatar
        animateAvatarSpeaking();
    }
    
    function getInterviewQuestions(field, level) {
        // This is a simulation - in a real app, this would use web scraping
        // to get relevant interview questions for the specific field
        
        let questions = [];
        
        // Common questions for all fields
        const commonQuestions = [
            "Can you tell me about yourself and your background?",
            "Why are you interested in this internship/role?",
            "What are your strengths and weaknesses?",
            "Where do you see yourself in 5 years?",
            "Why should we hire you for this position?"
        ];
        
        // Field-specific questions
        if (field === 'software') {
            questions = [
                "Can you explain the concept of object-oriented programming?",
                "What is the difference between SQL and NoSQL databases?",
                "How would you approach debugging a complex software issue?",
                "Can you describe a challenging project you worked on and how you overcame obstacles?",
                "What development methodologies are you familiar with (Agile, Scrum, etc.)?"
            ];
        } else if (field === 'data') {
            questions = [
                "What is the difference between supervised and unsupervised learning?",
                "How would you handle missing data in a dataset?",
                "Can you explain what a p-value is in statistics?",
                "What data visualization tools have you used and which do you prefer?",
                "Describe a time when you used data to solve a problem."
            ];
        } else if (field === 'marketing') {
            questions = [
                "How would you measure the success of a marketing campaign?",
                "What social media platforms do you think are most effective for B2B marketing?",
                "Can you describe a marketing campaign that impressed you and why?",
                "How do you stay updated on the latest marketing trends?",
                "What metrics would you track to evaluate content performance?"
            ];
        } else if (field === 'finance') {
            questions = [
                "Can you explain the concept of net present value (NPV)?",
                "What financial statements are you familiar with and what information do they provide?",
                "How would you approach creating a financial forecast?",
                "What is the difference between equity and debt financing?",
                "How do you stay informed about current market trends?"
            ];
        } else if (field === 'design') {
            questions = [
                "Can you walk me through your design process?",
                "What design tools are you most comfortable with?",
                "How do you incorporate user feedback into your designs?",
                "What is the difference between UI and UX design?",
                "Can you describe a design project you're particularly proud of?"
            ];
        }
        
        // Adjust questions based on experience level
        if (level === 'beginner') {
            // Keep questions more fundamental
            questions = questions.slice(0, 3).concat(commonQuestions.slice(0, 2));
        } else if (level === 'intermediate') {
            // Mix of fundamental and more challenging questions
            questions = questions.slice(0, 4).concat(commonQuestions.slice(0, 3));
        } else if (level === 'advanced') {
            // Include all questions
            questions = questions.concat(commonQuestions);
        }
        
        return questions;
    }
    
    function showQuestion(index) {
        if (index < interviewQuestions.length) {
            interviewQuestion.innerHTML = `<p>${interviewQuestions[index]}</p>`;
            answerInput.value = '';
            answerInput.focus();
            
            // Update progress
            updateProgress(index + 1, interviewQuestions.length);
            
            // Animate avatar
            animateAvatarSpeaking();
        } else {
            // Interview complete
            endInterview();
        }
    }
    
    function updateProgress(current, total) {
        // Create or update progress indicator
        let progressIndicator = document.querySelector('.interview-progress');
        
        if (!progressIndicator) {
            progressIndicator = document.createElement('div');
            progressIndicator.className = 'interview-progress';
            interviewQuestion.parentNode.insertBefore(progressIndicator, interviewQuestion);
        }
        
        progressIndicator.innerHTML = `Question ${current} of ${total}`;
    }
    
    function submitAnswer() {
        const answer = answerInput.value.trim();
        
        if (!answer) {
            alert('Please provide an answer before submitting');
            return;
        }
        
        // Save answer
        userAnswers.push({
            question: interviewQuestions[currentQuestionIndex],
            answer: answer
        });
        
        // Move to next question
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
    
    function endInterview() {
        interviewQuestion.innerHTML = `
            <p>Thank you for completing the interview practice!</p>
            <p>You've answered ${userAnswers.length} questions. Review your answers below:</p>
        `;
        
        // Create review section
        const reviewSection = document.createElement('div');
        reviewSection.className = 'interview-review';
        
        let reviewHTML = '';
        userAnswers.forEach((item, index) => {
            reviewHTML += `
                <div class="review-item">
                    <h4>Question ${index + 1}:</h4>
                    <p>${item.question}</p>
                    <h4>Your Answer:</h4>
                    <p>${item.answer}</p>
                </div>
            `;
        });
        
        reviewSection.innerHTML = reviewHTML;
        
        // Add restart button
        const restartButton = document.createElement('button');
        restartButton.className = 'btn-primary';
        restartButton.textContent = 'Practice Again';
        restartButton.addEventListener('click', function() {
            location.reload();
        });
        
        // Update interface
        answerInput.style.display = 'none';
        submitAnswerBtn.style.display = 'none';
        
        interviewQuestion.appendChild(reviewSection);
        interviewQuestion.appendChild(restartButton);
        
        // Add CSS for review section if not already present
        if (!document.querySelector('#interview-review-style')) {
            const style = document.createElement('style');
            style.id = 'interview-review-style';
            style.textContent = `
                .interview-review {
                    margin-top: 1.5rem;
                    max-height: 300px;
                    overflow-y: auto;
                }
                .review-item {
                    background: #f8f9fa;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }
                .review-item h4 {
                    margin-bottom: 0.5rem;
                    color: var(--primary);
                }
                .interview-progress {
                    text-align: center;
                    margin-bottom: 1rem;
                    font-weight: 500;
                    color: var(--primary);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Stop avatar animation
        animateAvatarIdle();
    }
    
    function animateAvatarSpeaking() {
        if (avatarMouth) {
            avatarMouth.style.animation = 'speak 0.5s infinite alternate';
        }
        
        // Add speaking animation CSS if not already present
        if (!document.querySelector('#avatar-animations')) {
            const style = document.createElement('style');
            style.id = 'avatar-animations';
            style.textContent = `
                @keyframes speak {
                    from {
                        height: 10px;
                        border-radius: 0 0 20px 20px;
                    }
                    to {
                        height: 20px;
                        border-radius: 0 0 30px 30px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function animateAvatarIdle() {
        if (avatarMouth) {
            avatarMouth.style.animation = 'none';
            avatarMouth.style.height = '15px';
            avatarMouth.style.borderRadius = '0 0 25px 25px';
        }
    }
});