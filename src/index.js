import _ from "lodash";
import "./style.css";
import { Ship, GameBoard, Players } from "./classes";

let players;

function createGame() {
  players = new Players();
  populateBoard(players.real);
  populateBoard(players.computer);
  loadPhysicalBoard(players);
}

function populateBoard(board) {
  placeShip(board, 3);
  placeShip(board, 3);
  placeShip(board, 2);
  placeShip(board, 2);
  placeShip(board, 1);
  placeShip(board, 1);
}

function placeShip(board, length) {
  let ship = new Ship(length);
  let row = Math.floor(Math.random() * 10);
  let column = Math.floor(Math.random() * 10);
  let positioning =
    Math.floor(Math.random() * 2) === 0 ? "horizontal" : "column";
  for (let i = 0; i < length; i++) {
    if (positioning === "horizontal") {
      if (column + i >= 10 || board.board[row][column + i] !== "empty") {
        row = Math.floor(Math.random() * 10);
        column = Math.floor(Math.random() * 10);
        positioning =
          Math.floor(Math.random() * 2) == 0 ? "horizontal" : "column";
        i = 0;
      }
    } else {
      if (row + i >= 10 || board.board[row + i][column] !== "empty") {
        row = Math.floor(Math.random() * 10);
        column = Math.floor(Math.random() * 10);
        positioning =
          Math.floor(Math.random() * 2) == 0 ? "horizontal" : "column";
        i = 0;
      }
    }
  }
  board.place(ship, [row, column], positioning);
}

const realBoard = document.getElementById("real");
const compBoard = document.getElementById("computer");

function loadPhysicalBoard(players) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement("button");
      square.id = "" + i + "" + j + "real";
      let boardSquare = players.real.board[i][j];
      if (boardSquare === "empty") {
        square.classList.add("empty");
      } else if (boardSquare === "missed") {
        square.classList.add("missed");
      } else {
        square.classList.add("ship");
      }
      realBoard.appendChild(square);
      square.addEventListener("click", () =>
        processClick(square, players.real, players.real)
      );
    }
  }
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement("button");
      square.id = "" + i + "" + j + "computer";
      let boardSquare = players.computer.board[i][j];
      if (boardSquare === "empty" || boardSquare === "missed") {
        square.classList.add(boardSquare);
      } else {
        square.classList.add("ship");
      }
      compBoard.appendChild(square);
      square.addEventListener("click", () =>
        processClick(square, players.computer, players.real)
      );
    }
  }
}

function processClick(square, player, real) {
  let coordinateContent =
    player.board[square.id.charAt(0) - "0"][square.id.charAt(1) - "0"];
  if (coordinateContent === "missed") {
    if (currentPlayer === "computer") {
      setTimeout(() => computerTurn(player, real, real), 500);
    }
  } else if (coordinateContent === "empty") {
    player.board[square.id.charAt(0) - "0"][square.id.charAt(1) - "0"] =
      "missed";
    square.classList.add("miss");
    square.classList.remove("empty");
    square.innerHTML = "<div></div>";
    switchTurn(player, real);
  } else if (coordinateContent === "hit") {
    if (currentPlayer === "computer") {
      setTimeout(() => computerTurn(player, real, real), 500);
    }
  } else {
    player.receiveAttack(square.id.charAt(0) - "0", square.id.charAt(1) - "0");
    square.classList.remove("ship");
    square.classList.add("hit");
    player.board[square.id.charAt(0) - "0"][square.id.charAt(1) - "0"] = "hit";
    if (currentPlayer === "computer") {
      setTimeout(() => computerTurn(player, real, real), 500);
    }
  }


  if (player.reportAllSunk()) {
    winMessage();
  }
}

function switchTurn(player, real) {
  currentPlayer = currentPlayer === "real" ? "computer" : "real";
  if (currentPlayer === "computer") {
    realBoard.querySelectorAll("button").forEach((node) => {
      node.disabled = false;
      node.style.opacity = "1";
    });
    compBoard.querySelectorAll("button").forEach((node) => {
      node.disabled = true;
      node.style.opacity = ".5";
    });
    setTimeout(() => computerTurn(player, real, real), 500);
  } else {
    realBoard.querySelectorAll("button").forEach((node) => {
      node.disabled = true;
      node.style.opacity = ".5";
    });
    compBoard.querySelectorAll("button").forEach((node) => {
      node.disabled = false;
      node.style.opacity = "1";
    });
  }
}

function computerTurn(player, real) {
  let realDiv = document.getElementById("real");
  let realEmpties = [...realDiv.querySelectorAll(".empty")];
  let realShips = [...realDiv.querySelectorAll(".ship")];
  let availableSquares = [...realEmpties, ...realShips];
  let random = Math.floor(Math.random() * availableSquares.length);
  let row = availableSquares[random].id.charAt(0);
  let column = availableSquares[random].id.charAt(1);
  let square = document.getElementById("" + row + "" + column + "real");
  processClick(square, real, real);
}

function winMessage() {
  const dialog = document.createElement("dialog");
  const para = document.createElement("p");
  if (currentPlayer === "real") {
    para.textContent = "You won!";
  } else {
    para.textContent = "Computer won.";
  }
  dialog.appendChild(para);
  const button = document.createElement("button");
  button.textContent = "close";
  button.addEventListener("click", () => {
    document.getElementById("computer").innerHTML = "";
    document.getElementById("real").innerHTML = "";
    begin();
    dialog.open = false;
  });
  dialog.appendChild(button);
  document.body.appendChild(dialog);
  dialog.open = true;
}

let currentPlayer = "computer";
function begin() {
  createGame();
  currentPlayer = "computer";
  switchTurn();
}
begin();
