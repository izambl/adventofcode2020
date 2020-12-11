import { readInput } from '../../common'

const input = readInput(`${__dirname}/input`).map((seatsRow: string) => seatsRow.split(''));

function part01(): number {
  let seatsArrangement = input;
  let seatsChanges = 0;
  
  do { 
    [seatsArrangement, seatsChanges] = seattingRound(seatsArrangement, 4, checkAdjacentOccopies);
  } while(seatsChanges)

  return countOccupies(seatsArrangement);
}

function part02(): number {
  let seatsArrangement = input;
  let seatsChanges = 0;
  
  do { 
    [seatsArrangement, seatsChanges] = seattingRound(seatsArrangement, 5, checkAdjacentOccopiesExtra);
  } while(seatsChanges)

  return countOccupies(seatsArrangement);
}

function seattingRound(seats: Array<string[]>, tolerance: number, adjacentFunction: (seats: Array<string[]>, x: number, y: number) => number): [Array<string[]>, number] {  
  const newSeatsArrangement = JSON.parse(JSON.stringify(seats));
  const oldSeatsArrangement = JSON.parse(JSON.stringify(seats));
  let changes = 0;

  for (let y = 0; y < oldSeatsArrangement.length; y++) {
    for (let x = 0; x < oldSeatsArrangement[y].length; x++) {
      if (oldSeatsArrangement[y][x] === '.') continue;

      const isOccupied = oldSeatsArrangement[y][x] === '#';
      const adjacentOccupies = adjacentFunction(oldSeatsArrangement, x, y);

      if (isOccupied && adjacentOccupies >= tolerance) {
        changes++;
        newSeatsArrangement[y][x] = 'L';
      } else if (!isOccupied && adjacentOccupies === 0) {
        changes++;
        newSeatsArrangement[y][x] = '#';
      }
    }
  }

  return [newSeatsArrangement, changes];
}

function checkAdjacentOccopies(seats: Array<string[]>, x: number, y: number): number {
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

function checkAdjacentOccopiesExtra(seats: Array<string[]>, x: number, y: number): number {
  let adjacentOccupies = 0;  
  let xx = x;
  let yy = y;

  
  while (seats?.[yy -= 1]?.[xx -= 1] === '.') { }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;
  
  yy = y;
  xx = x;
  while (seats?.[yy -= 1]?.[xx] === '.') { }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y;
  xx = x;
  while (seats?.[yy -= 1]?.[xx += 1] === '.') { }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y;
  xx = x;
  while (seats?.[yy += 1]?.[xx -= 1] === '.') { }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y;
  xx = x;
  while (seats?.[yy += 1]?.[xx] === '.') { }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  yy = y;
  xx = x;
  while (seats?.[yy += 1]?.[xx += 1] === '.') { }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;
  
  yy = y;
  xx = x;
  while (seats?.[yy]?.[xx -= 1] === '.') { }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;
  
  yy = y;
  xx = x;
  while (seats?.[yy]?.[xx += 1] === '.') { }
  adjacentOccupies += seats?.[yy]?.[xx] === '#' ? 1 : 0;

  return adjacentOccupies;
}

function countOccupies(seatsArrangement: Array<string[]>) {
  let count = 0;

  for (let y = 0; y < seatsArrangement.length; y++) {
    for (let x = 0; x < seatsArrangement[y].length; x++) {
      if (seatsArrangement[y][x] === '#') count++;
    }
  }
  
  return count;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
