import { readInput } from '../../common'

interface Mentions { [index: number]: [number, [number, number]] };

const input = readInput(`${__dirname}/input`)[0].split(',').map(Number);

function part0102(endTurn = 2020): number {
  const lastMentions: Mentions = {};
  let lastNumberSpoken: number = null;
  let turn = 1;

  for (let i = 0; i < input.length; i++) {    
    lastNumberSpoken = input[i];
    addMention(lastNumberSpoken, turn, lastMentions);
    turn++;
  }

  while(true) {
    if (lastMentions[lastNumberSpoken][0] === 1) {
      lastNumberSpoken = 0;
    } else {
      const [, [nextToLastTurn, lastTurn]] = lastMentions[lastNumberSpoken];
      lastNumberSpoken = lastTurn - nextToLastTurn;
    }
    addMention(lastNumberSpoken, turn, lastMentions);    

    if (turn === endTurn) break;

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
