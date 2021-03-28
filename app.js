const imgArr = [
  "grapes.png",
  "orange.png",
  "real-food.png",
  "banana.png",
  "cake.png",
  "dog.png",
];
let sameItem = [];
let elements = 12;
let scorekeeper = 0;

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

//Sounds

var sound = new Howl({
  src: ["sounds/success2.mp3"],
  volume: 0.2,
});
var click = new Howl({
  src: ["sounds/click.mp3"],
  volume: 0.2,
});

var mode = new Howl({
  src: ["sounds/mode.mp3"],
  volume: 0.2,
});

function populateBoard() {
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

function populateImages(board) {
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

function updateScore() {
  score.innerHTML = "Score: " + ++scorekeeper;
}

function reset(card, boardItems) {
  sameItem = [];
  count = 0;
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
      }
    });
    boardItems.forEach((item) => {
      if (!item.lastChild.classList.contains("card--back_active")) {
        item.disabled = false;
      }
    });
  }, 1500);
}

populateBoard();
populateImages(board_location);

const card = document.querySelectorAll(".card");
const card_front = document.querySelectorAll(".card--front");
const card_back = document.querySelectorAll(".card--back");
let score = document.querySelector(".score");
let count = 0;

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

    console.log(sameItem);

    if (sameItem.length == 2) {
      if (compare(sameItem)) {
        sameItem.forEach((card) => {
          card.isPair = true;
        });
        setTimeout(() => {
          sound.play();
        }, 200);
        updateScore();
        reset(sameItem, card);
      } else {
        sameItem.forEach((card) => {
          if (card.isPair != true) {
            card.isPair = false;
          }
        });

        reset(sameItem, card);
      }
    }
  });
}

/* ALL BUTTON EVENTS  */
let easybtn = document.querySelector(".btn--easy");
easybtn.addEventListener("click", easyMode);

let hardbtn = document.querySelector(".btn--hard");
hardbtn.addEventListener("click", hardMode);

let resetbtn = document.querySelector(".btn");
resetbtn.addEventListener("click", resetAll);

function resetAll() {
  // alert("reset mode activated");
  mode.play();
}

function easyMode() {
  mode.play();
  // alert("easy mode activated");
}
function hardMode() {
  mode.play();
  // alert("hard mode activated");
}
