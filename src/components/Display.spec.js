import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import '@testing-library/jest-dom'
import Display from './Display.js'
import { store } from '../features/store'
import { clear, number, operator } from '../features/calculator'

describe('<Display /> tests', () => {
  test('Should render the last number in the queue', () => {
    render(<Provider store={store}>
      <Display />
    </Provider>)
    store.dispatch(clear()) // Make sure there's nothing in queue
    store.dispatch(number(7))
    expect(screen.getByRole('heading')).toHaveTextContent('7')
    store.dispatch(number(5))
    expect(screen.getByRole('heading')).toHaveTextContent('75')
    store.dispatch(operator('+'))
    expect(screen.getByRole('heading')).toHaveTextContent('75')
    store.dispatch(number(1))
    expect(screen.getByRole('heading')).toHaveTextContent('1')
    store.dispatch(operator('='))
    expect(screen.getByRole('heading')).toHaveTextContent('76')
  })
  test('Should render a decimal place', () => {
    render(<Provider store={store}>
      <Display />
    </Provider>)
    store.dispatch(clear()) // Make sure there's nothing in queue
    store.dispatch(number(7))
    store.dispatch(operator('.'))
    expect(screen.getByRole('heading')).toHaveTextContent('7.')
  })
  test('Should render a decimal place and a zero', () => {
    render(<Provider store={store}>
      <Display />
    </Provider>)
    store.dispatch(clear()) // Make sure there's nothing in queue
    store.dispatch(number(7))
    store.dispatch(operator('.'))
    store.dispatch(number(0))
    expect(screen.getByRole('heading')).toHaveTextContent('7.0')
    store.dispatch(number(0))
    store.dispatch(number(0))
    expect(screen.getByRole('heading')).toHaveTextContent('7.000')
  })
  test('Should render multiple zeroes before a decimal number', () => {
    render(<Provider store={store}>
      <Display />
    </Provider>)
    store.dispatch(clear()) // Make sure there's nothing in queue
    store.dispatch(number(7))
    store.dispatch(operator('.'))
    store.dispatch(number(0))
    store.dispatch(number(0))
    store.dispatch(number(0))
    store.dispatch(number(1))
    expect(screen.getByRole('heading')).toHaveTextContent('7.0001')
  })
  test('Should render zero after clear', () => {
    render(<Provider store={store}>
      <Display />
    </Provider>)
    store.dispatch(clear()) // Make sure there's nothing in queue
    store.dispatch(number(7))
    store.dispatch(operator('+'))
    store.dispatch(number(7))
    store.dispatch(clear())
    expect(screen.getByRole('heading')).toHaveTextContent('0')
  })
})
