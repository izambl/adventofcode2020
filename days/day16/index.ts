import { readInput } from '../../common';

type Ticket = number[];
type Range = [number, number];
type Field = [string, Range[]];
interface FieldsRows { [index: string]: number }
interface FieldsPossibleRows { [index: string]: number[] }

const input = readInput(`${__dirname}/input`, '\n\n');

const fields: Field[] = input[0].split('\n').map((field: string): Field => {
  const [fieldName, fieldRangesText] = field.split(': ');
  const fieldRanges: Range[] = fieldRangesText.split(' or ').map((range: string): Range => {
    const [lowerLimit, upperLimit] = range.split('-').map(Number);

    return [lowerLimit, upperLimit];
  });

  return [fieldName, fieldRanges];
});
const myTicket: Ticket = input[1].split('\n')[1].split(',').map(Number);
const nearbyTickets: Ticket[] = input[2].split('\n').slice(1).map((ticket: string) => ticket.split(',').map(Number));

function part01(): number {
  const invalidValues: number[] = [];

  nearbyTickets.forEach((ticket: Ticket) => {
    ticket.forEach((number: number) => {
      if (!validNumber(number)) invalidValues.push(number);
    });
  });

  return invalidValues.reduce((total: number, invalidValue: number) => total + invalidValue, 0);
}

function part02(): number {
  const validTickets = nearbyTickets.filter((ticket: Ticket) => ticket.every((number: number) => validNumber(number)));
  const fieldsValidRows: { [index: string]: number[] } = {};

  validTickets.push(myTicket);

  // Find all the valid possibilities for each field
  fields.forEach(([fieldName, fieldRanges]: Field) => {
    if (!fieldsValidRows[fieldName]) fieldsValidRows[fieldName] = [];

    for (let ticketField = 0; ticketField < myTicket.length; ticketField += 1) {
      const validFieldFound = validTickets.every((ticket: Ticket) => {
        const ticketFieldValue = ticket[ticketField];

        return fieldRanges
          .some(([lowerLimit, upperLimit]: Range) => ticketFieldValue >= lowerLimit && ticketFieldValue <= upperLimit);
      });

      if (validFieldFound) {
        fieldsValidRows[fieldName].push(ticketField);
      }
    }
  });

  // Cleans up the possibilities using fields with only 1 option
  const fieldsRows = normalizePossibleRows(fieldsValidRows);

  return Object.keys(fieldsRows).reduce((total: number, key: string) => {
    if (/^departure/.test(key)) {
      return total * myTicket[fieldsRows[key]];
    }
    return total;
  }, 1);
}

function normalizePossibleRows(fieldsValidRows: FieldsPossibleRows): FieldsRows {
  const fieldsRows: FieldsRows = {};
  const fieldPossibleRows = Object.keys(fieldsValidRows)
    .reduce((newOb: any, key: string) => ({ ...newOb, [key]: [...fieldsValidRows[key]] }), {});

  let lonelyKey = Object.keys(fieldPossibleRows).find((key: string) => fieldPossibleRows[key].length === 1);
  while (lonelyKey) {
    const [lonelyKeyValue] = fieldPossibleRows[lonelyKey];

    fieldsRows[lonelyKey] = lonelyKeyValue;
    delete fieldPossibleRows[lonelyKey];

    Object.keys(fieldPossibleRows).forEach((key: string) => {
      if (fieldsValidRows[key].includes(lonelyKeyValue)) {
        fieldPossibleRows[key].splice(fieldPossibleRows[key].indexOf(lonelyKeyValue), 1);
      }
    });

    lonelyKey = Object.keys(fieldPossibleRows).find((key: string) => fieldPossibleRows[key].length === 1);
  }

  return fieldsRows;
}

function validNumber(number: number): boolean {
  return fields.some((field: Field): boolean => field[1]
    .some(([lowerLimit, upperLimit]: Range) => number >= lowerLimit && number <= upperLimit));
}

process.stdout.write(`Part 1: ${part01()}\n`);
process.stdout.write(`Part 2: ${part02()}\n`);
