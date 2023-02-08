import type { FC, ReactNode } from 'react'

import { Header } from './Header/Header'
import { PageLoading } from './PageLoading/PageLoading'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Header />

      <main className="flex-grow h-screen">
        <div className="__header-height"></div>

        <div className="overflow-hidden h-[calc(100%-theme(space.16))] bg-surface-0 dark:bg-dark-surface-0">
          {children}
        </div>
      </main>

      <PageLoading />
    </div>
  )
}
