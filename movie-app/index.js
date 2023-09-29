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

console.log(
'[1] Вёрстка +10\n',
'- на странице есть несколько карточек фильмов и строка поиска. На каждой карточке фильма есть постер и название фильма. Также на карточке может быть другая информация, которую предоставляет API, например, описание фильма, его рейтинг на IMDb и т.д. +5\n',
'- в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5\n',
'[2] При загрузке приложения на странице отображаются карточки фильмов с полученными от API данными +10\n',
'[3] Если в поле поиска ввести слово и отправить поисковый запрос, на странице отобразятся карточки фильмов, в названиях которых есть это слово, если такие данные предоставляет API +10\n',
'[4] Поиск +30\n',
'- при открытии приложения курсор находится в поле ввода +5\n',
'- есть placeholder +5\n',
'- автозаполнение поля ввода отключено (нет выпадающего списка с предыдущими запросами) +5\n',
'- поисковый запрос можно отправить нажатием клавиши Enter +5\n',
'- после отправки поискового запроса и отображения результатов поиска, поисковый запрос продолжает отображаться в поле ввода +5\n',
'- в поле ввода есть крестик при клике по которому поисковый запрос из поля ввода удаляется и отображается placeholder +5\n',
'[5] Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10\n',
'- высокое качество оформления приложения предполагает собственное оригинальное оформление равное или отличающееся в лучшую сторону по сравнению с демо\n',
'- дополнительный функционал: наличие на карточке фильма его описания и рейтинга на IMDb, обработка ошибок, крестик в поисковой строке, перевод на русский язык\n',

'Итого: 60'
)