import Decimal from 'decimal.js'
import { construct, identity, ifElse, invoker, pipe } from 'ramda'
import instanceOf from './instanceOf'

const countDecimalPlaces = pipe(
  ifElse(instanceOf(Decimal), identity, construct(Decimal)),
  invoker(0, 'decimalPlaces') // Call a prototype method
)

export default countDecimalPlaces
