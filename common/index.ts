import fs from 'fs';
import path from  'path';

export function readInput(fileName: string): string[] {
  return fs.readFileSync(path.join(fileName)).toString('utf-8').split('\n');
}

export function readNumberInput(fileName: string) {
  return readInput(fileName).map(Number);
}
