import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from './Button.js'
import MinimalApp from './MinimalApp.js'

describe('<Button /> Component', () => {
  test('Renders', () => {
    render(
      <MinimalApp>
        <Button actionCreator={() => {}}>Click Me</Button>
      </MinimalApp>
    )
    expect(screen.getByText(/Click Me/i)).toBeInTheDocument()
  })
})
