import { useRef } from 'react'

import { render, screen } from '@/utils/testing-library'
import userEvent from '@testing-library/user-event'

import { useOnClickOutside } from './useOnClickOutside'

const setup = () => {
  const testFn = jest.fn()
  const TestComponent = () => {
    const ref = useRef<HTMLDivElement>(null)

    useOnClickOutside(ref, testFn)

    return (
      <div className="fixed left-0 top-0 w-40 h-40">
        <div
          data-testid="left-top"
          ref={ref}
          className="fixed left-0 top-0 w-20 h-20"
        >
          <button
            data-testid="left-top-button"
            className="left-5 top-5 w-10 h-10"
          ></button>
        </div>
        <div
          data-testid="right-bottom"
          className="fixed right-20 bottom-20 w-20 h-20"
        ></div>
      </div>
    )
  }

  return {
    TestComponent,
    testFn
  }
}

describe('#useOnClickOutside', () => {
  it('should trigger callback function if the user clicks outside of the ref element', async () => {
    const { TestComponent, testFn } = setup()
    const user = userEvent.setup()

    render(<TestComponent />)

    expect(testFn).not.toHaveBeenCalled()
    await user.click(screen.getByTestId('left-top'))
    expect(testFn).not.toHaveBeenCalled()
    await user.click(screen.getByTestId('left-top-button'))
    expect(testFn).not.toHaveBeenCalled()
    await user.click(screen.getByTestId('right-bottom'))
    expect(testFn).toHaveBeenCalledTimes(1)
  })
})
