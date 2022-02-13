import i18nObj from './translate.js';

let searchString = '';
let lang = 'en';


document.getElementById("id-search").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        searchString = event.currentTarget.value;
        getData();
    }
});

const ruBtn = document.querySelector('.ru');
ruBtn.addEventListener('click', setLanguage.bind(this, 'ru'));
const enBtn = document.querySelector('.en');
enBtn.addEventListener('click', setLanguage.bind(this, 'en'));


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

    fillMain(i18nObj[lang].loading);

    const oSearch = {
        query: searchString,
        language: lang
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
            fillMain(i18nObj[lang].noConection);
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
        fillMain(i18nObj[lang].noData);
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

function setLanguage(newLang) {
    if (lang !== newLang ) {
        lang = newLang;

        if (lang === 'en') {
            ruBtn.classList.remove('active');
            enBtn.classList.add('active');
        } else {
            enBtn.classList.remove('active');
            ruBtn.classList.add('active');
        }

        getTranslate(lang);

        getData();
    }
}

function getTranslate(newLang) {
    const datasetElements = document.querySelectorAll('[data-i18n]');  
    datasetElements.forEach((element) => {
      if (element.placeholder) {
        element.placeholder = i18nObj[newLang][element.getAttribute('data-i18n')];
        element.textContent = '';
      } else {
        element.textContent = i18nObj[newLang][element.getAttribute('data-i18n')];
      }
    });
  }



getData();