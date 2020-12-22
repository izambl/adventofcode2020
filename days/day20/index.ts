import { readInput } from '../../common';

interface Borders {
  t: string
  r: string
  b: string
  l: string
}
interface Tile {
  id: number
  image: Array<string[]>
  borders: Borders
}
enum Border {
  t = 't',
  r = 'r',
  b = 'b',
  l = 'l',
}

const imageTiles: Tile[] = readInput(`${__dirname}/input`, '\n\n')
  .map((inputline: string) => inputline.split('\n'))
  .map((tileInput: string[]): Tile => {
    const tileId = Number(tileInput[0].replace(':', '').split(' ')[1]);
    const image = tileInput.slice(1).map((imageLine: string) => imageLine.split(''));
    const imageArray = [];

    for (let y = 0; y < image.length; y++) {
      for (let x = 0; x < image[y].length; x++) {
        if (!imageArray[x]) imageArray[x] = [];
        imageArray[x][y] = image[y][x];
      }
    }

    const i: any = imageArray;
    const t = `${i[0][0]}${i[0][1]}${i[0][2]}${i[0][3]}${i[0][4]}${i[0][5]}${i[0][6]}${i[0][7]}${i[0][8]}${i[0][9]}`;
    const r = `${i[0][9]}${i[1][9]}${i[2][9]}${i[3][9]}${i[4][9]}${i[5][9]}${i[6][9]}${i[7][9]}${i[8][9]}${i[9][9]}`;
    const b = `${i[9][0]}${i[9][1]}${i[9][2]}${i[9][3]}${i[9][4]}${i[9][5]}${i[9][6]}${i[9][7]}${i[9][8]}${i[9][9]}`;
    const l = `${i[0][0]}${i[1][0]}${i[2][0]}${i[3][0]}${i[4][0]}${i[5][0]}${i[6][0]}${i[7][0]}${i[8][0]}${i[9][0]}`;

    return {
      id: tileId,
      image: imageArray,
      borders: {
        t, r, b, l,
      },
    };
  });

function part01(): number {
  const corners: Tile[] = imageTiles.filter((tile: Tile) => countNeighbors(tile) === 2);

  return corners.reduce((total: number, corner: Tile) => total * corner.id, 1);
}

function part02(): number {
  let tilesReserve: Tile[] = [...imageTiles];
  let firstCorner = imageTiles.find((tile: Tile) => countNeighbors(tile) === 2);
  const imageLength = Math.sqrt(imageTiles.length);
  const finalImage: Array<Tile[]> = [...Array(imageLength)].map(() => [...Array(imageLength)]);

  tilesReserve = removeTile(tilesReserve, firstCorner);

  let right = null;
  let bottom = null;
  do {
    firstCorner = rotateTile(firstCorner);
    right = findNeighbor(firstCorner, Border.r, tilesReserve);
    bottom = findNeighbor(firstCorner, Border.b, tilesReserve);
  } while (!right || !bottom);

  finalImage[0][0] = firstCorner;

  for (let y = 0; y < imageLength; y++) {
    for (let x = 0; x < imageLength; x++) {
      if (y === 0 && x === 0) continue;

      if (x > 0) {
        finalImage[y][x] = findNeighbor(finalImage[y][x - 1], Border.r, tilesReserve);
      } else {
        finalImage[y][x] = findNeighbor(finalImage[y - 1][x], Border.b, tilesReserve);
      }
      tilesReserve = removeTile(tilesReserve, finalImage[y][x]);
    }
  }

  const tilesWithoutBorders = finalImage.map((tileRow: Tile[]): Tile[] => tileRow.map((tile: Tile): Tile => removeTileImageBorders(tile)));

  const stitchedImage: Array<string[]> = [];

  tilesWithoutBorders.forEach((tileRow: Tile[]) => {
    for (let i = 0; i < 8; i++) {
      let imageRow: string[] = [];
      for (let row = 0; row < tileRow.length; row++) {
        imageRow = [...imageRow, ...tileRow[row].image[i]];
      }
      stitchedImage.push(imageRow);
    }
  });

  let monsterImage = stitchedImage;
  let monsters = countMonsters(stitchedImage);
  if (!monsters) {
    monsterImage = rotateImage(monsterImage);
    monsters = countMonsters(monsterImage);
  }
  if (!monsters) {
    monsterImage = rotateImage(monsterImage);
    monsters = countMonsters(monsterImage);
  }
  if (!monsters) {
    monsterImage = rotateImage(monsterImage);
    monsters = countMonsters(monsterImage);
  }
  if (!monsters) {
    monsterImage = flipImage(monsterImage);
    monsters = countMonsters(monsterImage);
  }
  if (!monsters) {
    monsterImage = rotateImage(monsterImage);
    monsters = countMonsters(monsterImage);
  }
  if (!monsters) {
    monsterImage = rotateImage(monsterImage);
    monsters = countMonsters(monsterImage);
  }
  if (!monsters) {
    monsterImage = rotateImage(monsterImage);
    monsters = countMonsters(monsterImage);
  }

  countMonsters(monsterImage, true);
  monsterImage.forEach((x: string[]) => console.log(x.join('').replace(/[#.]/g, ' ')));

  let hashtagCount = 0;
  for (let y = 0; y < stitchedImage.length; y++) {
    for (let x = 0; x < stitchedImage[y].length; x++) {
      if (stitchedImage[y][x] === '#') hashtagCount++;
    }
  }

  return hashtagCount;
}

function removeTile(tilesReserve: Tile[], tile: Tile): Tile[] {
  const newTilesReserve = [...tilesReserve];
  const tileToRemove = newTilesReserve.find((tileFromReserve: Tile) => tileFromReserve.id === tile.id);

  newTilesReserve.splice(newTilesReserve.indexOf(tileToRemove), 1);

  return newTilesReserve;
}

function findNeighbor(tile: Tile, border: Border, tilesReserve: Tile[]): Tile {
  let borderToFind: Border = null;
  switch (border) {
    case 't': borderToFind = Border.b; break;
    case 'r': borderToFind = Border.l; break;
    case 'b': borderToFind = Border.t; break;
    case 'l': borderToFind = Border.r; break;
  }

  for (let i = 0; i < tilesReserve.length; i++) {
    let currentTile = tilesReserve[i];

    for (let round = 0; round < 4; round++) {
      currentTile = rotateTile(currentTile);
      if (currentTile.borders[borderToFind] === tile.borders[border]) {
        return currentTile;
      }
    }

    currentTile = flipTile(currentTile);
    for (let round = 0; round < 4; round++) {
      currentTile = rotateTile(currentTile);
      if (currentTile.borders[borderToFind] === tile.borders[border]) {
        return currentTile;
      }
    }
  }

  return null;
}

function countNeighbors(tile: Tile): number {
  let neighbors = 0;
  let currentTile = tile;

  for (let round = 0; round < 4; round++) {
    currentTile = rotateTile(currentTile);

    const hasNeighbor = imageTiles.some((imageTile: Tile) => {
      if (imageTile.id === currentTile.id) return false;

      for (let round = 0; round < 4; round++) {
        imageTile = rotateTile(imageTile);

        if (imageTile.borders.l === currentTile.borders.r || imageTile.borders.l === currentTile.borders.r.split('').reverse().join('')) {
          return true;
        }
      }

      return false;
    });

    if (hasNeighbor) neighbors++;
  }

  return neighbors;
}

function removeTileImageBorders(tile: Tile): Tile {
  const imageWithoutBorders = tile.image.map((imageRow: string[]): string[] => [...imageRow].slice(1, -1));

  return {
    id: tile.id,
    image: imageWithoutBorders.slice(1, -1),
    borders: { ...tile.borders },
  };
}

function countMonsters(image: Array<string[]>, paint: boolean = false): number {
  let monsters = 0;

  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      if (isMonsterHere(image, x, y, paint)) {
        monsters++;
      }
    }
  }

  return monsters;
}

function isMonsterHere(image: Array<string[]>, x: number, y: number, paint: boolean = false): boolean {
  let monster = true;

  monster = monster && image?.[y][x + 18] === '#';

  monster = monster && image?.[y + 1]?.[x] === '#';
  monster = monster && image?.[y + 1]?.[x + 5] === '#';
  monster = monster && image?.[y + 1]?.[x + 6] === '#';
  monster = monster && image?.[y + 1]?.[x + 11] === '#';
  monster = monster && image?.[y + 1]?.[x + 12] === '#';
  monster = monster && image?.[y + 1]?.[x + 17] === '#';
  monster = monster && image?.[y + 1]?.[x + 18] === '#';
  monster = monster && image?.[y + 1]?.[x + 19] === '#';

  monster = monster && image?.[y + 2]?.[x + 1] === '#';
  monster = monster && image?.[y + 2]?.[x + 4] === '#';
  monster = monster && image?.[y + 2]?.[x + 7] === '#';
  monster = monster && image?.[y + 2]?.[x + 10] === '#';
  monster = monster && image?.[y + 2]?.[x + 13] === '#';
  monster = monster && image?.[y + 2]?.[x + 16] === '#';

  if (paint && monster) {
    image[y][x + 18] = '0';
    image[y + 1][x] = '0';
    image[y + 1][x + 5] = '0';
    image[y + 1][x + 6] = '0';
    image[y + 1][x + 11] = '0';
    image[y + 1][x + 12] = '0';
    image[y + 1][x + 17] = '0';
    image[y + 1][x + 18] = '0';
    image[y + 1][x + 19] = '0';
    image[y + 2][x + 1] = '0';
    image[y + 2][x + 4] = '0';
    image[y + 2][x + 7] = '0';
    image[y + 2][x + 10] = '0';
    image[y + 2][x + 13] = '0';
    image[y + 2][x + 16] = '0';
  }

  return monster;
}

function rotateTile(tile: Tile): Tile {
  return {
    id: tile.id,
    image: rotateImage(tile.image),
    borders: {
      t: tile.borders.l.split('').reverse().join(''),
      r: tile.borders.t,
      b: tile.borders.r.split('').reverse().join(''),
      l: tile.borders.b,
    },
  };
}

function flipTile(tile: Tile): Tile {
  return {
    id: tile.id,
    image: flipImage(tile.image),
    borders: {
      t: tile.borders.t.split('').reverse().join(''),
      r: tile.borders.l,
      b: tile.borders.b.split('').reverse().join(''),
      l: tile.borders.r,
    },
  };
}

function rotateImage(image: Array<string[]>): Array<string[]> {
  const rotatedImage: Array<string[]> = [...Array(image.length)].map(() => [...Array(image.length)]);

  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      rotatedImage[x][image.length - y - 1] = image[y][x];
    }
  }

  return rotatedImage;
}

function flipImage(image: Array<string[]>): Array<string[]> {
  return image.map((tileLine: string[]) => [...tileLine].reverse());
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
