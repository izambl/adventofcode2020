import { readInput } from '../../common';

const input = readInput(`${__dirname}/input`).map(Number);
const INITIAL_SUBJECT = 7;

function part01(): number {
  const loops = input.map(findLoops);

  return doLoop(loops[0], input[1]);
}

function part02(): number {
  return 2;
}

function findLoops(publicKey: number): number {
  let loops = 0;
  let value = 1;

  while (value !== publicKey) {
    loops += 1;
    value *= INITIAL_SUBJECT;
    value %= 20201227;
  }

  return loops;
}

function doLoop(times: number, subject: number): number {
  let value = 1;

  while (times) {
    value *= subject;
    value %= 20201227;
    times -= 1;
  }

  return value;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
