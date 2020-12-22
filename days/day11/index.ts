import { readInput } from '../../common';

type AdjacentFunction = (seats: Array<string[]>, x: number, y: number) => number;
type Seats = Array<string[]>;

const input = readInput(`${__dirname}/input`).map((seatsRow: string) => seatsRow.split(''));

function part01(): number {
  let seatsArrangement = input;
  let seatsChanges = 0;

  do {
    [seatsArrangement, seatsChanges] = seattingRound(seatsArrangement, 4, checkAdjacentOccopies);
  } while (seatsChanges);

  return countOccupies(seatsArrangement);
}

function part02(): number {
  let seatsArrangement = input;
  let seatsChanges = 0;

  do {
    [seatsArrangement, seatsChanges] = seattingRound(seatsArrangement, 5, checkAdjacentOccopiesExtra);
  } while (seatsChanges);

  return countOccupies(seatsArrangement);
}

function seattingRound(seats: Seats, tolerance: number, adjacentFunction: AdjacentFunction): [Seats, number] {
  const newSeatsArrangement = JSON.parse(JSON.stringify(seats));
  const oldSeatsArrangement = JSON.parse(JSON.stringify(seats));
  let changes = 0;

  for (let y = 0; y < oldSeatsArrangement.length; y += 1) {
    for (let x = 0; x < oldSeatsArrangement[y].length; x += 1) {
      if (oldSeatsArrangement[y][x] === '.') continue;

      const isOccupied = oldSeatsArrangement[y][x] === '#';
      const adjacentOccupies = adjacentFunction(oldSeatsArrangement, x, y);

      if (isOccupied && adjacentOccupies >= tolerance) {
        changes += 1;
        newSeatsArrangement[y][x] = 'L';
      } else if (!isOccupied && adjacentOccupies === 0) {
        changes += 1;
        newSeatsArrangement[y][x] = '#';
      }
    }
  }

  return [newSeatsArrangement, changes];
}

function checkAdjacentOccopies(seats: Seats, x: number, y: number): number {
  let adjacentOccupies = 0;

  adjacentOccupies += seats?.[y - 1]?.[x - 1] === '#' ? 1 : 0;
  adjacentOccupies += seats?.[y - 1]?.[x] === '#' ? 1 : 0;
  adjacentOccupies += seats?.[y - 1]?.[x + 1] === '#' ? 1 : 0;
  adjacentOccupies += seats?.[y + 1]?.[x - 1] === '#' ? 1 : 0;
  adjacentOccupies += seats?.[y + 1]?.[x] === '#' ? 1 : 0;
  adjacentOccupies += seats?.[y + 1]?.[x + 1] === '#' ? 1 : 0;
  adjacentOccupies += seats?.[y]?.[x - 1] === '#' ? 1 : 0;
  adjacentOccupies += seats?.[y]?.[x + 1] === '#' ? 1 : 0;

  return adjacentOccupies;
}

function checkAdjacentOccopiesExtra(seats: Seats, x: number, y: number): number {
  let adjacentOccupies = 0;
  let xx = x;
  let yy = y;

  yy = y - 1;
  xx = x - 1;
  while (seats?.[yy]?.[xx] === '.') {
    yy -= 1;
    xx -= 1;
  }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y - 1;
  xx = x;
  while (seats?.[yy]?.[xx] === '.') {
    yy -= 1;
  }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y - 1;
  xx = x + 1;
  while (seats?.[yy]?.[xx] === '.') {
    yy -= 1;
    xx += 1;
  }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y + 1;
  xx = x - 1;
  while (seats?.[yy]?.[xx] === '.') {
    yy += 1;
    xx -= 1;
  }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y + 1;
  xx = x;
  while (seats?.[yy]?.[xx] === '.') {
    yy += 1;
  }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y + 1;
  xx = x + 1;
  while (seats?.[yy]?.[xx] === '.') {
    yy += 1;
    xx += 1;
  }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y;
  xx = x - 1;
  while (seats?.[yy]?.[xx] === '.') {
    xx -= 1;
  }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y;
  xx = x + 1;
  while (seats?.[yy]?.[xx] === '.') {
    xx += 1;
  }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  return adjacentOccupies;
}

function countOccupies(seatsArrangement: Array<string[]>) {
  let count = 0;

  for (let y = 0; y < seatsArrangement.length; y += 1) {
    for (let x = 0; x < seatsArrangement[y].length; x += 1) {
      if (seatsArrangement[y][x] === '#') count += 1;
    }
  }

  return count;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
