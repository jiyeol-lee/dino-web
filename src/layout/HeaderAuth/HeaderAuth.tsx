import { useTranslation } from 'next-i18next'
import type { FC } from 'react'

import { Button } from '@/components/shared/Button/Button'

export interface HeaderAuthProps {
  isSignedIn: boolean
  signIn: () => void
  signOut: () => void
}

export const HeaderAuth: FC<HeaderAuthProps> = ({
  isSignedIn,
  signIn,
  signOut
}) => {
  const { t } = useTranslation()

  if (isSignedIn) {
    return (
      <Button
        className="!border-none"
        variant="outlined"
        color="default"
        label={t('HEADER_SIGN_OUT')}
        onClick={signOut}
      />
    )
  }

  return (
    <Button
      className="!border-none"
      variant="outlined"
      color="default"
      label={t('HEADER_SIGN_IN')}
      onClick={signIn}
    />
  )
}

HeaderAuth.displayName = 'HeaderAuth'
