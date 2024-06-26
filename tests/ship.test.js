const { Ship } = require("../main");

test("constructor", () => {
  const ship = new Ship(4);
  expect(ship.length).toBe(4);
  expect(ship.hits).toBe(0);
  expect(ship.sunk).toBe(false);
});

test("hit function", () => {
  const ship = new Ship(4);
  ship.hit();
  expect(ship.hits).toBe(1);
});

test("sunk function false", () => {
  const ship = new Ship(4);
  expect(ship.isSunk()).toBe(false);
});

test("sunk function true", () => {
    const ship = new Ship(4);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
