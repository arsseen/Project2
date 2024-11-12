const API_KEY = 'f0f1b694500db2ecd3e070ae81f84e1e';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const searchInput = document.getElementById('search-input');
const moviesDisplay = document.getElementById('movies-display');
const movieModal = document.getElementById('movie-modal');
const movieDetails = document.getElementById('movie-details');
const closeModal = document.getElementById('close-modal');
const watchlistMovies = document.getElementById('watchlist-movies');


let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
searchInput.addEventListener('input', () => searchMovies(searchInput.value));

async function searchMovies(query) {
  if (query.length < 3) return; 
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  const data = await response.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  moviesDisplay.innerHTML = '';
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-poster">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>Дата выхода: ${movie.release_date}</p>
        <button class="add-watchlist-btn" onclick="addToWatchlist(${movie.id})">Добавить в список</button>
      </div>
    `;
    movieCard.addEventListener('click', () => showMovieDetails(movie.id));
    moviesDisplay.appendChild(movieCard);
  });
}

async function showMovieDetails(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
  const movie = await response.json();
  const modalContent = document.querySelector('#movie-modal .modal-content');
  modalContent.style.backgroundImage = `url(${IMG_BASE_URL}${movie.poster_path})`;
  movieDetails.innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.overview}</p>
    <p><strong>Рейтинг:</strong> ${movie.vote_average}</p>
    <p><strong>Длительность:</strong> ${movie.runtime} минут</p>
    <h3>В ролях:</h3>
    <p>${movie.credits.cast.slice(0, 5).map(cast => cast.name).join(', ')}</p>
  `;

  movieModal.style.display = 'block';
}
closeModal.addEventListener('click', () => {
  movieModal.style.display = 'none';
});


async function addToWatchlist(movieId) {
  if (watchlist.some(movie => movie.id === movieId)) {
    alert("Этот фильм уже в вашем списке!");
    return;
  }

  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const movie = await response.json();

  watchlist.push({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
  });

  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  displayWatchlist();
  alert("Фильм добавлен в ваш список!");
}


function displayWatchlist() {
  watchlistMovies.innerHTML = '';
  watchlist.forEach(movie => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-card');
    movieItem.innerHTML = `
      <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-poster">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <button class="remove-watchlist-btn" onclick="removeFromWatchlist(${movie.id})">Удалить</button>
      </div>
    `;

    movieItem.addEventListener('click', () => showMovieDetails(movie.id));
    watchlistMovies.appendChild(movieItem);
  });
}
function removeFromWatchlist(movieId) {
  watchlist = watchlist.filter(movie => movie.id !== movieId);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));

  displayWatchlist();
}
displayWatchlist();
