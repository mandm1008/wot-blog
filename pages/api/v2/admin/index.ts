import { createRoute, routerHandler } from '~/config/nc'
import { verifyTokenAndAdmin } from '~/tools/middleware'

const router = createRoute()

router.use(verifyTokenAndAdmin).get((_, res) => {
  res.status(200).json({})
})

export default routerHandler(router)
