import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { number, operator, clear } from '../features/calculator';

const ButtonComponent = styled.button``;

const Button = (props) => {
  const dispatch = useDispatch();
  return (<ButtonComponent onClick={() => dispatch(props.actionCreator(props.value))}>{props.children}</ButtonComponent>);
}

export const NumberButton = (props) => {
  return (<Button actionCreator={number} {...props}>{props.children}</Button>);
}

export const OperatorButton = (props) => {
  return (<Button actionCreator={operator} {...props}>{props.children}</Button>);
}
export const ClearButton = (props) => {
  return (<Button actionCreator={clear}>{props.children}</Button>);
}

export default Button;
