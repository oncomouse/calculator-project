import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import Button from './Button.js';
import { store } from '../store';

describe('<Button /> Component', () =>{
  test('Renders', () => {
    render(
      <Provider store={store}>
        <Button actionCreator={() => {}}>Click Me</Button>
      </Provider>
    );
    expect(screen.getByText(/Click Me/i)).toBeInTheDocument();
  })
})
