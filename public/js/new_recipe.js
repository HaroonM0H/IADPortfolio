document.addEventListener('DOMContentLoaded', function() {
    const recipeForm = document.getElementById('recipe-form');
    const messageContainer = document.getElementById('message-container');
    
    // Display message if present
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const error = urlParams.get('error');
    
    if (message) {
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        
        if (error) {
            messageContainer.classList.add('error');
        }
    }
    
    // Form submission handling
    recipeForm.addEventListener('submit', function(e) {
        // Basic validation
        const name = document.getElementById('name').value.trim();
        const description = document.getElementById('description').value.trim();
        const type = document.getElementById('type').value;
        const cookingtime = document.getElementById('cookingtime').value;
        const ingredients = document.getElementById('ingredients').value.trim();
        const instructions = document.getElementById('instructions').value.trim();
        
        if (!name || !description || !type || !cookingtime || !ingredients || !instructions) {
            e.preventDefault();
            messageContainer.textContent = 'Please fill out all fields';
            messageContainer.classList.add('error');
            messageContainer.style.display = 'block';
        }
    });
});