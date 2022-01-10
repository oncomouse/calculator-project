import { createAction, createReducer } from '@reduxjs/toolkit';
import { add, adjust, divide, curry, isEmpty, last, multiply, subtract } from 'ramda';

export const clear = createAction('calculator/clear');
export const operator = createAction('calculator/operator');
export const number = createAction('calculator/number');

export const actions = {
  operator,
  number
};

const initialState = {
  decimal: false,
  queue: []
};

// How many decimal places does the number have?
export const countDecimalPlaces = (num: number): number => {
  const str = num.toString();
  return str.indexOf('.') >= 0 ? str.split('.')[1].length : 0;
};

// Attach a number to an existing number:
const extendNumber = curry((decimal, newNum, num) => {
  if (decimal) {
    return num + newNum / Math.pow(10, countDecimalPlaces(num) + 1);
  }
  return num * 10 + newNum;
})

// Which operators do we accept?
const ALLOWED_OPERATORS = '+-*/=.';

const performOperation = (a, operation, b) => ({
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
})[operation](a, b || a); // b||a to handle if we press equals after a number and an operator has been entered

export default createReducer(initialState, (builder) => {
  builder
    .addCase(number, (state, action) => {
      if (isEmpty(state.queue)) {
        state.queue.push(action.payload);
      } else if (typeof last(state.queue) === 'number') {
        state.queue = adjust(-1, extendNumber(state.decimal, action.payload), state.queue);
      } else {
        state.decimal = false;
        state.queue.push(action.payload);
      }
    })
    .addCase(clear, (state) => {
      state.queue = [];
      state.decimal = false;
    })
    .addCase(operator, (state, action) => {
      if (ALLOWED_OPERATORS.indexOf(action.payload) >= 0 && !isEmpty(state.queue)) {
        if (typeof last(state.queue) === 'number') {
          if (action.payload === '.') { // Trigger decimal:
            state.decimal = !state.decimal;
          } else if (state.queue.length === 3) { // Trigger an operation:
              state.queue = [
                performOperation(...state.queue)
              ];
              state.decimal = false;
          }
          if (action.payload !== '=' && action.payload !== '.') { // Add a new action:
            state.queue.push(action.payload);
          }
        } else { // Operator pressed after operator:
          if (action.payload === '.') { // Push a zero and turn on decimal:
            state.queue.push(0);
            state.decimal = true;
          } else if (action.payload === '=') {
            state.queue = [
              performOperation(...state.queue) // This may be too cute, but performOperation can handle a number and an operator
            ];
            state.decimal = false;
          } else { // Replace previous operator:
            state.queue[1] = action.payload;
          }
        }
      }
    })
});

