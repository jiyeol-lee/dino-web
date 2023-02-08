import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

import { AccessLevels, Apps } from '@/constants/app'
import { CollectionsName } from '@/constants/collection'
import categorySchema from '@/models/album/categorySchema'
import userSchema from '@/models/common/userSchema'
import { createDocument } from '@/models/utils/createDocument'
import type { User } from '@/types'
import type { Category } from '@/types/album'
import { dbConnect } from '@/utils/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Category | Category[] | { message?: string }>
) {
  try {
    const token = await getToken({ req })
    const currentUserId = token!.sub!
    const appAbbreviation = req.query.appAbbreviation as unknown as Apps
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

    const categoryDoc = createDocument(
      CollectionsName.ALBUM_CATEGORY,
      categorySchema
    )

    switch (req.method) {
      case 'GET': {
        const categories: Category[] = await categoryDoc.find()

        if (!categories) {
          return res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
        }

        return res.status(200).json(categories)
      }

      case 'POST': {
        // if the user access-level is not super admin or admin, return error
        if (
          currentUserAppAccessLevel !== AccessLevels.SUPER_ADMIN &&
          currentUserAppAccessLevel !== AccessLevels.ADMIN
        ) {
          return res.status(401).json({ message: 'SEM_NOT_AUTHORIZED_USER' })
        }

        const name = req.body?.name

        const category: Category = await categoryDoc.create({ name })

        if (!category) {
          return res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
        }

        return res.status(201).json(category)
      }

      default:
        return res.status(405).json({ message: 'SEM_METHOD_NOT_ALLOWED' })
    }
  } catch (error) {
    res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
  }
}
