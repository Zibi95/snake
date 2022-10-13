"use strict";
const board = document.querySelector(".board");
const score = document.querySelector("h1");
const start = document.querySelector("a");
let snake = [];
let food;
let snakeDirection;
let theGame;

function game() {
  gameCheck();
  let [positionX, positionY] = [
    snake[snake.length - 1].dataset.x,
    snake[snake.length - 1].dataset.y,
  ];

  if (snakeDirection == "up") positionY--;
  if (snakeDirection == "down") positionY++;
  if (snakeDirection == "left") positionX--;
  if (snakeDirection == "right") positionX++;

  const nextMove = selector(positionX, positionY);
  snake.push(nextMove);
  snake.shift();
  snakeCheck();
  score.textContent = `Score: ${snake.length - 3}`;
}

function createBoard() {
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      let checkbox = document.createElement("input");

      checkbox.dataset.x = j;
      checkbox.dataset.y = i;
      checkbox.type = "checkbox";
      checkbox.setAttribute("disabled", "");
      board.appendChild(checkbox);
    }
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min) + 1;
}

function numberToDirection(number) {
  if (number == 1) return "up";
  if (number == 2) return "right";
  if (number == 3) return "down";
  if (number == 4) return "left";
}

function spawnSnake() {
  let positionX = getRandomNumber(9, 11);
  let positionY = getRandomNumber(9, 11);

  for (let i = 0; i < 3; i++) {
    if (snakeDirection == "up") positionY--;
    if (snakeDirection == "down") positionY++;
    if (snakeDirection == "right") positionX++;
    if (snakeDirection == "left") positionX--;

    const snakeEl = selector(positionX, positionY);

    snake.push(snakeEl);
    snakeCheck();
  }
}

function spawnFood() {
  let positionX = getRandomNumber(1, 19);
  let positionY = getRandomNumber(1, 19);

  food = board.querySelector(`[data-x='${positionX}'][data-y='${positionY}']`);

  if (snake.includes(food)) return;
  food.classList.add("food");
}

function gameCheck() {
  //Food check
  if (snake.includes(food)) {
    const snakeEl = selector(food.dataset.x, food.dataset.y);
    snake.unshift(snakeEl);
    food.classList.remove("food");
    spawnFood();
    return;
  }
  if (snake.length !== new Set(snake).size || snake.includes(null)) {
    clearInterval(theGame);
    return;
  }
}

function snakeCheck() {
  const checked = board.querySelectorAll("[data-x][data-y]");
  checked.forEach((el) => {
    if (snake.includes(el)) el.checked = true;
    else el.checked = false;
  });
}
function selector(x, y) {
  return board.querySelector(`[data-x='${x}'][data-y='${y}']`);
}

window.addEventListener("keyup", function (e) {
  if (!theGame) theGame = setInterval(game, 200);
  e.preventDefault();
  if (e.key == "ArrowDown" && snakeDirection != "up") snakeDirection = "down";
  if (e.key == "ArrowUp" && snakeDirection != "down") snakeDirection = "up";
  if (e.key == "ArrowLeft" && snakeDirection != "right")
    snakeDirection = "left";
  if (e.key == "ArrowRight" && snakeDirection != "left")
    snakeDirection = "right";
});

function init() {
  if (!board.hasChildNodes()) {
    createBoard();
  }
  clearInterval(theGame);
  theGame = false;
  if (food) {
    food.classList.remove("food");
    food = "";
  }
  snake = [];
  snakeDirection = numberToDirection(getRandomNumber(0, 4));
  spawnSnake();
  spawnFood();
}

start.addEventListener("click", () => setTimeout(init, 500));
