import reducer, { isNumber, isOperator, operator, number, clear } from './calculator'
import { always, append, clone, evolve, update } from 'ramda'

const initialState = reducer({}, clear(true))
describe('Utilities', () => {
  test('isNumber should identify a number', () => {
    expect(isNumber('0.54')).toBe(true)
    expect(isNumber('0')).toBe(true)
    expect(isNumber('7.0')).toBe(true)
    expect(isNumber('2000.45')).toBe(true)
  })
  test('isOperator should not identify a number', () => {
    expect(isOperator('0.54')).toBe(false)
    expect(isOperator('0')).toBe(false)
    expect(isOperator('2000.45')).toBe(false)
  })
  test('isOperator should identify an operator', () => {
    expect(isOperator('+')).toBe(true)
    expect(isOperator('-')).toBe(true)
    expect(isOperator('/')).toBe(true)
    expect(isOperator('*')).toBe(true)
    expect(isOperator('.')).toBe(true)
    expect(isOperator('=')).toBe(true)
  })
})
describe('Reducer for numbers', () => {
  test('It should add a number to queue', () => {
    const finalState = {
      queue: '4'
    }
    expect(reducer(initialState, number(4))).toEqual(finalState)
  })
  test('It should replace a zero, if it is the last number', () => {
    let state = {
      queue: '0'
    }
    state = reducer(state, number(4))
    const finalState = {
      queue: '4'
    }
    expect(state).toEqual(finalState)
  })
  test('It should continue to fill out the number when numbers are applied', () => {
    let state = {
      queue: '4'
    }
    state = reducer(state, number(5))
    const finalState = evolve({
      queue: always('45')
    }, initialState)
    expect(state).toEqual(finalState)
  })
  test('It should add after a decimal point if decimal is true', () => {
    let state = {
      queue: '4.'
    }
    const finalState = {
      queue: '4.5'
    }
    state = reducer(state, number(5))
    expect(state).toEqual(finalState)
    const finalState2 = {
      queue: '4.55'
    }
    state = reducer(state, number(5))
    expect(state).toEqual(finalState2)
  })
  test('It should restart a fresh queue if an operation has been completed and a number is input', () => {
    let state = {
      queue: '4 + 5 = 9'
    }
    state = reducer(state, number(5))
    const finalState = {
      queue: '5'
    }
    expect(state).toEqual(finalState)
  })
})

describe('Reducer for clear', () => {
  test('It should clear the last number', () => {
    let state = {
      queue: '45.3 + 27.5'
    }
    state = reducer(state, clear(false))
    const finalState = {
      queue: '45.3 + 0'
    }
    expect(state).toEqual(finalState)
  })
  test('It should clear the queue with all clear', () => {
    let state = {
      queue: '45.3 + 27.5'
    }
    state = reducer(state, clear(true))
    const finalState = clone(initialState)
    expect(state).toEqual(finalState)
  })
  test('It should clear trailing zeroes from the queue', () => {
    let state = {
      queue: '5.000'
    }
    state = reducer(state, clear(true))
    const finalState = clone(initialState)
    expect(state).toEqual(finalState)
  })
  test('It should clear trailing zeroes from the queue when clearing last number', () => {
    let state = {
      queue: '5 + 6.00'
    }
    state = reducer(state, clear())
    const finalState = {
      queue: '5 + 0'
    }

    expect(state).toEqual(finalState)
  })
})

describe('Reducer for operations', () => {
  test('Ignore Invalid Operation', () => {
    let state = {
      queue: '4.'
    }
    const finalState = clone(state)
    state = reducer(state, operator('!'))
    expect(state).toEqual(finalState)
  })
  test('Ignore Empty Queue w/ Invalid Input', () => {
    let state = clone(initialState)
    const finalState = clone(initialState)
    state = reducer(state, operator('!'))
    expect(state).toEqual(finalState)
  })
  test('Ignore empty queue with =', () => {
    let state = clone(initialState)
    const finalState = clone(initialState)
    state = reducer(state, operator('='))
    expect(state).toEqual(finalState)
  })
  test('Add a 0 if queue empty and operator is not =', () => {
    let state = clone(initialState)
    const finalState = {
      queue: '0 +'
    }
    state = reducer(state, operator('+'))
    expect(state).toEqual(finalState)
  })
  test('Replace last operation', () => {
    let state = {
      queue: '4 *'
    }
    const finalState = evolve({
      queue: always('4 +')
    }, state)
    state = reducer(state, operator('+'))
    expect(state).toEqual(finalState)
  })
  test('Decimal point after operator', () => {
    let state = {
      queue: '4 *'
    }
    const finalState = {
      queue: '4 * 0.'
    }
    state = reducer(state, operator('.'))
    expect(state).toEqual(finalState)
  })
  test('Addition (operation)', () => {
    let state = {
      queue: '4'
    }
    const finalState = {
      queue: '4 +'
    }
    state = reducer(state, operator('+'))
    expect(state).toEqual(finalState)
  })
  test('Subtraction (operation)', () => {
    let state = {
      queue: '4'
    }
    const finalState = {
      queue: '4 -'
    }
    state = reducer(state, operator('-'))
    expect(state).toEqual(finalState)
  })
  test('Multiplication (operation)', () => {
    let state = {
      queue: '4'
    }
    const finalState = {
      queue: '4 *'
    }
    state = reducer(state, operator('*'))
    expect(state).toEqual(finalState)
  })
  test('Division (operation)', () => {
    let state = {
      queue: '4'
    }
    const finalState = {
      queue: '4 /'
    }
    state = reducer(state, operator('/'))
    expect(state).toEqual(finalState)
  })
  test('Addition (calculation)', () => {
    const initialState = {
      queue: '4 + 5'
    }
    const finalState = {
      queue: '9 +'
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('Subtraction (calculation)', () => {
    const initialState = {
      queue: '5 - 4'
    }
    const finalState = {
      queue: '1 +'
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('Multiplication (calculation)', () => {
    const initialState = {
      queue: '5 * 4'
    }
    const finalState = {
      queue: '20 +'
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('Division (calculation)', () => {
    const initialState = {
      queue: '20 / 4'
    }
    const finalState = {
      queue: '5 +'
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('It should continue with calculation if an operator is added after an equals', () => {
    let state = {
      queue: '4 + 5 = 9'
    }
    state = reducer(state, operator('+'))
    const finalState = {
      queue: '4 + 5 = 9 +'
    }
    expect(state).toEqual(finalState)
  })
  test('Equals (w/ two numbers)', () => {
    const initialState = {
      queue: '20 / 4'
    }
    const finalState = {
      queue: '20 / 4 = 5'
    }
    expect(reducer(initialState, operator('='))).toEqual(finalState)
  })
  test('Equals (w/ one number and an operator)', () => {
    const initialState = {
      queue: '5 +'
    }
    const finalState = {
      queue: '5 + 5 = 10'
    }
    expect(reducer(initialState, operator('='))).toEqual(finalState)
  })
  test('Equals should repeat operation without other input', () => {
    const initialState = {
      queue: '6 + 4'
    }
    let state = reducer(initialState, operator('='))
    state = reducer(state, operator('='))
    state = reducer(state, operator('='))
    const finalState = {
      queue: '6 + 4 = 10 + 4 = 14 + 4 = 18'
    }
    expect(state).toEqual(finalState)
  })
  test('Equals (w/ one number)', () => {
    const initialState = {
      queue: '5'
    }
    const finalState = {
      queue: '5'
    }
    expect(reducer(initialState, operator('='))).toEqual(finalState)
  })
  test('Decimal', () => {
    const initialState = {
      queue: '5'
    }
    const finalState = {
      queue: '5.'
    }
    expect(reducer(initialState, operator('.'))).toEqual(finalState)
  })
  test('Ignore decimal when decimals present', () => {
    const initialState = {
      queue: '5.125'
    }
    const finalState = {
      queue: '5.125'
    }
    expect(reducer(initialState, operator('.'))).toEqual(finalState)
  })
  test('Ignore decimal when decimals present (trailing zeroes)', () => {
    const initialState = {
      queue: '5.000'
    }
    const finalState = {
      queue: '5.000'
    }
    expect(reducer(initialState, operator('.'))).toEqual(finalState)
  })
  test('Zeroes after decimal', () => {
    const initialState = {
      queue: '5.'
    }
    const finalState = {
      queue: '5.00'
    }
    expect(reducer(reducer(initialState, number(0)), number(0))).toEqual(finalState)
    const finalState2 = {
      queue: '5.001'
    }
    expect(reducer(finalState, number(1))).toEqual(finalState2)
  })
  test('Enter decimals correctly', () => {
    const initialState = {
      queue: '455'
    }
    const finalState = {
      queue: '455.123'
    }
    let state = reducer(initialState, operator('.'))
    state = reducer(state, number(1))
    state = reducer(state, number(2))
    state = reducer(state, number(3))
    expect(state).toEqual(finalState)
  })
  test('Zeroes after decimal starting from an integer', () => {
    const initialState = {
      queue: '5'
    }
    const finalState = {
      queue: '5.000'
    }
    let state = reducer(initialState, operator('.'))
    state = reducer(state, number(0))
    state = reducer(state, number(0))
    state = reducer(state, number(0))
    expect(state).toEqual(finalState)
    const finalState2 = {
      queue: '5.0001'
    }
    state = reducer(state, number(1))
    expect(state).toEqual(finalState2)
  })
  test('Clear zeroes after decimal', () => {
    const initialState = {
      queue: '5.00'
    }
    const finalState = {
      queue: '5 +'
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
    const finalState2 = {
      queue: '5 + 2'
    }
    expect(reducer(finalState, number(2))).toEqual(finalState2)
  })
})
