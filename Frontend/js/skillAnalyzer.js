// import { skillsAPI } from './api.js';

// document.addEventListener('DOMContentLoaded', function() {
//     const skillForm = document.getElementById('skill-form');
    
//     if (skillForm) {
//         skillForm.addEventListener('submit', async function(e) {
//             e.preventDefault();
            
//             const userSkills = document.getElementById('user-skills').value;
//             const desiredJob = document.getElementById('desired-job').value;
            
//             if (!userSkills || !desiredJob) {
//                 showNotification('Please fill in all fields', 'error');
//                 return;
//             }
            
//             await analyzeSkills(userSkills, desiredJob);
//         });
//     }
// });

// async function analyzeSkills(userSkills, desiredJob) {
//     const submitBtn = document.querySelector('#skill-form button[type="submit"]');
//     const originalText = submitBtn.textContent;
//     submitBtn.textContent = '🌐 Analyzing Skills...';
//     submitBtn.disabled = true;

//     try {
//         showLoadingAnimation(desiredJob);
        
//         const result = await skillsAPI.analyze(userSkills, desiredJob);
//         displayAnalysisResults(result, desiredJob);
        
//     } catch (error) {
//         console.error('Skill analysis failed:', error);
//         showNotification('Skill analysis failed. Please try again.', 'error');
//         displayErrorState(desiredJob);
//     } finally {
//         submitBtn.textContent = originalText;
//         submitBtn.disabled = false;
//         hideLoadingAnimation();
//     }
// }

// function showLoadingAnimation(jobTitle) {
//     const resultsContainer = document.getElementById('results-container');
//     resultsContainer.innerHTML = `
//         <div class="loading-animation">
//             <div class="scraping-animation">
//                 <div class="earth"></div>
//                 <div class="satellite"></div>
//             </div>
//             <h3>🔍 Scanning Job Market</h3>
//             <p>Searching across Indeed, LinkedIn, and Glassdoor for <strong>${jobTitle}</strong> positions...</p>
//             <div class="progress-container">
//                 <div class="progress-bar">
//                     <div class="progress-fill" id="scraping-progress"></div>
//                 </div>
//                 <div class="progress-text" id="progress-text">Analyzing job requirements...</div>
//             </div>
//             <div class="loading-details">
//                 <div class="loading-step">
//                     <span class="step-icon">🌐</span>
//                     <span>Connecting to job sites</span>
//                 </div>
//                 <div class="loading-step">
//                     <span class="step-icon">📊</span>
//                     <span>Analyzing skill requirements</span>
//                 </div>
//                 <div class="loading-step">
//                     <span class="step-icon">🎯</span>
//                     <span>Calculating match percentage</span>
//                 </div>
//             </div>
//         </div>
//     `;
    
//     // Animate progress bar
//     setTimeout(() => {
//         const progressFill = document.getElementById('scraping-progress');
//         const progressText = document.getElementById('progress-text');
//         if (progressFill && progressText) {
//             progressFill.style.width = '100%';
//             progressText.textContent = 'Finalizing analysis...';
//         }
//     }, 2000);
// }

// function hideLoadingAnimation() {
//     // Animation will be replaced by results
// }

// function displayAnalysisResults(result, desiredJob) {
//     const resultsContainer = document.getElementById('results-container');
    
//     const matchColor = result.match_percentage >= 70 ? '#10b981' : 
//                       result.match_percentage >= 40 ? '#f59e0b' : '#ef4444';
    
//     const matchText = result.match_percentage >= 70 ? 'Excellent match!' :
//                      result.match_percentage >= 40 ? 'Good potential' : 'Needs improvement';

//     const resultsHTML = `
//         <div class="analysis-result animate-fade-up">
//             <div class="analysis-header">
//                 <h3>📊 Skill Analysis Complete</h3>
//                 <p class="analysis-subtitle">Based on real ${desiredJob} job postings</p>
//             </div>
            
//             <div class="match-percentage">
//                 <div class="percentage-circle">
//                     <svg width="140" height="140" viewBox="0 0 140 140">
//                         <circle cx="70" cy="70" r="64" fill="none" stroke="#e9ecef" stroke-width="8"></circle>
//                         <circle cx="70" cy="70" r="64" fill="none" stroke="${matchColor}" stroke-width="8" 
//                                 stroke-dasharray="402.12" stroke-dashoffset="${402.12 * (1 - result.match_percentage/100)}" 
//                                 stroke-linecap="round" transform="rotate(-90 70 70)"></circle>
//                         <text x="70" y="75" text-anchor="middle" font-size="28" font-weight="600" fill="${matchColor}">
//                             ${Math.round(result.match_percentage)}%
//                         </text>
//                         <text x="70" y="95" text-anchor="middle" font-size="12" fill="#6c757d">${matchText}</text>
//                     </svg>
//                 </div>
//                 <div class="match-details">
//                     <h4>Your Skill Match: ${Math.round(result.match_percentage)}%</h4>
//                     <p>You have <strong>${result.matched_skills.length}</strong> out of <strong>${result.required_skills.length}</strong> required skills for ${desiredJob} positions</p>
//                     ${result.total_jobs_analyzed ? 
//                       '<div class="success-badge">✅ Based on real job market data</div>' : 
//                       '<div class="info-badge">ℹ️ Using common industry requirements</div>'
//                     }
//                 </div>
//             </div>
            
//             <div class="skills-comparison">
//                 <div class="skills-section matched-skills-section">
//                     <h4>✅ Your Matched Skills</h4>
//                     <div class="skills-tags">
//                         ${result.matched_skills.length > 0 ? 
//                           result.matched_skills.map(skill => `
//                             <span class="skill-tag matched animate-bounce-in">
//                                 ${skill}
//                                 <span class="skill-check">✓</span>
//                             </span>
//                           `).join('') :
//                           '<div class="no-skills-message">No skills matched yet. Focus on learning the required skills below.</div>'
//                         }
//                     </div>
//                 </div>
                
//                 <div class="skills-section improve-skills-section">
//                     <h4>🎯 Skills to Develop</h4>
//                     <div class="skills-tags">
//                         ${result.skills_to_improve.length > 0 ? 
//                           result.skills_to_improve.map(skill => `
//                             <span class="skill-tag missing animate-bounce-in">
//                                 ${skill}
//                                 <span class="skill-plus">+</span>
//                             </span>
//                           `).join('') :
//                           '<div class="success-message">🎉 Excellent! You have all the key skills required.</div>'
//                         }
//                     </div>
//                 </div>
//             </div>
            
//             ${result.skills_to_improve.length > 0 ? `
//                 <div class="improvement-plan animate-slide-up">
//                     <h4>📚 Your Learning Path</h4>
//                     <div class="plan-steps">
//                         <div class="plan-step">
//                             <span class="step-number">1</span>
//                             <div class="step-content">
//                                 <h5>Priority Skills</h5>
//                                 <p>Focus on: <strong>${result.skills_to_improve.slice(0, 3).join(', ')}</strong></p>
//                             </div>
//                         </div>
//                         <div class="plan-step">
//                             <span class="step-number">2</span>
//                             <div class="step-content">
//                                 <h5>Learning Resources</h5>
//                                 <p>Use platforms like Coursera, Udemy, or freeCodeCamp</p>
//                             </div>
//                         </div>
//                         <div class="plan-step">
//                             <span class="step-number">3</span>
//                             <div class="step-content">
//                                 <h5>Practice Projects</h5>
//                                 <p>Build real projects to apply your new skills</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ` : ''}
            
//             <div class="analysis-actions">
//                 <button class="btn-primary" onclick="saveSkillAnalysis()">
//                     <i class="fas fa-save"></i> Save Analysis
//                 </button>
//                 <button class="btn-secondary" onclick="shareSkillAnalysis()">
//                     <i class="fas fa-share"></i> Share Results
//                 </button>
//                 <button class="btn-outline" onclick="retryAnalysis()">
//                     <i class="fas fa-redo"></i> Analyze Again
//                 </button>
//             </div>
//         </div>
//     `;
    
//     resultsContainer.innerHTML = resultsHTML;
    
//     // Add CSS for new elements
//     addSkillAnalysisStyles();
// }

// function displayErrorState(desiredJob) {
//     const resultsContainer = document.getElementById('results-container');
//     resultsContainer.innerHTML = `
//         <div class="error-state animate-shake">
//             <div class="error-icon">⚠️</div>
//             <h3>Connection Issue</h3>
//             <p>We're having trouble accessing job sites right now. Here's what you can do:</p>
//             <div class="error-suggestions">
//                 <div class="suggestion">
//                     <span class="suggestion-icon">🔍</span>
//                     <div>
//                         <strong>Search Manually</strong>
//                         <p>Search for "${desiredJob}" on Indeed or LinkedIn to see current requirements</p>
//                     </div>
//                 </div>
//                 <div class="suggestion">
//                     <span class="suggestion-icon">🔄</span>
//                     <div>
//                         <strong>Try Again</strong>
//                         <p>Check your connection and retry the analysis</p>
//                     </div>
//                 </div>
//                 <div class="suggestion">
//                     <span class="suggestion-icon">💡</span>
//                     <div>
//                         <strong>Use Common Skills</strong>
//                         <p>Research typical skills for ${desiredJob} positions online</p>
//                     </div>
//                 </div>
//             </div>
//             <button class="btn-primary" onclick="retryAnalysis()">
//                 <i class="fas fa-redo"></i> Try Again
//             </button>
//         </div>
//     `;
// }

// function addSkillAnalysisStyles() {
//     if (!document.querySelector('#skill-analysis-styles')) {
//         const style = document.createElement('style');
//         style.id = 'skill-analysis-styles';
//         style.textContent = `
//             .scraping-animation {
//                 position: relative;
//                 width: 100px;
//                 height: 100px;
//                 margin: 0 auto 2rem;
//             }
//             .earth {
//                 width: 60px;
//                 height: 60px;
//                 background: linear-gradient(45deg, #4361ee, #4cc9f0);
//                 border-radius: 50%;
//                 position: absolute;
//                 top: 20px;
//                 left: 20px;
//                 animation: rotate 10s linear infinite;
//             }
//             .satellite {
//                 width: 20px;
//                 height: 20px;
//                 background: #7209b7;
//                 border-radius: 50%;
//                 position: absolute;
//                 top: 0;
//                 left: 40px;
//                 animation: orbit 3s linear infinite;
//             }
//             @keyframes rotate {
//                 from { transform: rotate(0deg); }
//                 to { transform: rotate(360deg); }
//             }
//             @keyframes orbit {
//                 0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
//                 100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
//             }
//             .progress-container {
//                 margin: 1.5rem 0;
//             }
//             .progress-text {
//                 text-align: center;
//                 margin-top: 0.5rem;
//                 font-size: 0.9rem;
//                 color: #6c757d;
//             }
//             .loading-details {
//                 display: flex;
//                 flex-direction: column;
//                 gap: 1rem;
//                 margin-top: 1.5rem;
//             }
//             .loading-step {
//                 display: flex;
//                 align-items: center;
//                 gap: 1rem;
//                 padding: 0.5rem;
//                 background: #f8f9fa;
//                 border-radius: 8px;
//             }
//             .step-icon {
//                 font-size: 1.2rem;
//             }
//             .analysis-header {
//                 text-align: center;
//                 margin-bottom: 2rem;
//             }
//             .analysis-subtitle {
//                 color: #6c757d;
//                 margin-top: 0.5rem;
//             }
//             .match-details {
//                 text-align: center;
//                 margin-top: 1rem;
//             }
//             .success-badge, .info-badge {
//                 display: inline-block;
//                 padding: 0.5rem 1rem;
//                 border-radius: 20px;
//                 font-size: 0.8rem;
//                 margin-top: 0.5rem;
//             }
//             .success-badge {
//                 background: #d1fae5;
//                 color: #065f46;
//             }
//             .info-badge {
//                 background: #dbeafe;
//                 color: #1e40af;
//             }
//             .skills-comparison {
//                 display: grid;
//                 grid-template-columns: 1fr 1fr;
//                 gap: 2rem;
//                 margin: 2rem 0;
//             }
//             @media (max-width: 768px) {
//                 .skills-comparison {
//                     grid-template-columns: 1fr;
//                 }
//             }
//             .skills-section h4 {
//                 margin-bottom: 1rem;
//                 color: var(--dark);
//             }
//             .skill-tag {
//                 position: relative;
//                 padding: 0.5rem 1rem 0.5rem 2.5rem;
//                 border-radius: 20px;
//                 font-size: 0.9rem;
//                 font-weight: 500;
//                 margin: 0.25rem;
//                 display: inline-flex;
//                 align-items: center;
//             }
//             .skill-tag.matched {
//                 background: #d1fae5;
//                 color: #065f46;
//                 border: 1px solid #a7f3d0;
//             }
//             .skill-tag.missing {
//                 background: #fef3c7;
//                 color: #92400e;
//                 border: 1px solid #fcd34d;
//             }
//             .skill-check, .skill-plus {
//                 position: absolute;
//                 left: 1rem;
//                 font-weight: bold;
//             }
//             .skill-check {
//                 color: #059669;
//             }
//             .skill-plus {
//                 color: #d97706;
//             }
//             .no-skills-message, .success-message {
//                 text-align: center;
//                 padding: 1.5rem;
//                 background: #f8f9fa;
//                 border-radius: 8px;
//                 color: #6c757d;
//             }
//             .success-message {
//                 background: #d1fae5;
//                 color: #065f46;
//             }
//             .improvement-plan {
//                 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//                 color: white;
//                 padding: 2rem;
//                 border-radius: 12px;
//                 margin: 2rem 0;
//             }
//             .improvement-plan h4 {
//                 color: white;
//                 margin-bottom: 1.5rem;
//                 text-align: center;
//             }
//             .plan-steps {
//                 display: grid;
//                 grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//                 gap: 1.5rem;
//             }
//             .plan-step {
//                 display: flex;
//                 align-items: flex-start;
//                 gap: 1rem;
//             }
//             .step-number {
//                 background: rgba(255,255,255,0.2);
//                 color: white;
//                 width: 30px;
//                 height: 30px;
//                 border-radius: 50%;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 font-weight: bold;
//                 flex-shrink: 0;
//             }
//             .step-content h5 {
//                 margin: 0 0 0.5rem 0;
//                 color: white;
//             }
//             .step-content p {
//                 margin: 0;
//                 opacity: 0.9;
//                 font-size: 0.9rem;
//             }
//             .analysis-actions {
//                 display: flex;
//                 gap: 1rem;
//                 justify-content: center;
//                 flex-wrap: wrap;
//             }
//             .btn-outline {
//                 background: transparent;
//                 border: 2px solid var(--primary);
//                 color: var(--primary);
//                 padding: 0.75rem 1.5rem;
//                 border-radius: 8px;
//                 cursor: pointer;
//                 transition: all 0.3s ease;
//             }
//             .btn-outline:hover {
//                 background: var(--primary);
//                 color: white;
//             }
//             .error-state {
//                 text-align: center;
//                 padding: 2rem;
//             }
//             .error-icon {
//                 font-size: 3rem;
//                 margin-bottom: 1rem;
//             }
//             .error-suggestions {
//                 display: grid;
//                 grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//                 gap: 1rem;
//                 margin: 2rem 0;
//             }
//             .suggestion {
//                 display: flex;
//                 align-items: flex-start;
//                 gap: 1rem;
//                 padding: 1rem;
//                 background: #f8f9fa;
//                 border-radius: 8px;
//                 text-align: left;
//             }
//             .suggestion-icon {
//                 font-size: 1.5rem;
//                 flex-shrink: 0;
//             }
//         `;
//         document.head.appendChild(style);
//     }
// }

// function saveSkillAnalysis() {
//     showNotification('Analysis saved to your dashboard!', 'success');
// }

// function shareSkillAnalysis() {
//     showNotification('Share feature coming soon!', 'info');
// }

// function retryAnalysis() {
//     document.getElementById('skill-form').dispatchEvent(new Event('submit'));
// }

// js/skillAnalyzer.js

import { skillsAPI } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("skill-form");
  const resultsContainer = document.getElementById("results-container");

  if (!form) {
    console.error("❌ Skill Analyzer form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // 🚫 Prevent reload

    const userSkills = document.getElementById("user-skills").value.trim();
    const desiredJob = document.getElementById("desired-job").value.trim();

    if (!userSkills || !desiredJob) {
      alert("Please enter your skills and desired job role!");
      return;
    }

    resultsContainer.innerHTML = `<p>⏳ Analyzing skills...</p>`;

    try {
      const data = await skillsAPI.analyze(userSkills, desiredJob);
      resultsContainer.innerHTML = `
        <div class="analysis-results">
          <p><strong>Match Percentage:</strong> ${data.match_percentage}%</p>
          <p><strong>Matched Skills:</strong> ${data.matched_skills.join(", ")}</p>
          <p><strong>Skills to Improve:</strong> ${data.skills_to_improve.join(", ")}</p>
        </div>`;
    } catch (error) {
      console.error("❌ Error:", error);
      resultsContainer.innerHTML = `<p style="color:red;">Error analyzing skills.</p>`;
    }
  });
});
