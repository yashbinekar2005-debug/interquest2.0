// Job Finder functionality

document.addEventListener('DOMContentLoaded', function() {
    const jobSearchForm = document.getElementById('job-search-form');
    const jobResultsContainer = document.getElementById('job-results-container');
    
    if (jobSearchForm) {
        jobSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const jobField = document.getElementById('job-field').value;
            const jobLocation = document.getElementById('job-location').value;
            
            if (!jobField || !jobLocation) {
                alert('Please fill in all fields');
                return;
            }
            
            searchJobs(jobField, jobLocation);
        });
    }
    
    function searchJobs(jobField, jobLocation) {
        // Show loading state
        const submitBtn = jobSearchForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Searching...';
        submitBtn.disabled = true;
        
        // In a real application, this would make an API call to the backend
        // which would then use web scraping to get job listings
        setTimeout(() => {
            // Simulate API response with scraped job data
            const jobResults = simulateJobSearch(jobField, jobLocation);
            
            // Display results
            displayJobResults(jobResults);
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2500);
    }
    
    function simulateJobSearch(jobField, jobLocation) {
        // This is a simulation - in a real app, this data would come from web scraping
        // multiple job sites like LinkedIn, Naukri.com, Indeed, etc.
        
        const jobResults = [
            {
                title: `${jobField} Intern`,
                company: 'Tech Solutions Inc.',
                location: jobLocation,
                type: 'Internship',
                posted: '2 days ago',
                description: `We are looking for a motivated ${jobField} Intern to join our dynamic team. This is a great opportunity to gain hands-on experience in a professional environment.`,
                link: '#',
                source: 'LinkedIn'
            },
            {
                title: `Junior ${jobField}`,
                company: 'Innovate Labs',
                location: jobLocation,
                type: 'Internship',
                posted: '1 week ago',
                description: `Join our team as a ${jobField} Intern and work on real projects that impact our business. We provide mentorship and growth opportunities.`,
                link: '#',
                source: 'Naukri.com'
            },
            {
                title: `${jobField} Development Intern`,
                company: 'Digital Creations',
                location: jobLocation,
                type: 'Internship',
                posted: '3 days ago',
                description: `We're seeking a ${jobField} Intern with passion for technology and eagerness to learn. You'll collaborate with our experienced developers.`,
                link: '#',
                source: 'Indeed'
            },
            {
                title: `Student ${jobField}`,
                company: 'StartUp Ventures',
                location: jobLocation,
                type: 'Internship',
                posted: 'Just now',
                description: `Perfect opportunity for students looking to gain experience in ${jobField}. Flexible hours and remote work options available.`,
                link: '#',
                source: 'LinkedIn'
            },
            {
                title: `${jobField} Trainee`,
                company: 'Global Tech',
                location: jobLocation,
                type: 'Internship',
                posted: '5 days ago',
                description: `Our ${jobField} Internship program offers comprehensive training and the chance to work on cutting-edge projects with industry experts.`,
                link: '#',
                source: 'Naukri.com'
            }
        ];
        
        return jobResults;
    }
    
    function displayJobResults(jobs) {
        if (jobs.length === 0) {
            jobResultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No internships found for your search criteria.</p>
                    <p>Try broadening your search or check back later for new opportunities.</p>
                </div>
            `;
            return;
        }
        
        const jobsHTML = jobs.map(job => `
            <div class="job-listing">
                <div class="job-header">
                    <h4 class="job-title">${job.title}</h4>
                    <span class="job-source">${job.source}</span>
                </div>
                <div class="job-company">${job.company}</div>
                <div class="job-details">
                    <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span class="job-type"><i class="fas fa-briefcase"></i> ${job.type}</span>
                    <span class="job-posted"><i class="fas fa-clock"></i> ${job.posted}</span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-actions">
                    <button class="btn-primary apply-btn" data-link="${job.link}">Apply Now</button>
                    <button class="btn-secondary save-btn">Save</button>
                </div>
            </div>
        `).join('');
        
        jobResultsContainer.innerHTML = jobsHTML;
        
        // Add event listeners to apply buttons
        const applyButtons = document.querySelectorAll('.apply-btn');
        applyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const jobLink = this.getAttribute('data-link');
                redirectToJobSite(jobLink);
            });
        });
        
        // Add CSS for job listings if not already present
        if (!document.querySelector('#job-listings-style')) {
            const style = document.createElement('style');
            style.id = 'job-listings-style';
            style.textContent = `
                .job-listing {
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    transition: var(--transition);
                }
                .job-listing:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .job-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }
                .job-title {
                    font-size: 1.2rem;
                    color: var(--primary);
                    margin-bottom: 0;
                }
                .job-source {
                    background: #e9ecef;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    color: var(--gray);
                }
                .job-company {
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }
                .job-details {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                    color: var(--gray);
                }
                .job-details span {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                .job-description {
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }
                .job-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .no-results {
                    text-align: center;
                    padding: 2rem;
                    color: var(--gray);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function redirectToJobSite(link) {
        // In a real application, this would redirect to the actual job posting
        // For demo purposes, we'll show a modal with options
        
        const modalHTML = `
            <div id="redirect-modal" class="modal">
                <div class="modal-content" style="max-width: 500px;">
                    <span class="close">&times;</span>
                    <div class="redirect-options">
                        <h3>Apply through:</h3>
                        <div class="option-list">
                            <div class="option" data-site="linkedin">
                                <i class="fab fa-linkedin"></i>
                                <span>LinkedIn</span>
                            </div>
                            <div class="option" data-site="naukri">
                                <i class="fas fa-briefcase"></i>
                                <span>Naukri.com</span>
                            </div>
                            <div class="option" data-site="indeed">
                                <i class="fas fa-search"></i>
                                <span>Indeed</span>
                            </div>
                            <div class="option" data-site="company">
                                <i class="fas fa-globe"></i>
                                <span>Company Website</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('redirect-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const redirectModal = document.getElementById('redirect-modal');
        redirectModal.style.display = 'block';
        
        // Close modal when X is clicked
        redirectModal.querySelector('.close').addEventListener('click', function() {
            redirectModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === redirectModal) {
                redirectModal.style.display = 'none';
            }
        });
        
        // Handle option selection
        const options = redirectModal.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', function() {
                const site = this.getAttribute('data-site');
                simulateRedirect(site);
                redirectModal.style.display = 'none';
            });
        });
        
        // Add CSS for redirect options if not already present
        if (!document.querySelector('#redirect-options-style')) {
            const style = document.createElement('style');
            style.id = 'redirect-options-style';
            style.textContent = `
                .redirect-options {
                    padding: 2rem;
                }
                .redirect-options h3 {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                .option-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.5rem;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: var(--transition);
                }
                .option:hover {
                    background: #f8f9fa;
                    border-color: var(--primary);
                }
                .option i {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    color: var(--primary);
                }
                @media (max-width: 576px) {
                    .option-list {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function simulateRedirect(site) {
        // Show a message instead of actually redirecting for demo purposes
        let siteName = '';
        switch(site) {
            case 'linkedin':
                siteName = 'LinkedIn';
                break;
            case 'naukri':
                siteName = 'Naukri.com';
                break;
            case 'indeed':
                siteName = 'Indeed';
                break;
            case 'company':
                siteName = 'the company website';
                break;
        }
        
        alert(`In a real application, you would be redirected to ${siteName} to apply for this position.`);
        
        // In a real application, you would use:
        // window.open('https://www.linkedin.com/jobs/view/...', '_blank');
    }
});