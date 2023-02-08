// handlers.js
import { rest } from 'msw'

import { Apps } from '@/constants/app'
import { getMockAsset } from '@/mock-data/post.mockData'

export const MOCK_RESPONSE_DELAY = 100
export const FAKE_RETURN = { message: 'FAKE_MESSAGE' }

const mockAssetHandler = rest.get(
  `/api/app/${Apps.FAMILY_ALBUM}/album/asset/:assetId`,
  (_, response, context) => {
    return response(
      context.delay(MOCK_RESPONSE_DELAY),
      context.status(200),
      context.json(getMockAsset())
    )
  }
)

export const mockAssetHandlerException = rest.get(
  `/api/app/${Apps.FAMILY_ALBUM}/album/asset/:assetId`,
  (_, response, context) => {
    return response(
      context.delay(MOCK_RESPONSE_DELAY),
      context.status(400),
      context.json(FAKE_RETURN)
    )
  }
)

const mockAssetUrlHandler = rest.get(
  '/api/asset/signed-url',
  (_, response, context) => {
    return response(
      context.delay(MOCK_RESPONSE_DELAY),
      context.status(200),
      context.json({ url: 'FAKE_URL' })
    )
  }
)

export const mockAssetUrlHandlerException = rest.get(
  '/api/asset/signed-url',
  async (_, response, context) =>
    response(
      context.delay(MOCK_RESPONSE_DELAY),
      context.status(400),
      context.json(FAKE_RETURN)
    )
)

export const handlers = [mockAssetHandler, mockAssetUrlHandler]
