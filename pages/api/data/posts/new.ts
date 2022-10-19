import { NextApiResponse } from 'next'
import nc from 'next-connect'
import { getCategoriesWithPosts } from '~/tools/category'
import { handleError } from '~/tools/middleware'
import { getNewPosts, removeContentOfPost } from '~/tools/post'

export default nc({
  onError: handleError
}).get(async (req, res: NextApiResponse<Apis.ApiPost.ResNew>) => {
  const newPosts = removeContentOfPost(await getCategoriesWithPosts(await getNewPosts(5)))

  res.status(200).json(newPosts)
})
