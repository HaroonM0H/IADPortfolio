document.addEventListener('DOMContentLoaded', function() {
    const recipeForm = document.getElementById('recipe-form');
    const messageContainer = document.getElementById('message-container');
    
    // Get recipe ID from URL
    const pathParts = window.location.pathname.split('/');
    const recipeId = pathParts[pathParts.length - 1];
    
    // Set form action
    recipeForm.action = `/recipes/${recipeId}`;
    
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
    
    // Fetch recipe data and populate form
    fetch(`/edit-recipe-data/${recipeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch recipe data');
            }
            return response.json();
        })
        .then(recipe => {
            // Populate form fields
            document.getElementById('name').value = recipe.name;
            document.getElementById('description').value = recipe.description;
            document.getElementById('type').value = recipe.type;
            document.getElementById('cookingtime').value = recipe.Cookingtime;
            document.getElementById('ingredients').value = recipe.ingredients;
            document.getElementById('instructions').value = recipe.instructions;
        })
        .catch(error => {
            console.error('Error:', error);
            messageContainer.textContent = `Error loading recipe: ${error.message}`;
            messageContainer.classList.add('error');
            messageContainer.style.display = 'block';
        });
    
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