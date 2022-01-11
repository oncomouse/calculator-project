import Decimal from 'decimal.js'
import { curry, identity, ifElse, pipe } from 'ramda'

const instanceOf = curry((xo, x) => x instanceof xo)
const countDecimalPlaces = pipe(
  ifElse(instanceOf(Decimal), identity, (x) => new Decimal(x)),
  (x) => x.decimalPlaces()
)

export default countDecimalPlaces
