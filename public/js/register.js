function validateForm() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageContainer = document.getElementById('message-container');
    
    // Check password length
    if (password.length < 8) {
        messageContainer.textContent = 'Password must be at least 8 characters long';
        messageContainer.classList.add('error');
        messageContainer.style.display = 'block';
        return false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        messageContainer.textContent = 'Passwords do not match';
        messageContainer.classList.add('error');
        messageContainer.style.display = 'block';
        return false;
    }
    
    return true;
}

// Display message if present in URL params
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const error = urlParams.get('error');
    
    if (message) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        
        if (error) {
            messageContainer.classList.add('error');
        }
    }
};