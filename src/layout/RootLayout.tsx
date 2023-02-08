import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import type { FC, ReactNode } from 'react'

import ToastList from '@/layout/ToastList/ToastList'

interface RootLayoutProps {
  children: ReactNode
}

export const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>{t('TAB_TITLE')}</title>
        <meta name="description" content={t('TAB_DESCRIPTION')} />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-black dark:text-white bg-surface-0 dark:bg-surface-0 font-lato">
        {children}

        <ToastList />
      </div>
    </>
  )
}
