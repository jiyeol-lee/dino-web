import type { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { ReactElement } from 'react'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import { UserList } from '@/components/admin/UserList/UserList'
import { Locales, Modules } from '@/constants/app'
import { BaseLayout } from '@/layout/BaseLayout'
import { RootLayout } from '@/layout/RootLayout'
import type { NextPageWithLayout } from '@/pages/_app'
import type { User } from '@/types'

interface PageProps {
  users: User[]
}

const Page: NextPageWithLayout<PageProps> = () => {
  return (
    <Container className="__d-h-full">
      <Box
        className="__d-flex __d-justify-center __d-items-center __d-h-full"
        sx={{ py: 2 }}
      >
        <Box sx={{ width: '100%', height: 700, maxHeight: '100%' }}>
          <Box className="__d-w-full __d-h-full">
            <UserList />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

Page.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <BaseLayout>{page}</BaseLayout>
    </RootLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.values(Locales).flatMap((locale) =>
    Object.values(Modules).map((module) => ({
      params: { module },
      locale
    }))
  )
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translation = await serverSideTranslations(locale ?? 'default', [
    'common'
  ])

  return { props: { ...translation } }
}

export default Page
