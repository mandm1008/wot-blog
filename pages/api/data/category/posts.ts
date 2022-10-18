import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { sort } from '~/tools'
import { handleError } from '~/tools/middleware'
import { getPostsByCategory } from '~/tools/post'
import { getCategoriesWithPosts } from '~/tools/category'

interface Request extends NextApiRequest {
  query: Apis.ApiCategory.ReqGetPosts
}

export default nc({
  onError: handleError
}).get(async (req: Request, res: NextApiResponse<Apis.ApiCategory.ResPosts | Apis.Error>) => {
  let posts = sort(await getPostsByCategory(req.query.slug), 'time')

  if (!posts) {
    return res.status(404).json({ error: 'Invalid slug' })
  }

  const page = parseInt(req.query.page || '1', 10)
  if (req.query.q) {
    const q = req.query.q.toLowerCase()
    posts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        (post.subTitle && post.subTitle.toLowerCase().includes(q)) ||
        (post.content && post.content.toLowerCase().includes(q))
    )
  }

  const data = posts.slice((page - 1) * 10, page * 10)
  const total = posts.length - 10 * page
  const totalPages = Math.ceil(total / 10)

  res.status(200).json({
    posts: await getCategoriesWithPosts(data),
    totalPages: totalPages > 0 ? totalPages : 0,
    total: total > 0 ? total : 0
  })
})
