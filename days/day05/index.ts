import { ENGINE_METHOD_EC } from 'constants';
import { readInput } from '../../common'

const input = readInput(`${__dirname}/input`);

function part01(): number {
  const boardingPassesIds: number[] = input.map((boardingPass: string) => {
    const [row, column] = findRowAndColumn(boardingPass);

    return (row * 8) + column;
  })

  return Math.max(...boardingPassesIds);
}

function part02(): number {
  const boardingPassesIds: number[] = input.map((boardingPass: string) => {
    const [row, column] = findRowAndColumn(boardingPass);

    return (row * 8) + column;
  }).sort((a: number, b: number) => a - b);

  let lastBoardingPassId = boardingPassesIds[0] - 1;
  for (const boardingPassId of boardingPassesIds) {
    if (lastBoardingPassId + 1 !== boardingPassId) return lastBoardingPassId + 1;

    lastBoardingPassId = boardingPassId;
  }
    
  throw new Error('Boarding pass not found');
}

function findRowAndColumn(boardingPass: string): [number, number] {
  const rowDirections = boardingPass.slice(0, 7);
  const columnDirections = boardingPass.slice(-3);

  const row = findPlace(rowDirections);
  const column = findPlace(columnDirections, 'L', 'R', [0, 7]);

  return [row, column];
}

function findPlace(instructions: string, lower: string = 'F', upper: string = 'B', range: [number, number] = [0, 127]): number {
  const row = [...instructions].reduce((range: [number, number], half: string) => {
    const [lowerHalf, upperHalf] = range;
    const distanceToShort = (upperHalf - lowerHalf + 1) / 2;

    if (half === lower) return [lowerHalf, upperHalf - distanceToShort];

    return [lowerHalf + distanceToShort, upperHalf];
  }, range);

  if (row[0] === row[1]) return row[0];

  throw new Error('Ooops, something went wrong');
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
