import { createRoute, routerHandler } from '~/config/nc'
import { connect } from '~/config/db'
import Category from '~/models/Category'
import { sort } from '~/tools'
import { getPostsByCategory, removeContentOfPost } from '~/tools/post'
import { getCategoriesWithPosts } from '~/tools/category'

const router = createRoute<
  Apis.ApiCategory.ResCategory | Apis.ApiCategory.ResPosts,
  { query: Apis.ApiCategory.ReqGetCategory & Apis.ApiCategory.ReqGetPosts }
>()

router
  .get('/', async (req, res) => {
    await connect()

    const { slug, admin } = req.query

    const category = !!admin
      ? await Category.findOneWithDeleted<Models.Category>({ slug })
      : await Category.findOne<Models.Category>({ slug })

    if (category === null) return res.status(404).json({ error: 'Category not found' })

    res.status(200).json(category.toObject())
  })
  .get('/posts', async (req, res) => {
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
      posts: removeContentOfPost(await getCategoriesWithPosts(data)),
      totalPages: totalPages > 0 ? totalPages : 0,
      total: total > 0 ? total : 0
    })
  })

export default routerHandler(router)
