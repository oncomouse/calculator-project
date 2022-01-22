import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import '@testing-library/jest-dom'
import Button from './Button.js'
import { store } from '../features/store'
import theme from '../features/theme'

describe('<Button /> Component', () => {
  test('Renders', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Button actionCreator={() => {}}>Click Me</Button>
        </ThemeProvider>
      </Provider>
    )
    expect(screen.getByText(/Click Me/i)).toBeInTheDocument()
  })
})
