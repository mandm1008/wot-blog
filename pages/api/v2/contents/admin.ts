import { createRoute, routerHandler } from '~/config/nc'
import { connect } from '~/config/db'
import { verifyTokenAndAdmin } from '~/tools/middleware'
import Content from '~/models/Content'

const router = createRoute<Apis.Error, { body: Apis.ApiContent.ReqEdit }>()

router.use(verifyTokenAndAdmin).post(async (req, res) => {
  await connect()
  const content = await Content.findOne({ postId: req.body.id })
  content.content = req.body.content

  try {
    await content.save()
  } catch (e) {
    return res.status(403).json({ error: 'Save failed!' })
  }

  res.status(200).json({})
})

export default routerHandler(router)
