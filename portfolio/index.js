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
  }
}

portfolioBtns.addEventListener('click', changeClassActive);

function getTranslate(lang) {
  const datasetElements = document.querySelectorAll('[data-i18]');  
  datasetElements.forEach((element) => {
    if (element.placeholder) {
      element.placeholder = i18Obj[lang][element.getAttribute('data-i18')];
      element.textContent = '';
    } else {
      element.textContent = i18Obj[lang][element.getAttribute('data-i18')];
    }
  });
}


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
window.addEventListener('beforeunload', setLocalStorage);

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
window.addEventListener('load', getLocalStorage);

const player = document.querySelector('.video-player');
const video = document.querySelector('.video');
const progress = document.querySelector('.progress');
const playBtn = document.querySelector('.play');
const playControl = document.querySelector('.play-control');
const volume = document.querySelector('.volume');
const playback = document.querySelector('.playback');
const sound = document.querySelector('.sound');
const pbText = document.querySelector('.pb');
const poster = document.querySelector('.poster');
let mousedown = false;

playBtn.addEventListener('click', togglePlay);
playControl.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateBtn);
video.addEventListener('pause', updateBtn);
video.addEventListener('timeupdate', handleProgress);
volume.addEventListener('change', updateRange);
volume.addEventListener('mousemove', updateRange);
playback.addEventListener('change', updateRange);
playback.addEventListener('mousemove', updateRange);
volume.addEventListener('input', changeColorVolume);
playback.addEventListener('input', changeColorPlayback);
progress.addEventListener('input', changeColorProgress);
progress.addEventListener('change', scrub);
sound.addEventListener('click', handleVolume);
poster.addEventListener('click', removePoster);




function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  lastProgress = progress.value;
  poster.style.display = 'none';
}

function updateBtn() {
  playBtn.classList.toggle('none');   
  if (this.paused) { 
    playControl.style.backgroundImage = "url('./assets/svg/play.svg')"; 
  } else {
    playControl.style.backgroundImage = "url('./assets/svg/pause.svg')"; 
  }
}

  function updateRange() {
    video[this.name] = this.value;
  }

  function changeColorVolume() {
    const value = this.value;
    this.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${value*100}%, #c8c8c8 ${value*100}%, #c8c8c8 100%)`;
    if (value == 0) {
      sound.style.backgroundImage = "url('./assets/svg/mute.svg')";
      video.muted = true;
    } else {
      sound.style.backgroundImage = "url('./assets/svg/volume.svg')";
      video.muted = false;
    }
  }

  function changeColorPlayback() {
    const value = this.value;
    this.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${(value-0.5)/1.5*100}%, #c8c8c8 ${(value-0.5)/1.5*100}%, #c8c8c8 100%)`;
    pbText.textContent = `×${value}`;
  }

  function changeColorProgress() {
    const value = this.value;
    this.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${value}%, #c8c8c8 ${value}%, #c8c8c8 100%)`;
  }

  function handleVolume() {
    if (video.muted) {
      video.muted = false;
      sound.style.backgroundImage = "url('./assets/svg/volume.svg')";
      if (volume.value == 0) {
        volume.value = 0.4;
        updateRange.call(volume);
      }
    } else {
      video.muted = true;
      sound.style.backgroundImage = "url('./assets/svg/mute.svg')";
    }
  }

  let lastProgress;

  function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    if (progress.value === lastProgress) {
      progress.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${percent}%, #c8c8c8 ${percent}%, #c8c8c8 100%)`;
      progress.value = percent;
      lastProgress = progress.value;
    }
  }

  function scrub() {
    const scrubTime = progress.value * video.duration / 100;
    video.currentTime = scrubTime;
    video.play();
    lastProgress = progress.value; 
  }

  function removePoster() {
    poster.style.display = 'none';
    togglePlay();
  }

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
