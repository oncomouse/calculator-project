import reducer, { operator, number, clear } from './calculator'
import { always, append, clone, evolve, update } from 'ramda'

const initialState = reducer({}, clear())
describe('Reducer for numbers', () => {
  test('It should add a number to queue', () => {
    const finalState = evolve({
      queue: append(4)
    }, initialState)
    expect(reducer(initialState, number(4))).toEqual(finalState)
  })
  test('It should continue to fill out the number when numbers are applied', () => {
    let state = evolve({
      queue: append(4)
    }, initialState)
    state = reducer(state, number(5))
    const finalState = evolve({
      queue: append(45)
    }, initialState)
    expect(state).toEqual(finalState)
  })
  test('It should add after a decimal point if decimal is true', () => {
    let state = evolve({
      decimal: always(true),
      queue: append(4)
    }, initialState)
    const finalState = evolve({
      queue: update(0, 4.5)
    }, state)
    state = reducer(state, number(5))
    expect(state).toEqual(finalState)
    const finalState2 = evolve({
      queue: update(0, 4.55)
    }, finalState)
    state = reducer(state, number(5))
    expect(state).toEqual(finalState2)
  })
})

describe('Reducer for clear', () => {
  test('It should clear the queue', () => {
    let state = evolve({
      queue: always([45.3, '+', 27.5]),
      decimal: always(true)
    }, initialState)
    state = reducer(state, clear())
    const finalState = clone(initialState)
    expect(state).toEqual(finalState)
  })
  test('It should clear trailing zeroes from the queue', () => {
    let state = evolve({
      queue: always([5]),
      decimal: always(true),
      zeroes: always(3)
    }, initialState)
    state = reducer(state, clear())
    const finalState = clone(initialState)
    expect(state).toEqual(finalState)
  })
  test('It should clear last operation', () => {
    let state = evolve({
      queue: always([15]),
      decimal: always(false),
      lastOperation: always(['+', 5])
    }, initialState)
    state = reducer(state, clear())
    const finalState = clone(initialState)
    expect(state).toEqual(finalState)
  })
})

describe('Reducer for operations', () => {
  test('Ignore Invalid Operation', () => {
    let state = evolve({
      queue: append(4),
      decimal: always(true)
    }, initialState)
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
    const finalState = evolve({
      queue: always([0, '+'])
    }, initialState)
    state = reducer(state, operator('+'))
    expect(state).toEqual(finalState)
  })
  test('Replace last operation', () => {
    let state = evolve({
      queue: always([4, '*'])
    }, initialState)
    const finalState = evolve({
      queue: update(-1, '+')
    }, state)
    state = reducer(state, operator('+'))
    expect(state).toEqual(finalState)
  })
  test('Decimal point after operator', () => {
    let state = evolve({
      queue: always([4, '*'])
    }, initialState)
    const finalState = evolve({
      queue: append(0),
      decimal: always(true)
    }, state)
    state = reducer(state, operator('.'))
    expect(state).toEqual(finalState)
  })
  test('Addition (operation)', () => {
    let state = evolve({
      queue: append(4)
    }, initialState)
    const finalState = evolve({
      queue: append('+')
    }, state)
    state = reducer(state, operator('+'))
    expect(state).toEqual(finalState)
  })
  test('Subtraction (operation)', () => {
    let state = evolve({
      queue: append(4)
    }, initialState)
    const finalState = evolve({
      queue: append('-')
    }, state)
    state = reducer(state, operator('-'))
    expect(state).toEqual(finalState)
  })
  test('Multiplication (operation)', () => {
    let state = evolve({
      queue: append(4)
    }, initialState)
    const finalState = evolve({
      queue: append('*')
    }, state)
    state = reducer(state, operator('*'))
    expect(state).toEqual(finalState)
  })
  test('Division (operation)', () => {
    let state = evolve({
      queue: append(4)
    }, initialState)
    const finalState = evolve({
      queue: append('/')
    }, state)
    state = reducer(state, operator('/'))
    expect(state).toEqual(finalState)
  })
  test('Addition (calculation)', () => {
    const initialState = {
      queue: [4, '+', 5],
      decimal: false
    }
    const finalState = {
      queue: [9, '+'],
      decimal: false
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('Subtraction (calculation)', () => {
    const initialState = {
      queue: [5, '-', 4],
      decimal: false
    }
    const finalState = {
      queue: [1, '+'],
      decimal: false
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('Multiplication (calculation)', () => {
    const initialState = {
      queue: [5, '*', 4],
      decimal: false
    }
    const finalState = {
      queue: [20, '+'],
      decimal: false
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('Division (calculation)', () => {
    const initialState = {
      queue: [20, '/', 4],
      decimal: false
    }
    const finalState = {
      queue: [5, '+'],
      decimal: false
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('Equals (w/ two numbers)', () => {
    const initialState = {
      queue: [20, '/', 4],
      decimal: false
    }
    const finalState = {
      queue: [5],
      decimal: false,
      lastOperation: ['/', 4]
    }
    expect(reducer(initialState, operator('='))).toEqual(finalState)
  })
  test('Equals (w/ one number and an operator)', () => {
    const initialState = {
      queue: [5, '+'],
      decimal: false
    }
    const finalState = {
      queue: [10],
      decimal: false,
      lastOperation: ['+', 5]
    }
    expect(reducer(initialState, operator('='))).toEqual(finalState)
  })
  test('Equals should repeat operation without other input', () => {
    const initialState = {
      queue: [5, '+', 5],
      decimal: false
    }
    let state = reducer(initialState, operator('='))
    state = reducer(state, operator('='))
    state = reducer(state, operator('='))
    const finalState = {
      queue: [20],
      decimal: false,
      lastOperation: ['+', 5]
    }
    expect(state).toEqual(finalState)
  })
  test('Equals (w/ one number)', () => {
    const initialState = {
      queue: [5],
      decimal: false
    }
    const finalState = {
      queue: [5],
      decimal: false
    }
    expect(reducer(initialState, operator('='))).toEqual(finalState)
  })
  test('Decimal', () => {
    const initialState = {
      queue: [5],
      decimal: false
    }
    const finalState = {
      queue: [5],
      decimal: true
    }
    expect(reducer(initialState, operator('.'))).toEqual(finalState)
  })
  test('Ignore decimal when decimals present', () => {
    const initialState = {
      queue: [5.125],
      decimal: true
    }
    const finalState = {
      queue: [5.125],
      decimal: true
    }
    expect(reducer(initialState, operator('.'))).toEqual(finalState)
  })
  test('Ignore decimal when decimals present (trailing zeroes)', () => {
    const initialState = {
      queue: [5],
      decimal: true,
      zeroes: 3
    }
    const finalState = {
      queue: [5],
      decimal: true,
      zeroes: 3
    }
    expect(reducer(initialState, operator('.'))).toEqual(finalState)
  })
  test('Zeroes after decimal', () => {
    const initialState = {
      queue: [5],
      decimal: true
    }
    const finalState = {
      queue: [5],
      decimal: true,
      zeroes: 2
    }
    expect(reducer(reducer(initialState, number(0)), number(0))).toEqual(finalState)
    const finalState2 = {
      queue: [5.001],
      decimal: true
    }
    expect(reducer(finalState, number(1))).toEqual(finalState2)
  })
  test('Enter decimals correctly', () => {
    const initialState = {
      queue: [455],
      decimal: false
    }
    const finalState = {
      queue: [455.123],
      decimal: true
    }
    let state = reducer(initialState, operator('.'))
    state = reducer(state, number(1))
    state = reducer(state, number(2))
    state = reducer(state, number(3))
    expect(state).toEqual(finalState)
  })
  test('Zeroes after decimal starting from an integer', () => {
    const initialState = {
      queue: [5],
      decimal: false
    }
    const finalState = {
      queue: [5],
      decimal: true,
      zeroes: 3
    }
    let state = reducer(initialState, operator('.'))
    state = reducer(state, number(0))
    state = reducer(state, number(0))
    state = reducer(state, number(0))
    expect(state).toEqual(finalState)
    const finalState2 = {
      queue: [5.0001],
      decimal: true
    }
    state = reducer(state, number(1))
    expect(state).toEqual(finalState2)
  })
  test('Clear zeroes after decimal', () => {
    const initialState = {
      queue: [5],
      decimal: true,
      zeroes: 2
    }
    const finalState = {
      queue: [5, '+'],
      decimal: true,
      zeroes: 2
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
    const finalState2 = {
      queue: [5, '+', 2],
      decimal: false
    }
    expect(reducer(finalState, number(2))).toEqual(finalState2)
  })
})
