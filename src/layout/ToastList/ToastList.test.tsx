import { useEffect } from 'react'
import { config } from 'react-transition-group'

import { AlertColor } from '@/constants/app'
import { useAppDispatch } from '@/hooks/useRedux'
import { enqueueAlert } from '@/redux-actions'
import { act, render, screen } from '@/utils/testing-library'

import ToastList from './ToastList'

config.disabled = true

jest.useFakeTimers()

const setup = () => {
  const severity = AlertColor.ERROR
  const fakeMessage1 = 'FAKE_MESSAGE_1'
  const fakeMessage2 = 'FAKE_MESSAGE_2'
  const TestComponent = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
      dispatch(enqueueAlert(severity, fakeMessage1))

      setTimeout(() => {
        dispatch(enqueueAlert(severity, fakeMessage2))
      }, 1000)
    }, [dispatch])

    return <ToastList />
  }

  return {
    fakeMessage1,
    fakeMessage2,
    TestComponent
  }
}

describe('#ToastList', () => {
  it('should render display alert and call deleteAlert in 3000 seconds', async () => {
    const { fakeMessage1, fakeMessage2, TestComponent } = setup()

    render(<TestComponent />)

    let message1 = screen.queryByText(fakeMessage1)
    expect(message1).toBeInTheDocument()

    let message2 = screen.queryByText(fakeMessage2)
    expect(message2).not.toBeInTheDocument()

    // in 1 second, second alert should be rendered
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    message1 = screen.queryByText(fakeMessage1)
    expect(message1).toBeInTheDocument()
    message2 = screen.queryByText(fakeMessage2)
    expect(message2).toBeInTheDocument()

    // in 3 seconds, first alert should be removed
    await act(async () => {
      jest.advanceTimersByTime(2000)
      jest.runAllTicks()
    })

    message1 = screen.queryByText(fakeMessage1)
    expect(message1).not.toBeInTheDocument()
    message2 = screen.queryByText(fakeMessage2)
    expect(message2).toBeInTheDocument()

    // in 4 seconds, first alert should be removed
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    message1 = screen.queryByText(fakeMessage1)
    expect(message1).not.toBeInTheDocument()
    message2 = screen.queryByText(fakeMessage2)
    expect(message2).not.toBeInTheDocument()
  })
})
