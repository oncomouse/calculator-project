import Decimal from 'decimal.js'

const countDecimalPlaces = x => (x instanceof Decimal ? x : new Decimal(x || 0)).decimalPlaces()

export default countDecimalPlaces
