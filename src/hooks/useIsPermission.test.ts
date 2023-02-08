import { useRouter } from 'next/router'

import { AccessLevels, Apps } from '@/constants/app'
import { useCurrentUser } from '@/hooks/useHttpApp'
import { getMockUser } from '@/mock-data/user.mockData'
import { renderHook } from '@/utils/testing-library'

import {
  useIsAdminOrAbove,
  useIsEditorOrAbove,
  useIsSuperAdmin
} from './usePermission'

enum SetupType {
  useIsEditorOrAbove = 'useIsEditorOrAbove',
  useIsAdminOrAbove = 'useIsAdminOrAbove',
  useIsSuperAdmin = 'useIsSuperAdmin'
}

const setup = ({
  isLogin,
  appAbbreviation,
  accessLevel,
  type
}: {
  isLogin: boolean
  appAbbreviation: unknown
  accessLevel: AccessLevels
  type: SetupType
}) => {
  ;(useRouter as jest.Mock).mockReturnValueOnce({
    query: { appAbbreviation: appAbbreviation }
  })

  const { result } = renderHook(() => {
    if (isLogin) {
      const mockUser = getMockUser()
      mockUser.accessLevel[appAbbreviation as Apps] = accessLevel
      ;(useCurrentUser as jest.Mock).mockReturnValueOnce({ user: mockUser })
    } else {
      ;(useCurrentUser as jest.Mock).mockReturnValueOnce({ user: null })
    }

    if (type === SetupType.useIsEditorOrAbove) {
      return useIsEditorOrAbove()
    }

    if (type === SetupType.useIsAdminOrAbove) {
      return useIsAdminOrAbove()
    }

    if (type === SetupType.useIsSuperAdmin) {
      return useIsSuperAdmin()
    }

    return
  })

  return result
}

describe('#usePermisison', () => {
  describe('#useIsSuperAdmin', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return false if the user is not logged in', () => {
      const result = setup({
        isLogin: false,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.NONE,
        type: SetupType.useIsSuperAdmin
      })

      expect(result.current).toEqual({ isSuperAdmin: false })
    })

    it('should return false if the appAbbreviation is not valid', () => {
      const result = setup({
        isLogin: true,
        appAbbreviation: 'fake',
        accessLevel: AccessLevels.NONE,
        type: SetupType.useIsSuperAdmin
      })

      expect(result.current).toEqual({ isSuperAdmin: false })
    })

    it('should return false if the user is not super admin', () => {
      const result1 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.NONE,
        type: SetupType.useIsSuperAdmin
      })

      expect(result1.current).toEqual({ isSuperAdmin: false })

      const result2 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.EDITOR,
        type: SetupType.useIsSuperAdmin
      })

      expect(result2.current).toEqual({ isSuperAdmin: false })

      const result3 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.ADMIN,
        type: SetupType.useIsSuperAdmin
      })

      expect(result3.current).toEqual({ isSuperAdmin: false })

      const result4 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.SUPER_ADMIN,
        type: SetupType.useIsSuperAdmin
      })

      expect(result4.current).toEqual({ isSuperAdmin: true })
    })
  })

  describe('#useIsAdminOrAbove', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return false if the user is not logged in', () => {
      const result = setup({
        isLogin: false,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.NONE,
        type: SetupType.useIsAdminOrAbove
      })

      expect(result.current).toEqual({ isAdminOrAbove: false })
    })

    it('should return false if the appAbbreviation is not valid', () => {
      const result = setup({
        isLogin: true,
        appAbbreviation: 'fake',
        accessLevel: AccessLevels.NONE,
        type: SetupType.useIsAdminOrAbove
      })

      expect(result.current).toEqual({ isAdminOrAbove: false })
    })

    it('should return false if the user is not admin or super admin', () => {
      const result1 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.NONE,
        type: SetupType.useIsAdminOrAbove
      })

      expect(result1.current).toEqual({ isAdminOrAbove: false })

      const result2 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.EDITOR,
        type: SetupType.useIsAdminOrAbove
      })

      expect(result2.current).toEqual({ isAdminOrAbove: false })

      const result3 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.ADMIN,
        type: SetupType.useIsAdminOrAbove
      })

      expect(result3.current).toEqual({ isAdminOrAbove: true })

      const result4 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.SUPER_ADMIN,
        type: SetupType.useIsAdminOrAbove
      })

      expect(result4.current).toEqual({ isAdminOrAbove: true })
    })
  })

  describe('#useIsEditorOrAbove', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return false if the user is not logged in', () => {
      const result = setup({
        isLogin: false,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.NONE,
        type: SetupType.useIsEditorOrAbove
      })

      expect(result.current).toEqual({ isEditorOrAbove: false })
    })

    it('should return false if the appAbbreviation is not valid', () => {
      const result = setup({
        isLogin: true,
        appAbbreviation: 'fake',
        accessLevel: AccessLevels.NONE,
        type: SetupType.useIsEditorOrAbove
      })

      expect(result.current).toEqual({ isEditorOrAbove: false })
    })

    it('should return false if the user is not editor or admin or super admin', () => {
      const result1 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.NONE,
        type: SetupType.useIsEditorOrAbove
      })

      expect(result1.current).toEqual({ isEditorOrAbove: false })

      const result2 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.EDITOR,
        type: SetupType.useIsEditorOrAbove
      })

      expect(result2.current).toEqual({ isEditorOrAbove: true })

      const result3 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.ADMIN,
        type: SetupType.useIsEditorOrAbove
      })

      expect(result3.current).toEqual({ isEditorOrAbove: true })

      const result4 = setup({
        isLogin: true,
        appAbbreviation: Apps.FAMILY_ALBUM,
        accessLevel: AccessLevels.SUPER_ADMIN,
        type: SetupType.useIsEditorOrAbove
      })

      expect(result4.current).toEqual({ isEditorOrAbove: true })
    })
  })
})
