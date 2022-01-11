import Decimal from 'decimal.js'
import { construct, curry, identity, ifElse, invoker, pipe } from 'ramda'

const instanceOf = curry((xo, x) => x instanceof xo)
const countDecimalPlaces = pipe(
  ifElse(instanceOf(Decimal), identity, construct(Decimal)),
  invoker(0, 'decimalPlaces') // Call a prototype method
)

export default countDecimalPlaces
