import { Provider } from 'react-redux'
import styled from 'styled-components'
import { ClearButton, NumberButton, OperatorButton } from './components/Button.js'
import Display from './components/Display'
import { store } from './store'

const Component = styled.div`
  display: grid;
  grid-template-columns: repeat(4,1fr);
  grid-gap: 1rem;
  width: 20rem;
`

function App () {
  return (
    <Provider store={store}>
      <Component>
        <ClearButton>C</ClearButton>
        <Display />
        <NumberButton value={7}>7</NumberButton>
        <NumberButton value={8}>8</NumberButton>
        <NumberButton value={9}>9</NumberButton>
        <OperatorButton value="*">x</OperatorButton>
        <NumberButton value={4}>4</NumberButton>
        <NumberButton value={5}>5</NumberButton>
        <NumberButton value={6}>6</NumberButton>
        <OperatorButton value="-">-</OperatorButton>
        <NumberButton value={1}>1</NumberButton>
        <NumberButton value={2}>2</NumberButton>
        <NumberButton value={3}>3</NumberButton>
        <OperatorButton value="+">+</OperatorButton>
        <NumberButton value={0} width={2}>0</NumberButton>
        <OperatorButton value=".">.</OperatorButton>
        <OperatorButton value="=">=</OperatorButton>
      </Component>
    </Provider>
  )
}

export default App
