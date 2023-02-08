import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { Button } from '@/components/shared/Button/Button'
import { Modules } from '@/constants/app'
import { useCurrentUser } from '@/hooks/useHttpApp'
import { BaseLayout } from '@/layout/BaseLayout'
import { RootLayout } from '@/layout/RootLayout'
import type { NextPageWithLayout } from '@/pages/_app'
import { adminUrlService } from '@/url-services/admin'
import { familyAlbumUrlService } from '@/url-services/family-album'
import { hasAccessAdminPage } from '@/utils/app'

const pages = [
  {
    link: {
      pathname: adminUrlService.index(Modules.FAMILY_ALBUM)
    },
    name: 'HOME_PAGE_ADMIN_BUTTON',
    shouldAdmin: true,
    needAuth: true
  },
  {
    link: {
      pathname: familyAlbumUrlService.index()
    },
    name: 'HOME_PAGE_FAMILY_ALBUM_BUTTON',
    shouldAdmin: false,
    needAuth: true
  }
]

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation('common')
  const { user } = useCurrentUser()

  const canAccessAdminPage = hasAccessAdminPage(user)

  return (
    <div className="container">
      <p className="text-5xl my-2">
        {t('HOME_PAGE_TITLE', { appName: t('APP_NAME') })}
      </p>

      <div className="mt-5 inline-flex space-x-2">
        {pages.map((page) => {
          if (!canAccessAdminPage && page.shouldAdmin) {
            return null
          }

          if (page.needAuth && !user) {
            return (
              <Button
                key={page.name}
                type="button"
                disabled={true}
                variant="filled"
                color="primary"
                label={t(page.name)}
              />
            )
          }

          return (
            <Link key={page.name} href={page.link} passHref legacyBehavior>
              <a>
                <Button
                  key={page.name}
                  type="button"
                  variant="filled"
                  color="primary"
                  label={t(page.name)}
                />
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

Page.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <BaseLayout>{page}</BaseLayout>
    </RootLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'default', ['common']))
    }
  }
}

export default Page
