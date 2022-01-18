import { evaluate } from 'mathjs'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { __, adjust, always, append, gte, indexOf, init, not, nth, slice, split, test, pipe } from 'ramda'

export const clear = createAction('calculator/clear')
export const operator = createAction('calculator/operator')
export const number = createAction('calculator/number')

export const actions = {
  operator,
  number
}

const initialState = {
  queue: ['0']
}

const splitQueue = split(' ')

// Which operators do we accept?
const ALLOWED_OPERATORS = '+-*/%=.±'

export const isOperator = pipe(
  indexOf(__, ALLOWED_OPERATORS),
  gte(__, 0)
)

export const isNumber = test(/^-{0,1}[0-9]+\.{0,1}[0-9]*$/)

export default createReducer(initialState, (builder) => {
  builder
    .addCase(number, (state, action) => {
      if (state.queue.length === 0) {
        state.queue = action.payload.toString()
      // Last item is an operator, start a new number:
      } else if (isOperator(nth(-1, state.queue))) {
        state.queue = state.queue.push(action.payload.toString())
      // If there's a solution currently displayed, replace the whole state.queue with the new number:
      } else if (state.queue.length > 2 && nth(-2, state.queue) === '=') {
        state.queue = action.payload.toString()
      // If there's a zero, replace it:
      } else if (nth(-1, state.queue) === '0') {
        state.queue = adjust(-1, always(action.payload.toString()), state.queue)
      // Otherwise, adjust the number by appending it to the last string:
      } else {
        state.queue = adjust(-1, xs => xs + action.payload.toString(), state.queue)
      }
    })
    .addCase(clear, (state, action) => {
      if (action.payload) {
        state.queue = initialState.queue
      } else {
        if (isNumber(nth(-1, state.queue))) {
          state.queue = state.queue.slice(0, -1).push('0')
        }
      }
    })
    .addCase(operator, (state, action) => {
      if (not(isOperator(action.payload))) {
        return
      }
      if (state.queue.length === 0 && action.payload !== '=') {
        state.queue = ['0']
      }
      if (action.payload === '.') {
        const lastQueueItem = nth(-1, state.queue)
        if (isOperator(lastQueueItem)) {
          state.queue.push('0.')
        } else if (lastQueueItem.indexOf('.') < 0) {
          // state.queue.push('.')
          state.queue = adjust(-1, append('.'), state.queue)
        }
      } else if (action.payload === '=') {
        // Queue is of the form of <number> <operation>
        if (state.queue.length === 2) {
          const firstItem = nth(-2, state.queue)
          const secondItem = nth(-1, state.queue)
          if (isNumber(firstItem) && isOperator(secondItem)) {
            state.queue.push(` ${firstItem} = ${evaluate(`${firstItem} ${secondItem} ${firstItem}`)}`)
          }
        // At least three items:
        } else if (state.queue.length > 2) {
          const firstItem = nth(-3, state.queue)
          const secondItem = nth(-2, state.queue)
          const thirdItem = nth(-1, state.queue)
          if (isNumber(firstItem) && isOperator(secondItem) && isNumber(thirdItem)) {
            // This is a straight-forward a +-/* b calculation:
            if (secondItem !== '=') {
              state.queue.push(` = ${evaluate(`${firstItem} ${secondItem} ${thirdItem}`)}`)
            // Handle recurring operations. This had to be worked out by trial and error:
            } else if (state.queue.length >= 4) {
              const fourthItem = nth(-4, state.queue)
              state.queue.push(` ${fourthItem} ${firstItem} = ${evaluate(`${firstItem} ${fourthItem} ${thirdItem}`)}`)
            }
          }
        }
      // Handle positive/negative:
      } else if (action.payload === '±') {
        const lastQueueItem = nth(-1, state.queue)
        if (isNumber(lastQueueItem)) {
          if (lastQueueItem.indexOf('-') === 0) {
            state.queue = adjust(-1, slice(1), state.queue)
          } else {
            state.queue = adjust(-1, always('-' + lastQueueItem), state.queue)
          }
        }
      } else {
        const lastQueueItem = nth(-1, state.queue)
        // Replace last operator:
        if (isOperator(lastQueueItem) && lastQueueItem !== '=') {
          state.queue = adjust(-1, always(action.payload), state.queue)
        } else {
          // If we already have an equals in the chain, split and calculate for the part after it:
          if (state.queue.indexOf('=') >= 0) {
            const parts = state.queue.split(' = ')
            state.queue = init(parts).join(' = ') + ' = ' + evaluate(nth(-1, parts))
          // Otherwise, calculate the whole state.queue:
          } else {
            state.queue = evaluate(state.queue)
          }
          // Then add on the new operation:
          state.queue.push(' ' + action.payload)
        }
      }
    })
})
