import { readInput } from '../../common';

const input = readInput(`${__dirname}/input`).map((row) => row.split(''));

function walk1(): number {
  const slope: [number, number] = [3, 1];

  return walkTheWalk(slope, input);
}

function walk2(): number {
  const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];

  return slopes.reduce((total: number, slope: [number, number]) => total * walkTheWalk(slope, input), 1);
}

function walkTheWalk(slope: [number, number], treePositions: string[][]): number {
  const width = treePositions[0].length;
  const position = [0, 0];
  let treeCount = 0;

  while (position[0] < treePositions.length) {
    treeCount += treePositions[position[0]][position[1] % width] === '#' ? 1 : 0;
    position[1] += slope[0];
    position[0] += slope[1];
  }

  return treeCount;
}

process.stdout.write(`Part 1: ${walk1()}\n`);
process.stdout.write(`Part 2: ${walk2()}\n`);
