import { createAction, createReducer } from '@reduxjs/toolkit'
import { adjust, curry, isEmpty, last, max, reduce } from 'ramda'
import countDecimalPlaces from '../utilities/countDecimalPlaces'
import Decimal from 'decimal.js'

export const clear = createAction('calculator/clear')
export const operator = createAction('calculator/operator')
export const number = createAction('calculator/number')

export const actions = {
  operator,
  number
}

const initialState = {
  decimal: false,
  queue: []
}

const lastNumber = reduce((acc, cur) => (typeof cur === 'number') ? cur : acc, null)
const lastString = reduce((acc, cur) => (typeof cur === 'string') ? cur : acc, null)
const extractLastOperation = (queue) => ([
  lastString(queue),
  lastNumber(queue)
])

const deleteFrom = (key, obj) => { delete obj[key] }

// Attach a number to an existing number:
const extendNumber = curry((decimal, newNum, zeroes, num) => {
  zeroes = zeroes || 0
  if (decimal) {
    const x = new Decimal(num)
    const places = countDecimalPlaces(x) + 1 + zeroes
    const y = new Decimal(newNum)
    const z = new Decimal(Math.pow(10, places))
    return parseFloat(x.plus(y.dividedBy((z))).toFixed(places))
  }
  return num * 10 + newNum
})

// Which operators do we accept?
const ALLOWED_OPERATORS = '+-*/=.'

const performOperation = (x, operation, y) => {
  const a = new Decimal(x)
  const b = new Decimal(y || x) // y||x to handle if we press equals after a number and an operator has been entered
  const counts = max(countDecimalPlaces(a), countDecimalPlaces(b))
  const result = ({
    '+': (a, b) => a.plus(b).toFixed(counts),
    '-': (a, b) => a.minus(b).toFixed(counts),
    '*': (a, b) => a.times(b).toFixed(counts),
    '/': (a, b) => a.dividedBy(b).toFixed(counts)
  })[operation](a, b)
  return parseFloat(result)
}
export default createReducer(initialState, (builder) => {
  builder
    .addCase(number, (state, action) => {
      if (isEmpty(state.queue)) {
        state.queue.push(action.payload)
      } else if (typeof last(state.queue) === 'number') {
        if (state.decimal && countDecimalPlaces(last(state.queue)) === 0 && action.payload === 0) {
          state.zeroes = typeof state.zeroes === 'undefined' ? 1 : state.zeroes + 1
        } else {
          state.queue = adjust(-1, extendNumber(state.decimal, action.payload, state.zeroes), state.queue)
          if (state.decimal && countDecimalPlaces(last(state.queue)) > 0) {
            deleteFrom('zeroes', state)
          }
        }
      } else {
        deleteFrom('zeroes', state)
        deleteFrom('lastOperation', state)
        state.decimal = false
        state.queue.push(action.payload)
      }
    })
    .addCase(clear, (state) => {
      state.queue = []
      state.decimal = false
      deleteFrom('zeroes', state)
      deleteFrom('lastOperation', state)
    })
    .addCase(operator, (state, action) => {
      if (ALLOWED_OPERATORS.indexOf(action.payload) >= 0) {
        if (isEmpty(state.queue)) { // If queue is empty and any operation but = is prssed, add a zero and continue operator processing
          if (action.payload === '=') {
            return
          }
          state.queue = [0]
        }
        if (typeof last(state.queue) === 'number') {
          if (action.payload === '.') { // Trigger decimal:
            if (countDecimalPlaces(last(state.queue)) === 0 && typeof state.zeroes === 'undefined') {
              state.decimal = !state.decimal
            }
          } else if (state.queue.length === 3) { // Trigger an operation:
            state.lastOperation = extractLastOperation(state.queue)
            state.queue = [
              performOperation(...state.queue)
            ]
            state.decimal = false
          } else if (state.lastOperation && action.payload === '=') { // If we have a number and a last operation, do that if = is pressed:
            state.queue = [
              performOperation(last(state.queue), state.lastOperation[0], state.lastOperation[1])
            ]
          }
          if (action.payload !== '=' && action.payload !== '.') { // Add a new action:
            state.queue.push(action.payload)
            deleteFrom('lastOperation', state)
          }
        } else { // Operator pressed after operator:
          if (action.payload === '.') { // Push a zero and turn on decimal:
            state.queue.push(0)
            state.decimal = true
          } else if (action.payload === '=') { // Can perform operations of the form 5+= (is 5+5=)
            state.lastOperation = extractLastOperation(state.queue)
            state.queue = [
              performOperation(...state.queue) // This may be too cute, but performOperation can handle a number and an operator
            ]
            state.decimal = false
          } else { // Replace previous operator:
            state.queue[1] = action.payload
          }
        }
      }
    })
})
