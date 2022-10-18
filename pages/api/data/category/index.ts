import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getCategoryBySlug } from '~/tools/category'
import { handleError } from '~/tools/middleware'

interface Request extends NextApiRequest {
  query: Apis.ApiCategory.ReqGetCategory
}

export default nc({
  onError: handleError
}).get(async (req: Request, res: NextApiResponse<Apis.ApiCategory.ResCategory | Apis.Error>) => {
  const category = await getCategoryBySlug(req.query.slug)
  if (!category) return res.status(404).json({ error: 'Category not found' })

  res.status(200).json(category)
})
