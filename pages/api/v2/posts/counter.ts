import { createRoute, routerHandler } from '~/config/nc'
import { connect } from '~/config/db'
import Post from '~/models/Post'
import { logger } from '~/tools/helper'

const router = createRoute<Apis.Error, { query: Apis.ApiPost.ReqInteractive }>()

router.get(async (req, res) => {
  try {
    await connect()

    if (req.query.type) {
      const posts = await Post.findById(req.query.id)
      const idUser = req.query.idUser || 'customer'
      if (typeof posts[req.query.type] === 'number') {
        posts[req.query.type] += 1
      } else {
        posts[req.query.type].push(idUser)
      }
      await posts.save()
      return res.status(200).json({})
    }

    await logger('Invalid type')
    res.status(404).json({ error: 'Invalid type' })
  } catch (e: any) {
    await logger(e || 'Error in server!')
    res.status(500).json({ error: 'Error in server!' })
  }
})

export default routerHandler(router)
