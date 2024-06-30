import _ from "lodash";
import "./style.css";
import { Ship, GameBoard, Players } from "./classes";

let players;

let userShipCount = 0;

function createGame() {
  if (userShipCount === 0) {
    players = new Players();
    loadPhysicalBoard(players);
    populateRealBoard(players.real, players);
  }
  if (userShipCount === 6) {
    document.getElementById("game-container").removeChild(document.getElementById("position"));
    populateComputerBoard(players.computer);
    document.getElementById("computer").innerHTML = "";
    document.getElementById("real").innerHTML = "";
    loadPhysicalBoard(players);
    currentPlayer = "computer";
    switchTurn();
  }
}

function populateComputerBoard(board) {
  placeCompShip(board, 3);
  placeCompShip(board, 3);
  placeCompShip(board, 2);
  placeCompShip(board, 2);
  placeCompShip(board, 1);
  placeCompShip(board, 1);
}

function placeCompShip(board, length) {
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
      if (userShipCount === 6) {
        square.addEventListener("click", () =>
          processClick(square, players.real, players.real)
        );
      }
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
      if (userShipCount === 6) {
        square.addEventListener("click", () =>
          processClick(square, players.computer, players.real)
        );
      }
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
  realBoard.querySelectorAll("button").forEach((node) => {
    node.disabled = true;
    node.style.opacity = "1";
  });
  compBoard.querySelectorAll("button").forEach((node) => {
    node.disabled = true;
    node.style.opacity = ".5";
  });
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
    userShipCount = 0;
    begin();
    dialog.open = false;
  });
  dialog.appendChild(button);
  document.body.appendChild(dialog);
  dialog.open = true;
}
function populateRealBoard(board, players) {
  let gridSquares = document.querySelectorAll("#real .empty");
  let positionButton = document.createElement("button");
  positionButton.id="position"
  positionButton.textContent = "Vertical";
  positionButton.addEventListener("click", () => {
    positionButton.textContent =
      positionButton.textContent === "Vertical" ? "Horizontal" : "Vertical";
  });
  document.getElementById("game-container").appendChild(positionButton);
  gridSquares.forEach((element) => {
    element.addEventListener("click", () => {
      let length = Math.ceil(currentShipLength);
      currentShipLength -= 0.5;
      let ship = new Ship(length);
      let positioning =
        positionButton.textContent === "Vertical" ? "horizontal" : "vertical";
      let carryOn = true;
      let row = parseInt(element.id.charAt(0));
      let column = parseInt(element.id.charAt(1));
      for (let i = 0; i < length; i++) {
        if (positioning === "horizontal") {
          if (column + i >= 10 || board.board[row][column + i] !== "empty") {
            carryOn = false;
          }
        } else {
          if (row + i >= 10 || board.board[row + i][column] !== "empty") {
            carryOn = false;
          }
        }
      }

      if (carryOn) {
        board.place(
          ship,
          [parseInt(element.id.charAt(0)), parseInt(element.id.charAt(1))],
          positioning
        );
        userShipCount++;
        for (let i = 0; i < length; i++) {
          if (positioning === "horizontal") {
            let current = document.getElementById(
              "" +
                parseInt(element.id.charAt(0)) +
                "" +
                (parseInt(element.id.charAt(1)) + i) +
                "real"
            );
            current.classList.remove("empty");
            current.classList.add("ship");
          } else {
            let current = document.getElementById(
              "" +
                (parseInt(element.id.charAt(0)) + i) +
                "" +
                parseInt(element.id.charAt(1)) +
                "real"
            );
            current.classList.remove("empty");
            current.classList.add("ship");
          }
        }
      }
      if (userShipCount === 6) {
        createGame();
      }
    });
    element.addEventListener("mouseout", () => {
      let length = Math.floor(currentShipLength + 0.5);
      let positioning =
        positionButton.textContent === "Vertical" ? "horizontal" : "vertical";
      let carryOn = true;
      for (let i = 0; i < length; i++) {
        if (positioning === "horizontal") {
          if (
            parseInt(element.id.charAt(1)) + i >= 10 ||
            board.board[parseInt(element.id.charAt(0))][
              parseInt(element.id.charAt(1)) + i
            ] !== "empty"
          ) {
            carryOn = false;
            break;
          }
        } else {
          if (
            parseInt(element.id.charAt(0)) + i >= 10 ||
            board.board[parseInt(element.id.charAt(0)) + i][
              parseInt(element.id.charAt(1))
            ] !== "empty"
          ) {
            carryOn = false;
            break;
          }
        }
      }
      if (carryOn) {
        for (let i = 0; i < length; i++) {
          if (positioning === "horizontal") {
            let current = document.getElementById(
              "" +
                parseInt(element.id.charAt(0)) +
                "" +
                (parseInt(element.id.charAt(1)) + i) +
                "real"
            );
            if (current.classList.contains("ship-hover")) {
              current.classList.remove("ship-hover");
            }
            current.classList.add("empty");
          } else {
            let current = document.getElementById(
              "" +
                (parseInt(element.id.charAt(0)) + i) +
                "" +
                parseInt(element.id.charAt(1)) +
                "real"
            );
            if (current.classList.contains("ship-hover")) {
              current.classList.remove("ship-hover");
            }
            current.classList.add("empty");
          }
        }
      }
    });
    element.addEventListener("mouseover", () => {
      let length = Math.floor(currentShipLength + 0.5);
      let positioning =
        positionButton.textContent === "Vertical" ? "horizontal" : "vertical";
      let carryOn = true;

      for (let i = 0; i < length; i++) {
        if (positioning === "horizontal") {
          if (
            parseInt(element.id.charAt(1)) + i >= 10 ||
            board.board[parseInt(element.id.charAt(0))][
              parseInt(element.id.charAt(1)) + i
            ] !== "empty"
          ) {
            carryOn = false;
            break;
          }
        } else {
          if (
            parseInt(element.id.charAt(0)) + i >= 10 ||
            board.board[parseInt(element.id.charAt(0)) + i][
              parseInt(element.id.charAt(1))
            ] !== "empty"
          ) {
            carryOn = false;
            break;
          }
        }
      }

      if (carryOn) {
        for (let i = 0; i < length; i++) {
          if (positioning === "horizontal") {
            let current = document.getElementById(
              "" +
                parseInt(element.id.charAt(0)) +
                "" +
                (parseInt(element.id.charAt(1)) + i) +
                "real"
            );
            if (current) {
              current.classList.remove("empty");
              current.classList.add("ship-hover");
            }
          } else {
            let current = document.getElementById(
              "" +
                (parseInt(element.id.charAt(0)) + i) +
                "" +
                parseInt(element.id.charAt(1)) +
                "real"
            );
            if (current) {
              current.classList.remove("empty");
              current.classList.add("ship-hover");
            }
          }
        }
      }
    });
  });
}
let currentShipLength = 3;
let currentPlayer = "computer";
function begin() {
  createGame();
}
begin();
