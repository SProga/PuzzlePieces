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
  volume: 0.5,
});

//FUNCTIONS

function removelife() {
  totalLives--;
  let removed = lives.pop();
  setTimeout(function () {
    removed.src = heartImgs[1];
  }, 1000);
  setTimeout(function () {
    removed.src = heartImgs[2];
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
    won.play();
  }
  return (score.innerHTML = "Score: " + scorekeeper);
}

function reset(card, boardItems) {
  setTimeout(() => {
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
  }, 1500);

  if (totalLives < 1) {
    boardItems.forEach((items) => {
      items.disabled = true;
    });
    fail.play();
  } else {
    boardItems.forEach((item) => {
      if (!item.lastChild.classList.contains("card--back_active")) {
        item.disabled = false;
      }
    });
    sameItem = [];
    count = 0;
  }
}

function resetAll(prevSettings) {
  let game_board = document.querySelector(".game-board");
  game_board.innerHTML = " ";
  life_container.innerHTML = " ";
  scorekeeper = 0;
  totalLives = 3;
  updateScore(scorekeeper);
  count = 0;
  sameItem = [];
  init(prevSettings);
  mode.play();
}

function init(items = 12) {
  const imgArr = [
    "grapes.png",
    "orange.png",
    "real-food.png",
    "banana.png",
    "cake.png",
    "dog.png",
  ];

  for (let i = 0; i < 3; i++) {
    let img = document.createElement("IMG");
    img.classList.add("lifelines");
    life_container.appendChild(img);
    img.src = heartImgs[0];
    lives[i] = img;
  }

  elements = items;

  let board_location = [];
  let arr = [];
  while (arr.length < elements) {
    let r = Math.floor(Math.random() * elements);
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  let counter = 0;
  for (let i = 0; i < elements; i++) {
    for (let k = 0; k < 2; k++) {
      board_location.push([imgArr[i], arr[counter]]);
      counter++;
    }
  }

  populateBoard(elements);
  populateImages(board_location, elements);

  const card = document.querySelectorAll(".card");
  const card_front = document.querySelectorAll(".card--front");
  const card_back = document.querySelectorAll(".card--back");

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
  elements = 6;
  return elements;
  // alert("easy mode activated");
}
function hardMode(elements) {
  mode.play();
  elements = 12;
  return elements;
  // alert("hard mode activated");
}

//END OF FUNCTIONS

//EVENT HANDLERS
let easybtn = document.querySelector(".btn--easy");
easybtn.addEventListener("click", () => {
  prevSettings = easyMode();
  return resetAll(prevSettings);
});

let hardbtn = document.querySelector(".btn--hard");
hardbtn.addEventListener("click", () => {
  prevSettings = hardMode();
  return resetAll(prevSettings);
});

let resetbtn = document.querySelector(".btn");
resetbtn.addEventListener("click", () => {
  return resetAll(prevSettings);
});

//PROGRAM EXECUTION
init(12);
