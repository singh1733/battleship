class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    this.sunk = this.length == this.hits;
    return this.sunk;
  }
}

class GameBoard {
  constructor() {
    this.board = Array.from({ length: 16 }, () =>
      Array.from({ length: 16 }, () => "empty")
    );
  }

  place(ship, coordinates, positioning) {
    this.board[coordinates[0]][coordinates[1]] = ship;
    if (positioning === "horizontal") {
      for (let i = 1; i < ship.length; i++) {
        this.board[coordinates[0]][coordinates[1] + i] = ship;
      }
    } else {
      for (let i = 1; i < ship.length; i++) {
        this.board[coordinates[0] + i][coordinates[1]] = ship;
      }
    }
  }

  receiveAttack(row, column) {
    if (
      this.board[row][column] !== "empty" &&
      this.board[row][column] !== "missed"
    ) {
      this.board[row][column].hit();
    } else {
      this.board[row][column] = "missed";
    }
  }

  reportAllSunk(){
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            if (
                this.board[i][j] !== "empty" &&
                this.board[i][j] !== "missed"
              ) {
                if (!this.board[i][j].isSunk()){
                    return false;
                }
              }
        }
      }
      return true;
  }
}

module.exports = { Ship, GameBoard };
