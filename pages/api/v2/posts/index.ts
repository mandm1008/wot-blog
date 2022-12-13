import { connect } from '~/config/db'
import { createRoute, routerHandler } from '~/config/nc'
import Post from '~/models/Post'
import Category from '~/models/Category'
import { sort as sortTool } from '~/tools'

const router = createRoute<Apis.ApiPost.ResGet, { query: Apis.ApiPost.ReqGet }>()

router.get(async (req, res) => {
  await connect()
  const { length, filter, sort, hasCategory } = req.query

  try {
    const dbData = await Post.find<Models.Post>({})

    let posts = dbData.map((item) => item.toObject<Models.Post>())

    if (filter && filter === 'true')
      posts = posts.filter((item) => !!item.postedAt && new Date().getTime() >= new Date(item.postedAt).getTime())

    if (sort) {
      sort.forEach((type) => {
        posts = sortTool(posts, type)
      })
    }

    if (length) posts = posts.slice(0, JSON.parse(length))

    if (hasCategory && hasCategory === 'true') {
      try {
        const categories = await Category.find<Models.Category>({})

        posts = posts.map((post) => ({
          ...post,
          categories: post.categoryId.map((id) => categories.find((item) => item._id.toString() === id))
        }))
      } catch (e) {
        throw new Error('Error load data from db')
        return
      }
    }

    res.status(200).json({ data: posts })
  } catch (e) {
    throw new Error('Error load data from db')
  }
})

export default routerHandler(router)
