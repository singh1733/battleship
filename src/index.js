import _ from "lodash";
import "./style.css";
import { Ship, GameBoard, Players } from "./classes";

function createGame() {
  const players = new Players();
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

function loadPhysicalBoard(players) {
  const realBoard = document.getElementById("real");
  const compBoard = document.getElementById("computer");

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement("button");
      square.id = "" + i + "" + j;
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
        processClick(square, players.real.board)
      );
    }
  }
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement("button");
      square.id = "" + i + "" + j;
      let boardSquare = players.computer.board[i][j];
      if (boardSquare === "empty" || boardSquare === "missed") {
        square.classList.add(boardSquare);
      } else {
        square.classList.add("ship");
      }
      compBoard.appendChild(square);
      square.addEventListener("click", () =>
        processClick(square, players.computer.board)
      );
    }
  }
}

function processClick(square, board) {
  let coordinateContent =
    board[square.id.charAt(0) - "0"][square.id.charAt(1) - "0"];
  if (coordinateContent === "missed") {
  } else if (coordinateContent === "empty") {
    coordinateContent = "missed";
  } else {
    board.receiveAttack(square.id.charAt(0) - "0", square.id.charAt(1) - "0");
    square.classList.add("hit");
  }
}

createGame();
