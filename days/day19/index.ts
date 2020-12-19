import { readInput } from '../../common';

interface Rule0Object { type: number, body: number[] }
interface Rule1Object { type: number, body: string }
interface Rule2Object { type: number, body: Array<number[]> }
type RuleObject = Rule0Object | Rule1Object | Rule2Object;
interface Rules { [index: number]: RuleObject }

const [rawRules, rawMessage] = readInput(`${__dirname}/input`, '\n\n');

const rulesBook: Rules = rawRules.split('\n').reduce((rulesObject: Rules, rawRule: string): Rules => {
  const [number, rule] = rawRule.split(': ');
  const ruleObject: RuleObject = { type: null, body: null }

  if (rule.indexOf('"') !== -1) {
    ruleObject.type = 1;
    ruleObject.body = rule.replace(/"/g, '');
  } else if (rule.indexOf('|') !== -1) {
    ruleObject.type = 2;
    ruleObject.body = rule.split(' | ').map((subRule: string) => subRule.split(' ').map(Number));
  } else {
    ruleObject.type = 0;
    ruleObject.body = rule.split(' ').map(Number);
  }

  return { ...rulesObject, [number]: ruleObject };
}, {});

const messages: string[] = rawMessage.split('\n');

function part01(): number {
  const rulesRegExp = new RegExp(`^${buildExpression(0, rulesBook)}$`);

  return messages.reduce((total: number, message: string) => {
    if (rulesRegExp.test(message)) return total + 1;

    return total;
  }, 0);
}

function part02(): number {
  const rule42 = buildExpression(42, rulesBook);
  const rule31 = buildExpression(31, rulesBook);

  const newRulesBook: Rules = {
    ...rulesBook,
    8: { type: 1, body: `(${rule42}+)` },
    11: { type: 1, body: `((${rule42}${rule31})|(${rule42}{2}${rule31}{2})|(${rule42}{3}${rule31}{3})|(${rule42}{4}${rule31}{4})|(${rule42}{5}${rule31}{5}))` },
  };
  const rulesRegExp = new RegExp(`^${buildExpression(0, newRulesBook)}$`);

  return messages.reduce((total: number, message: string) => {
    if (rulesRegExp.test(message)) return total + 1;

    return total;
  }, 0);
}

function buildExpression(ruleNumber: number, rulesBook: Rules): string {
  const { type, body } = rulesBook[ruleNumber];

  switch (type) {
    case 0: return expressionRuleType0(body as number[], rulesBook);
    case 1: return expressionRuleType1(body as string);
    case 2: return expressionRuleType2(body as Array<number[]>, rulesBook);
  }
}

function expressionRuleType0(rules: number[], rulesBook: Rules): string {
  const regExpString = rules.reduce((regExpSubString: string, rule: number) => `${regExpSubString}${buildExpression(rule, rulesBook)}`, '');

  return regExpString;
}

function expressionRuleType1(rule: string): string {
  return rule;
}

function expressionRuleType2(rules: Array<number[]>, rulesBook: Rules): string {
  const rulesOptions = rules.map((rule: number[]): string => expressionRuleType0(rule, rulesBook));

  return `(${rulesOptions.join('|')})`;
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
