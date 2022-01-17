import { evaluate } from 'mathjs'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { __, adjust, always, gte, indexOf, init, not, nth, slice, split, test, pipe } from 'ramda'

export const clear = createAction('calculator/clear')
export const operator = createAction('calculator/operator')
export const number = createAction('calculator/number')

export const actions = {
  operator,
  number
}

const initialState = {
  queue: '0'
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
      const queue = splitQueue(state.queue)
      if (state.queue.length === 0) {
        state.queue = action.payload.toString()
      // Last item is an operator, start a new number:
      } else if (isOperator(nth(-1, queue))) {
        state.queue = state.queue += ' ' + action.payload.toString()
      // If there's a solution currently displayed, replace the whole queue with the new number:
      } else if (queue.length > 2 && nth(-2, queue) === '=') {
        state.queue = action.payload.toString()
      // If there's a zero, replace it:
      } else if (nth(-1, queue) === '0') {
        state.queue = adjust(-1, always(action.payload.toString()), queue).join(' ')
      // Otherwise, adjust the number by appending it to the last string:
      } else {
        state.queue = adjust(-1, xs => xs + action.payload.toString(), queue).join(' ')
      }
    })
    .addCase(clear, (state, action) => {
      if (action.payload) {
        state.queue = initialState.queue
      } else {
        const queue = splitQueue(state.queue)
        if (isNumber(nth(-1, queue))) {
          state.queue = queue.slice(0, -1).join(' ') + ' 0'
        }
      }
    })
    .addCase(operator, (state, action) => {
      if (not(isOperator(action.payload))) {
        return
      }
      if (state.queue.length === 0 && action.payload !== '=') {
        state.queue = '0'
      }
      const queue = splitQueue(state.queue)
      if (action.payload === '.') {
        const lastQueueItem = nth(-1, queue)
        if (isOperator(lastQueueItem)) {
          state.queue += ' 0.'
        } else if (lastQueueItem.indexOf('.') < 0) {
          state.queue += '.'
        }
      } else if (action.payload === '=') {
        // Queue is of the form of <number> <operation>
        if (queue.length === 2) {
          const firstItem = nth(-2, queue)
          const secondItem = nth(-1, queue)
          if (isNumber(firstItem) && isOperator(secondItem)) {
            state.queue += ` ${firstItem} = ${evaluate(`${firstItem} ${secondItem} ${firstItem}`)}`
          }
        // At least three items:
        } else if (queue.length > 2) {
          const firstItem = nth(-3, queue)
          const secondItem = nth(-2, queue)
          const thirdItem = nth(-1, queue)
          if (isNumber(firstItem) && isOperator(secondItem) && isNumber(thirdItem)) {
            // This is a straight-forward a +-/* b calculation:
            if (secondItem !== '=') {
              state.queue += ` = ${evaluate(`${firstItem} ${secondItem} ${thirdItem}`)}`
            // Handle recurring operations. This had to be worked out by trial and error:
            } else if (queue.length >= 4) {
              const fourthItem = nth(-4, queue)
              state.queue += ` ${fourthItem} ${firstItem} = ${evaluate(`${firstItem} ${fourthItem} ${thirdItem}`)}`
            }
          }
        }
      // Handle positive/negative:
      } else if (action.payload === '±') {
        const lastQueueItem = nth(-1, queue)
        if (isNumber(lastQueueItem)) {
          if (lastQueueItem.indexOf('-') === 0) {
            state.queue = adjust(-1, slice(1), queue).join(' ')
          } else {
            state.queue = adjust(-1, always('-' + lastQueueItem), queue).join(' ')
          }
        }
      } else {
        const lastQueueItem = nth(-1, queue)
        // Replace last operator:
        if (isOperator(lastQueueItem) && lastQueueItem !== '=') {
          state.queue = adjust(-1, always(action.payload), queue).join(' ')
        } else {
          // If we already have an equals in the chain, split and calculate for the part after it:
          if (state.queue.indexOf('=') >= 0) {
            const parts = state.queue.split(' = ')
            state.queue = init(parts).join(' = ') + ' = ' + evaluate(nth(-1, parts))
          // Otherwise, calculate the whole queue:
          } else {
            state.queue = evaluate(state.queue)
          }
          // Then add on the new operation:
          state.queue += ' ' + action.payload
        }
      }
    })
})
