import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { compose } from 'ramda'
import type { FC } from 'react'

import { Button } from '@/components/shared/Button/Button'
import { HeaderAuth } from '@/layout/HeaderAuth/HeaderAuth'
import { withSignInOutHandler } from '@/layout/HeaderAuth/withSignInOutController'
import { HeaderLanguage } from '@/layout/HeaderLanguage/HeaderLanguage'

const HeaderAuthContainer = compose(withSignInOutHandler)(HeaderAuth)

export const Header: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="fixed bg-surface-1 dark:bg-dark-surface-1 z-app-toolbar w-full sm:px-6 __header-height flex drop-shadow-lg">
      <Link href="/" passHref legacyBehavior>
        <a className="flex items-center">
          <Button
            className="hover:!bg-transparent !p-2.5"
            label={t('APP_NAME')}
          />
        </a>
      </Link>

      <div className="flex-grow flex justify-end items-center">
        <HeaderAuthContainer />

        <HeaderLanguage />
      </div>
    </div>
  )
}
