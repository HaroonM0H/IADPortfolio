// Display message if present in URL parameters
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const username = urlParams.get('username');
    const error = urlParams.get('error');
    
    if (message) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        
        if (error) {
            messageContainer.classList.add('error');
        }
    }
    
    // Pre-fill username if provided
    if (username) {
        document.getElementById('username').value = username;
    }
};