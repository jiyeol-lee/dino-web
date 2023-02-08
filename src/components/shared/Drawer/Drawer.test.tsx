import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Drawer } from './Drawer'

describe('#Drawer', () => {
  it('should render children', () => {
    render(<Drawer open={false}>Drawer</Drawer>)

    expect(screen.getByText('Drawer')).toBeInTheDocument()
  })

  it('should render and hidden on the left side of the screen by default', () => {
    render(<Drawer open={false}>Drawer</Drawer>)

    expect(screen.getByTestId('drawer')).toHaveClass('left-0 -translate-x-full')
    expect(screen.getByTestId('drawer')).not.toHaveClass(
      'right-0 translate-x-full'
    )
  })

  it('should render and hidden on the left side of the screen if anchor is left', () => {
    render(
      <Drawer open={false} anchor="left">
        Drawer
      </Drawer>
    )

    expect(screen.getByTestId('drawer')).toHaveClass('left-0 -translate-x-full')
    expect(screen.getByTestId('drawer')).not.toHaveClass(
      'right-0 translate-x-full'
    )
  })

  it('should render and hidden on the right side of the screen if anchor is right', () => {
    render(
      <Drawer open={false} anchor="right">
        Drawer
      </Drawer>
    )

    expect(screen.getByTestId('drawer')).toHaveClass('right-0 translate-x-full')
    expect(screen.getByTestId('drawer')).not.toHaveClass(
      'left-0 -translate-x-full'
    )
  })

  it('should add transform-none class if drawer is opened', () => {
    const { rerender } = render(<Drawer open={false}>Drawer</Drawer>)

    expect(screen.getByTestId('drawer')).not.toHaveClass('transform-none')

    rerender(<Drawer open={true}>Drawer</Drawer>)

    expect(screen.getByTestId('drawer')).toHaveClass('transform-none')
  })

  it('should pass custom class', () => {
    render(
      <Drawer open={false} className="hello">
        Drawer
      </Drawer>
    )

    expect(screen.getByTestId('drawer')).toHaveClass('hello')
  })

  it('should emit event from onClickOutside only when the user clicks outside of the drawer and when the drawer is opened', async () => {
    const mockFn = jest.fn()
    const user = userEvent.setup()

    const { rerender } = render(
      <div className="fixed top-0 left-0 w-[50rem] h-screen">
        <Drawer open={false} onClickOutside={mockFn}>
          Drawer
        </Drawer>

        <div
          data-testid="outside"
          className="fixed top-0 right-0 w-80 h-screen"
        ></div>
      </div>
    )

    expect(mockFn).not.toHaveBeenCalled()
    await user.click(screen.getByTestId('outside'))
    expect(mockFn).not.toHaveBeenCalled()

    rerender(
      <div className="fixed top-0 left-0 w-[50rem] h-screen">
        <Drawer open={true} onClickOutside={mockFn}>
          Drawer
        </Drawer>

        <div
          data-testid="outside"
          className="fixed top-0 right-0 w-80 h-screen"
        ></div>
      </div>
    )

    expect(mockFn).not.toHaveBeenCalled()
    await user.click(screen.getByTestId('outside'))
    expect(mockFn).toHaveBeenCalled()
  })
})
