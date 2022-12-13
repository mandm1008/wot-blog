import { createRoute, routerHandler } from '~/config/nc'
import { connect } from '~/config/db'
import { verifyTokenAndAdmin, RequestVerify } from '~/tools/middleware'
import Post from '~/models/Post'
import Content from '~/models/Content'

const router = createRoute<
  Apis.ApiPost.ResCreate | Apis.ApiPost.ResEdit | Apis.ApiDelete.Res,
  RequestVerify<{
    query: Apis.ApiDelete.ReqQuery
    body: Apis.ApiPost.ReqCreate & Apis.ApiPost.ReqEdit & Apis.ApiDelete.ReqBody
  }>
>()

router
  .use(verifyTokenAndAdmin)
  .post(
    async (
      req: RequestVerify<{
        body: Apis.ApiPost.ReqCreate
      }>,
      res
    ) => {
      await connect()

      const post = new Post(req.body)
      await post.save()
      await post.delete()
      const content = new Content({ postId: post._id.toString() })
      await content.save()

      res.status(200).json({ result: await getNewPost(req.body) })
    }
  )
  .patch(
    async (
      req: RequestVerify<{
        body: Apis.ApiPost.ReqEdit
      }>,
      res
    ) => {
      await connect()

      const { _id, deleted, ...data } = req.body
      let post = await Post.findOneWithDeleted({ _id: _id })

      if (!post) {
        return res.status(404).json({ error: 'Not Found' })
      }

      if (deleted && !post.deleted) {
        await post.delete()
      } else if (!deleted && post.deleted) {
        await post.restore()
      }

      Object.keys(data).forEach((key) => {
        post[key] = data[key]
      })

      const newData = (await post.save()).toObject() as Models.Post

      res.status(200).json({ data: newData })
    }
  )
  .delete(
    async (
      req: RequestVerify<{
        query: Apis.ApiDelete.ReqQuery
        body: Apis.ApiDelete.ReqBody
      }>,
      res
    ) => {
      await connect()

      if (req.query.type === 'delete') {
        await Post.deleteMany({ _id: { $in: req.body.ids } })
        await Content.deleteMany({ postId: { $in: req.body.ids } })
        return res.status(200).json({ ids: req.body.ids })
      }

      if (req.query.type === 'hidden') {
        await Post.delete({ _id: { $in: req.body.ids } })
        return res.status(200).json({ ids: req.body.ids })
      }

      if (req.query.type === 'restore') {
        await Post.restore({ _id: { $in: req.body.ids } })
        return res.status(200).json({ ids: req.body.ids })
      }

      res.status(404).json({ error: 'Invalid type' })
    }
  )

async function getNewPost(query: any): Promise<Models.Post> {
  const post = await Post.findOneWithDeleted(query)
  return post.toObject()
}

export default routerHandler(router)
