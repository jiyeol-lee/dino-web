import { useEffect } from 'react'
import type { FC } from 'react'

import Alert from '@mui/material/Alert'

import { useAppDispatch } from '@/hooks/useRedux'
import { deleteAlert } from '@/redux-actions'
import type { ToastMessage } from '@/types'

type ToastListItemProps = ToastMessage

const ToastListItem: FC<ToastListItemProps> = ({ id, severity, message }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    setTimeout(() => {
      dispatch(deleteAlert(id))
    }, 3000)
  }, [dispatch, id])

  return (
    <Alert variant="outlined" elevation={6} severity={severity}>
      {message}
    </Alert>
  )
}

export default ToastListItem
