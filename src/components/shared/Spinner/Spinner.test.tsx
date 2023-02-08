import { render, screen } from '@testing-library/react'

import { Spinner } from './Spinner'

describe('#Spinner', () => {
  it('should render spinner', () => {
    render(<Spinner />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should be able to pass className', () => {
    render(<Spinner className="hello" />)

    expect(screen.getByRole('status')).toHaveClass('hello')
  })
})
