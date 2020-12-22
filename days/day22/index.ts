import { readInput } from '../../common';

type Player = number[];

const input = readInput(`${__dirname}/input`, '\n\n')

const player01: Player = input[0].split('\n').slice(1).map(Number);
const player02: Player = input[1].split('\n').slice(1).map(Number);

function part01(): number {
  const [, winnerCards] = play(player01, player02);

  return winnerCards.reverse().reduce((total: number, card: number, index: number) => total + (card * (index + 1)), 0);
}

function part02(): number {
  const [, winnerCards] = playRecursive(player01, player02);

  return winnerCards.reverse().reduce((total: number, card: number, index: number) => total + (card * (index + 1)), 0);
}

function play(player01: Player, player02: Player): [string, Player] {
  const playerA = [...player01];
  const playerB = [...player02];

  while (playerA.length && playerB.length) {
    const playerACard = playerA.shift();
    const playerBCard = playerB.shift();

    if (playerACard > playerBCard) playerA.push(playerACard, playerBCard);
    else playerB.push(playerBCard, playerACard);
  }

  if (playerA.length) return ['playerA', playerA];
  else return ['playerB', playerB];
}

function playRecursive(player01: Player, player02: Player): [string, Player] {
  const playerA = [...player01];
  const playerB = [...player02];
  const cardsCache: { [index: string]: boolean } = {};

  while (playerA.length && playerB.length) {
    const roundChecksum = `${playerA.join('')}-${playerB.join('')}`;
    if (cardsCache[roundChecksum]) return ['playerA', playerA];
    else cardsCache[roundChecksum] = true;

    const playerACard = playerA.shift();
    const playerBCard = playerB.shift();

    if (playerA.length >= playerACard && playerB.length >= playerBCard) {
      const [subRoundWinner] = playRecursive(playerA.slice(0, playerACard), playerB.slice(0, playerBCard));
      if (subRoundWinner === 'playerA') playerA.push(playerACard, playerBCard);
      else playerB.push(playerBCard, playerACard);
    } else {
      if (playerACard > playerBCard) playerA.push(playerACard, playerBCard);
      else playerB.push(playerBCard, playerACard);
    }    
  }

  if (playerA.length) return ['playerA', playerA];
  else return ['playerB', playerB];
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
