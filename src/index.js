import _ from "lodash";
import "./style.css";
import { Ship, GameBoard, Players } from "./classes";

const players = new Players();

function createGame() {
  populateBoard(players.real);
  populateBoard(players.computer);
  loadPhysicalBoard(players);
}

function populateBoard(board) {
  let ship = new Ship(3);
  board.place(ship, [0, 1], "horizontal");
  ship = new Ship(2);
  board.place(ship, [0, 6], "vertical");
  ship = new Ship(1);
  board.place(ship, [9, 9], "vertical");
  ship = new Ship(2);
  board.place(ship, [9, 6], "horizontal");
  ship = new Ship(3);
  board.place(ship, [2, 6], "horizontal");
  ship = new Ship(1);
  board.place(ship, [5, 3], "horizontal");
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
      setTimeout(() => computerTurn(player, real, real), 1000);
    }
  } else if (coordinateContent === "empty") {
    player.board[square.id.charAt(0) - "0"][square.id.charAt(1) - "0"] =
      "missed";
    square.classList.add("miss");
    square.classList.remove("empty");
    square.innerHTML = "<div></div>";
    switchTurn(player, real);
  } else {
    player.receiveAttack(square.id.charAt(0) - "0", square.id.charAt(1) - "0");
    square.classList.remove("ship");
    square.classList.add("hit");
    if (currentPlayer === "computer") {
      setTimeout(() => computerTurn(player, real, real), 1000);
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
    setTimeout(() => computerTurn(player, real, real), 1000);
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
  while (true) {
    let row = Math.floor(Math.random() * 10);
    let column = Math.floor(Math.random() * 10);
    let square = document.getElementById("" + row + "" + column + "real");
    if (
      !square.classList.contains("missed") &&
      !square.classList.contains("hit")
    ) {
      processClick(square, real, real);
      return;
    }
  }
}

function winMessage() {}

createGame();
let currentPlayer = "computer";
switchTurn();
