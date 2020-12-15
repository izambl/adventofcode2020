import { readInput } from '../../common';

type Mention = [number, [number, number]];

const input = readInput(`${__dirname}/input`)[0].split(',').map(Number);

function part0102(endTurn = 2020): number {
  const lastMentions: Mention[] = [];
  let lastNumberSpoken: number = null;
  let turn = 1;

  for (let i = 0; i < input.length; i++) {    
    lastNumberSpoken = input[i];
    addMention(lastNumberSpoken, turn, lastMentions);
    turn++;
  }

  while (true) {
    const [numberOfMentions, [nextToLastTurn, lastTurn]] = lastMentions[lastNumberSpoken];

    lastNumberSpoken = (numberOfMentions === 1) ? 0 : lastTurn - nextToLastTurn;

    addMention(lastNumberSpoken, turn, lastMentions);

    if (turn === endTurn) break;

    turn++;    
  }

  return lastNumberSpoken;
}

function addMention(number: number, turn: number, mentions: Mention[]): void {
  if (!mentions[number]) {
    mentions[number] = [1, [null, turn]];
  } else {
    const [numberOfMentions, [, lastTurn]] = mentions[number];

    mentions[number] = [numberOfMentions + 1, [lastTurn, turn]];
  }
}

process.stdout.write(`Part 1: ${part0102(2020)}\n`);
process.stdout.write(`Part 2: ${part0102(30000000)}\n`);
