import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { always, join, pipe, prop, propOr, reduce, times } from 'ramda'
import countDecimalPlaces from '../utilities/countDecimalPlaces'

const Component = styled.h1``

const listOfZeroes = pipe(
  times(always(0)),
  join('')
)

const format = (value, decimal, zeroes) => {
  return countDecimalPlaces(value) > 0 ? value : `${value}${decimal ? '.' : ''}${listOfZeroes(zeroes)}`
}

const Display = (props) => {
  const value = useSelector(pipe(
    prop('queue'),
    reduce((acc, cur) => typeof cur === 'number' ? cur : acc, 0)
  ))
  const decimal = useSelector(prop('decimal'))
  const zeroes = useSelector(propOr(0, 'zeroes'))
  const output = format(value, decimal, zeroes)
  return (<Component>{output}</Component>)
}

export default Display
