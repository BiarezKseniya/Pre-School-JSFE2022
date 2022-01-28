import i18Obj from './translate.js';

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
}

function switchToEng(event) {
  document.querySelector('.ru').classList.remove('active');
  document.querySelector('.eng').classList.add('active');
}

document.querySelectorAll('.light')[0].addEventListener('click', switchToLight);

// function switchToLight(event) {
// document.documentElement.style.setProperty('--back_color', '#fff');
// document.documentElement.style.setProperty('--font_color', '#000');
// document.documentElement.style.setProperty('--hover_color', '#000');
// }

function switchToLight(event) {
const themeChange = document.querySelectorAll('.theme');
themeChange.forEach((element) =>{
  element.classList.toggle('white');
});
}

    console.log( 
    'Самооценка\n',  
    '[1] Вёрстка соответствует макету. Ширина экрана 768px +48\n',
      '- блок <header> +6\n',
      '-секция hero +6 (прим.: выравнивание элементов переключателя языков считаю некорректным)\n',
      '-секция skills +6 (прим.: отступы от боковых границ в макете разнятся; выполнено с одинаковыми)\n',
      '-секция portfolio +6\n',
      '-секция video +6\n (прим.: выравнивание кнопки отновительно изображения в макете кажется нелогичным: отсутупы разные со всех сторон; выполнено выравнивание по центру)',
      '-секция price +6\n',
      '-секция contacts +6\n',
      '-блок <footer> +6\n',
    '[2] Ни на одном из разрешений до 320px включительно не появляется горизонтальная полоса прокрутки. Весь контент страницы при этом сохраняется: не обрезается и не удаляется +15\n',
      '- нет полосы прокрутки при ширине страницы от 1440рх до 768рх +5\n',
      '- нет полосы прокрутки при ширине страницы от 768рх до 480рх +5\n',
      '- нет полосы прокрутки при ширине страницы от 480рх до 320рх +5\n',
    '[3] На ширине экрана 768рх и меньше реализовано адаптивное меню +22\n',
      '- при ширине страницы 768рх панель навигации скрывается, появляется бургер-иконка +2\n',
      '- при нажатии на бургер-иконку справа плавно появляется адаптивное меню, бургер-иконка изменяется на крестик +4\n',
      '- высота адаптивного меню занимает всю высоту экрана. При ширине экрана 768-620рх вёрстка меню соответствует макету, когда экран становится уже, меню занимает всю ширину экрана +4\n',
      '- при нажатии на крестик адаптивное меню плавно скрывается уезжая за правую часть экрана, крестик превращается в бургер-иконку +4\n',
      '- бургер-иконка, которая при клике превращается в крестик, создана при помощи css-анимаций без использования изображений +2\n',
      '- ссылки в адаптивном меню работают, обеспечивая плавную прокрутку по якорям +2\n',
      '- при клике по ссылке в адаптивном меню адаптивное меню плавно скрывается, крестик превращается в бургер-иконку +4\n', 
    
    'Итого: 75');
