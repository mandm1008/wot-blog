import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { connect } from '~/config/db'
import Post from '~/models/Post'
import { getCategoriesWithPosts } from '~/tools/category'
import { handleError } from '~/tools/middleware'
import { removeContentOfPost } from '~/tools/post'
import { sort, filterPostWithPostedTime } from '~/tools'

interface Request extends NextApiRequest {
  query: Apis.ApiPost.ReqMost
}

export default nc({
  onError: handleError
}).get(async (req: Request, res: NextApiResponse<Apis.ApiPost.ResMost>) => {
  await connect()

  let posts = await getCategoriesWithPosts(
    filterPostWithPostedTime((await Post.find<Models.Post>({})).map((item) => item.toObject()))
  )
  const category: Models.Category | null = JSON.parse(req.query.category || 'null')

  if (req.query.mode) {
    let time = new Date().getTime() / 1000
    switch (req.query.mode) {
      case 'week':
        time -= 60 * 60 * 24 * 7
        break
      case 'month':
        time -= 60 * 60 * 24 * 30
        break
    }

    posts = posts.filter((post) => {
      const crrTime = new Date(post.postedAt || post.createdAt).getTime() / 1000

      return crrTime > time
    })
  }

  if (category) {
    posts = posts.filter((post) => post.categoryId.findIndex((id) => id === category._id) !== -1)
  }

  posts = sort(posts, req.query.type)

  if (req.query.amount) {
    posts = posts.slice(0, parseInt(req.query.amount))
  }

  if (req.query.type === 'share') {
    posts = posts.slice(0, 10)
  }

  if (category) {
    posts = posts.slice(0, 3)
  }

  res.status(200).json(removeContentOfPost(posts))
})
