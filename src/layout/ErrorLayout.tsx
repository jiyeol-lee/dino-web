import type { FC, ReactNode } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import { RootLayout } from '@/layout/RootLayout'

interface ErrorLayoutProps {
  children: ReactNode
}

export const ErrorLayout: FC<ErrorLayoutProps> = ({ children }) => {
  return (
    <RootLayout>
      <Box className="__d-flex">
        <Box className="__d-grow __d-h-screen" component="main">
          <Paper elevation={0} square={true}>
            {children}
          </Paper>
        </Box>
      </Box>
    </RootLayout>
  )
}
