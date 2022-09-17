import type { FC } from 'react'

import Typography from '@mui/material/Typography'

import { useCreatedAtText, useUpdatedAtText } from '@/hooks/useTimestampText'

export interface PostListItemTimeProps {
  createdAt: string
  updatedAt: string
}

export const PostListItemTime: FC<PostListItemTimeProps> = ({
  createdAt,
  updatedAt
}) => {
  const { createdAtText } = useCreatedAtText(createdAt)
  const { updatedAtText } = useUpdatedAtText(updatedAt)

  return (
    <>
      <Typography variant="caption">{createdAtText}</Typography>
      <Typography variant="caption">{updatedAtText}</Typography>
    </>
  )
}
