import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { connect } from '~/config/db'
import Post from '~/models/Post'
import { sort, filterPostWithPostedTime } from '~/tools'
import { getNewPosts, removeContentOfPost } from '~/tools/post'
import { handleError } from '~/tools/middleware'
import { getCategoriesWithPosts } from '~/tools/category'

interface Request extends NextApiRequest {
  query: Apis.ApiPost.ReqMore
}

export default nc({
  onError: handleError
}).get(async (req: Request, res: NextApiResponse<Apis.ApiPost.ResMore>) => {
  await connect()

  const page = parseInt(req.query.page || '0', 10)
  const newPosts = await getCategoriesWithPosts(await getNewPosts(5))
  const posts = filterPostWithPostedTime((await Post.find<Models.Post>({})).map((item) => item.toObject()))

  const morePosts = sort(
    await getCategoriesWithPosts(
      posts.filter((post) => {
        for (const newPost of newPosts) {
          if (post._id.toString() === newPost._id.toString()) {
            return false
          }
        }
        return true
      })
    ),
    'time'
  )

  const results = morePosts.slice(page ? 7 + (page - 1) * 6 : 0, page ? 7 + page * 6 : 7)
  const total = morePosts.length - (page && page * 6) - 7
  const totalPages = Math.ceil(total / 6)

  res.status(200).json({
    morePosts: removeContentOfPost(results),
    total: total > 0 ? total : 0,
    totalPages: totalPages > 0 ? totalPages : 0
  })
})
