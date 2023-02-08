import { CogIcon } from '@heroicons/react/24/solid'
import { render, screen, within } from '@testing-library/react'

import { Button } from './Button'

describe('#Button', () => {
  it('should render button', () => {
    render(<Button></Button>)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should render label', () => {
    render(<Button label="Test"></Button>)

    expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument()
  })

  it('should render icon on the left side of the label by default', () => {
    const { container } = render(
      <Button label="Test" icon={<CogIcon data-testid="icon" />}></Button>
    )

    const buttonChildren = container.querySelectorAll('button span')

    expect(buttonChildren).toHaveLength(2)
    expect(
      within(buttonChildren[0] as HTMLElement).getByTestId('icon')
    ).toBeInTheDocument()
    expect(
      within(buttonChildren[1] as HTMLElement).getByText('Test')
    ).toBeInTheDocument()
  })

  it('should render icon on the left side of the label if iconPosition is left', () => {
    const { container } = render(
      <Button label="Test" icon={<CogIcon data-testid="icon" />}></Button>
    )

    const buttonChildren = container.querySelectorAll('button span')

    expect(buttonChildren).toHaveLength(2)
    expect(
      within(buttonChildren[0] as HTMLElement).getByTestId('icon')
    ).toBeInTheDocument()
    expect(
      within(buttonChildren[1] as HTMLElement).getByText('Test')
    ).toBeInTheDocument()
  })

  it('should render icon on the right side of the label if iconPosition is right', () => {
    const { container } = render(
      <Button label="Test" icon={<CogIcon data-testid="icon" />}></Button>
    )

    const buttonChildren = container.querySelectorAll('button span')

    expect(buttonChildren).toHaveLength(2)
    expect(
      within(buttonChildren[1] as HTMLElement).getByText('Test')
    ).toBeInTheDocument()
    expect(
      within(buttonChildren[0] as HTMLElement).getByTestId('icon')
    ).toBeInTheDocument()
  })

  it('should have rounded-full and !p-2.5 class if label is not passed', () => {
    render(<Button icon={<CogIcon data-testid="icon" />}></Button>)

    expect(screen.getByRole('button')).toHaveClass('rounded-full !p-2.5')
  })
})
