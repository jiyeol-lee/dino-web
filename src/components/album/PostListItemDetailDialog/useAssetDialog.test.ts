import { usePostPageQueryParams } from '@/hooks/usePostPageQueryParams'
import { useAppSelector } from '@/hooks/useRedux'
import { getMockAsset } from '@/mock-data/post.mockData'
import { selectGlobalLoadingState } from '@/redux-selectors'
import { mockAssetUrlHandlerException } from '@/utils/msw-handlers'
import { mswServer } from '@/utils/msw-server'
import { act, renderHook, waitFor } from '@/utils/testing-library'

import { useAssetDialog } from './useAssetDialog'

jest.mock('@/hooks/usePostPageQueryParams', () => {
  const originalModule = jest.requireActual('@/hooks/usePostPageQueryParams')

  return {
    __esModule: true,
    ...originalModule,
    usePostPageQueryParams: jest.fn()
  }
})

const setup = () => {
  const useTestHook = () => {
    const isLoadingGlobally = useAppSelector(selectGlobalLoadingState)
    const assetDialog = useAssetDialog()

    return {
      isLoadingGlobally,
      assetDialog
    }
  }

  const renderHookResult = renderHook(() => useTestHook())

  return renderHookResult
}

describe('#useAssetDialog', () => {
  test(`
    1. isLoadingGlobally and isDialogOpen should be false if qpAssetId is invalid.
    2. should set isLoadingGlobally and isDialogOpen to true when the qpAssetId is valid.
    3. refinedAsset should be set without src at the beginning. at this time, isLoadingGlobally still should be true.
    4. refinedAsset should be set with src. isLoadingGlobally should be false at this moment.
  `, async () => {
    ;(usePostPageQueryParams as jest.Mock).mockReturnValue({
      postPageQueryParams: { qpAssetId: '' },
      patch: jest.fn()
    })

    const { result, rerender } = setup()

    // 1.
    expect(result.current.assetDialog.isDialogOpen).toBe(false)
    expect(result.current.isLoadingGlobally).toBe(false)

    // 2.
    ;(usePostPageQueryParams as jest.Mock).mockReturnValue({
      postPageQueryParams: {
        qpAssetId: 'QUERY_PARAM_ASSET_ID'
      },
      patch: jest.fn()
    })
    act(() => {
      rerender()
    })
    expect(result.current.assetDialog.isDialogOpen).toBe(true)
    expect(result.current.isLoadingGlobally).toBe(true)

    // 3.
    await waitFor(() => {
      expect(result.current.assetDialog.refinedAsset).toEqual({
        ...getMockAsset()
      })
    })
    expect(result.current.isLoadingGlobally).toBe(true)

    // 4.
    await waitFor(() => {
      expect(result.current.assetDialog.refinedAsset).toEqual({
        ...getMockAsset(),
        src: 'FAKE_URL'
      })
    })
    expect(result.current.isLoadingGlobally).toBe(false)
  })

  test(`
    1. isLoadingGlobally and isDialogOpen should be false if qpAssetId is invalid.
    2. should set isLoadingGlobally and isDialogOpen to true when the qpAssetId is valid.
    3. refinedAsset should be set without src at the beginning. at this time, isLoadingGlobally still should be true.
    4. refinedAsset should be null if getAssetUrl returns error
  `, async () => {
    ;(usePostPageQueryParams as jest.Mock).mockReturnValue({
      postPageQueryParams: { qpAssetId: '' },
      patch: jest.fn()
    })
    mswServer.use(mockAssetUrlHandlerException)

    const { result, rerender } = setup()

    // 1.
    expect(result.current.assetDialog.isDialogOpen).toBe(false)
    expect(result.current.isLoadingGlobally).toBe(false)

    // 2.
    ;(usePostPageQueryParams as jest.Mock).mockReturnValue({
      postPageQueryParams: {
        qpAssetId: 'QUERY_PARAM_ASSET_ID'
      },
      patch: jest.fn()
    })
    act(() => {
      rerender()
    })
    expect(result.current.assetDialog.isDialogOpen).toBe(true)
    expect(result.current.isLoadingGlobally).toBe(true)

    // 3.
    await waitFor(() => {
      expect(result.current.assetDialog.refinedAsset).toEqual({
        ...getMockAsset()
      })
    })
    expect(result.current.isLoadingGlobally).toBe(true)

    // 4.
    await waitFor(() => {
      expect(result.current.assetDialog.refinedAsset).toBe(null)
    })
    expect(result.current.isLoadingGlobally).toBe(false)
  })
})
