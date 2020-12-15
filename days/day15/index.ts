import { readInput } from '../../common'

interface Mentions { [index: number]: [number, [number, number]] };

const input = readInput(`${__dirname}/input`)[0].split(',').map(Number);

function part0102(lastTurn = 2020): number {
  const lastMentions: Mentions = {};
  let lastNumberSpoken = null;
  let turn = 1;

  for (let i = 0; i < input.length; i++) {    
    lastNumberSpoken = input[i];
    addMention(lastNumberSpoken, turn, lastMentions);

    turn++;
  }

  while (turn < (lastTurn + 1)) {
    if (lastMentions[lastNumberSpoken][0] === 1) {
      input[turn] = 0;
    } else {      
      const [, [nextToLastTurn, lastTurn]] = lastMentions[lastNumberSpoken];

      input[turn] = lastTurn - nextToLastTurn;
    }
    lastNumberSpoken = input[turn];
    addMention(lastNumberSpoken, turn, lastMentions);
    
    turn++;
  }

  return lastNumberSpoken;
}

function addMention(lastNumberSpoken: number, turn: number, lastMentions: Mentions): void {
  if (!lastMentions[lastNumberSpoken]) {
    lastMentions[lastNumberSpoken] = [1, [null, turn]];
  } else {
    const [numberOfMentions, [, lastTurn]] = lastMentions[lastNumberSpoken];

    lastMentions[lastNumberSpoken] = [numberOfMentions + 1, [lastTurn, turn]];
  }
}

process.stdout.write(`Part 1: ${part0102(2020)}\n`);
process.stdout.write(`Part 2: ${part0102(30000000)}\n`);
