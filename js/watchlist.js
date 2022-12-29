import API_KEY from "./config.js" //delete this line and assign the API_KEY variable with your own API key

const BASE_URL_BY_IMDBID = 'https://www.omdbapi.com/?i='

async function handleFetch(url, callback){
    const response = await fetch(url)
    const data = await response.json()
    callback(data)
}

function insertMovies(data){
    const {Poster, imdbID, Title, imdbRating, Runtime, Genre, Plot} = data
    const movieItemClone = movieItemTemplate.content.cloneNode(true)
    movieItemClone.querySelector('.movie-watchlist-btn').dataset.imdb = imdbID
    movieItemClone.querySelector('.poster-img').src = Poster
    movieItemClone.querySelector('.movie-title').innerText = Title
    movieItemClone.querySelector('.movie-rating').innerText =  `⭐${imdbRating}`
    movieItemClone.querySelector('.movie-duration').innerText = `⌚${Runtime}`
    movieItemClone.querySelector('.movie-genre').innerText = Genre
    movieItemClone.querySelector('.movie-description').innerText = Plot
    movieListContainer.appendChild(movieItemClone)
}

function showMovieList(){
    userMovieWatchlist.map(id =>{
        handleFetch(`${BASE_URL_BY_IMDBID}${id}&apikey=${API_KEY}`, data =>{
            insertMovies(data)
        })
    })
}

function handleRemoveFromWatchList(event){
    userMovieWatchlist = JSON.parse(localStorage.getItem("userMovieWatchList"))
    userMovieWatchlist.filter(imdb =>{
        if(imdb === event.currentTarget.dataset.imdb){
            userMovieWatchlist.splice(userMovieWatchlist.indexOf(imdb), 1)
        }
    })
    movieListContainer.innerHTML = ''
    showMovieList()
    localStorage.setItem("userMovieWatchList", JSON.stringify(userMovieWatchlist))
    generateRemoveBtns()
    if(userMovieWatchlist.length === 0){
        movieListContainer.innerHTML = emptyWatchlistMessage
    }
}

function generateRemoveBtns(){
    setTimeout(()=>{
        const watchlistBtns = document.querySelectorAll('[data-imdb]')
        watchlistBtns.forEach(btn=>{
            btn.addEventListener('click', handleRemoveFromWatchList)
        })
    }, 2000)
}

const movieItemTemplate = document.getElementById('movie-item-template')
const movieListContainer = document.getElementById('movie-list-container')

let userMovieWatchlist = JSON.parse(localStorage.getItem("userMovieWatchList"))
let emptyWatchlistMessage = `
<div class='message flow'>
    <h2>Your watchlist is looking a little empty...</h2>
    <a class='movie-watchlist-btn' href='index.html'>Let’s add some movies!</a>
</div>
`

if(userMovieWatchlist.length === 0){
    movieListContainer.innerHTML = emptyWatchlistMessage
}

showMovieList()
generateRemoveBtns()

