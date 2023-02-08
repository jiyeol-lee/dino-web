import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HeaderAuth } from './HeaderAuth'

describe('#HeaderAuth', () => {
  it('should render sign in button if user is not signed in', () => {
    const mockFn = jest.fn()

    render(<HeaderAuth isSignedIn={false} signIn={mockFn} signOut={mockFn} />)

    expect(
      screen.getByRole('button', { name: 'HEADER_SIGN_IN' })
    ).toBeInTheDocument()
  })

  it('should call sign in callback function if the user clicks sign in button', async () => {
    const user = userEvent.setup()
    const signInMockFn = jest.fn()
    const signOutMockFn = jest.fn()

    render(
      <HeaderAuth
        isSignedIn={false}
        signIn={signInMockFn}
        signOut={signOutMockFn}
      />
    )

    const button = screen.getByRole('button', { name: 'HEADER_SIGN_IN' })

    expect(signInMockFn).not.toHaveBeenCalled()
    expect(signOutMockFn).not.toHaveBeenCalled()
    await user.click(button)
    expect(signInMockFn).toHaveBeenCalledTimes(1)
    expect(signOutMockFn).not.toHaveBeenCalled()
  })

  it('should render sign out button if user is signed in', () => {
    const mockFn = jest.fn()

    render(<HeaderAuth isSignedIn={true} signIn={mockFn} signOut={mockFn} />)

    expect(
      screen.getByRole('button', { name: 'HEADER_SIGN_OUT' })
    ).toBeInTheDocument()
  })

  it('should call sign in callback function if the user clicks sign in button', async () => {
    const user = userEvent.setup()
    const signInMockFn = jest.fn()
    const signOutMockFn = jest.fn()

    render(
      <HeaderAuth
        isSignedIn={true}
        signIn={signInMockFn}
        signOut={signOutMockFn}
      />
    )

    const button = screen.getByRole('button', { name: 'HEADER_SIGN_OUT' })

    expect(signInMockFn).not.toHaveBeenCalled()
    expect(signOutMockFn).not.toHaveBeenCalled()
    await user.click(button)
    expect(signInMockFn).not.toHaveBeenCalled()
    expect(signOutMockFn).toHaveBeenCalledTimes(1)
  })
})
