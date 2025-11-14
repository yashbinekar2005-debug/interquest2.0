// Authentication functionality for InternQuest

document.addEventListener('DOMContentLoaded', function() {
    // Auth modal elements
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const closeModal = document.querySelector('.close');
    const googleLoginBtn = document.getElementById('google-login');
    const googleSignupBtn = document.getElementById('google-signup');
    
    // Show modal when login/signup buttons are clicked
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            authModal.style.display = 'block';
            document.querySelector('.tab-link[data-tab="login"]').click();
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            authModal.style.display = 'block';
            document.querySelector('.tab-link[data-tab="signup"]').click();
        });
    }
    
    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Simulate login process
            simulateLogin(email, password);
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Simulate signup process
            simulateSignup(name, email, password);
        });
    }
    
    // Google authentication
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            simulateGoogleAuth('login');
        });
    }
    
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', function() {
            simulateGoogleAuth('signup');
        });
    }
    
    // Simulate authentication functions
    function simulateLogin(email, password) {
        // In a real application, this would make an API call to your backend
        console.log('Logging in with:', email, password);
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // For demo purposes, we'll assume login is successful
            localStorage.setItem('user', JSON.stringify({
                name: 'Demo User',
                email: email
            }));
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Close modal and update UI
            authModal.style.display = 'none';
            updateUIForLoggedInUser();
            
            alert('Login successful!');
        }, 1500);
    }
    
    function simulateSignup(name, email, password) {
        // In a real application, this would make an API call to your backend
        console.log('Signing up with:', name, email, password);
        
        // Show loading state
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // For demo purposes, we'll assume signup is successful
            localStorage.setItem('user', JSON.stringify({
                name: name,
                email: email
            }));
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Close modal and update UI
            authModal.style.display = 'none';
            updateUIForLoggedInUser();
            
            alert('Account created successfully!');
        }, 1500);
    }
    
    function simulateGoogleAuth(action) {
        console.log(`Google ${action} initiated`);
        
        // In a real application, this would integrate with Google OAuth
        // For demo purposes, we'll simulate the process
        
        // Show loading state
        const googleBtn = action === 'login' ? googleLoginBtn : googleSignupBtn;
        const originalText = googleBtn.textContent;
        googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        googleBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // For demo purposes, we'll assume authentication is successful
            localStorage.setItem('user', JSON.stringify({
                name: 'Google User',
                email: 'user@gmail.com'
            }));
            
            // Reset button
            googleBtn.innerHTML = originalText;
            googleBtn.disabled = false;
            
            // Close modal and update UI
            authModal.style.display = 'none';
            updateUIForLoggedInUser();
            
            alert('Google authentication successful!');
        }, 2000);
    }
    
    function updateUIForLoggedInUser() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            // Update auth buttons to show user info
            const authButtons = document.querySelector('.auth-buttons');
            if (authButtons) {
                authButtons.innerHTML = `
                    <div class="user-info">
                        <span>Hello, ${user.name}</span>
                        <button id="logout-btn" class="btn-logout">Logout</button>
                    </div>
                `;
                
                // Add logout functionality
                document.getElementById('logout-btn').addEventListener('click', function() {
                    localStorage.removeItem('user');
                    location.reload();
                });
            }
        }
    }
    
    // Check if user is already logged in on page load
    function checkAuthStatus() {
        const user = localStorage.getItem('user');
        if (user) {
            updateUIForLoggedInUser();
        }
    }
    
    // Initialize auth status check
    checkAuthStatus();
});