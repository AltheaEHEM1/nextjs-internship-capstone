import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<button>Click Me</button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('calls the onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<button onClick={handleClick}>Submit</button>)
    const button = screen.getByRole('button', { name: /submit/i })
    
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when the disabled prop is passed', () => {
    render(<button disabled>Loading</button>)
    const button = screen.getByRole('button', { name: /loading/i })
    expect(button).toBeDisabled()
  })
})
