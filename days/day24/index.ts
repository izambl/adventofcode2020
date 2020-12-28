import { readInput } from '../../common';

type Position = [number, number];
enum TileColor {
  Black,
  White,
}
type Tile = { [index: string]: TileColor };

const input = readInput(`${__dirname}/input`);

function part01(): number {
  const tiles: Tile = {};

  input.forEach((direction: string) => {
    const tilePosition = findTile(direction).join(' ');

    if (tiles[tilePosition] === undefined || tiles[tilePosition] === TileColor.White) {
      tiles[tilePosition] = TileColor.Black;
    } else {
      tiles[tilePosition] = TileColor.White;
    }
  });

  return countBlackTiles(tiles);
}

function part02(): number {
  let tiles: Tile = {};

  input.forEach((direction: string) => {
    const tilePosition = findTile(direction).join(' ');

    if (tiles[tilePosition] === undefined || tiles[tilePosition] === TileColor.White) {
      tiles[tilePosition] = TileColor.Black;
    } else {
      tiles[tilePosition] = TileColor.White;
    }
  });

  let days = 100;
  while (days) {
    tiles = flipTiles(tiles);
    days -= 1;
  }

  return countBlackTiles(tiles);
}

function flipTiles(tiles: Tile): Tile {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  const newTile = { ...tiles };

  Object.keys(tiles).forEach((key: string) => {
    const [x, y] = key.split(' ').map(Number);

    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });

  for (let x = minX - 1; x <= maxX + 1; x += 1) {
    for (let y = minY - 1; y <= maxY + 1; y += 1) {
      if (Math.abs(y) % 2 === 0 && Math.abs(x) % 2 !== 0) continue;

      const blackCount = countBlackNeighbors([x, y], tiles);
      const pos = `${x} ${y}`;

      if (tiles[pos] === undefined) tiles[pos] = TileColor.White;

      if (tiles[pos] === TileColor.White && blackCount === 2) newTile[pos] = TileColor.Black;
      if (tiles[pos] === TileColor.Black && (blackCount === 0 || blackCount > 2)) newTile[pos] = TileColor.White;
    }
  }

  return newTile;
}

function countBlackNeighbors(position: Position, tiles: Tile): number {
  const [x, y] = position;
  let neighbors = 0;

  if (tiles[`${x + 2} ${y}`] === TileColor.Black) neighbors += 1;
  if (tiles[`${x - 2} ${y}`] === TileColor.Black) neighbors += 1;
  if (tiles[`${x + 1} ${y - 1}`] === TileColor.Black) neighbors += 1;
  if (tiles[`${x - 1} ${y - 1}`] === TileColor.Black) neighbors += 1;
  if (tiles[`${x + 1} ${y + 1}`] === TileColor.Black) neighbors += 1;
  if (tiles[`${x - 1} ${y + 1}`] === TileColor.Black) neighbors += 1;

  return neighbors;
}

function findTile(directions: string): Position {
  const steps = directions.match(/(e|se|sw|w|nw|ne)/g);
  const position: Position = [0, 0];

  steps.forEach((step: string) => {
    switch (step) {
      case 'e': position[0] += 2; break;
      case 'se': position[0] += 1; position[1] += 1; break;
      case 'sw': position[0] -= 1; position[1] += 1; break;
      case 'w': position[0] -= 2; break;
      case 'nw': position[0] -= 1; position[1] -= 1; break;
      case 'ne': position[0] += 1; position[1] -= 1; break;
    }
  });

  return position;
}

function countBlackTiles(tiles: Tile): number {
  return Object.keys(tiles).reduce((total: number, key: string) => {
    if (tiles[key] === TileColor.Black) return total + 1;

    return total;
  }, 0);
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
