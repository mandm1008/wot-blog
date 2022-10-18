import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { connect } from '~/config/db'
import Category from '~/models/Category'
import { handleError, verifyTokenAndAdmin } from '~/tools/middleware'

interface RequestCreate extends NextApiRequest {
  body: Apis.ApiCategory.ReqCreate
}

interface RequestEdit extends NextApiRequest {
  body: Apis.ApiCategory.ReqEdit
}

interface RequestDelete extends NextApiRequest {
  query: Apis.ApiCategory.ReqDeleteQuery
  body: Apis.ApiCategory.ReqDeleteBody
}

export default nc({
  onError: handleError
})
  .use(verifyTokenAndAdmin)
  .post(async (req: RequestCreate, res: NextApiResponse<Apis.ApiCategory.ResCreate | Apis.Error>) => {
    await connect()

    const category = new Category(req.body)
    await category.save()
    await category.delete()

    res.status(200).json({ data: await getNewCategory(req.body.title) })
  })
  .put(async (req: RequestEdit, res: NextApiResponse<Apis.ApiCategory.ResCreate | Apis.Error>) => {
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
  .delete(async (req: RequestDelete, res: NextApiResponse<Apis.ApiCategory.ResDelete | Apis.Error>) => {
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
