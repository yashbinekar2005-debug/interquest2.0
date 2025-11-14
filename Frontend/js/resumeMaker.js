// Resume Maker functionality

document.addEventListener('DOMContentLoaded', function() {
    const resumeForm = document.getElementById('resume-form');
    const addProjectBtn = document.getElementById('add-project');
    const projectsContainer = document.getElementById('projects-container');
    const downloadResumeBtn = document.getElementById('download-resume');
    
    // Form fields for live preview
    const formFields = [
        'resume-name', 'resume-email', 'resume-phone', 'resume-location',
        'education-school', 'education-degree', 'education-major', 'education-gpa', 'education-dates',
        'resume-skills'
    ];
    
    // Initialize with one project
    addProjectEntry();
    
    // Add project button
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', addProjectEntry);
    }
    
    // Form submission
    if (resumeForm) {
        resumeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateResumePDF();
        });
    }
    
    // Download resume button
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', generateResumePDF);
    }
    
    // Live preview updates
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateResumePreview);
        }
    });
    
    // Project fields update (delegated event handling)
    projectsContainer.addEventListener('input', function(e) {
        if (e.target.classList.contains('project-name') || 
            e.target.classList.contains('project-description') || 
            e.target.classList.contains('project-tech')) {
            updateResumePreview();
        }
    });
    
    function addProjectEntry() {
        const projectEntry = document.createElement('div');
        projectEntry.className = 'project-entry';
        projectEntry.innerHTML = `
            <div class="form-group">
                <input type="text" class="project-name" placeholder="Project Name" required>
            </div>
            <div class="form-group">
                <textarea class="project-description" placeholder="Project Description" required></textarea>
            </div>
            <div class="form-group">
                <input type="text" class="project-tech" placeholder="Technologies Used" required>
            </div>
            <button type="button" class="btn-remove-project">Remove</button>
        `;
        
        projectsContainer.appendChild(projectEntry);
        
        // Add remove functionality
        const removeBtn = projectEntry.querySelector('.btn-remove-project');
        removeBtn.addEventListener('click', function() {
            if (projectsContainer.children.length > 1) {
                projectEntry.remove();
                updateResumePreview();
            } else {
                alert('You need at least one project');
            }
        });
    }
    
    function updateResumePreview() {
        // Update personal information
        document.getElementById('preview-name').textContent = 
            document.getElementById('resume-name').value || 'Your Name';
        document.getElementById('preview-email').textContent = 
            document.getElementById('resume-email').value || 'email@example.com';
        document.getElementById('preview-phone').textContent = 
            document.getElementById('resume-phone').value || '(123) 456-7890';
        document.getElementById('preview-location').textContent = 
            document.getElementById('resume-location').value || 'City, State';
        
        // Update education
        document.getElementById('preview-school').textContent = 
            document.getElementById('education-school').value || 'University Name';
        document.getElementById('preview-degree').textContent = 
            document.getElementById('education-degree').value || 'Bachelor of Science in Computer Science';
        document.getElementById('preview-dates').textContent = 
            document.getElementById('education-dates').value || 'August 2020 - May 2024';
        
        const gpaValue = document.getElementById('education-gpa').value;
        document.getElementById('preview-gpa').textContent = 
            gpaValue ? `GPA: ${gpaValue}` : '';
        
        // Update skills
        const skillsValue = document.getElementById('resume-skills').value;
        document.getElementById('preview-skills').innerHTML = 
            skillsValue ? `<p>${skillsValue}</p>` : '<p>Python, JavaScript, React, SQL, Git</p>';
        
        // Update projects
        const projectEntries = document.querySelectorAll('.project-entry');
        const projectsPreview = document.getElementById('preview-projects');
        
        let projectsHTML = '';
        projectEntries.forEach(entry => {
            const name = entry.querySelector('.project-name').value || 'Project Name';
            const description = entry.querySelector('.project-description').value || 'Project description goes here.';
            const tech = entry.querySelector('.project-tech').value || 'Python, React, MongoDB';
            
            projectsHTML += `
                <div class="project-entry">
                    <h3>${name}</h3>
                    <p>${description}</p>
                    <p><strong>Technologies:</strong> ${tech}</p>
                </div>
            `;
        });
        
        projectsPreview.innerHTML = projectsHTML || 
            `<div class="project-entry">
                <h3>Project Name</h3>
                <p>Project description goes here.</p>
                <p><strong>Technologies:</strong> Python, React, MongoDB</p>
            </div>`;
    }
    
    function generateResumePDF() {
        // In a real application, this would use a library like jsPDF
        // to generate an actual PDF from the resume preview
        
        // For demo purposes, we'll show a success message
        alert('In a real application, your resume would be generated as a PDF and downloaded. For now, you can take a screenshot of the resume preview.');
        
        // In a real implementation, you would use:
        // const { jsPDF } = window.jspdf;
        // const doc = new jsPDF();
        // doc.html(document.getElementById('resume-preview'), {
        //     callback: function(doc) {
        //         doc.save('resume.pdf');
        //     },
        //     x: 10,
        //     y: 10
        // });
    }
    
    // Initialize preview with placeholder values
    updateResumePreview();
});