import type { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { compose } from 'ramda'
import { useRef } from 'react'
import type { ReactElement } from 'react'

import type { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import { AddPostButton } from '@/components/album/AddPostButton/AddPostButton'
import { PostList } from '@/components/album/PostList/PostList'
import { PostListItemDetailDialog } from '@/components/album/PostListItemDetailDialog/PostListItemDetailDialog'
import { withController as withControllerForPostListItemDetailDialog } from '@/components/album/PostListItemDetailDialog/withController'
import { PostPageMoveButtons } from '@/components/album/PostPageMoveButtons/PostPageMoveButtons'
import { withController as withControllerForPostPageMoveButtons } from '@/components/album/PostPageMoveButtons/withController'
import { PostPagination } from '@/components/album/PostPagination/PostPagination'
import { POST_MAX_WIDTH } from '@/constants/album'
import { Apps, Locales } from '@/constants/app'
import { useRedirect404IfNotSignedIn } from '@/hooks/useRedirect404IfNotSignedIn'
import { useScrollTop0IfPostPageNumberChange } from '@/hooks/useScrollTop0IfPostPageNumberChange'
import { BaseLayout } from '@/layout/BaseLayout'
import { RootLayout } from '@/layout/RootLayout'
import type { NextPageWithLayout } from '@/pages/_app'

const PostPageMoveButtonsWithController = compose(
  withControllerForPostPageMoveButtons
)(PostPageMoveButtons)
const PostListItemDetailDialogWithController = compose(
  withControllerForPostListItemDetailDialog
)(PostListItemDetailDialog)

const Page: NextPageWithLayout = () => {
  const scrollBoxRef = useRef<HTMLElement>(null)

  useScrollTop0IfPostPageNumberChange(scrollBoxRef)
  useRedirect404IfNotSignedIn()

  return (
    <Box
      className="__d-flex __d-flex-col __d-w-full __d-h-full __d-overflow-auto"
      ref={scrollBoxRef}
    >
      <Paper
        elevation={0}
        className="__d-w-full __d-sticky"
        sx={{ top: 0, zIndex: (theme: Theme) => theme.zIndex.appBar }}
      >
        <Box className="__d-flex-center __d-flex-col">
          <Box
            className="__d-h-full"
            sx={{
              width: '90%',
              maxWidth: POST_MAX_WIDTH
            }}
          >
            <Box sx={{ mt: 5 }} />

            <Box sx={{ mt: 2 }}>
              <AddPostButton />
            </Box>

            <Box className="__d-flex-center" sx={{ mt: 2 }}>
              <PostPagination />
            </Box>

            <Box sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Paper>

      <Box className="__d-w-full __d-h-full">
        <Box className="__d-flex-center __d-flex-col">
          <Box
            className="__d-h-full"
            sx={{
              width: '90%',
              maxWidth: POST_MAX_WIDTH
            }}
          >
            <PostList />

            <PostPageMoveButtonsWithController />

            <Box sx={{ mt: 3 }} />
          </Box>
        </Box>
      </Box>

      <PostListItemDetailDialogWithController />
    </Box>
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
    [Apps.FAMILY_ALBUM].map((appAbbreviation) => ({
      params: { appAbbreviation },
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
