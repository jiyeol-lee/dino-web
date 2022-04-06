import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import { Apps } from '@/constants'
import { CollectionName } from '@/constants/collection'
import projectSchema from '@/models/common/projectSchema'
import { createDocument } from '@/models/utils/createDocument'
import { dbConnect } from '@/utils/db-utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req })
    const userId = session?.user?.id
    if (!userId) {
      return res.status(401).json({ status: false })
    }

    const targetAppAbbreviation = req.query.appAbbreviation
    // NOTE: 496-1
    // only money tracker can execute below codes
    if (targetAppAbbreviation !== Apps.moneyTracker) {
      return res.status(400).json({ message: 'SEM_QUERY_NOT_ALLOWED' })
    }

    await dbConnect()

    const ProjectDoc = createDocument(
      `${targetAppAbbreviation}.${CollectionName.PROJECT}`,
      projectSchema
    )

    switch (req?.method) {
      case 'GET': {
        const projects = await ProjectDoc.find({
          $or: [
            { ownerId: userId },
            { accessUsers: { $elemMatch: { accessUserId: userId } } }
          ]
        })

        if (!projects) {
          return res.status(400).json({ status: false })
        }

        return res.status(200).json({ status: true, projects })
      }

      case 'POST': {
        const project = await ProjectDoc.create({
          ...(req?.body ?? {}),
          ownerId: userId
        })

        if (!project) {
          return res.status(400).json({ status: false })
        }

        return res.status(201).json({ status: true, project })
      }

      default:
        return res.status(405).json({ status: false })
    }
  } catch (error) {
    res.status(400).json({ status: false })
  }
}
