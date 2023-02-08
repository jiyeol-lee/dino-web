import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

import { PostAudiences } from '@/constants/album'
import { AccessLevels, Apps } from '@/constants/app'
import { CollectionsName } from '@/constants/collection'
import postSchema from '@/models/album/postSchema'
import userSchema from '@/models/common/userSchema'
import { createDocument } from '@/models/utils/createDocument'
import type { User } from '@/types'
import { dbConnect } from '@/utils/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<number | { message?: string }>
) {
  try {
    const token = await getToken({ req })
    const currentUserId = token!.sub!
    const appAbbreviation = req.query.appAbbreviation as Apps
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

    const postDoc = createDocument(CollectionsName.ALBUM_POST, postSchema)

    switch (req.method) {
      case 'GET': {
        const { qpCategoryId } = req.query
        const audienceMatch =
          currentUserAppAccessLevel === AccessLevels.NONE
            ? {
                $eq: ['$audience', PostAudiences.ALL]
              }
            : {}

        const match = qpCategoryId
          ? {
              $match: {
                $expr: {
                  $and: [
                    audienceMatch,
                    {
                      $in: [
                        new mongoose.Types.ObjectId(qpCategoryId as string),
                        '$categories'
                      ]
                    }
                  ]
                }
              }
            }
          : {
              $match: {
                $expr: {
                  $and: [audienceMatch]
                }
              }
            }

        const [result]: { total?: number }[] = await postDoc.aggregate([
          match,
          {
            $count: 'total'
          }
        ])

        return res.status(200).json(result?.total ?? 0)
      }

      default:
        return res.status(405).json({ message: 'SEM_METHOD_NOT_ALLOWED' })
    }
  } catch (error) {
    res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
  }
}
