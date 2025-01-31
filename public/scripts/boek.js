var currentIndex;

let lastScrollTop = 0;

let autoplayBook = false;
let autonextPage = false;
let textSize = "16px";
let textColor = "#000000";

// Load settings from localStorage on page load
window.addEventListener("load", function () {});

document.addEventListener("DOMContentLoaded", function () {
  const flipbook = document.getElementById("flipbook");
  const flipbookMobile = document.getElementById("mobileFlipbook");

  const audio = document.querySelector("audio");

  const inhoudItems = document.querySelectorAll(".inhoudItem");

  var boekValue = document.getElementById("boekJSON");
  var indexValue = document.getElementById("index");

  var boek = JSON.parse(boekValue.dataset.testValue);
  var requestedIndex = JSON.parse(indexValue.dataset.testValue);
  var pages = 0;

  function calcPages() {
    boek.hoofdstukken.forEach(function (hoofdstuk) {
      pages += hoofdstuk.aantalPag;
    });
  }

  currentIndex = requestedIndex;

  calcPages();

  function showPage(index) {
    if (index === 0) {
      if (autoplayBook) {
        console.log("cover overslaan");
        setTimeout(() => {
          playNext();
        }, 500);
      }
    }
    const offset = -index * 100;
    flipbook.style.transform = `translateX(${offset}%)`;
    flipbookMobile.style.transform = `translateX(${offset}%)`;
    currentIndex = index;

    playAudio();
    changeButton();
  }

  document.querySelector(".prev").addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      showPage(currentIndex);
    }
  });

  document.querySelector(".next").addEventListener("click", function () {
    //console.log(currentIndex);
 playNext();
  });

  document.querySelector(".close").addEventListener("click", function () {
    console.log("close");
    window.location.href = "/";
  });

  const audioFiles = ["cover"];

  boek.hoofdstukken.forEach(function (hoofdstuk) {
    for (let i = 1; i <= hoofdstuk.aantalPag; i++) {
      audioFiles.push(
        "/Audio/" + boek.nummer + "/" + hoofdstuk.image + "_" + i + ".mp3"
      );
    }
  });

  function playNext(){
    if (currentIndex < pages) {
      currentIndex++;
      showPage(currentIndex);
    }
  }

  function playAudio() {
    audio.pause();
    playState = "pause";
    if (currentIndex > 0) {
      playState = "play";
      audio.src = audioFiles[currentIndex];
      audio.addEventListener("loadedmetadata", () => {
        console.log(audio.duration);
        if (audio.duration < 3.5) {
          console.log("empty page");
        }
      });
      console.log(audioFiles[currentIndex]);
      audio.play();
      requestAnimationFrame(whilePlaying);
    }
  }

  const settings = JSON.parse(localStorage.getItem("userSettings"));
  console.log(settings);
  if (settings) {
    autoplayBook = settings.autoplayBook;
    autonextPage = settings.autonextPage;
    textSize = settings.textSize;
    textColor = settings.textColor;

    document.getElementById("autoplayBook").checked = autoplayBook;
    document.getElementById("autonextPage").checked = autonextPage;
    document.getElementById("textSize").value = textSize;
    document.getElementById("textColor").value = textColor;

    applyTextStyles();
  }

  showPage(requestedIndex);

  playButton.addEventListener("click", () => {
    if (currentIndex == 0) {
      showPage(1);
    } else {
      if (playState === "pause") {
        audio.play();
        requestAnimationFrame(whilePlaying);
        playState = "play";
      } else {
        audio.pause();
        cancelAnimationFrame(raf);
        playState = "pause";
      }
    }
    changeButton();
  });

  audio.addEventListener("ended", function () {
    //console.log("Audio finished playing!");
    // Proceed to the next page
    if (autonextPage) {
      if (currentIndex < pages) {
        playNext();
      }
    }
  });

  inhoudItems.forEach((button) => {
    button.addEventListener("click", function () {
      showPage(button.value);
      chapterModal.classList.add("slideOut");
      setTimeout(() => {
        chapterModal.classList.remove("active", "slideOut");
        chapterModal.style.display = "none";
      }, 500);
    });
  });

  applyTextStyles();
});

function applyTextStyles() {
  // Select all paragraph elements inside .mobileContent
  const paragraphs = document.querySelectorAll(".mobileContent p");
  const titles = document.querySelectorAll(".mobileContent h2");

  // Apply styles to each element
  paragraphs.forEach((p) => {
    p.style.color = textColor;
    p.style.fontSize = textSize;
  });

  titles.forEach((t) => {
    t.style.color = textColor;
    t.style.fontSize = textSize;
  });
}

function adjustButtonPosition() {
  const audioControls = document.getElementById("audio-player-container");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");

  // Compute the desired top position
  const audioStartY = audioControls.offsetTop;
  const buttonTop = audioStartY - prev.offsetHeight - 10; // Optional margin

  if (window.innerWidth <= 440) {
    // Apply positioning for mobile
    prev.style.top = `${buttonTop}px`;
    next.style.top = `${buttonTop}px`;
  } else {
    // Reset for desktop
    next.style.top = "50%";
    next.style.transform = "translateY(-50%)";
    prev.style.top = "50%";
    prev.style.transform = "translateY(-50%)";
  }
}

window.addEventListener("resize", adjustButtonPosition);
adjustButtonPosition();
//chapter modal

const chapterButton = document.getElementById("chapters");
const chapterModal = document.getElementById("chapterModal");
const closeModal = document.getElementById("closeModal");

chapterButton.addEventListener("click", () => {
  chapterModal.classList.add("active");
  chapterModal.classList.add("open");
  chapterModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  chapterModal.classList.add("slideOut");
  setTimeout(() => {
    chapterModal.classList.remove("active", "slideOut");
    chapterModal.style.display = "none";
  }, 500);
});

//Setting modal

const SettingsButton = document.getElementById("settings");
const SettingsModal = document.getElementById("settingsModal");
const closeSettingsModal = document.getElementById("closeSettingsModal");

SettingsButton.addEventListener("click", () => {
  SettingsModal.classList.add("active");
  SettingsModal.classList.add("open");
  SettingsModal.style.display = "block";
});

closeSettingsModal.addEventListener("click", () => {
  SettingsModal.classList.add("slideOut");
  setTimeout(() => {
    SettingsModal.classList.remove("active", "slideOut");
    SettingsModal.style.display = "none";
  }, 500);
});

/** audio player */

const playButton = document.getElementById("play");
const audioPlayerContainer = document.getElementById("audio-player-container");
const seekSlider = document.getElementById("seek-slider");
const textButton = document.getElementById("text");

const flipbookContainer = document.getElementById("desktop-carousel");
const mobileflipbookContainer = document.getElementById("mobile-carousel");

let playState = "pause";
playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';

function changeButton() {
  const icon = playButton.querySelector("i");
  if (playState === "play" && icon.classList.contains("fa-play")) {
    icon.classList.remove("icon-slide-down", "icon-active");
    icon.classList.add("icon-slide-up");

    setTimeout(() => {
      icon.classList.add("fa-pause");
      icon.classList.remove("fa-play");
    }, 100);
    icon.style.opacity = "0";
    icon.classList.remove("icon-slide-up");
    icon.classList.add("icon-slide-down");

    setTimeout(() => {
      icon.classList.remove("icon-slide-down");
      icon.classList.add("icon-active");
      icon.style.opacity = "";
    }, 300);
  } else if (playState === "pause" && icon.classList.contains("fa-pause")) {
    icon.classList.remove("icon-slide-down", "icon-active");
    icon.classList.add("icon-slide-up");

    setTimeout(() => {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }, 300);

    icon.style.opacity = "0";
    icon.classList.remove("icon-slide-up");
    icon.classList.add("icon-slide-down");

    setTimeout(() => {
      icon.classList.remove("icon-slide-down");
      icon.classList.add("icon-active");
      icon.style.opacity = "";
    }, 300);
  }
}

textButton.addEventListener("click", () => {
  if (flipbookContainer.style.display !== "none") {
    flipbookContainer.style.display = "none";
    mobileflipbookContainer.style.display = "flex";
  } else {
    flipbookContainer.style.display = "flex";
    mobileflipbookContainer.style.display = "none";
  }
});

const showRangeProgress = (rangeInput) => {
  audioPlayerContainer.style.setProperty(
    "--seek-before-width",
    (rangeInput.value / rangeInput.max) * 100 + "%"
  );
};

seekSlider.addEventListener("input", (e) => {
  showRangeProgress(e.target);
});

const durationContainer = document.getElementById("duration");
const currentTimeContainer = document.getElementById("current-time");
let raf = null;

const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

const displayDuration = () => {
  durationContainer.textContent = calculateTime(audio.duration);
};

const setSliderMax = () => {
  seekSlider.max = Math.floor(audio.duration);
};

const displayBufferedAmount = () => {
  if (audio.buffered.length > 0) {
    const bufferedAmount = Math.floor(
      audio.buffered.end(audio.buffered.length - 1)
    );
    audioPlayerContainer.style.setProperty(
      "--buffered-width",
      `${(bufferedAmount / seekSlider.max) * 100}%`
    );
    //console.log('Buffered Amount:', bufferedAmount);
  }
};

const whilePlaying = () => {
  seekSlider.value = Math.floor(audio.currentTime);
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  audioPlayerContainer.style.setProperty(
    "--seek-before-width",
    `${(seekSlider.value / seekSlider.max) * 100}%`
  );
  raf = requestAnimationFrame(whilePlaying);
};

if (audio.readyState > 0) {
  displayDuration();
  setSliderMax();
  displayBufferedAmount();
} else {
  audio.addEventListener("loadedmetadata", () => {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
  });
}

audio.addEventListener("progress", displayBufferedAmount);

seekSlider.addEventListener("input", () => {
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  if (!audio.paused) {
    cancelAnimationFrame(raf);
  }
});

seekSlider.addEventListener("change", () => {
  audio.currentTime = seekSlider.value;
  if (!audio.paused) {
    requestAnimationFrame(whilePlaying);
  }
});

document
  .getElementById("settingsForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    autoplayBook = document.getElementById("autoplayBook").checked;
    autonextPage = document.getElementById("autonextPage").checked;
    textSize = document.getElementById("textSize").value;
    textColor = document.getElementById("textColor").value;

    const settings = {
      autoplayBook,
      autonextPage,
      textSize,
      textColor,
    };

    applyTextStyles();

    localStorage.setItem("userSettings", JSON.stringify(settings));
    // Show the notification
    const notification = document.getElementById("settingsNotification");
    notification.classList.add("show");

    // Hide it after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  });
