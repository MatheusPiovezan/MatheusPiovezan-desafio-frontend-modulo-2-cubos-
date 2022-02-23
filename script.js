//Visualização de filmes
const movies = document.querySelector('.movies');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const input = document.querySelector('.input');
const darkLightButton = document.querySelector('.btn-theme');
const body = document.querySelector('body');

let films = [];
let database = [];
let page = 0;
let startIndex = 0;
let endIndex = 5;

async function pageI() {
    const response = await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false");
    const body = await response.json();

    films = body.results;

    for (let i = page * 5; i < (page + 1) * 5; i++) {
        card(films[i]);
    }
};


pageI();

const card = (element) => {
    const movie = document.createElement('div');
    const movieInfo = document.createElement('div');
    const movieTitle = document.createElement('span');
    const movieRating = document.createElement('span');
    const imgStar = document.createElement('img');

    movie.classList.add('movie');
    movieInfo.classList.add('movie__info');
    movieTitle.classList.add('movie__title');
    movieRating.classList.add('movie__rating');

    movie.style = `background-image: url(${element.poster_path})`;
    movieTitle.textContent = element.title;
    imgStar.src = './assets/estrela.svg';
    imgStar.alt = 'Estrela';
    const vote = element.vote_average;

    movies.append(movie);
    movie.append(movieInfo);
    movieInfo.append(movieTitle, movieRating);
    movieRating.append(imgStar, vote);

    modal(movie, element.id);
}

//Paginação de filmes
btnNext.addEventListener('click', () => {
    startIndex += 5;
    endIndex += 5;

    if (endIndex > films.length) {
        startIndex = 0;
        endIndex = 5;
    }
    console.log(startIndex)
    console.log(endIndex)
    let newMovie = films.slice(startIndex, endIndex);
    let changeMovies = document.querySelectorAll('.movie');
    let movieTitle = document.querySelectorAll('.movie__title');
    let movieRating = document.querySelectorAll('.movie__rating');

    changeMovies.forEach((movie, index) => {
        movie.style.backgroundImage = `url(${newMovie[index].poster_path})`;
        movieTitle[index].textContent = newMovie[index].title;
        movieRating[index].textContent = newMovie[index].vote_average;

        modal(movie, newMovie[index].id)
    })
});
btnPrev.addEventListener('click', () => {
    startIndex -= 5;
    endIndex -= 5;

    if (endIndex < 4) {
        startIndex = 15;
        endIndex = 20;
    }
    let newMovie = films.slice(startIndex, endIndex);
    let changeMovies = document.querySelectorAll('.movie');
    let movieTitle = document.querySelectorAll('.movie__title');
    let movieRating = document.querySelectorAll('.movie__rating');

    changeMovies.forEach((movie, index) => {
        movie.style.backgroundImage = `url(${newMovie[index].poster_path})`;
        movieTitle[index].textContent = newMovie[index].title;
        movieRating[index].textContent = newMovie[index].vote_average;
        console.log(newMovie)
        modal(movie, newMovie[index].id)
    });
});

//Filme do dia
fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(async (response) => {
    const body = await response.json();

    const highlightVideo = document.querySelector('.highlight__video');
    const highlightTitle = document.querySelector('.highlight__title');
    const highlightRating = document.querySelector('.highlight__rating');
    const highlightGenres = document.querySelector('.highlight__genres');
    const highlightLaunch = document.querySelector('.highlight__launch');
    const highlightDescription = document.querySelector('.highlight__description');

    highlightVideo.style = `background-image: linear-gradient(rgba(0, 0, 0, 0.6)100%, rgba(0, 0, 0, 0.6)100%), url(${body.backdrop_path})`;
    highlightTitle.textContent = body.title;
    highlightRating.textContent = body.vote_average;
    const genre = [];
    body.genres.forEach((item) => {
        genre.push(item.name);
    });
    highlightGenres.textContent = genre.join(', ');
    highlightLaunch.textContent = body.release_date;
    highlightDescription.textContent = body.overview;
});
fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(async (response) => {
    const body = await response.json();

    const highlightVideoLink = document.querySelector('.highlight__video-link');
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
});

//Modal de filme
const modal = (film, id) => {
    film.addEventListener('click', () => {
        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`).then(async (response) => {
            const body = await response.json();

            const modal_hidden = document.querySelector('.modal');
            const modalTitle = document.querySelector('.modal__title');
            const modalImg = document.querySelector('.modal__img');
            const modalDescription = document.querySelector('.modal__description');
            const modalAverage = document.querySelector('.modal__average');
            const modalGenres = document.querySelector('.modal__genres');

            modalTitle.textContent = body.title;
            modalImg.src = body.backdrop_path;
            modalDescription.textContent = body.overview;
            modalAverage.textContent = body.vote_average;
            modal_hidden.classList.remove('hidden');
            modalGenres.innerHTML = '';

            body.genres.forEach((item) => {
                const genre = document.createElement('span');

                genre.classList.add('modal__genre');
                genre.textContent = item.name

                modalGenres.append(genre);
            });

            modal_hidden.addEventListener('click', () => {
                const genres = document.querySelector('.modal__genres');

                modal_hidden.classList.add('hidden');
                genres.textContent = '';
            });
        });
    });
};

//Busca de filmes
input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;

    if (event.key === 'Enter') {
        deleteMovie();

        if (input.value.trim() === '') {
            database = [];
            page = 0;
            pageI();
        } else {
            fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`).then(async (resposta) => {
                const body = await resposta.json()

                database = body.results

                for (let i = 0; i < 5; i++) {
                    card(database.length ? database[i] : films[i])
                }
                input.value = ''
                console.log(database)
            });
        };
    };
});
function deleteMovie() {
    while (movies.firstChild) {
        movies.removeChild(movies.firstChild);
    };
};

//Mudança de tema
if (localStorage.getItem('theme')) {
    setTheme();
};

darkLightButton.addEventListener('click', () => {

    if (localStorage.getItem('theme') == 'dark') {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
    setTheme();
});

function setTheme() {

    if (localStorage.getItem('theme') === 'dark') {
        darkLightButton.src = './assets/dark-mode.svg';
        body.style.setProperty('--background-color', '#242424');
        body.style.setProperty('--input-border-color', '#FFFFFF');
        body.style.setProperty('--color', '#FFFFFF');
        body.style.setProperty('--shadow-color', '0px 4px 8px rgba(255, 255, 255, 0.15)');
        body.style.setProperty('--highlight-background', '#454545');
        body.style.setProperty('--highlight-color', 'rgba(255, 255, 255, 0.7)');
        body.style.setProperty('--highlight-description', '#FFFFFF');
        btnNext.src = './assets/seta-direita-branca.svg';
        btnPrev.src = './assets/seta-esquerda-branca.svg';
    } else {
        darkLightButton.src = './assets/light-mode.svg';
        body.style.setProperty('--background-color', '#FFF');
        body.style.setProperty('--input-border-color', '#979797');
        body.style.setProperty('--color', '#000');
        body.style.setProperty('--shadow-color', '0px 4px 8px rgba(0, 0, 0, 0.15)');
        body.style.setProperty('--highlight-background', '#FFF');
        body.style.setProperty('--highlight-color', 'rgba(0, 0, 0, 0.7)');
        body.style.setProperty('--highlight-description', '#000');
        btnNext.src = './assets/seta-direita-preta.svg';
        btnPrev.src = './assets/seta-esquerda-preta.svg';
    }
};
