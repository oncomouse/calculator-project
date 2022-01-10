import { Provider } from 'react-redux';
import Button from './components/Button.js';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      
    </Provider>
  );
}

export default App;
