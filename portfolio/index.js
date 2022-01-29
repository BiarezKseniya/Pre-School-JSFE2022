import i18Obj from './translate.js';

let lang = 'en';
let theme = 'dark';

const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');

function toggleNav() {
  nav.classList.toggle('open');
  menu.classList.toggle('open');
}

function closeNav(event) {
  if (event.target.classList.contains('nav-link')) {  
    nav.classList.remove('open');
    menu.classList.remove('open');
  }
}
menu.addEventListener('click', toggleNav);
nav.addEventListener('click', closeNav);

const portfolioBtn = document.querySelector('.portfolio_btn');
const portfolioImages = document.querySelectorAll('.portfolio_item');
const portfolioBtns = document.querySelector('.season_buttons');

portfolioBtns.addEventListener('click', changeImage);

function changeImage(event) {
  if(event.target.classList.contains('portfolio_btn')) {
      const season = event.target.dataset.season;      
      portfolioImages.forEach((img, index) => img.src = `./assets/img/${season}/${index + 1}.jpg`);
  }
}

const seasons = ['winter', 'spring', 'summer', 'autumn'];

function preloadImages() {
  seasons.forEach((element) => {
  for(let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `./assets/img/${element}/${i}.jpg`;
  }
});
}

preloadImages();

const allPortfolioBtns = document.querySelectorAll('.portfolio_btn');

function changeClassActive (event) {
  if(event.target.classList.contains('portfolio_btn')) {
    allPortfolioBtns.forEach((element) => {
      element.classList.remove('active');
    });
    event.target.classList.add('active');
  };
};

portfolioBtns.addEventListener('click', changeClassActive);

function getTranslate(lang) {
  const datasetElements = document.querySelectorAll('[data-i18]');  
  datasetElements.forEach((element) => {
    if (element.placeholder) {
      element.placeholder = i18Obj[lang][element.getAttribute('data-i18')];
      element.textContent = ''
    } else {
      element.textContent = i18Obj[lang][element.getAttribute('data-i18')];
    }
  });
};


document.querySelectorAll('.eng')[0].addEventListener('click', getTranslate.bind(this, 'en'));
document.querySelectorAll('.ru')[0].addEventListener('click', getTranslate.bind(this, 'ru'));

document.querySelectorAll('.eng')[0].addEventListener('click', switchToEng);
document.querySelectorAll('.ru')[0].addEventListener('click', switchToRu);

function switchToRu(event) {
  document.querySelector('.eng').classList.remove('active');
  document.querySelector('.ru').classList.add('active');
  lang = 'ru';
}

function switchToEng(event) {
  document.querySelector('.ru').classList.remove('active');
  document.querySelector('.eng').classList.add('active');
  lang = 'en';
}

document.querySelectorAll('.light')[0].addEventListener('click', switchTheme);

function switchTheme(event) {
const themeChange = document.querySelectorAll('.theme');
themeChange.forEach((element) =>{
  element.classList.toggle('white');
});
  if (theme === 'dark') {
    theme = 'light';
  } else {
    theme = 'dark';
  }
}

function setLocalStorage() {
  localStorage.setItem('lang', lang);
  localStorage.setItem('theme', theme);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
  if(localStorage.getItem('lang')) {
    const lang = localStorage.getItem('lang');
    getTranslate(lang);
    if (lang === 'ru') {
      switchToRu();
    }
  }
  if(localStorage.getItem('theme')) {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      switchTheme();
    }
  }
}
window.addEventListener('load', getLocalStorage)



    console.log( 
    'Самооценка\n', 
    '[1] Смена изображений в секции portfolio +25\n',
      '- при кликах по кнопкам Winter, Spring, Summer, Autumn в секции portfolio отображаются изображения из папки с соответствующим названием +20\n',
      '- кнопка, по которой кликнули, становится активной т.е. выделяется стилем. Другие кнопки при этом будут неактивными +5\n',
    '[2] Перевод страницы на два языка +25\n',
      '- при клике по надписи ru англоязычная страница переводится на русский язык +10\n',
      '- при клике по надписи en русскоязычная страница переводится на английский язык +10\n',
      '- надписи en или ru, соответствующие текущему языку страницы, становятся активными т.е. выделяются стилем +5\n',
    '[3] Переключение светлой и тёмной темы +25\n',
      '- тёмная тема приложения сменяется светлой +10\n',
      '- светлая тема приложения сменяется тёмной +10\n',
      '- после смены светлой и тёмной темы интерактивные элементы по-прежнему изменяют внешний вид при наведении и клике и при этом остаются видимыми на странице (нет ситуации с белым шрифтом на белом фоне) +5\n',
    '[4] Дополнительный функционал: выбранный пользователем язык отображения страницы и светлая или тёмная тема сохраняются при перезагрузке страницы +5\n',
    '[5] Дополнительный функционал: сложные эффекты для кнопок при наведении и/или клике +5\n', 
    
    'Итого: 75');
