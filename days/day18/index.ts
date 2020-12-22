import { readInput } from '../../common';

type OperatorFunction = (a: number, b: number) => number;
interface Operators { [index: string]: { method: OperatorFunction, order: number } }

const input = readInput(`${__dirname}/input`, '\n').map((operation: string): string => operation.replace(/\s/g, ''));

function part01(): number {
  const operators: Operators = {
    '+': { method: (a, b) => a + b, order: 0 },
    '*': { method: (a, b) => a * b, order: 0 },
  };

  return input.reduce((total: number, operation: string): number => reduceOperation(operation, operators) + total, 0);
}

function part02(): number {
  const operators: Operators = {
    '+': { method: (a, b) => a + b, order: 0 },
    '*': { method: (a, b) => a * b, order: 1 },
  };

  return input.reduce((total: number, operation: string): number => reduceOperation(operation, operators) + total, 0);
}

function reduceOperation(expression: string, operators: Operators): number {
  let finalexpression = expression;
  const matcher = /\([\d+*]+\)/;
  let match: RegExpExecArray = null;

  while (match = matcher.exec(finalexpression)) {
    const innerExpression = finalexpression.substring(match.index + 1, match.index + match[0].length - 1);

    finalexpression = finalexpression.replace(match[0], `${solveExpression(innerExpression, operators)}`);
  }

  return solveExpression(finalexpression, operators);
}

function solveExpression(expression: string, operators: Operators): number {
  const operation = splitByOperators(expression, operators);
  const expressionOperators = getExpressionOperators(expression, operators);

  expressionOperators.forEach((sign: string) => {
    const operatorIndex = operation.indexOf(sign);
    const leftSide = Number(operation[operatorIndex - 1]);
    const rightSide = Number(operation[operatorIndex + 1]);
    const result = operators[sign].method(leftSide, rightSide);

    operation.splice(operatorIndex - 1, 3, `${result}`);
  });

  return Number(operation[0]);
}

function getExpressionOperators(expression: string, operators: Operators): string[] {
  const operatorSymbols = Object.keys(operators).join('');
  const operatorsRegexp = new RegExp(`[${operatorSymbols}]`, 'g');
  const expressionOperators: string[] = expression.match(operatorsRegexp);

  expressionOperators.sort((operatorA: string, operatorB: string) => operators[operatorA].order - operators[operatorB].order);

  return expressionOperators;
}

function splitByOperators(expression: string, operators: Operators): string[] {
  const result: string[] = [];
  let acc = '';

  for (const nextChar of expression) {
    if (operators[nextChar]) {
      result.push(acc);
      result.push(nextChar);
      acc = '';

      continue;
    }

    acc += nextChar;
  }

  result.push(acc);

  return result;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
