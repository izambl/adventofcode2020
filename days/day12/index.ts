import { readInput } from '../../common'

type Instruction = [string, number];
type Position = [number, number];

const input: Instruction[] = readInput(`${__dirname}/input`).map((instruction: string) => [instruction.replace(/\d/g, ''), Number(instruction.replace(/[^\d]/g, ''))]);

function part01(): number {
  let position: Position = [0, 0];
  let direction = 'E';

  for (const [instruction, value] of input ) {
    switch (instruction) {
      case 'N':
      case 'E':
      case 'W':
      case 'S': position = move(instruction, value, position); break;
      case 'L':
      case 'R': direction = rotate(instruction, value, direction); break;
      case 'F': position = move(direction, value, position); break;
    }
  }

  return Math.abs(position[0]) + Math.abs(position[1]);
}

function part02(): number {
  let shipPosition: Position = [0, 0];
  let waypointPosition: Position = [10, 1];

  for (const [instruction, value] of input ) {
    switch (instruction) {
      case 'N':
      case 'E':
      case 'W':
      case 'S': waypointPosition = move(instruction, value, waypointPosition); break;
      case 'L':
      case 'R': waypointPosition = rotateWaypoint(instruction, value, waypointPosition); break;
      case 'F': shipPosition = moveShip(waypointPosition, shipPosition, value); break;
    }
  }

  return Math.abs(shipPosition[0]) + Math.abs(shipPosition[1]);

}

function rotateWaypoint(direction: string, degrees: number, waypoint: Position): Position {
  let turns = degrees / 90;
  let newWaypointPosition: Position = [...waypoint];

  while (turns--) {
    const [x, y] = newWaypointPosition;

    newWaypointPosition = direction === 'R'
      ? [y, -x]
      : [-y, x];
  };
  
  return newWaypointPosition;
}

function moveShip(waypoint: Position, ship: Position, distance: number): Position {
  const [xShip, yShip] = ship;
  const [xWaypoint, yWaypoint] = waypoint;

  return [xShip + xWaypoint * distance, yShip + yWaypoint * distance];
}

function rotate(direction: string, degrees: number, currentDirection: string): string {
  const directions: { [index: string]: string[] } = {
    L: ['E', 'N', 'W', 'S'],
    R: ['E', 'S', 'W', 'N'],
  };
  const turns = degrees / 90;
  const actualDirection = directions[direction].indexOf(currentDirection);

  return directions[direction][(actualDirection + turns) % 4];
}

function move(direction: string, distance: number, currentPosition: Position): Position {
  const [x, y] = currentPosition;

  switch (direction) {
    case 'N': return [x, y + distance];
    case 'E': return [x + distance, y];
    case 'W': return [x - distance, y];
    case 'S': return [x, y - distance];
  }
  return [x, y];
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
