import { curry } from 'ramda'

const instanceOf = curry((xo, x) => x instanceof xo)

export default instanceOf
