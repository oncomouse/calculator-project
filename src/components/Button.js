import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { number, operator, clear } from '../features/calculator'
import { always, equals, ifElse, pipe, prop, reduce } from 'ramda'

const ButtonComponent = styled.button`
  display: inline-grid;
  height: 5rem;
  width: ${props => (props.width || 1) * 5 + (props.width - 1 || 0) * props.theme.gridGap}rem;
  font-size: 3.5rem;
  grid-column-end: span ${props => (props.width || 1)};
  background: ${props => props.highlight ? props.theme.highlight.bg : 'initial'};
  foreground: ${props => props.highlight ? props.theme.highlight.fg : 'black'};
  border-radius: 3px;
  border: 1px solid #666;
  &:hover {
    background: #ddd;
  }
`

const Button = (props) => {
  const dispatch = useDispatch()
  return (<ButtonComponent onClick={() => dispatch(props.actionCreator(props.value))} {...props}>{props.children}</ButtonComponent>)
}

export const NumberButton = (props) => {
  return (<Button actionCreator={number} {...props}>{props.children}</Button>)
}

export const OperatorButton = (props) => {
  const isHighlighted = useSelector(pipe(
    prop('queue'),
    reduce((acc, cur) => (typeof cur === 'string') ? cur : acc, null),
    ifElse(equals(null), always(false), equals(props.value))
  ))
  return (<Button actionCreator={operator} highlight={isHighlighted} {...props}>{props.children}</Button>)
}
export const ClearButton = (props) => {
  return (<Button actionCreator={clear}>{props.children}</Button>)
}

export default Button
