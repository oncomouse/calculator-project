import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { number, operator, clear } from '../features/calculator'
import { always, equals, ifElse, pipe, prop, reduce, replace } from 'ramda'

const shrink = (xs, factor) => {
  const size = parseFloat(xs, 10)
  const units = replace(size, '', xs)
  return `${size * factor}${units}`
}

const ButtonComponent = styled.button`
  display: inline-grid;
  height: ${props => props.theme.button.height};
  width: ${props => (props.width || 1) * parseInt(props.theme.button.height, 10) + (props.width - 1 || 0) * props.theme.gridGap}rem;
  padding-top: ${props => props.small ? shrink(props.theme.button.font.size, 1 - props.theme.button.smallFactor) : 0};
  font-size: ${props => props.small ? shrink(props.theme.button.font.size, props.theme.button.smallFactor) : props.theme.button.font.size};
  grid-column-end: span ${props => (props.width || 1)};
  background: ${props => props.highlight ? props.theme.button.highlight.bg : props.theme.button.bg};
  color: ${props => props.highlight ? props.theme.button.highlight.fg : props.theme.button.fg};
  border-width: ${props => props.theme.button.border.width};
  border-color: ${props => props.theme.button.border.color};
  border-style: ${props => props.theme.button.border.style};
  border-radius: ${props => props.theme.button.border.radius};
  &:hover {
    color: ${props => props.theme.button.hover.fg};
    background: ${props => props.theme.button.hover.bg};
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
  // Is this button the last operator to be pressed? If so, highlight it:
  const isHighlighted = useSelector(pipe(
    prop('queue'),
    reduce((acc, cur) => (typeof cur === 'string') ? cur : acc, null),
    ifElse(equals(null), always(false), equals(props.value))
  ))
  return (<Button actionCreator={operator} highlight={isHighlighted} {...props}>{props.children}</Button>)
}

export const ClearButton = (props) => {
  return (<Button actionCreator={clear} {...props}>{props.children}</Button>)
}

export default Button
