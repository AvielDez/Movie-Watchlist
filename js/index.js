import API_KEY from "./config.js" //delete this line and assign the API_KEY variable with your own API key

async function handleFetch(url, callback){
    const response = await fetch(url)
    const data = await response.json()
    callback(data)
}

function getMovieImbdID(data){
    data.Search.map(movie =>{
        imdbIdArray.push(movie.imdbID)
    })
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

function setMovieInfo(){
    //    Promise.all(imdbIdArray)
    //    .then((responses) => responses.map(r => r.json()))
    //    .then(data => console.log(data))
    
    //NOT SURE HOW TO WAIT FOR ALL OF THE PROMISES TO BE DONE BEFORE MOVING ON TO THE REST OF THE CODE. I HAD TO 
    //INSERT setTimeOut TO WAIT FOR ALL THE PROMISES TO BE DONE BUT THIS NOT A GOOD SOLUTION BECAUSE IT DEPENDS ON THE SPEED OF 
    //THE INTERNET CONNECTION.
    imdbIdArray.map(id =>{
        handleFetch(`${BASE_URL_BY_IMDBID}${id}&apikey=${API_KEY}`, data =>{
            insertMovies(data)
        })
    })
}

function handleAddToWatchList(event){
    let isMovieOnList = userMovieWatchlist.includes(event.currentTarget.dataset.imdb)
    let children = event.currentTarget.children
    if(!isMovieOnList){
        userMovieWatchlist.push(event.currentTarget.dataset.imdb)
        localStorage.setItem("userMovieWatchList", JSON.stringify(userMovieWatchlist))
        children[0].src = iconRemoveSrc
        children[1].innerText = 'Remove'
    }
    else{
        userMovieWatchlist = JSON.parse(localStorage.getItem("userMovieWatchList"))
        userMovieWatchlist.filter(imdb =>{
            if(imdb === event.currentTarget.dataset.imdb){
              userMovieWatchlist.splice(userMovieWatchlist.indexOf(imdb), 1)
            }
        })
        localStorage.setItem("userMovieWatchList", JSON.stringify(userMovieWatchlist))
        children[0].src = iconAddSrc
        children[1].innerText = 'Watchlist'
    }
    console.log(userMovieWatchlist)
}

const BASE_URL_BY_SEARCH = 'https://www.omdbapi.com/?s='
const BASE_URL_BY_IMDBID = 'https://www.omdbapi.com/?i='

let imdbIdArray = []
let userMovieWatchlist = JSON.parse(localStorage.getItem("userMovieWatchList"))

const movieItemTemplate = document.getElementById('movie-item-template')
const movieListContainer = document.getElementById('movie-list-container')

const iconAddSrc = 'images/icon-add.png'
const iconRemoveSrc = 'images/icon-remove.png'

document.getElementById('search-btn').addEventListener('click', ()=>{
    const searchInput = document.getElementById('search-input')
    if(searchInput.value){
        movieListContainer.innerHTML = ''
        imdbIdArray.length = 0
        handleFetch(`${BASE_URL_BY_SEARCH}${searchInput.value}&apikey=${API_KEY}`, data =>{
            if(data.Response === "True"){
                getMovieImbdID(data)
                setMovieInfo()
                setTimeout(()=>{
                    const watchlistBtns = document.querySelectorAll('[data-imdb]')
                    watchlistBtns.forEach(btn=>{
                        userMovieWatchlist.map(movie=>{
                            if(btn.dataset.imdb === movie){
                                btn.children[0].src = iconRemoveSrc
                                btn.children[1].innerText = 'Remove'
                            }
                        })
                    })
                }, 2000)
            }
            else{
                movieListContainer.innerHTML = "<h2 class='message'>Unable to find what you’re looking for. Please try another search.</h2>"
            }
        })
        searchInput.value = ''
    }
    setTimeout(()=>{ //THIS IS NOT A GOOD SOLUTION BUT I AM UNSURE HOW TO PROCEED.
        const watchlistBtns = document.querySelectorAll('[data-imdb]')
        watchlistBtns.forEach(btn=>{
            btn.addEventListener('click', handleAddToWatchList)
        })
    }, 2000)
})