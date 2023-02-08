import { useEffect } from 'react'
import type { FC } from 'react'

import LinearProgress from '@mui/material/LinearProgress'

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { resetPostUploadStatus } from '@/redux-actions'
import { selectPostUploadProgress } from '@/redux-selectors'

export const PostFormDialogProgressBar: FC = () => {
  const progress = useAppSelector(selectPostUploadProgress)
  const dispatch = useAppDispatch()

  useEffect(() => {
    return () => {
      dispatch(resetPostUploadStatus())
    }
  }, [dispatch])

  if (Number.isNaN(progress)) {
    return <></>
  }

  return <LinearProgress variant="determinate" value={progress} />
}
