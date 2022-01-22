import { evaluate } from 'mathjs'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { __, adjust, always, concat, equals, gte, indexOf, lastIndexOf, not, nth, slice, test, toString, pipe, where } from 'ramda'

export const clear = createAction('calculator/clear')
export const operator = createAction('calculator/operator')
export const number = createAction('calculator/number')

// Initial state is a zero:
const initialState = {
  queue: ['0']
}

// Which operators do we accept?
const ALLOWED_OPERATORS = '+-*/%=.±'

// Test if a string is an operator:
export const isOperator = pipe(
  indexOf(__, ALLOWED_OPERATORS),
  gte(__, 0)
)

// Regular expression to test if a string is a number:
export const isNumber = test(/^-{0,1}[0-9]+\.{0,1}[0-9]*$/)

// Test if an action is an operator and contains action.payload of xs:
const matchOperator = xs => where({
  type: equals(operator.type),
  payload: equals(xs)
})

// Perform the evaluation, then convert to a string:
const calculate = pipe(
  evaluate,
  toString
)

export default createReducer(initialState, (builder) => {
  builder

    // === Numbers ===
    .addCase(number, (state, action) => {
      // If the queue is empty, append to the queue:
      if (state.queue.length === 0) {
        state.queue = [action.payload.toString()]
      // Last item is an operator, start a new number:
      } else if (isOperator(nth(-1, state.queue))) {
        state.queue.push(action.payload.toString())
      // If there's a solution currently displayed, replace the whole state.queue with the new number:
      } else if (state.queue.length > 2 && nth(-2, state.queue) === '=') {
        state.queue = [action.payload.toString()]
      // If there's a zero, replace it:
      } else if (nth(-1, state.queue) === '0') {
        state.queue = adjust(-1, always(action.payload.toString()), state.queue)
      // Otherwise, adjust the number by appending it to the last string:
      } else {
        state.queue = adjust(-1, xs => xs + action.payload.toString(), state.queue)
      }
    })

    // === Clear ===
    .addCase(clear, (state, action) => {
      // If all clear was pressed:
      if (action.payload) {
        state.queue = initialState.queue
      } else {
        // If the last item in a queue is a number, replace it with zero:
        if (isNumber(nth(-1, state.queue))) {
          state.queue = adjust(-1, always('0'), state.queue)
        }
      }
    })
    // === Operators ===
    // We use addMatcher for operator actions because otherwise, the single case reducer is pretty
    // confusing. Each matcher matches a particular operation that has special status. The default
    // case matches +-/*, the mathematical operations

    // Noop for invalid actions and invalid operators:
    .addMatcher(action => action.type !== operator.type || not(isOperator(action.payload)), () => {})

    // Handle decimal operator:
    .addMatcher(matchOperator('.'), (state, action) => {
      const lastQueueItem = nth(-1, state.queue)
      // Add a zero if there's an operator currently pressed:
      if (isOperator(lastQueueItem)) {
        state.queue.push('0')
      }
      // Append a decimal if there's no decimal present, otherwise ignore:
      if (lastQueueItem.indexOf('.') < 0) {
        state.queue = adjust(-1, xs => xs + '.', state.queue)
      }
    })

    // Handle negation operator:
    .addMatcher(matchOperator('±'), (state, action) => {
      const lastQueueItem = nth(-1, state.queue)
      if (isNumber(lastQueueItem)) {
        // If a negative number, remove the negative:
        if (lastQueueItem.indexOf('-') === 0) {
          state.queue = adjust(-1, slice(1), state.queue)
        // Otherwise, attach it:
        } else {
          state.queue = adjust(-1, always('-' + lastQueueItem), state.queue)
        }
      }
    })

    // Handle equals operator:
    .addMatcher(matchOperator('='), (state, action) => {
      if (state.queue.length === 2) {
        const firstItem = nth(-2, state.queue)
        const secondItem = nth(-1, state.queue)
        // Queue is of the form of <number> <operation>:
        if (isNumber(firstItem) && isOperator(secondItem)) {
          state.queue = concat(state.queue, [firstItem, '=', calculate(`${firstItem} ${secondItem} ${firstItem}`)])
        }
      // Queue contains at least three items:
      } else if (state.queue.length > 2) {
        const firstItem = nth(-3, state.queue)
        const secondItem = nth(-2, state.queue)
        const thirdItem = nth(-1, state.queue)
        // Queue is of the form <number> <operation> <number>:
        if (isNumber(firstItem) && isOperator(secondItem) && isNumber(thirdItem)) {
          // Check that the operator isn't equals:
          if (secondItem !== '=') {
            state.queue = concat(state.queue, ['=', calculate(`${firstItem} ${secondItem} ${thirdItem}`)])
          // If it is an equals, are there at least four items in the queue?
          // If so, we are performing a recurring operation (e.g. 5+5===)
          } else if (state.queue.length >= 4) {
            const fourthItem = nth(-4, state.queue)
            state.queue = concat(state.queue, [fourthItem, firstItem, '=', calculate(`${firstItem} ${fourthItem} ${thirdItem}`)])
            // The above line was written by trial and error with the test case
          }
        }
      }
    })

    // All that remains are to handle mathematical operators
    .addDefaultCase((state, action) => {
      const lastQueueItem = nth(-1, state.queue)
      // Replace last operator:
      if (isOperator(lastQueueItem) && lastQueueItem !== '=') {
        state.queue = adjust(-1, always(action.payload), state.queue)
      // Otherwise, we are performing some form of calculation:
      } else {
        // If we already have an equals in the chain, split and calculate for the part after it:
        if (state.queue.indexOf('=') >= 0) {
          const position = lastIndexOf('=', state.queue)
          state.queue = concat(state.queue.slice(0, position), ['=', calculate(state.queue.slice(position + 1).join(' '))])
        // Otherwise, calculate the whole state.queue:
        } else {
          state.queue = [calculate(state.queue.join(' '))]
        }
        // Then add on the new operation:
        state.queue.push(action.payload)
      }
    })
})
