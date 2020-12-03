import { readInput } from '../../common'

const input = readInput(`${__dirname}/input`).map((row) => row.split(''));

function walk1() {
  const slope = [3, 1];
  const width = input[0].length;
  const position = [0, 0];
  let treeCount = 0;

  while (position[0] < input.length) {
    treeCount += input[position[0]][position[1] % width] === '#' ? 1 : 0;
    position[1] += slope[0];
    position[0] += slope[1];
    console.log(treeCount);
  }

  return treeCount;
}

function walk2() {
  const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
  const width = input[0].length;
  let total = 1;

  slopes.forEach((slope) => {
    const position = [0, 0];
    let treeCount = 0;

    while (position[0] < input.length) {
      treeCount += input[position[0]][position[1] % width] === '#' ? 1 : 0;
      position[1] += slope[0];
      position[0] += slope[1];
    }

    total *= treeCount;
  })

  return total;
}

process.stdout.write(`Part 1: ${walk1()}\n`);
process.stdout.write(`Part 2: ${walk2()}\n`);
