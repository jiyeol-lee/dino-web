import { useRouter } from 'next/router'

import { AccessLevels, Apps } from '@/constants/app'
import { useCurrentUser } from '@/hooks/useHttpApp'
import { getMockUser } from '@/mock-data/user.mockData'
import { renderHook } from '@/utils/testing-library'

import { useUserAccessLevel } from './useUserAccessLevel'

describe('#useUserAccessLevel', () => {
  it('should return AccessLevels.NONE if "appAbbreviation" query is invalid', () => {
    ;(useRouter as jest.Mock).mockReturnValue({
      query: { appAbbreviation: 'INVALID' }
    })

    const { result } = renderHook(() => useUserAccessLevel())

    expect(result.current).toEqual({
      userAccessLevel: AccessLevels.NONE
    })
  })

  it('should return AccessLevels.NONE if user is not valid', () => {
    ;(useRouter as jest.Mock).mockReturnValue({
      query: { appAbbreviation: Apps.FAMILY_ALBUM }
    })

    const { result } = renderHook(() => useUserAccessLevel())

    expect(result.current.userAccessLevel).toBe(AccessLevels.NONE)
  })

  it("should return user's AccessLevels", () => {
    ;(useRouter as jest.Mock).mockReturnValue({
      query: { appAbbreviation: Apps.FAMILY_ALBUM }
    })
    const mockUser = getMockUser()
    mockUser.accessLevel[Apps.FAMILY_ALBUM] = AccessLevels.EDITOR
    ;(useCurrentUser as jest.Mock).mockReturnValue({ user: mockUser })

    const { result } = renderHook(() => useUserAccessLevel())

    expect(result.current.userAccessLevel).toBe(AccessLevels.EDITOR)
  })
})
