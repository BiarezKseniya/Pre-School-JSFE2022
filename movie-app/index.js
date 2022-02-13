let searchString = '';


document.getElementById("id-search").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        searchString = event.currentTarget.value;
        getData();
    }
});


function getApiUrl(oSearch) {
    const mainDiscUrl = 'https://api.themoviedb.org/3/discover/movie';
    const mainSearchUrl = 'https://api.themoviedb.org/3/search/movie';
    const apiKey = '414a398df6154155ef0898546e38a697';

    let sUrl = (oSearch.query ? mainSearchUrl : mainDiscUrl) + '?api_key=' + apiKey;

    for (let param in oSearch) {
        if (oSearch[param]) {
            sUrl = sUrl + '&' + param + '=' + oSearch[param];
        }
    }

    return sUrl;
}

function getData() {

    fillMain('Loading...');

    const oSearch = {
        query: searchString
    }

    const sApiUrl = getApiUrl(oSearch);

    fetch(sApiUrl)
        .then((oResponse) => {
            oResponse.json()
                .then((oData) => {
                    if (oResponse.ok) {
                        console.log(oData);
                        processData(oData);
                    } else {
                        console.log('Ошибка HTTP ' + oResponse.status);
                        console.log(oData);
                    }

                });
        })
        .catch( (error) => {
            console.log(error);
            fillMain('Connection Error');
        });
}

function processData(oData) {
    // получить текущую страницу page и общее число страниц total_pages

    
    if (oData.results.length > 0) {
        fillMain('');
        oData.results.forEach((element) => {
            createBlock(element);
        });
    } else {
        fillMain('No data found');
    }

}

function createBlock(element) {
    const main = document.getElementById('id-main');

    const movieItem = document.createElement('div');
    movieItem.classList.add('item');
    main.appendChild(movieItem);

    const img = document.createElement('img');
    //img.classList.add('gallery-img')
    img.src = getPosterUrl(element.poster_path);
    img.alt = 'movie_poster';
    movieItem.appendChild(img);

    const footerItem = document.createElement('div');
    footerItem.classList.add('footer-item');
    movieItem.appendChild(footerItem);

    const titleItem = document.createElement('h3');
    titleItem.textContent = element.title; 
    footerItem.appendChild(titleItem);

    const ratingItem = document.createElement('span');
    ratingItem.classList.add(getRatingClass(element.vote_average));
    ratingItem.textContent = element.vote_average; 
    footerItem.appendChild(ratingItem);

    const movieInfo = document.createElement('div');
    movieInfo.textContent = element.overview;
    movieInfo.classList.add('info');
    movieItem.appendChild(movieInfo);

}

function getPosterUrl(sPath) {
    if (sPath) {
        return 'https://image.tmdb.org/t/p/w300' + sPath;
    } else {
        return './assets/no-image.png';
    }
}

function getRatingClass(vote) {
    return  vote < 5 ? 'rating-red' :
            vote < 8 ? 'rating-orange' : 'rating-green';
}

function fillMain(content) {
    const main = document.getElementById('id-main');
    main.innerHTML = content;
}


getData();

