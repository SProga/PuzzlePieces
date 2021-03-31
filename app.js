//GLOBALS
let scorekeeper = 0;
let count = 0;
let sameItem = [];
let prevSettings = 12;
let elements = "";
let totalLives = 3;
let score = document.querySelector(".score");
let lives = [];
let life_container = document.querySelector(".lives");

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

//AUDIO GLOBALS
let won = new Howl({
  src: ["sounds/congrats.mp3"],
  volume: 1,
});

let sound = new Howl({
  src: ["sounds/success2.mp3"],
  volume: 0.2,
});
let click = new Howl({
  src: ["sounds/click.mp3"],
  volume: 0.2,
});
let mode = new Howl({
  src: ["sounds/mode.mp3"],
  volume: 0.2,
});

let swoosh = new Howl({
  src: ["sounds/bamboo_swoosh.mp3", "cable_swoosh.mp3", "thick_swoosh.mp3"],
  volume: 0.2,
});

let fail = new Howl({
  src: ["sounds/fail.mp3"],
  volume: 0.05,
});
let loseheart = new Howl({
  src: ["sounds/lose_heart.mp3"],
  volume: 0.02,
});

let playstate = new Howl({
  src: ["sounds/idea.ogg"],
  volume: 0.1,
  loop: true,
});
let vol = document.querySelector(".tg");

//FUNCTIONS

function removelife() {
  totalLives--;
  let removed = lives.pop();
  setTimeout(function () {
    removed.src = heartImgs[1];
  }, 1000);
  setTimeout(function () {
    removed.src = heartImgs[2];
    loseheart.play();
  }, 2000);
}

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
    img_front.classList.add("item-front");
    let img_back = document.createElement("IMG");
    img_back.classList.add("item-back");
    cardfront.appendChild(img_front);
    cardback.appendChild(img_back);
    newDiv.appendChild(cardfront);
    newDiv.appendChild(cardback);
    game_board.appendChild(newDiv);
  }
}

function populateImages(board, elements) {
  const img_back = document.querySelectorAll(".item-back");

  //we do it twice the amount because it is a 2d array.
  for (let i = 0; i < elements; i++) {
    for (let k = 0; k < 2; k++) {
      card_location = board[i][1];
      img_back[card_location].src = `imgs/${board[i][0]}`;
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
};

function updateScore(scorekeeper, el) {
  const toWin = el / 2;
  if (scorekeeper === toWin) {
    const vol = playstate.volume();
    setTimeout(() => {
      playstate.volume(vol);
    }, 1500);
    playstate.volume(0);
    won.play();
  }
  return (score.innerHTML = "Score: " + scorekeeper);
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
      fail.play();
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
  updateScore(scorekeeper);
  count = 0;
  sameItem = [];
  init(prevSettings);
  mode.play();
}

function init(items = 12) {
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

    for (let k = 0; k < 2; k++) {
      board_location.push([imgArr[rand], arr[counter]]);
      counter++;
    }
  }

  populateBoard(elements);
  populateImages(board_location, elements);

  const card = document.querySelectorAll(".card");
  const card_front = document.querySelectorAll(".card--front");
  const card_back = document.querySelectorAll(".card--back");

  if (elements > 6) {
    //CALLBACK HELLLLLLLLLLLLLLLLLL NEEDS TO BE REFACTORED
    setTimeout(() => {
      card_front.forEach((c) => {
        c.classList.add("card--front_active");
      });
      card_back.forEach((c) => {
        c.classList.add("card--back_active");
      });
      setTimeout(() => {
        card_front.forEach((c) => {
          c.classList.remove("card--front_active");
        });
        card_back.forEach((c) => {
          c.classList.remove("card--back_active");
        });
        setTimeout(() => {
          card.forEach((card) => {
            card.disabled = false;
            card.classList.remove("disabled");
            setTimeout(() => {
              let allbtn = document.querySelectorAll(".btn");
              allbtn.forEach((btn) => {
                btn.classList.remove("disabled");
                btn.disabled = false;
              }, 3500);
            });
          });
        }, 500);
        swoosh.play();
      }, 1500);
      card.forEach((card) => {
        card.disabled = true;
        card.classList.add("disabled");
      });
    }, 500);
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
        if (compare(sameItem)) {
          sameItem.forEach((card) => {
            card.isPair = true;
          });
          setTimeout(() => {
            sound.play();
          }, 200);
          ++scorekeeper;
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
        }
      }
    });
  }
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
    playstate.stop();
  } else {
    vol.classList.add("fa-volume-up");
    vol.classList.remove("fa-volume-mute");
    playstate.play();
  }
});
//PROGRAM EXECUTION
init(10);
