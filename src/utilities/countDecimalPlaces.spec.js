import countDecimalPlaces from './countDecimalPlaces'

test('Counting decimal places should work', () => {
  expect(countDecimalPlaces(4)).toBe(0)
  expect(countDecimalPlaces(4.5)).toBe(1)
  expect(countDecimalPlaces(4.55)).toBe(2)
  expect(countDecimalPlaces(4.555)).toBe(3)
})
