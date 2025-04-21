// Fetch user data from the server
fetch('/dashboard-data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Not authenticated');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('user-info').innerHTML = `
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Email:</strong> ${data.email}</p>
        `;
        
        // After getting user data, fetch their recipes
        return fetch('/user-recipes');
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        return response.json();
    })
    .then(recipes => {
        const recipesContainer = document.getElementById('recipes-container');
        
        if (recipes.length === 0) {
            recipesContainer.innerHTML = '<p class="no-recipes">You don\'t have any recipes yet.</p>';
            return;
        }
        
        // Create recipe cards
        let cardsHTML = '<div class="recipe-container">';
        
        recipes.forEach(recipe => {
            cardsHTML += `
                <div class="recipe-card">
                    <h3 class="recipe-name">${recipe.name}</h3>
                    ${recipe.image ? 
                        `<img src="${recipe.image}" class="recipe-image" alt="${recipe.name}">` : 
                        `<div class="recipe-image" style="background-color: #ddd; display: flex; align-items: center; justify-content: center;">No Image</div>`
                    }
                    <div class="recipe-details">
                        <p class="recipe-description">${recipe.description}</p>
                        <div class="recipe-meta">
                            <span class="recipe-type">${recipe.type}</span>
                            <span class="recipe-time">Cooking time: ${recipe.Cookingtime} min</span>
                        </div>
                        
                        <div class="recipe-section">
                            <h4>Ingredients</h4>
                            <p>${recipe.ingredients}</p>
                        </div>
                        
                        <div class="recipe-section">
                            <h4>Instructions</h4>
                            <p>${recipe.instructions}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cardsHTML += '</div>';
        recipesContainer.innerHTML = cardsHTML;
    })
    .catch(error => {
        console.error('Error:', error);
        if (error.message === 'Not authenticated') {
            window.location.href = '/login';
        } else {
            document.getElementById('recipes-container').innerHTML = 
                `<p>Error loading recipes: ${error.message}</p>`;
        }
    });