import { NextApiResponse } from 'next'
import nc from 'next-connect'
import { connect } from '~/config/db'
import { filterPostWithPostedTime } from '~/tools'
import { removeContentOfPost } from '~/tools/post'
import { handleError } from '~/tools/middleware'
import Category from '~/models/Category'
import Post from '~/models/Post'

export default nc({
  onError: handleError
}).get(async (req, res: NextApiResponse<Apis.ApiHeader>) => {
  await connect()

  const categories = (await Category.find<Models.Category>({})).map((item) => item.toObject<Models.Category>())
  const posts = removeContentOfPost(
    filterPostWithPostedTime((await Post.find<Models.Post>({})).map((item) => item.toObject())) as any
  )

  const data = categories.map((category) => ({
    ...category,
    posts: posts
      .filter((post) => {
        const index = post.categoryId.findIndex((c) => c === category._id.toString())

        return index >= 0
      })
      .filter((post, i) => i <= 2)
  }))

  res.status(200).json(data)
})
