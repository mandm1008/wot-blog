import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter as create } from 'next-connect'
import type { NodeRouter } from 'next-connect/dist/types/node'
import { logger } from '~/tools/helper'

export function createRoute<res = Apis.Error, req = {}>() {
  return create<NextApiRequest & req, NextApiResponse<res | Apis.Error>>()
}

export function routerHandler<res = Apis.Error, req = {}>(
  router: NodeRouter<NextApiRequest & req, NextApiResponse<res | Apis.Error>>
) {
  return router.handler({
    onError: async (err: any, req, res) => {
      await logger(err)
      return res.status(500).json({ error: 'Error in server!' })
    }
  })
}
