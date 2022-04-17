import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import type { FC } from 'react'

import type { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

interface ErrorProps {
  statusCode: 400 | 401 | 404 | 500
}

const Error: FC<ErrorProps> = ({ statusCode }) => {
  const { t } = useTranslation('common')

  return (
    <Box
      className="__d-flex-center __d-overflow-hidden"
      sx={{ height: (theme: Theme) => `calc(100vh - ${theme.spacing(8)})` }}
    >
      <Paper elevation={4} sx={{ py: 4, px: 3 }}>
        <Typography variant="h6">{t(`ERROR_${statusCode}_MESSAGE`)}</Typography>
        <Box className="__d-flex __d-justify-end">
          <Link href="/">
            <Button sx={{ mt: 3 }} variant="contained">
              {t('GO_TO_HOMEPAGE')}
            </Button>
          </Link>
        </Box>
      </Paper>
    </Box>
  )
}

export default Error
