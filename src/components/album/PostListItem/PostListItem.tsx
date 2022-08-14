import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import type { FC } from 'react'

import type { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import DeletePostDialog from '@/components/album/DeletePostDialog/DeletePostDialog'
import PostListItemAssetList from '@/components/album/PostListItemAssetList/PostListItemAssetList'
import MaxHeightMenu from '@/components/mui/MaxHeightMenu/MaxHeightMenu'
import type { MenuOption } from '@/components/mui/MaxHeightMenu/MaxHeightMenu'
import { POST_MAX_WIDTH } from '@/constants/album'
import { useDialogStatus } from '@/hooks/useDialogStatus'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import type { Post } from '@/types/album'

interface PostListItemProps {
  post: Post
}

const PostListItemTime = dynamic(
  () => import('@/components/album/PostListItemTime/PostListItemTime'),
  { ssr: false }
)

const PostListItem: FC<PostListItemProps> = ({ post }) => {
  const { t } = useTranslation('common')
  const { state, openDialog, closeDialog } = useDialogStatus()
  const canEditPost = useIsAdmin()

  const menuOptions: MenuOption[] = [
    {
      label: t('DELETE'),
      click: () => {
        openDialog()
      }
    }
  ]

  return (
    <>
      <Paper
        key={post._id}
        sx={{
          padding: (theme: Theme) => theme.spacing(2),
          marginTop: (theme: Theme) => theme.spacing(4),
          width: '90%',
          maxWidth: POST_MAX_WIDTH
        }}
      >
        <Box className="__d-flex">
          <Box className="__d-flex __d-flex-col __d-justify-center __d-grow">
            <Typography>{post.title}</Typography>

            <Box sx={{ mt: 1 }} />

            <PostListItemTime
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
            />
          </Box>

          {canEditPost && (
            <Box className="__d-flex __d-items-center">
              <MaxHeightMenu options={menuOptions} />
            </Box>
          )}
        </Box>

        {post.description && (
          <Box sx={{ mt: 2 }}>
            <Divider />
            <Typography sx={{ mt: 2 }}>{post.description}</Typography>
          </Box>
        )}

        <Divider sx={{ mt: 2 }} />
        <Box sx={{ mt: 2 }}>
          <PostListItemAssetList assets={post.assets} />
        </Box>

        {/*<Box sx={{ mt: 2 }}>
          <ButtonGroup fullWidth variant="outlined">
            <Button>{t('BUTTON_LIKE')}</Button>
            <Button>{t('BUTTON_COMMENTS')}</Button>
          </ButtonGroup>
        </Box>*/}
      </Paper>

      {state.isOpen && (
        <DeletePostDialog
          id={post._id}
          assetKeys={post.assets.map((asset) => asset.key)}
          closeDialog={closeDialog}
        ></DeletePostDialog>
      )}
    </>
  )
}

export default PostListItem
