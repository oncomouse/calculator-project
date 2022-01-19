import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { pipe, prop, reduce } from 'ramda'
import { isNumber } from '../features/calculator'

const Component = styled.h1`
  grid-column-end: span 4;
  display: inline-grid;
  font-size: 8rem;
  font-weight: normal;
  margin: 0;
`

const Display = (props) => {
  const value = useSelector(pipe(
    prop('queue'),
    reduce((acc, cur) => (isNumber(cur) ? cur : acc), '0')
  ))
  return (<Component>{value}</Component>)
}

export default Display
