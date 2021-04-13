"use strict";

//GLOBALS
let scorekeeper = 0; //keep track of how many pairs are found
let count = 0;
let sameItem = []; //initialize the array that will hold a pair of cards
let prevSettings = 12; //initialize the state of the cards to be 12
let elements = "";
let totalLives = 3;
let score = document.querySelector(".score");
let lives = [];
let life_container = document.querySelector(".lives");
let accuracy = document.querySelector(".accuracy");
let numMoves = 0;
let totalCorrect = 0;
let tm = 0;
let time = 0;
let correct = "";
let countdowntxt = document.querySelector(".countdown__text");

const heartImgs = [
  "imgs/sprite_h.png",
  "imgs/sprite_h2.png",
  "imgs/sprite_h3.png",
];
const imgArr = [
  "png/036-icecreamstick.png",
  "png/001-gift.png",
  "png/002-pizza.png",
  "png/043-speakers.png",
  "png/015-chat.png",
  "png/004-confetti.png",
  "png/007-piñata.png",
  "png/041-lollipop.png",
  "png/049-burger.png",
  "png/038-crown.png",
  "png/045-barbecue.png",
  "png/030-doughnut.png",
  "png/032-microphone.png",
  "png/009-synthesizer.png",
  "png/031-taco.png",
  "png/040-bell.png",
  "png/022-birthday cake.png",
  "png/016-lemonade.png",
  "png/013-clock.png",
  "png/027-photocamera.png",
  "pngCraft/049-knitting.png",
  "pngCraft/035-origami.png",
  "pngCraft/031-pliers.png",
  "pngCraft/013-handsaw.png",
  "pngCraft/038-hatchet.png",
  "pngCraft/032-toolkit.png",
  "pngCraft/003-liquidglue.png",
];

//strictly for viewports less than 780px
const mobileArr = [
  "mobile/png/036-icecreamstick-small.png",
  "mobile/png/001-gift-small.png",
  "mobile/png/002-pizza-small.png",
  "mobile/png/043-speakers-small.png",
  "mobile/png/015-chat-small.png",
  "mobile/png/004-confetti-small.png",
  "mobile/png/007-piñata-small.png",
  "mobile/png/041-lollipop-small.png",
  "mobile/png/049-burger-small.png",
  "mobile/png/038-crown-small.png",
  "mobile/png/045-barbecue-small.png",
  "mobile/png/030-doughnut-small.png",
  "mobile/png/032-microphone-small.png",
  "mobile/png/009-synthesizer-small.png",
  "mobile/png/031-taco-small.png",
  "mobile/png/040-bell-small.png",
  "mobile/png/022-birthday cake-small.png",
  "mobile/png/016-lemonade-small.png",
  "mobile/png/013-clock-small.png",
  "mobile/png/027-photocamera-small.png",
  "mobile/pngCraft/049-knitting-small.png",
  "mobile/pngCraft/035-origami-small.png",
  "mobile/pngCraft/031-pliers-small.png",
  "mobile/pngCraft/013-handsaw-small.png",
  "mobile/pngCraft/038-hatchet-small.png",
  "mobile/pngCraft/032-toolkit-small.png",
  "mobile/pngCraft/003-liquidglue-small.png",
];

//AUDIO GLOBALS
let won = new Howl({
  src: ["sounds/congrats.mp3"],
  volume: 1,
  preload: false,
});

let sound = new Howl({
  src: ["sounds/success2.mp3"],
  volume: 0.2,
});
let click = new Howl({
  src: ["sounds/click.mp3"],
  volume: 1,
});
let mode = new Howl({
  src: ["sounds/mode.mp3"],
  volume: 1,
});

let swoosh = new Howl({
  src: ["sounds/bamboo_swoosh.mp3", "cable_swoosh.mp3", "thick_swoosh.mp3"],
  volume: 1,
});

let fail = new Howl({
  src: ["sounds/fail.mp3"],
  volume: 1,
  preload: false,
});
let loseheart = new Howl({
  src: ["sounds/lose_heart.mp3"],
  volume: 0.7,
  preload: false,
});

let playstate = new Howl({
  src: ["sounds/idea.mp3"],
  volume: 0.7,
  loop: true,
  preload: false,
});
let vol = document.querySelector(".tg");

//FUNCTIONS

function removelife() {
  totalLives--; //take one from the total lives
  if (totalLives >= 0) {
    let notice = document.querySelector(".last_notice");
    notice.innerHTML = "-1 Life";
    notice.classList.add("fadeUp");
    let removed = lives.pop(); //remove the life from the array
    setTimeout(function () {
      removed.src = heartImgs[1]; //after the first second show image 1
    }, 1000);
    setTimeout(function () {
      removed.src = heartImgs[2]; //after the second second show image 2
      loseheart.load();
      loseheart.play();
      notice.classList.remove("fadeUp");

      if (totalLives === 0) {
        setTimeout(() => {
          let notice = document.querySelector(".last_notice");
          notice.innerHTML = "Last Life";
          notice.classList.add("fadeUpShow");
        }, 500);
      }
    }, 2000); //this setTimeout creates an animation of the heart being removed
  }
}

/***
 /**
 * @param {number} 
 * 
 *  args the elements passed in is the number of cards on the board
 */
function populateBoard(elements) {
  let game_board = document.querySelector(".game-board");
  for (let i = 0; i < elements; i++) {
    let newDiv = document.createElement("button");
    newDiv.classList.add("card");
    let cardfront = document.createElement("div");
    cardfront.classList.add("card--front");
    let cardback = document.createElement("div");
    cardback.classList.add("card--back");
    let img_front = document.createElement("IMG");
    img_front.src = "imgs/bg2.jpg";
    img_front.srcset = "imgs/bg2.jpg 1x, imgs/bg2-small.jpg 2x";
    img_front.alt = `front of card ${i}`;
    img_front.classList.add("item-front");
    let img_back = document.createElement("IMG");
    img_back.classList.add("item-back");
    img_front.alt = `back of card ${i}`;
    cardfront.appendChild(img_front);
    cardback.appendChild(img_back);
    newDiv.appendChild(cardfront);
    newDiv.appendChild(cardback);
    game_board.appendChild(newDiv);
  }
}

function populateImages(board, elements) {
  const img_back = document.querySelectorAll(".item-back");
  let card_location = null;
  //we do it twice the amount because it is a 2d array.

  for (let i = 0; i < elements; i++) {
    for (let k = 0; k < 2; k++) {
      card_location = board[i][1];

      img_back[card_location].src = `../imgs/${board[i][0]}`; //set that indexlocation to the image stored in the 2d array
    }
  }
}

const compare = (arr) => {
  let p = 0;
  let n = 1;
  if (arr[p].lastChild.src !== arr[n].lastChild.src) {
    return false;
  } else {
    return true;
  }
}; //check to see if the cards last children passed in are the same which is the card_back class

function updateScore(scorekeeper, el) {
  const toWin = el / 2;
  if (scorekeeper === toWin) {
    const vol = playstate.volume();
    setTimeout(() => {
      playstate.volume(vol);
    }, 1500);
    playstate.volume(0);
    let wonBanner = document.querySelector(".game_notice--won");
    wonBanner.innerHTML = "YOU WON!";
    won.load();
    won.play();
  }

  score.innerHTML = "Score:" + scorekeeper;
}

function updateAccuracy() {
  const total = numMoves;
  let numRatio = "";
  let percentage = "";
  let percentage_floor = "";

  // console.log(total); //testing purposes

  if (correct === true) {
    totalCorrect++;
  }
  numRatio = totalCorrect / total;
  percentage = numRatio * 100;
  percentage_floor = Math.floor(percentage);
  accuracy.innerHTML = "Accuracy:" + percentage_floor + "%";
}

function reset(card, boardItems) {
  setTimeout(() => {
    if (totalLives < 0) {
      boardItems.forEach((item) => {
        item.disabled = true;
      });
      const vol = playstate.volume();
      setTimeout(() => {
        playstate.volume(vol);
      }, 3000);
      playstate.volume(0);
      fail.load();
      fail.play();
      let allCards = document.querySelectorAll(".card");

      allCards.forEach((card) => {
        if (!card.lastChild.classList.contains("card--back_active")) {
          card.firstChild.classList.add("card--front_active");
          card.lastChild.classList.add("card--back_active");
          swoosh.play();
        }
        allCards = null;
      });
      let lostBanner = document.querySelector(".game_notice--lost");
      lostBanner.innerHTML = "YOU LOST!";
    } else {
      card.forEach((c) => {
        if (
          c.isPair != true &&
          c.previousSibling.classList.contains("card--front_active")
        ) {
          c.previousSibling.classList.remove("card--front_active");
        }
        if (c.isPair != true && c.classList.contains("card--back_active")) {
          c.classList.remove("card--back_active");
          swoosh.play();
        }
      });
      boardItems.forEach((item) => {
        if (!item.lastChild.classList.contains("card--back_active")) {
          item.disabled = false;
        }
      }); //remember setTimeout waits
      sameItem = [];
      count = 0;
    }
  }, 1500);
}

function resetAll(prevSettings, lifelines) {
  let game_board = document.querySelector(".game-board");
  game_board.innerHTML = " ";
  life_container.innerHTML = " ";
  scorekeeper = 0;
  totalLives = lifelines;
  lives = [];
  updateScore(scorekeeper, prevSettings);
  count = 0;
  sameItem = [];
  time = 0;
  tm = 0;
  init(prevSettings);
  mode.play();
  let notice = document.querySelector(".last_notice");
  notice.innerHTML = "";
  notice.classList.remove("fadeUpShow");
  let wonBanner = document.querySelector(".game_notice--won");
  let lostBanner = document.querySelector(".game_notice--lost");
  wonBanner.innerHTML = "";
  lostBanner.innerHTML = "";
  numMoves = 0;
  totalCorrect = 0;
  accuracy.innerHTML = "Accuracy:" + totalCorrect + "%";
}

function init(items = 12) {
  disableSpam();
  for (let i = 0; i < totalLives; i++) {
    let img = document.createElement("IMG");
    img.classList.add("lifelines");
    life_container.appendChild(img);
    img.src = heartImgs[0];
    lives[i] = img;
  }

  elements = items;
  let exist = " ";
  let random = [];
  let rand = "";

  let board_location = [];
  let arr = [];
  while (arr.length < elements) {
    let r = Math.floor(Math.random() * elements);
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  let counter = 0;

  for (let i = 0; i < elements / 2; i++) {
    do {
      rand = Math.floor(Math.random() * imgArr.length);
      exist = random.includes(rand);
    } while (exist);
    random.push(rand);

    let screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      // console.log("currently in mobile setup");
      for (let k = 0; k < 2; k++) {
        board_location.push([mobileArr[rand], arr[counter]]);
        counter++;
      }
    } else {
      for (let k = 0; k < 2; k++) {
        board_location.push([imgArr[rand], arr[counter]]);
        counter++;
      }
    }
  }

  populateBoard(elements);
  populateImages(board_location, elements);

  const card = document.querySelectorAll(".card");
  const card_front = document.querySelectorAll(".card--front");
  const card_back = document.querySelectorAll(".card--back");

  if (elements === 12) {
    turnCards(3500, card, card_front, card_back);
  }
  if (elements === 18) {
    turnCards(5500, card, card_front, card_back);
  }
  if (elements >= 24) {
    turnCards(7500, card, card_front, card_back);
  } //only do this for harder modes

  for (let i = 0; i < card.length; i++) {
    card[i].addEventListener("click", (e) => {
      click.play();
      card[i].disabled = true;
      card_front[i].classList.add("card--front_active");
      card_back[i].classList.add("card--back_active");
      count++;

      if (count == 2) {
        card.forEach((c) => (c.disabled = true));
      }

      let item = "";
      item = card_back[i];
      sameItem.push(item);

      if (sameItem.length == 2) {
        ++numMoves;
        if (compare(sameItem)) {
          sameItem.forEach((card) => {
            card.parentNode.classList.add("scale");
            card.isPair = true;
            setTimeout(() => {
              card.parentNode.classList.remove("scale");
            }, 500);
          });
          setTimeout(() => {
            sound.play();
          }, 200);
          ++scorekeeper;
          correct = true;
          updateScore(scorekeeper, elements);
          reset(sameItem, card);
        } else {
          sameItem.forEach((card) => {
            if (card.isPair != true) {
              card.isPair = false;
            }
          });
          reset(sameItem, card);
          removelife();
          correct = false;
        }
        updateAccuracy();
      }
    });
  }
}

const timer = (delay, value) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  }).then(function () {
    value();
  });
};

async function turnCards(delay, card, card_front, card_back) {
  //Step 1
  //3500
  let floorTime = delay / 1000;
  time = Math.floor(floorTime);
  tm = setInterval(countDown, 1000);

  await timer(500, () => {
    card_front.forEach((c) => {
      c.classList.add("card--front_active");
    }); //for each card add the turning animation to the front of the card.
    card_back.forEach((c) => {
      c.classList.add("card--back_active");
    }); //for each card add the turning animation to the back of the card.
    card.forEach((card) => {
      card.disabled = true;
      card.classList.add("disabled");
    });
  });

  //Step 2
  await timer(delay - 1000, () => {
    card_front.forEach((c) => {
      c.classList.remove("card--front_active");
    }); //for each card remove the turning animation to the front of the card.
    card_back.forEach((c) => {
      c.classList.remove("card--back_active");
    }); //for each card remove the turning animation to the back of the card.
    swoosh.play();
    countdowntxt.innerHTML = "GO !";
    countdowntxt.style.color = "#64FFDA";
  });

  //Step 3
  await timer(500, () => {
    card.forEach((card) => {
      card.disabled = false; //make the card clickable again
      card.classList.remove("disabled"); //remove the not-allowed css property from the card.
      let allbtn = document.querySelectorAll(".btn");
      allbtn.forEach((btn) => {
        btn.classList.remove("disabled");
        btn.disabled = false;
      }); //after first delay this second delay callback :- makes each card clickable again
    });
    countdowntxt.classList.add("fadeOut");
  });

  //Step 4
  await timer(500, () => {
    countdowntxt.innerHTML = "";
    countdowntxt.classList.remove("fadeOut");
    countdowntxt.style.removeProperty("color");
  });
}

function easyMode(elements) {
  mode.play();
  elements = 12;
  return elements;
}
function hardMode(elements) {
  mode.play();
  elements = 18;
  return elements;
}
function expertMode(elements) {
  mode.play();
  elements = 24;
  return elements;
}

function disableSpam() {
  const allbtn = document.querySelectorAll(".btn");
  allbtn.forEach((btn) => {
    btn.disabled = "true";
    btn.classList.add("disabled");
  });
} //this function prevents the user from continuously clicking a button to reset or change
//the mode after clicking the button first time i.e delay between clicks

//time function called in the init function to countdown the time before the game begins
function countDown() {
  time--;
  if (time == 1) {
    clearInterval(tm);
  }
  countdowntxt.innerHTML = time;
}
//END OF FUNCTIONS

//EVENT HANDLERS
let lifelines = 3;
let easybtn = document.querySelector(".btn--easy");
easybtn.addEventListener("click", () => {
  prevSettings = easyMode();
  lifelines = 3;
  disableSpam();
  return resetAll(prevSettings, lifelines);
});

let hardbtn = document.querySelector(".btn--hard");
hardbtn.addEventListener("click", () => {
  prevSettings = hardMode();
  lifelines = 5;
  disableSpam();
  return resetAll(prevSettings, lifelines);
});
let expertbtn = document.querySelector(".btn--expert");
expertbtn.addEventListener("click", () => {
  prevSettings = expertMode();
  lifelines = 7;
  disableSpam();
  return resetAll(prevSettings, lifelines);
});
let resetbtn = document.querySelector(".btn--reset");
resetbtn.addEventListener("click", () => {
  disableSpam();
  return resetAll(prevSettings, lifelines);
});

vol.addEventListener("click", () => {
  if (vol.classList.contains("fa-volume-up")) {
    vol.classList.remove("fa-volume-up");
    vol.classList.add("fa-volume-mute");
    playstate.pause();
  } else {
    vol.classList.add("fa-volume-up");
    vol.classList.remove("fa-volume-mute");
    playstate.load();
    playstate.play();
  }
});
//PROGRAM EXECUTION
init(12);
