import reducer, { countDecimalPlaces, operator, number, clear } from './calculator'

describe('Reducer for numbers', () => {
  test('Counting decimal places should work', () => {
    expect(countDecimalPlaces(4)).toBe(0)
    expect(countDecimalPlaces(4.5)).toBe(1)
    expect(countDecimalPlaces(4.55)).toBe(2)
    expect(countDecimalPlaces(4.555)).toBe(3)
  })
  test('It should add a number to queue', () => {
    const finalState = {
      decimal: false,
      queue: [4]
    }
    const initialState = {
      decimal: false,
      queue: []
    }
    expect(reducer(initialState, number(4))).toEqual(finalState)
  })
  test('It should continue to fill out the number when numbers are applied', () => {
    const finalState = {
      decimal: false,
      queue: [45]
    }
    const initialState = {
      decimal: false,
      queue: [4]
    }
    expect(reducer(initialState, number(5))).toEqual(finalState)
  })
  test('It should add after a decimal point if decimal is true', () => {
    const finalState = {
      decimal: true,
      queue: [4.5]
    }
    const initialState = {
      decimal: true,
      queue: [4]
    }
    expect(reducer(initialState, number(5))).toEqual(finalState)
    const finalState2 = {
      decimal: true,
      queue: [4.55]
    }
    const initialState2 = {
      decimal: true,
      queue: [4.5]
    }
    expect(reducer(initialState2, number(5))).toEqual(finalState2)
  })
})

describe('Reducer for clear', () => {
  test('It should clear the queue', () => {
    const initialState = {
      queue: [45.3, '+', 27.5],
      decimal: true
    }
    const finalState = {
      queue: [],
      decimal: false
    }
    expect(reducer(initialState, clear())).toEqual(finalState)
  })
})

describe('Reducer for operations', () => {
  test('Ignore Invalid Operation', () => {
    const initialState = {
      queue: [4],
      decimal: true
    }
    const finalState = {
      queue: [4],
      decimal: true
    }
    expect(reducer(initialState, operator('!'))).toEqual(finalState)
  })
  test('Ignore Empty Queue', () => {
    const initialState = {
      queue: [],
      decimal: false
    }
    const finalState = {
      queue: [],
      decimal: false
    }
    expect(reducer(initialState, operator('!'))).toEqual(finalState)
  })
  test('Replace last operation', () => {
    const initialState = {
      queue: [4, '*'],
      decimal: false
    }
    const finalState = {
      queue: [4, '+'],
      decimal: false
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('Decimal point after operator', () => {
    const initialState = {
      queue: [4, '*'],
      decimal: false
    }
    const finalState = {
      queue: [4, '*', 0],
      decimal: true
    }
    expect(reducer(initialState, operator('.'))).toEqual(finalState)
  })
  test('Addition (operation)', () => {
    const initialState = {
      queue: [4],
      decimal: false
    }
    const finalState = {
      queue: [4, '+'],
      decimal: false
    }
    expect(reducer(initialState, operator('+'))).toEqual(finalState)
  })
  test('Subtraction (operation)', () => {
    const initialState = {
      queue: [5],
      decimal: false
    }
    const finalState = {
      queue: [5, '-'],
      decimal: false
    }
    expect(reducer(initialState, operator('-'))).toEqual(finalState)
  })
  test('Multiplication (operation)', () => {
    const initialState = {
      queue: [5],
      decimal: false
    }
    const finalState = {
      queue: [5, '*'],
      decimal: false
    }
    expect(reducer(initialState, operator('*'))).toEqual(finalState)
  })
  test('Division (operation)', () => {
    const initialState = {
      queue: [5],
      decimal: false
    }
    const finalState = {
      queue: [5, '/'],
      decimal: false
    }
    expect(reducer(initialState, operator('/'))).toEqual(finalState)
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
      decimal: false
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
      decimal: false
    }
    expect(reducer(initialState, operator('='))).toEqual(finalState)
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
})
