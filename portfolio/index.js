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
  poster.style.opacity = '0';
  setTimeout(function() {
    poster.style.display = 'none';
  }, 1000);
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
    poster.style.opacity = '0';
    setTimeout(function() {
      poster.style.display = 'none';
    }, 1000);
    togglePlay();
  }

    console.log( 
    'Самооценка\n', 
    '[1] Вёрстка +10\n', 
      '- вёрстка видеоплеера: есть само видео, в панели управления есть кнопка Play/Pause, прогресс-бар, кнопка Volume/Mute, регулятор громкости звука +5\n', 
      '- в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5\n', 
    '[2] Кнопка Play/Pause на панели управления +10\n', 
      '- при клике по кнопке Play/Pause запускается или останавливается проигрывание видео +5\n', 
      '- внешний вид и функционал кнопки изменяется в зависимости от того, проигрывается ли видео в данный момент +5\n', 
    '[3] Прогресс-бар отображает прогресс проигрывания видео. При перемещении ползунка прогресс-бара вручную меняется текущее время проигрывания видео. Разный цвет прогресс-бара до и после ползунка +10\n', 
    '[4] При перемещении ползунка регулятора громкости звука можно сделать звук громче или тише. Разный цвет регулятора громкости звука до и после ползунка +10\n', 
    '[5] При клике по кнопке Volume/Mute можно включить или отключить звук. Одновременно с включением/выключением звука меняется внешний вид кнопки. Также внешний вид кнопки меняется, если звук включают или выключают перетягиванием регулятора громкости звука от нуля или до нуля +10\n', 
    '[6] Кнопка Play/Pause в центре видео +10\n', 
      '- есть кнопка Play/Pause в центре видео при клике по которой запускается видео и отображается панель управления +5\n', 
      '- когда видео проигрывается, кнопка Play/Pause в центре видео скрывается, когда видео останавливается, кнопка снова отображается +5\n', 
    '[7] Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10\n', 
      '- высокое качество оформления приложения предполагает собственное оригинальное оформление равное или отличающееся в лучшую сторону по сравнению с демо\n', 
    
    'Итого: 60');
