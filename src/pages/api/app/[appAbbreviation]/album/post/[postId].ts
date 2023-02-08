import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

import { AccessLevels, Apps } from '@/constants/app'
import { CollectionsName } from '@/constants/collection'
import categorySchema from '@/models/album/categorySchema'
import userSchema from '@/models/common/userSchema'
import { createDocument } from '@/models/utils/createDocument'
import type { User } from '@/types'
import type { Post } from '@/types/album'
import { dbConnect } from '@/utils/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { message?: string }>
) {
  try {
    const token = await getToken({ req })
    const currentUserId = token!.sub!
    const { appAbbreviation, postId } = req.query as {
      appAbbreviation: Apps
      postId: unknown
    }
    if (appAbbreviation !== Apps.FAMILY_ALBUM) {
      return res.status(400).json({ message: 'SEM_QUERY_NOT_ALLOWED' })
    }

    await dbConnect()

    const userDoc = createDocument(CollectionsName.USER, userSchema)
    const currentUser: User | null = await userDoc.findOne({
      _id: currentUserId
    })
    if (!currentUser) {
      return res.status(401).json({ message: 'SEM_NOT_AUTHORIZED_USER' })
    }
    const currentUserAppAccessLevel = currentUser.accessLevel[appAbbreviation]

    const postDoc = createDocument(CollectionsName.ALBUM_POST, categorySchema)

    switch (req.method) {
      case 'PUT': {
        // if the user access-level is not super admin or admin, return error
        if (
          currentUserAppAccessLevel !== AccessLevels.SUPER_ADMIN &&
          currentUserAppAccessLevel !== AccessLevels.ADMIN
        ) {
          return res.status(401).json({ message: 'SEM_NOT_AUTHORIZED_USER' })
        }

        const { title, description, audience, categories } = req.body ?? {}

        const post: Post | null = (await postDoc
          .findOneAndUpdate(
            { _id: postId },
            { title, description, audience, categories },
            { new: true, runValidators: true }
          )
          .populate('categories')
          .populate('assets')) as Post | null

        if (!post) {
          return res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
        }

        return res.status(200).json(post)
      }

      case 'DELETE': {
        // if the user access-level is not super admin, return error
        if (currentUserAppAccessLevel !== AccessLevels.SUPER_ADMIN) {
          return res.status(401).json({ message: 'SEM_NOT_AUTHORIZED_USER' })
        }

        const deletedPost: Post | null = (await postDoc
          .findOneAndDelete({
            _id: postId
          })
          .populate('categories')
          .populate('assets')) as Post | null

        if (!deletedPost) {
          return res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
        }

        return res.status(200).json(deletedPost)
      }

      default:
        return res.status(405).json({ message: 'SEM_METHOD_NOT_ALLOWED' })
    }
  } catch (error) {
    res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
  }
}
