from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
from bs4 import BeautifulSoup
import platform
import os
import time
import glob

class SkillScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def analyze_skills(self, user_skills, desired_job):
        try:
            # Get real skills from job postings using web scraping
            required_skills = self.scrape_real_skills(desired_job)
            
            # Parse user skills
            user_skill_list = [skill.strip().lower() for skill in user_skills.split(',')]
            
            # Calculate matches
            matched_skills = []
            skills_to_improve = []
            
            for req_skill in required_skills:
                found = False
                for user_skill in user_skill_list:
                    if self.skill_match(user_skill, req_skill):
                        matched_skills.append(req_skill)
                        found = True
                        break
                if not found:
                    skills_to_improve.append(req_skill)
            
            match_percentage = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0
            
            return {
                'match_percentage': round(match_percentage, 2),
                'matched_skills': matched_skills,
                'skills_to_improve': skills_to_improve,
                'required_skills': required_skills,
                'user_skills': user_skill_list
            }
            
        except Exception as e:
            print(f"Error in skill analysis: {e}")
            return self.get_fallback_skills(user_skills, desired_job)
    
    def scrape_real_skills(self, job_title):
        """Scrape real skills from job postings"""
        skills = set()
        
        try:
            # Scrape from multiple sources
            indeed_skills = self.scrape_indeed_jobs(job_title)
            skills.update(indeed_skills)
            
            # Add common skills based on job type
            job_type_skills = self.get_job_type_skills(job_title)
            skills.update(job_type_skills)
            
        except Exception as e:
            print(f"Scraping error: {e}")
            skills = self.get_job_type_skills(job_title)
        
        return list(skills)[:15]  # Limit to top 15 skills
    
    def scrape_indeed_jobs(self, job_title):
        """Scrape job skills from Indeed"""
        skills = set()
        try:
            search_url = f"https://www.indeed.com/jobs?q={job_title.replace(' ', '+')}"
            response = requests.get(search_url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract skills from job descriptions
            job_cards = soup.find_all('div', class_='job_seen_beacon')
            
            for job in job_cards[:5]:
                description = job.get_text().lower()
                
                # Look for technical skills
                tech_skills = self.extract_tech_skills(description)
                skills.update(tech_skills)
                
                # Look for soft skills
                soft_skills = self.extract_soft_skills(description)
                skills.update(soft_skills)
                
        except Exception as e:
            print(f"Indeed scraping failed: {e}")
        
        return skills
    
    def extract_tech_skills(self, text):
        """Extract technical skills from text"""
        tech_keywords = {
            'programming': ['python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript'],
            'web': ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring', 'express'],
            'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'firebase'],
            'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform'],
            'data': ['pandas', 'numpy', 'tensorflow', 'pytorch', 'machine learning', 'data analysis', 'tableau'],
            'tools': ['git', 'github', 'gitlab', 'jira', 'linux', 'windows', 'macos', 'vscode']
        }
        
        found_skills = set()
        for category, skill_list in tech_keywords.items():
            for skill in skill_list:
                if skill in text:
                    found_skills.add(skill)
        
        return found_skills
    
    def extract_soft_skills(self, text):
        """Extract soft skills from text"""
        soft_skills = [
            'communication', 'teamwork', 'problem solving', 'leadership', 
            'adaptability', 'time management', 'creativity', 'critical thinking',
            'collaboration', 'analytical', 'presentation', 'negotiation'
        ]
        
        found_skills = set()
        for skill in soft_skills:
            if skill in text:
                found_skills.add(skill)
        
        return found_skills
    
    def get_job_type_skills(self, job_title):
        """Get skills based on job type"""
        job_lower = job_title.lower()
        
        if any(word in job_lower for word in ['frontend', 'web developer', 'ui']):
            return ['html', 'css', 'javascript', 'react', 'responsive design', 'git', 'web performance']
        elif any(word in job_lower for word in ['backend', 'server', 'api']):
            return ['python', 'java', 'node.js', 'sql', 'rest api', 'docker', 'aws', 'microservices']
        elif any(word in job_lower for word in ['fullstack', 'full stack']):
            return ['javascript', 'react', 'node.js', 'python', 'sql', 'git', 'aws', 'html', 'css']
        elif any(word in job_lower for word in ['data science', 'data analyst']):
            return ['python', 'sql', 'pandas', 'numpy', 'machine learning', 'statistics', 'data visualization']
        elif any(word in job_lower for word in ['mobile', 'android', 'ios']):
            return ['java', 'kotlin', 'swift', 'react native', 'flutter', 'mobile development']
        else:
            return ['communication', 'problem solving', 'teamwork', 'adaptability', 'technical skills']
    
    def skill_match(self, user_skill, required_skill):
        """Check if user skill matches required skill"""
        user_skill = user_skill.lower()
        required_skill = required_skill.lower()
        
        if user_skill == required_skill:
            return True
        
        # Handle common variations
        variations = {
            'js': 'javascript',
            'node': 'node.js',
            'postgres': 'postgresql',
            'ml': 'machine learning',
            'ai': 'artificial intelligence',
            'db': 'database'
        }
        
        if user_skill in variations and variations[user_skill] == required_skill:
            return True
        
        if required_skill in variations and variations[required_skill] == user_skill:
            return True
        
        return False
    
    def get_fallback_skills(self, user_skills, desired_job):
        """Fallback method"""
        user_skill_list = [skill.strip().lower() for skill in user_skills.split(',')]
        required_skills = self.get_job_type_skills(desired_job)
        
        matched_skills = []
        skills_to_improve = []
        
        for req_skill in required_skills:
            found = False
            for user_skill in user_skill_list:
                if self.skill_match(user_skill, req_skill):
                    matched_skills.append(req_skill)
                    found = True
                    break
            if not found:
                skills_to_improve.append(req_skill)
        
        match_percentage = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0
        
        return {
            'match_percentage': round(match_percentage, 2),
            'matched_skills': matched_skills,
            'skills_to_improve': skills_to_improve,
            'required_skills': required_skills,
            'user_skills': user_skill_list
        }

def get_chrome_user_data_dir():
    """Get Chrome user data directory based on OS"""
    system = platform.system()
    
    if system == "Windows":
        return os.path.join(os.environ['USERPROFILE'], 'AppData', 'Local', 'Google', 'Chrome', 'User Data')
    elif system == "Darwin":  # macOS
        return os.path.join(os.path.expanduser('~'), 'Library', 'Application Support', 'Google', 'Chrome')
    elif system == "Linux":
        return os.path.join(os.path.expanduser('~'), '.config', 'google-chrome')
    else:
        raise Exception(f"Unsupported operating system: {system}")

def find_chrome_profile(profile_name="always"):
    """Find Chrome profile directory across different devices"""
    user_data_dir = get_chrome_user_data_dir()
    
    # Check if profile exists
    profile_path = os.path.join(user_data_dir, profile_name)
    if os.path.exists(profile_path):
        return profile_name
    
    # If specific profile doesn't exist, try to find any profile
    profiles = []
    
    # Look for profile directories
    possible_patterns = [
        os.path.join(user_data_dir, "Profile *"),
        os.path.join(user_data_dir, "Default"),
        os.path.join(user_data_dir, "Profile 1"),
    ]
    
    for pattern in possible_patterns:
        for profile_dir in glob.glob(pattern):
            if os.path.isdir(profile_dir):
                profiles.append(os.path.basename(profile_dir))
    
    if profiles:
        print(f"Profile '{profile_name}' not found. Available profiles: {profiles}")
        # Use Default profile if available, otherwise use first found profile
        if "Default" in profiles:
            return "Default"
        else:
            return profiles[0]
    else:
        print("No Chrome profiles found. Using default behavior.")
        return None

def setup_chrome_driver(profile_name="always"):
    """Set up Chrome driver with automatic profile detection"""
    chrome_options = Options()
    
    try:
        # Find the best available profile
        actual_profile = find_chrome_profile(profile_name)
        user_data_dir = get_chrome_user_data_dir()
        
        if actual_profile:
            chrome_options.add_argument(f"--user-data-dir={user_data_dir}")
            chrome_options.add_argument(f"--profile-directory={actual_profile}")
            print(f"Using Chrome profile: {actual_profile}")
        else:
            print("Using Chrome with temporary profile")
            
    except Exception as e:
        print(f"Warning: Could not set up Chrome profile: {e}")
        print("Using Chrome with default settings")
    
    # Additional options for better compatibility
    chrome_options.add_argument("--no-first-run")
    chrome_options.add_argument("--no-default-browser-check")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # Keep browser open after execution
    chrome_options.add_experimental_option("detach", True)
    
    try:
        # Initialize the driver - let Selenium find Chrome automatically
        service = Service()
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        return driver
    except Exception as e:
        print(f"Error initializing Chrome driver: {e}")
        return None

def search_with_chrome(search_query, profile_name="always"):
    """Search using Chrome with automatic profile handling"""
    try:
        # Set up driver
        driver = setup_chrome_driver(profile_name)
        
        if not driver:
            print("Failed to initialize Chrome. Please make sure Chrome is installed.")
            return None
        
        # Navigate to Google
        driver.get("https://www.google.com")
        
        # Wait for search box and enter query
        wait = WebDriverWait(driver, 15)
        
        # Try different selectors for search box
        selectors = [
            "textarea[name='q']",
            "input[name='q']",
            "textarea[title='Search']",
            "input[title='Search']"
        ]
        
        search_box = None
        for selector in selectors:
            try:
                search_box = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                break
            except:
                continue
        
        if not search_box:
            print("Could not find search box. The page might look different.")
            return driver
        
        # Clear any existing text and enter search query
        search_box.clear()
        search_box.send_keys(search_query)
        search_box.send_keys(Keys.RETURN)
        
        print(f"Search completed for: '{search_query}'")
        print("Chrome browser is now open with your search results")
        
        return driver
        
    except Exception as e:
        print(f"Error during Chrome automation: {e}")
        return None

def extract_search_results(driver):
    """Extract search results from the page"""
    try:
        wait = WebDriverWait(driver, 10)
        
        # Wait for search results to load
        results = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.g")))
        
        extracted_data = []
        for result in results[:5]:  # Get first 5 results
            try:
                title_element = result.find_element(By.CSS_SELECTOR, "h3")
                link_element = result.find_element(By.CSS_SELECTOR, "a")
                
                # Try to get snippet with multiple possible selectors
                snippet = ""
                snippet_selectors = ["div.VwiC3b", "div.s3v9rd", "div.IsZvec"]
                for selector in snippet_selectors:
                    try:
                        snippet_element = result.find_element(By.CSS_SELECTOR, selector)
                        snippet = snippet_element.text
                        break
                    except:
                        continue
                
                extracted_data.append({
                    'title': title_element.text,
                    'link': link_element.get_attribute('href'),
                    'snippet': snippet
                })
            except Exception as e:
                continue
        
        return extracted_data
    except Exception as e:
        print(f"Error extracting results: {e}")
        return []

def save_comprehensive_analysis(user_skills, desired_job, analysis, learning_resources=None):
    """Save comprehensive analysis to file"""
    timestamp = int(time.time())
    filename = f"job_skills_analysis_{timestamp}.txt"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("JOB SKILLS ANALYSIS REPORT\n")
        f.write("=" * 50 + "\n\n")
        
        f.write(f"Desired Job: {desired_job}\n")
        f.write(f"Your Skills: {', '.join(analysis['user_skills'])}\n")
        f.write(f"Match Percentage: {analysis['match_percentage']}%\n")
        f.write(f"Analysis Date: {time.ctime()}\n")
        f.write(f"OS: {platform.system()} {platform.release()}\n")
        f.write("\n" + "=" * 50 + "\n\n")
        
        f.write("SKILLS ANALYSIS:\n")
        f.write("-" * 30 + "\n")
        f.write(f"✅ Matched Skills ({len(analysis['matched_skills'])}):\n")
        for skill in analysis['matched_skills']:
            f.write(f"   • {skill}\n")
        
        f.write(f"\n❌ Skills to Improve ({len(analysis['skills_to_improve'])}):\n")
        for skill in analysis['skills_to_improve']:
            f.write(f"   • {skill}\n")
        
        f.write(f"\n📋 Required Skills ({len(analysis['required_skills'])}):\n")
        for skill in analysis['required_skills']:
            f.write(f"   • {skill}\n")
        
        if learning_resources:
            f.write("\n" + "=" * 50 + "\n\n")
            f.write("LEARNING RESOURCES:\n")
            f.write("-" * 30 + "\n")
            for i, resource in enumerate(learning_resources, 1):
                f.write(f"\n{i}. {resource['title']}\n")
                f.write(f"   Link: {resource['link']}\n")
                if resource['snippet']:
                    f.write(f"   Description: {resource['snippet']}\n")
        
        f.write("\n" + "=" * 50 + "\n")
        f.write("RECOMMENDATIONS:\n")
        f.write("-" * 30 + "\n")
        if analysis['match_percentage'] >= 80:
            f.write("🎉 Excellent! You're well-qualified for this position.\n")
            f.write("Focus on highlighting your matched skills in your resume.\n")
        elif analysis['match_percentage'] >= 60:
            f.write("👍 Good match! You have a solid foundation.\n")
            f.write("Consider learning the missing skills to increase your chances.\n")
        elif analysis['match_percentage'] >= 40:
            f.write("💪 You have some relevant skills but need to improve.\n")
            f.write("Focus on learning the high-priority missing skills.\n")
        else:
            f.write("📚 Significant skill gap detected.\n")
            f.write("Consider starting with foundational courses for this career path.\n")
    
    return filename

def main_skills_analyzer():
    print("🤖 AI Job Skills Analyzer")
    print("=" * 40)
    
    # Get user input
    user_skills = input("Enter your skills (comma separated): ").strip()
    desired_job = input("Enter desired job title: ").strip()
    
    if not user_skills:
        user_skills = "communication, teamwork, problem solving"
    if not desired_job:
        desired_job = "software developer"
    
    print(f"\n🔍 Analyzing your skills for: {desired_job}")
    print("This may take a few moments...")
    
    # Analyze skills
    scraper = SkillScraper()
    analysis = scraper.analyze_skills(user_skills, desired_job)
    
    # Display quick results
    print(f"\n📊 ANALYSIS RESULTS:")
    print(f"   Match Percentage: {analysis['match_percentage']}%")
    print(f"   Matched Skills: {len(analysis['matched_skills'])}")
    print(f"   Skills to Improve: {len(analysis['skills_to_improve'])}")
    
    # Search for learning resources for missing skills
    driver = None
    learning_resources = []
    
    if analysis['skills_to_improve']:
        print(f"\n🔎 Searching for learning resources...")
        search_query = f"online courses tutorials learn {', '.join(analysis['skills_to_improve'][:3])}"
        driver = search_with_chrome(search_query)
        
        if driver:
            time.sleep(5)  # Wait for results to load
            learning_resources = extract_search_results(driver)
    
    # Save comprehensive report
    filename = save_comprehensive_analysis(user_skills, desired_job, analysis, learning_resources)
    print(f"\n💾 Comprehensive report saved to: {filename}")
    
    # Try to open the file with default text editor
    try:
        if platform.system() == "Windows":
            os.system(f'start "" "{filename}"')
        elif platform.system() == "Darwin":  # macOS
            os.system(f'open "{filename}"')
        else:  # Linux
            os.system(f'xdg-open "{filename}"')
    except:
        print(f"Could not open file automatically. Please open {filename} manually.")
    
    # Final message
    if analysis['match_percentage'] == 100:
        print(f"\n🎉 Congratulations! You are 100% eligible for {desired_job}!")
    else:
        missing = ', '.join(analysis['skills_to_improve'])
        print(f"\n📚 To improve your eligibility for {desired_job}, focus on learning: {missing}")
    
    if driver:
        print("\n🌐 Chrome browser remains open with learning resource search results")
        print("You can manually browse for more learning materials.")

if __name__ == "__main__":
    main_skills_analyzer()