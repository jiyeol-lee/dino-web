import { useCallback } from 'react'
import { useEffect, useState } from 'react'

import { useAlbumAssetMaxWidth } from '@/hooks/useAlbumAssetMaxWidth'
import { useDialogStatus } from '@/hooks/useDialogStatus'
import { useAsset } from '@/hooks/useHttpAlbum'
import { usePostPageQueryParams } from '@/hooks/usePostPageQueryParams'
import { useAppDispatch } from '@/hooks/useRedux'
import { hideGlobalLoading, showGlobalLoading } from '@/redux-actions'
import type { Asset } from '@/types/album'
import { getAssetSrc } from '@/utils/album'

export const useAssetDialog = () => {
  const [refinedAsset, setRefinedAsset] = useState<Asset | null>(null)
  const { state, openDialog, closeDialog } = useDialogStatus()
  const { postPageQueryParams, patch } = usePostPageQueryParams()
  const { asset } = useAsset({
    isReady: !!postPageQueryParams.qpAssetId,
    assetId: postPageQueryParams.qpAssetId!
  })
  const dispatch = useAppDispatch()
  const { width: albumAssetMaxWidth } = useAlbumAssetMaxWidth()

  const handleClose = useCallback(() => {
    patch({ qpAssetId: null })

    setRefinedAsset(null)
    closeDialog()
  }, [patch, setRefinedAsset, closeDialog])

  useEffect(() => {
    if (postPageQueryParams.qpAssetId) {
      openDialog()
    }
  }, [postPageQueryParams.qpAssetId, openDialog])

  useEffect(() => {
    if (state.isOpen) {
      dispatch(showGlobalLoading())
    } else {
      dispatch(hideGlobalLoading())
    }
  }, [state.isOpen, dispatch])

  useEffect(() => {
    if (asset) {
      // src is not ready but we can update state
      // so PostAsset component displays skeleton.
      setRefinedAsset(asset)

      getAssetSrc({
        key: asset.key,
        extension: asset.extension,
        width: albumAssetMaxWidth
      })
        .then((src) => ({ ...asset, src }))
        .then((asset) => {
          setRefinedAsset(asset)
          dispatch(hideGlobalLoading())
        })
        .catch(() => {
          handleClose()
        })
    }
  }, [asset, setRefinedAsset, handleClose, dispatch, albumAssetMaxWidth])

  return { refinedAsset, handleClose, isDialogOpen: state.isOpen }
}
