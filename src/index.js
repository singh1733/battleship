const { Ship, GameBoard, Players } = require("./classes");

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
  board.place(ship, [10, 10], "vertical");
  ship = new Ship(2);
  board.place(ship, [9, 8], "horizontal");
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
      let square = document.createElement("div");
      square.id = "" + i + "" + j;
      let boardSquare = players.real[i][j];
      if (boardSquare === "empty" || boardSquare === "missed") {
        square.classList.add(boardSquare);
      } else {
        square.classList.add("ship");
      }
      realBoard.appendChild(square);
    }
  }
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement("div");
      square.id = "" + i + "" + j;
      let boardSquare = players.computer[i][j];
      if (boardSquare === "empty" || boardSquare === "missed") {
        square.classList.add(boardSquare);
      } else {
        square.classList.add("ship");
      }
      compBoard.appendChild(square);
    }
  }
}

createGame();
