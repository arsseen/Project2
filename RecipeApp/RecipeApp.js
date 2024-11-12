const API_KEY = 'b7aa1f8b020447b9a9ef1e9fff98cf3e';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function showRecipeTitles() {
  try {
    const query = document.getElementById('searchRecept').value;
    const recipeList = document.getElementById('recipeList');
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`);
    
    if (!response.ok) throw new Error("Couldn't fetch resource");

    recipeList.innerHTML = '';
    const data = await response.json();

    for (const dish of data.results) {
      const listItem = document.createElement('div');
      listItem.classList.add('dishes-title');
      
      const dishName = document.createElement('div');
      dishName.classList.add('dishName');
      dishName.textContent = dish.title;

      const dishImage = document.createElement('img');
      dishImage.classList.add('dishImage');

      const addButton = document.createElement('button');
      addButton.textContent = 'Add to Favorites';
      addButton.classList.add('favorite-btn');
      addButton.onclick = (event) => {
        event.stopPropagation();
        addToFavorites(dish);
      };

      listItem.append(dishImage, dishName, addButton);
      recipeList.appendChild(listItem);
      await showRecipeDetails(dish.id, dishImage);
      listItem.onclick = () => showModal(dish.id);
    }

  } catch (error) {
    console.error(error);
  }
}

async function showRecipeDetails(id, dishImage) {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
    if (!response.ok) throw new Error("Couldn't fetch result");

    const data = await response.json();
    dishImage.src = data.image;
  } catch (error) {
    console.error(error);
  }
}
function addToFavorites(dish) {
  if (favorites.some(item => item.id === dish.id)) return alert("Already in Favorites!");

  favorites.push(dish);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

function renderFavorites() {
  const favoritesList = document.getElementById('favoritesList');
  favoritesList.innerHTML = '';

  favorites.forEach(dish => {
    const favoriteItem = document.createElement('div');
    favoriteItem.classList.add('dishes-title');

    const dishName = document.createElement('div');
    dishName.classList.add('dishName');
    dishName.textContent = dish.title;

    const dishImage = document.createElement('img');
    dishImage.classList.add('dishImage');
    dishImage.src = dish.image;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-btn');
    removeButton.onclick = () => removeFromFavorites(dish.id);

    favoriteItem.append(dishImage, dishName, removeButton);
    favoritesList.appendChild(favoriteItem);
  });
}
function removeFromFavorites(id) {
  favorites = favorites.filter(dish => dish.id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

function showModal(recipeId) {
  const modal = document.getElementById('recipe-modal');
  const modalContent = document.getElementById('modal-content');

  fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      modalContent.innerHTML = `
        <button id="close-modal" class="close">&times;</button>
        <h2>${data.title}</h2>
        <img src="${data.image}" alt="${data.title}" class="dishImage">
        <p><strong>Ingredients:</strong></p>
        <ul>${data.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}</ul>
        <p><strong>Instructions:</strong> ${data.instructions}</p>
      `;
      modal.style.display = 'flex';
      document.getElementById('close-modal').onclick = () => modal.style.display = 'none';
    })
    .catch(error => console.error(error));
}

document.addEventListener('DOMContentLoaded', renderFavorites);
