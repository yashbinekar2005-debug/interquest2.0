from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
import os

class ResumeGenerator:
    def __init__(self):
        self.output_dir = 'generated_resumes'
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def generate_pdf(self, resume_data):
        filename = f"resume_{resume_data.get('name', 'unknown').replace(' ', '_')}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        story.append(Paragraph(resume_data.get('name', 'Your Name'), title_style))
        
        # Contact Information
        contact_info = f"""
        {resume_data.get('email', '')} | {resume_data.get('phone', '')} | {resume_data.get('location', '')}
        """
        story.append(Paragraph(contact_info, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Education
        story.append(Paragraph("Education", styles['Heading2']))
        education_text = f"""
        <b>{resume_data.get('school', '')}</b><br/>
        {resume_data.get('degree', '')} in {resume_data.get('major', '')}<br/>
        {resume_data.get('dates', '')} | GPA: {resume_data.get('gpa', '')}
        """
        story.append(Paragraph(education_text, styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Skills
        story.append(Paragraph("Skills", styles['Heading2']))
        skills_text = resume_data.get('skills', '')
        story.append(Paragraph(skills_text, styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Projects
        story.append(Paragraph("Projects", styles['Heading2']))
        projects = resume_data.get('projects', [])
        for project in projects:
            project_text = f"""
            <b>{project.get('name', 'Project Name')}</b><br/>
            {project.get('description', 'Project description')}<br/>
            <i>Technologies: {project.get('technologies', '')}</i>
            """
            story.append(Paragraph(project_text, styles['Normal']))
            story.append(Spacer(1, 8))
        
        doc.build(story)
        return filepath