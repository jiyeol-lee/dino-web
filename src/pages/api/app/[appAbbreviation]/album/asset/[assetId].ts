import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

import { Apps } from '@/constants/app'
import { CollectionsName } from '@/constants/collection'
import assetSchema from '@/models/album/assetSchema'
import userSchema from '@/models/common/userSchema'
import { createDocument } from '@/models/utils/createDocument'
import type { User } from '@/types'
import type { Asset } from '@/types/album'
import { dbConnect } from '@/utils/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Asset | { message?: string }>
) {
  try {
    const token = await getToken({ req })
    const currentUserId = token!.sub!
    const { appAbbreviation, assetId } = req.query as {
      appAbbreviation: Apps
      assetId: unknown
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

    switch (req.method) {
      case 'GET': {
        const assetDoc = createDocument(
          CollectionsName.ALBUM_ASSET,
          assetSchema
        )

        const [asset]: (Omit<Asset, 'siblings'> & {
          siblings: { assets: string }[]
        })[] = await assetDoc.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(assetId as string) }
          },
          {
            $lookup: {
              from: CollectionsName.ALBUM_POST,
              pipeline: [
                {
                  $match: {
                    assets: {
                      $in: [new mongoose.Types.ObjectId(assetId as string)]
                    }
                  }
                },
                {
                  $project: { _id: 0, assets: 1 }
                },
                {
                  $unwind: '$assets'
                }
              ],
              as: 'siblings'
            }
          }
        ])

        if (!asset) {
          return res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
        }

        return res.status(200).json({
          ...asset,
          siblings: asset.siblings.map((sibling) => sibling.assets)
        })
      }

      default:
        return res.status(405).json({ message: 'SEM_METHOD_NOT_ALLOWED' })
    }
  } catch (error) {
    res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
  }
}
