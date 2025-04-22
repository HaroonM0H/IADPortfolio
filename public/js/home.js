document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    fetch('/dashboard-data')
        .then(response => {
            if (!response.ok) {
                // User is not logged in, then hide dashboard link
                document.getElementById('dashboard-link').style.display = 'none';
                throw new Error('Not authenticated');
            }
            return response.json();
        })
        .then(data => {
            // User is logged in, shw dashboard link
            document.getElementById('dashboard-link').style.display = 'inline-block';
        })
        .catch(error => {
            console.error('Authentication check error:', error);
        });

    //search functions
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    // Add event listener for search button click
    searchButton.addEventListener('click', performSearch);
    
    // Add event listener for Enter key in search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Load all recipes initially
    loadAllRecipes();
});

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.trim();
    
    if (searchTerm === '') {
        // If search is empty, load all recipes
        loadAllRecipes();
        return;
    }
    
    // Fetch recipes that match the search term
    fetch(`/search-recipes?term=${encodeURIComponent(searchTerm)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to search recipes');
            }
            return response.json();
        })
        .then(recipes => {
            displayRecipes(recipes);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('recipes-container').innerHTML = 
                '<p>Error searching recipes. Please try again later.</p>';
        });
}

function loadAllRecipes() {
    // Fetch all recipes for the homepage
    fetch('/all-recipes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }
            return response.json();
        })
        .then(recipes => {
            displayRecipes(recipes);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('recipes-container').innerHTML = 
                '<p>Error loading recipes. Please try again later.</p>';
        });
}

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes-container');
    
    if (!recipes || recipes.length === 0) {
        recipesContainer.innerHTML = '<p>No recipes available at the moment.</p>';
        return;
    }
    
    let recipesHTML = '<div class="recipes-grid">';
    recipes.forEach(recipe => {
        // Format ingredients as a list
        const ingredientsList = recipe.ingredients ? 
            `<ul class="ingredients-list">
                ${recipe.ingredients.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}
            </ul>` : '<p>No ingredients listed</p>';
        
        // Format instructions as numbered steps
        const instructionsList = recipe.instructions ?
            `<ol class="instructions-list">
                ${recipe.instructions.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}
            </ol>` : '<p>No instructions available</p>';
        
        recipesHTML += `
            <div class="recipe-card">
                <h3>${recipe.name}</h3>
                <div class="recipe-content">
                    <p class="recipe-description">${recipe.description}</p>
                    <div class="recipe-meta">
                        <p><strong>Type:</strong> ${recipe.type}</p>
                        <p><strong>Cooking Time:</strong> ${recipe.Cookingtime} minutes</p>
                    </div>
                    <div class="recipe-section">
                        <h4>Ingredients:</h4>
                        ${ingredientsList}
                    </div>
                    <div class="recipe-section">
                        <h4>Instructions:</h4>
                        ${instructionsList}
                    </div>
                </div>
            </div>
        `;
    });
    recipesHTML += '</div>';
    
    recipesContainer.innerHTML = recipesHTML;
}