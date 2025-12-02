// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('full_name').value.trim();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const phone = document.getElementById('phone').value.trim();
            
            // Validation
            if (!fullName) {
                showError('Full name is required');
                return;
            }
            
            if (!username) {
                showError('Username is required');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            if (!validatePassword(password)) {
                showError('Password must be at least 6 characters');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            if (phone && !validatePhone(phone)) {
                showError('Please enter a valid phone number');
                return;
            }
            
            // Submit form if all validations pass
            registerForm.submit();
        });
    }
});

function showError(message) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }
}
