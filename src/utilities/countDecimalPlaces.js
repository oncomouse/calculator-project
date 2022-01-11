import { always, contains, ifElse, length, nth, pipe, split, toString } from 'ramda'
// How many decimal places does the number have?
const countDecimalPlaces = pipe(
  toString, // Convert the number to a string
  ifElse(
    contains('.'), // Does it contain a decimal place?
    pipe(split('.'), nth(1), length), // If so, split and take the length of the latter
    always(0) // If not, 0
  )
)

export default countDecimalPlaces
