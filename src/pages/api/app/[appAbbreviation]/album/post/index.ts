import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

import { POST_PAGE_SIZE, PostAudiences } from '@/constants/album'
import { AccessLevels, Apps } from '@/constants/app'
import { CollectionsName } from '@/constants/collection'
import assetSchema from '@/models/album/assetSchema'
import postSchema from '@/models/album/postSchema'
import userSchema from '@/models/common/userSchema'
import { createDocument } from '@/models/utils/createDocument'
import type { User } from '@/types'
import type { AssetDefault, Post } from '@/types/album'
import { dbConnect } from '@/utils/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | Post[] | { message?: string }>
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
        const { qpPage, qpCategoryId } = req.query
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

        const posts: Post[] = await postDoc.aggregate([
          match,
          {
            $sort: { createdAt: -1 }
          },
          {
            $skip: (parseInt(qpPage as string) - 1) * POST_PAGE_SIZE
          },
          {
            $limit: POST_PAGE_SIZE
          },
          {
            $lookup: {
              from: CollectionsName.ALBUM_CATEGORY,
              localField: 'categories',
              foreignField: '_id',
              as: 'categories'
            }
          },
          {
            $lookup: {
              from: CollectionsName.ALBUM_ASSET,
              localField: 'assets',
              foreignField: '_id',
              as: 'assets'
            }
          }
        ])

        if (!posts) {
          return res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
        }

        return res.status(200).json(posts)
      }

      case 'POST': {
        const {
          assets: assetsInput,
          audience,
          categories,
          title,
          description
        } = req.body ?? {}

        const assetDoc = createDocument(
          CollectionsName.ALBUM_ASSET,
          assetSchema
        )

        const assets: AssetDefault[] = await assetDoc.create(assetsInput)
        if (!assets) {
          return res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
        }

        const post: Post = await postDoc
          .create({
            assets: assets.map((asset) => asset._id),
            audience,
            categories: categories ?? [],
            title,
            description
          })
          .then((savedPost) => postDoc.populate(savedPost, 'categories'))
          .then((savedPost) => postDoc.populate(savedPost, 'assets'))

        if (!post) {
          return res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
        }

        return res.status(201).json(post)
      }

      default:
        return res.status(405).json({ message: 'SEM_METHOD_NOT_ALLOWED' })
    }
  } catch (error) {
    res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
  }
}
