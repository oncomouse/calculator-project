import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { pipe, prop, reduce, tap } from 'ramda'

const Component = styled.div``

const Display = (props) => {
  const value = useSelector(pipe(
    prop('queue'),
    tap(console.log),
    reduce((acc, cur) => typeof cur === 'number' ? cur : acc, 0)
  ))
  return (<Component>{value}</Component>)
}

export default Display
