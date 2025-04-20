// Countdown
simplyCountdown('.simply-countdown', {
  year: 2025, // required
  month: 7, // required
  day: 10, // required
  hours: 8, // Default is 0 [0-23] integer
  words: {
    //words displayed into the countdown
    days: { singular: 'hari', plural: 'hari' },
    hours: { singular: 'jam', plural: 'jam' },
    minutes: { singular: 'menit', plural: 'menit' },
    seconds: { singular: 'detik', plural: 'detik' },
  },
});

// Navbar
const navbar = document.querySelector('.mynavbar');
const homeSection = document.querySelector('#home');

window.addEventListener('scroll', () => {
  const homeTop = homeSection.offsetTop;
  if (window.scrollY >= homeTop - 100) {
    navbar.classList.add('show');
  } else {
    navbar.classList.remove('show');
  }
});

// Offcanvas
const stickyTop = document.querySelector('.sticky-top');
const offcanvas = document.querySelector('.offcanvas');

offcanvas.addEventListener('show.bs.offcanvas', function () {
  stickyTop.style.overflow = 'visible';
});

offcanvas.addEventListener('hidden.bs.offcanvas', function () {
  stickyTop.style.overflow = 'hidden';
});

// Audio & Disable scroll
const rootElement = document.querySelector(':root');
const audioIconWrapper = document.querySelector('.audio-icon-wrapper');
const audioIcon = document.querySelector('.audio-icon-wrapper i');
const song = document.querySelector('#song');
let isPlaying = false;

function disableScroll() {
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(scrollTop, scrollLeft);
  };

  rootElement.style.scrollBehavior = 'auto';
}

function enableScroll() {
  window.onscroll = function () {};
  rootElement.style.scrollBehavior = 'smooth';
  // localStorage.setItem('opened', 'true'); // local
  playAudio();
  document.getElementById('bukaUndangan').style.display = 'none';
  document.getElementById('arrowDown').style.display = 'none';
}

function playAudio() {
  song.volume = 0.3;
  audioIconWrapper.style.display = 'flex';
  song.play();
  isPlaying = true;
}

audioIconWrapper.onclick = function () {
  if (isPlaying) {
    song.pause();
    audioIcon.classList.remove('bi-pause-circle');
    audioIcon.classList.add('bi-play-circle');
  } else {
    song.play();
    audioIcon.classList.add('bi-pause-circle');
    audioIcon.classList.remove('bi-play-circle');
  }

  isPlaying = !isPlaying;
};

// if (!localStorage.getItem("opened")) {
//   disableScroll();
// }
disableScroll();

// Konfirmasi kehadiran
window.addEventListener('load', function () {
  const form = document.getElementById('my-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const action = e.target.action;
    fetch(action, {
      method: 'POST',
      body: data,
    })
      .then(() => {
        alert('Konfirmasi Kehadiran Berhasil Terkirim!');
        form.reset();
      })
      .catch(() => {
        alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
      });
  });
});

// Ambil nama di url
const urlParams = new URLSearchParams(window.location.search);
const nama = urlParams.get('n') || '';
const pronoun = urlParams.get('p') || 'Bapak/Ibu/Saudara/i';
const namaContainer = document.querySelector('.hero h4 span');
namaContainer.innerText = `${pronoun} ${nama},`.replace(/ ,$/, ',');

document.querySelector('#nama').value = nama;
document.querySelector('#name').value = nama;

// Copy bank
function copyToClipboard(text, button) {
  navigator.clipboard
    .writeText(text)
    .then(function () {
      const icon = button.querySelector('i');
      icon.classList.remove('bi-clipboard');
      icon.classList.add('bi-clipboard-check');

      setTimeout(function () {
        icon.classList.remove('bi-clipboard-check');
        icon.classList.add('bi-clipboard');
      }, 2000);
    })
    .catch(function (err) {
      console.error('Gagal menyalin:', err);
    });
}

// Ucapan
document
  .getElementById('commentForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    const commentData = { name, message };

    fetch('/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    })
      .then((response) => response.json())
      .then((newComment) => {
        displayComment(newComment);
        document.getElementById('commentForm').reset();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Gagal mengirim komentar. Coba lagi nanti!');
      });
  });

const assignedColors = {};
let colorIndex = 0;
const colors = [
  '#e74c3c',
  '#2980b9',
  '#27ae60',
  '#8e44ad',
  '#f39c12',
  '#1abc9c',
  '#c0392b',
  '#2c3e50',
  '#d35400',
  '#7f8c8d',
];

function getUsernameColor(name) {
  if (!assignedColors[name]) {
    assignedColors[name] = colors[colorIndex % colors.length];
    colorIndex++;
  }
  return assignedColors[name];
}

function displayComment(comment) {
  const commentList = document.getElementById('commentsList');
  const listItem = document.createElement('li');
  listItem.classList.add('mb-3');

  const createdAt = dayjs(comment.createdAt);
  const now = dayjs();
  const diffInHours = now.diff(createdAt, 'hour');

  let timeDisplay = '';

  if (diffInHours >= 24) {
    timeDisplay = createdAt.format('dddd, D MMMM YYYY');
  } else {
    timeDisplay = createdAt.fromNow();
  }

  const cleanMessage = comment.message.replace(/\n/g, '<br>');

  listItem.innerHTML = `
<div class="p-3">
<div class="d-flex justify-content-between">
  <strong class="me-2" style="color: ${getUsernameColor(comment.name)};">${
    comment.name
  }</strong>
  <small class="text-muted">${timeDisplay}</small>
</div>
<p class="mt-2 mb-0 text-start">${cleanMessage}</p>
</div>
`;

  commentList.prepend(listItem);
}

function fetchComments() {
  fetch('/comments')
    .then((response) => response.json())
    .then((comments) => {
      const commentList = document.getElementById('commentsList');
      commentList.innerHTML = '';

      if (Array.isArray(comments)) {
        document.getElementById(
          'commentCount'
        ).textContent = `(${comments.length})`;

        comments
          .slice()
          .reverse()
          .forEach((comment) => {
            displayComment(comment);
          });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Gagal memuat komentar. Coba lagi nanti!');
    });
}

window.addEventListener('load', fetchComments);

// Animation
const revealElements = document.querySelectorAll('.reveal');

function handleScrollReveal() {
  revealElements.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementBottom = el.getBoundingClientRect().bottom;

    // Tambahkan animasi saat elemen terlihat
    if (elementTop < windowHeight - 100 && elementBottom > 0) {
      el.classList.add('scroll-visible');
    }
    // Hapus class saat elemen keluar dari layar
    else {
      el.classList.remove('scroll-visible');
    }
  });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);

