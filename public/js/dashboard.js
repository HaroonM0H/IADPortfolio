// Fetch user data from the server
fetch('/dashboard-data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Not authenticated');
        }
        return response.json();
    })
    .then(data => {
        // Update the welcome message with the username
        document.getElementById('username-display').textContent = data.username;
        
        // Load recipes and other dashboard content
        loadUserRecipes();
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = '/login';
    });

// Function to load user recipes
function loadUserRecipes() {
    fetch('/user-recipes')
        .then(response => response.json())
        .then(recipes => {
            const recipesContainer = document.getElementById('recipes-container');
            
            if (recipes.length === 0) {
                recipesContainer.innerHTML = '<p>You haven\'t added any recipes yet.</p>';
                return;
            }
            
            let recipesHTML = '<div class="recipes-grid">';
            recipes.forEach(recipe => {
                recipesHTML += `
                    <div class="recipe-card">
                        <h3>${recipe.name}</h3>
                        <p>${recipe.description}</p>
                        <p><strong>Type:</strong> ${recipe.type}</p>
                        <p><strong>Cooking Time:</strong> ${recipe.Cookingtime} minutes</p>
                        <div class="recipe-actions">
                            <a href="/edit-recipe/${recipe.rid}" class="edit-btn">Edit</a>
                            <button class="delete-btn" data-id="${recipe.rid}">Delete</button>
                        </div>
                    </div>
                `;
            });
            recipesHTML += '</div>';
            
            recipesContainer.innerHTML = recipesHTML;
            
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', handleDeleteRecipe);
            });
        })
        .catch(error => {
            console.error('Error loading recipes:', error);
            document.getElementById('recipes-container').innerHTML = 
                '<p>Error loading recipes. Please try again later.</p>';
        });
}

// Function to handle recipe deletion
function handleDeleteRecipe(event) {
    const recipeId = event.target.getAttribute('data-id');
    if (confirm('Are you sure you want to delete this recipe?')) {
        fetch(`/recipes/${recipeId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete recipe');
            return response.json();
        })
        .then(() => {
            // Reload recipes after deletion
            loadUserRecipes();
        })
        .catch(error => {
            console.error('Error deleting recipe:', error);
            alert('Failed to delete recipe. Please try again.');
        });
    }
}