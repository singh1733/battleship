import _ from "lodash";
import "./style.css";
import { Ship, GameBoard, Players } from "./classes";

let players;

function createGame() {
  //when there are 0 ships on real board
  if (userShipCount === 0) {
    players = new Players();
    loadPhysicalBoard(players);
    populateRealBoard(players.real, players);
  }
  //when there are 6 ships on real board, start game
  if (userShipCount === 6) {
    document
      .getElementById("game-container")
      .removeChild(document.getElementById("position"));
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

function computerShipData() {
  let row = Math.floor(Math.random() * 10);
  let column = Math.floor(Math.random() * 10);
  let positioning =
    Math.floor(Math.random() * 2) == 0 ? "horizontal" : "column";
  return { row, column, positioning };
}

function placeCompShip(board, length) {
  let ship = new Ship(length);
  let { row, column, positioning } = computerShipData();
  //check for any overlap
  for (let i = 0; i < length; i++) {
    if (positioning === "horizontal") {
      if (column + i >= 10 || board.board[row][column + i] !== "empty") {
        ({ row, column, positioning } = computerShipData());
        i = 0;
      }
    } else {
      if (row + i >= 10 || board.board[row + i][column] !== "empty") {
        ({ row, column, positioning } = computerShipData());
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
      //if the user board has 6 ships, allow for the buttons to be functional
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
    player.board[parseInt(square.id.charAt(0))][parseInt(square.id.charAt(1))];
  if (coordinateContent === "missed") {
    //allow replay
    if (currentPlayer === "computer") {
      setTimeout(() => computerTurn(player, real, real), 500);
    }
  } else if (coordinateContent === "empty") {
    player.board[parseInt(square.id.charAt(0))][parseInt(square.id.charAt(1))] =
      "missed";
    square.classList.add("miss");
    square.classList.remove("empty");
    square.innerHTML = "<div></div>";
    switchTurn(player, real);
  } else if (coordinateContent === "hit") {
    //allow replay
    if (currentPlayer === "computer") {
      setTimeout(() => computerTurn(player, real, real), 500);
    }
  } else {
    //allow replay
    player.receiveAttack(
      parseInt(square.id.charAt(0)),
      parseInt(square.id.charAt(1))
    );
    square.classList.remove("ship");
    square.classList.add("hit");
    player.board[parseInt(square.id.charAt(0))][parseInt(square.id.charAt(1))] =
      "hit";
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
    dialog.close();
  });
  dialog.appendChild(button);
  document.getElementById("game-container").appendChild(dialog);
  dialog.showModal();
}

let userShipCount = 0;

function createPositionButton() {
    let positionButton = document.createElement("button");
    positionButton.id = "position";
    positionButton.textContent = "Vertical";
    positionButton.addEventListener("click", () => {
      positionButton.textContent =
        positionButton.textContent === "Vertical" ? "Horizontal" : "Vertical";
    });
    document.getElementById("game-container").appendChild(positionButton);
    return positionButton;
  }
  
  function isPlacementValid(board, row, column, length, positioning) {
    for (let i = 0; i < length; i++) {
      if (positioning === "horizontal") {
        if (column + i >= 10 || board.board[row][column + i] !== "empty") {
          return false;
        }
      } else {
        if (row + i >= 10 || board.board[row + i][column] !== "empty") {
          return false;
        }
      }
    }
    return true;
  }
  
  function handleGridSquareClick(board, element, positionButton) {
    element.addEventListener("click", () => {
      let length = Math.ceil(currentShipLength);
      let ship = new Ship(length);
      let positioning =
        positionButton.textContent === "Vertical" ? "horizontal" : "vertical";
      let row = parseInt(element.id.charAt(0));
      let column = parseInt(element.id.charAt(1));
  
      if (isPlacementValid(board, row, column, length, positioning)) {
        currentShipLength -= 0.5;
        board.place(ship, [row, column], positioning);
        userShipCount++;
        for (let i = 0; i < length; i++) {
          let current;
          if (positioning === "horizontal") {
            current = document.getElementById(
              `${row}${column + i}real`
            );
          } else {
            current = document.getElementById(
              `${row + i}${column}real`
            );
          }
          if (current) {
            current.classList.remove("empty");
            current.classList.add("ship");
          }
        }
      }
      if (userShipCount === 6) {
        createGame();
      }
    });
  }
  
  function handleGridSquareMouseover(board, element, positionButton) {
    element.addEventListener("mouseover", () => {
      let length = Math.floor(currentShipLength + 0.5);
      let positioning =
        positionButton.textContent === "Vertical" ? "horizontal" : "vertical";
      let row = parseInt(element.id.charAt(0));
      let column = parseInt(element.id.charAt(1));
  
      if (isPlacementValid(board, row, column, length, positioning)) {
        for (let i = 0; i < length; i++) {
          let current;
          if (positioning === "horizontal") {
            current = document.getElementById(
              `${row}${column + i}real`
            );
          } else {
            current = document.getElementById(
              `${row + i}${column}real`
            );
          }
          if (current) {
            current.classList.remove("empty");
            current.classList.add("ship-hover");
          }
        }
      }
    });
  }
  
  function handleGridSquareMouseout(board, element, positionButton) {
    element.addEventListener("mouseout", () => {
      let length = Math.floor(currentShipLength + 0.5);
      let positioning =
        positionButton.textContent === "Vertical" ? "horizontal" : "vertical";
      let row = parseInt(element.id.charAt(0));
      let column = parseInt(element.id.charAt(1));
  
      if (isPlacementValid(board, row, column, length, positioning)) {
        for (let i = 0; i < length; i++) {
          let current;
          if (positioning === "horizontal") {
            current = document.getElementById(
              `${row}${column + i}real`
            );
          } else {
            current = document.getElementById(
              `${row + i}${column}real`
            );
          }
          if (current) {
            if (current.classList.contains("ship-hover")) {
              current.classList.remove("ship-hover");
            }
            current.classList.add("empty");
          }
        }
      }
    });
  }
  
  function populateRealBoard(board, players) {
    let gridSquares = document.querySelectorAll("#real .empty");
    let positionButton = createPositionButton();
  
    gridSquares.forEach((element) => {
      handleGridSquareClick(board, element, positionButton);
      handleGridSquareMouseover(board, element, positionButton);
      handleGridSquareMouseout(board, element, positionButton);
    });
  }  
let currentShipLength = 3;
let currentPlayer = "computer";
function begin() {
  createGame();
}
begin();
