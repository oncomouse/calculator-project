import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { number, operator, clear } from '../features/calculator'

const ButtonComponent = styled.button`
  display: inline-grid;
  height: 5rem;
  width: ${props => (props.width || 1) * 5 + (props.width - 1 || 0) * props.theme.gridGap}rem;
  font-size: 3.5rem;
  grid-column-end: span ${props => (props.width || 1)};
`

const Button = (props) => {
  const dispatch = useDispatch()
  return (<ButtonComponent onClick={() => dispatch(props.actionCreator(props.value))} {...props}>{props.children}</ButtonComponent>)
}

export const NumberButton = (props) => {
  return (<Button actionCreator={number} {...props}>{props.children}</Button>)
}

export const OperatorButton = (props) => {
  return (<Button actionCreator={operator} {...props}>{props.children}</Button>)
}
export const ClearButton = (props) => {
  return (<Button actionCreator={clear}>{props.children}</Button>)
}

export default Button
