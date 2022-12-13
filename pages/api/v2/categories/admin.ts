import { NextApiRequest } from 'next'
import { createRoute, routerHandler } from '~/config/nc'
import { verifyTokenAndAdmin } from '~/tools/middleware'
import { connect } from '~/config/db'
import Category from '~/models/Category'

const router = createRoute<
  Apis.ApiCategory.ResCreate | Apis.ApiDelete.Res,
  {
    body: Apis.ApiCategory.ReqCreate & Apis.ApiCategory.ReqEdit & Apis.ApiDelete.ReqBody
    query: Apis.ApiDelete.ReqQuery
  }
>()

router
  .use(verifyTokenAndAdmin)
  .post(async (req: NextApiRequest & { body: Apis.ApiCategory.ReqCreate }, res) => {
    await connect()

    const category = new Category(req.body)
    await category.save()
    await category.delete()

    res.status(200).json({ data: await getNewCategory(req.body.title) })
  })
  .put(async (req: NextApiRequest & { body: Apis.ApiCategory.ReqEdit }, res) => {
    await connect()

    const category = await Category.findOneWithDeleted({ _id: req.body.id })
    if (!category) {
      return res.status(404).json({ error: 'Category not found!' })
    }
    category.title = req.body.title
    if (req.body.color) category.color = req.body.color
    await category.save()

    res.status(200).json({ data: category.toObject() })
  })
  .delete(async (req: NextApiRequest & { body: Apis.ApiDelete.ReqBody; query: Apis.ApiDelete.ReqQuery }, res) => {
    await connect()

    if (req.query.type === 'delete') {
      await Category.deleteMany({ _id: { $in: req.body.ids } })
      return res.status(200).json({ ids: req.body.ids })
    }

    if (req.query.type === 'hidden') {
      await Category.delete({ _id: { $in: req.body.ids } })
      return res.status(200).json({ ids: req.body.ids })
    }

    if (req.query.type === 'restore') {
      await Category.restore({ _id: { $in: req.body.ids } })
      return res.status(200).json({ ids: req.body.ids })
    }

    res.status(404).json({ error: 'Invalid type' })
  })

async function getNewCategory(query: string): Promise<Models.Category> {
  const category = await Category.findOneWithDeleted({ title: query })

  return category.toObject()
}

export default routerHandler(router)
