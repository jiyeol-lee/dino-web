import { useIsAdminOrAbove } from '@/hooks/usePermission'
import { render, screen } from '@/utils/testing-library'

import { AddPostButton } from './AddPostButton'

jest.mock('@/hooks/usePermission', () => {
  const originalModule = jest.requireActual('@/hooks/usePermission')

  return {
    __esModule: true,
    ...originalModule,
    useIsAdminOrAbove: jest.fn()
  }
})

const setup = ({ isAdminOrAbove }: { isAdminOrAbove: boolean }) => {
  const TestComponent = () => {
    ;(useIsAdminOrAbove as jest.Mock).mockReturnValue({
      isAdminOrAbove
    })

    return <AddPostButton />
  }

  return { TestComponent }
}

describe('#AddPostButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render add button component if user's Apps.FAMILY_ALBUM permission is admin or super admin", () => {
    const { TestComponent } = setup({ isAdminOrAbove: true })

    render(<TestComponent />)

    const mockButtonText = screen.getByText('ALBUM_ADD_POST')
    expect(mockButtonText).toBeInTheDocument()
  })

  it("should render add button component if user's Apps.FAMILY_ALBUM permission is not super admin or admin", () => {
    const { TestComponent } = setup({ isAdminOrAbove: false })

    render(<TestComponent />)

    const mockButtonText = screen.queryByText('ALBUM_ADD_POST')
    expect(mockButtonText).not.toBeInTheDocument()
  })
})
