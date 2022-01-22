import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { store } from '../features/store'
import theme from '../features/theme'

// Minimal context to get components working. Used in testing:
const MinimalApp = (props) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  </Provider>
)

export default MinimalApp
