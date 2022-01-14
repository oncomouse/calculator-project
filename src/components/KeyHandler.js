import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import useKeypress from '../utilities/useKeypress'
import { number, operator } from '../features/calculator'

const Component = styled.span`display:none`

const KeyHandler = () => {
  const dispatch = useDispatch()
  useKeypress({
    0: () => dispatch(number(0)),
    1: () => dispatch(number(1)),
    2: () => dispatch(number(2)),
    3: () => dispatch(number(3)),
    4: () => dispatch(number(4)),
    5: () => dispatch(number(5)),
    6: () => dispatch(number(6)),
    7: () => dispatch(number(7)),
    8: () => dispatch(number(8)),
    9: () => dispatch(number(9)),
    Enter: () => dispatch(operator('=')),
    '-': () => dispatch(operator('-')),
    '+': () => dispatch(operator('+')),
    '*': () => dispatch(operator('*')),
    '/': () => dispatch(operator('/')),
    '=': () => dispatch(operator('='))
  })
  return (<Component/>)
}

export default KeyHandler
