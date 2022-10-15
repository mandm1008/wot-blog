import { NextApiResponse } from 'next'
import nc from 'next-connect'
import { connect } from '~/config/db'
import { filterPostWithPostedTime } from '~/tools'
import { handleError } from '~/tools/middleware'
import Category from '~/models/Category'
import Post from '~/models/Post'

export default nc({
  onError: handleError
}).get(async (req, res: NextApiResponse<Apis.ApiHeader>) => {
  await connect()

  const categories: Models.Category[] = (await Category.find({})).map((item) => item.toObject())
  const posts: Models.Post[] = filterPostWithPostedTime((await Post.find({})).map((item) => item.toObject()))

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
