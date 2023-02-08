import type { FC } from 'react'
import { memo } from 'react'
import { TransitionGroup } from 'react-transition-group'

import type { Theme } from '@mui/material'
import Collapse from '@mui/material/Collapse'
import Stack from '@mui/material/Stack'
import Box from '@mui/system/Box'

import { useAppSelector } from '@/hooks/useRedux'
import ToastListItem from '@/layout/ToastListItem/ToastListItem'
import { selectToastMessages } from '@/redux-selectors'

const ToastList: FC = () => {
  const toastMessages = useAppSelector(selectToastMessages)

  return (
    <Stack
      className="__d-absolute"
      sx={(theme: Theme) => ({
        left: theme.spacing(3),
        bottom: theme.spacing(3),
        zIndex: theme.zIndex.tooltip
      })}
    >
      <TransitionGroup>
        {toastMessages.map((toastMessage) => (
          <Collapse key={toastMessage.id}>
            <Box sx={{ mt: 2 }}></Box>

            <ToastListItem
              id={toastMessage.id}
              severity={toastMessage.severity}
              message={toastMessage.message}
            />
          </Collapse>
        ))}
      </TransitionGroup>
    </Stack>
  )
}

// this is totally independent of the rest of the app
export default memo(ToastList)
