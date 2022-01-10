import { Provider } from 'react-redux'
import { ClearButton, NumberButton, OperatorButton } from './components/Button.js'
import Display from './components/Display.js'
import { store } from './store'

function App () {
  return (
    <Provider store={store}>
      <ClearButton>C</ClearButton>
      <Display />
      <NumberButton value="7">7</NumberButton>
      <NumberButton value="8">8</NumberButton>
      <NumberButton value="9">9</NumberButton>
      <OperatorButton value="*">x</OperatorButton>
      <NumberButton value="4">4</NumberButton>
      <NumberButton value="5">5</NumberButton>
      <NumberButton value="6">6</NumberButton>
      <OperatorButton value="-">-</OperatorButton>
      <NumberButton value="1">1</NumberButton>
      <NumberButton value="2">2</NumberButton>
      <NumberButton value="3">3</NumberButton>
      <OperatorButton value="+">+</OperatorButton>
      <NumberButton value="0">0</NumberButton>
      <OperatorButton value=".">.</OperatorButton>
      <OperatorButton value="=">=</OperatorButton>
    </Provider>
  )
}

export default App
