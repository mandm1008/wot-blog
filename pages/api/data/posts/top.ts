import { NextApiResponse } from 'next'
import nc from 'next-connect'
import { getCategoriesWithPosts } from '~/tools/category'
import { handleError } from '~/tools/middleware'
import { getTopPosts } from '~/tools/post'

export default nc({
  onError: handleError
}).get(async (req, res: NextApiResponse<Apis.ApiPost.ResTop>) => {
  const topPosts = await getCategoriesWithPosts(await getTopPosts(9))

  res.status(200).json(topPosts)
})
