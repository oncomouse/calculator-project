import { Provider } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { ClearButton, NumberButton, OperatorButton } from './components/Button.js'
import Display from './components/Display'
import KeyHandler from './components/KeyHandler'
import { store } from './features/store'
import theme from './features/theme'

const Component = styled.div`
  display: grid;
  grid-template-columns: repeat(4,1fr);
  grid-gap: ${props => props.theme.gridGap}rem;
  width: 20rem;
  margin: auto;
  margin-top: 4rem;
`

function App () {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Component>
          <KeyHandler />
          <Display />
          <ClearButton value={true}>AC</ClearButton>
          <ClearButton value={false}>C</ClearButton>
          <OperatorButton value="±">±</OperatorButton>
          <OperatorButton value="/">/</OperatorButton>
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
      </ThemeProvider>
    </Provider>
  )
}

export default App
