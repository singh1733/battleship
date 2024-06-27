const { Ship, GameBoard } = require("../src/classes");

test("constructor", () => {
  const gameBoard = new GameBoard();
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      expect(gameBoard.board[i][j]).toBe("empty");
    }
  }
});

test("place horizontal", () => {
  const gameBoard = new GameBoard();
  const ship = new Ship(2);
  gameBoard.place(ship, [0, 1], "horizontal");

  expect(gameBoard.board[0][1]).toBe(ship);
  expect(gameBoard.board[0][2]).toBe(ship);
});

test("place vertical", () => {
  const gameBoard = new GameBoard();
  const ship = new Ship(2);
  gameBoard.place(ship, new Array(0, 1), "vertical");

  expect(gameBoard.board[0][1]).toBe(ship);
  expect(gameBoard.board[1][1]).toBe(ship);
});

test("hit ship", () => {
  const gameBoard = new GameBoard();
  const ship = new Ship(2);
  gameBoard.place(ship, new Array(0, 1), "vertical");
  gameBoard.receiveAttack(0, 1);
  expect(ship.hits).toBe(1);
});

test("miss ship", () => {
  const gameBoard = new GameBoard();
  const ship = new Ship(2);
  gameBoard.place(ship, new Array(0, 1), "vertical");
  gameBoard.receiveAttack(5, 1);
  expect(ship.hits).toBe(0);
  expect(gameBoard.board[5][1]).toBe("missed");
});

test("all sunk", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(2);
    gameBoard.place(ship, new Array(0, 1), "vertical");
    ship.hit();
    ship.hit();
    expect(gameBoard.reportAllSunk()).toBe(true);
  });

  test("all not sunk", () => {
    const gameBoard = new GameBoard();
    const ship = new Ship(2);
    gameBoard.place(ship, new Array(0, 1), "vertical");
    ship.hit();
    expect(gameBoard.reportAllSunk()).toBe(false);
  });
  
