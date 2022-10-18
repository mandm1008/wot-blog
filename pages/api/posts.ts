import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { connect } from '~/config/db'
import { verifyTokenAndAdmin, handleError, RequestVerify } from '~/tools/middleware'
import Post from '~/models/Post'
import Content from '~/models/Content'

interface RequestInteractive extends NextApiRequest {
  query: Apis.ApiPost.ReqInteractive
}

interface RequestCreate extends RequestVerify {
  body: Apis.ApiPost.ReqCreate
}

interface RequestEdit extends RequestVerify {
  body: Apis.ApiPost.ReqEdit
}

interface RequestDelete extends RequestVerify {
  query: Apis.ApiPost.ReqDeleteQuery
  body: Apis.ApiPost.ReqDeleteBody
}

export default nc({
  onError: handleError
})
  .get(async (req: RequestInteractive, res) => {
    try {
      await connect()

      if (req.query.type) {
        const posts = await Post.findById(req.query.id)
        const idUser = req.query.idUser || 'customer'
        posts[req.query.type].push(idUser)
        await posts.save()
        return res.status(200).json({})
      }

      res.status(404).json({ error: 'Invalid type' })
    } catch (e) {
      res.status(500).json({ error: 'Error in server!' })
    }
  })
  .use(verifyTokenAndAdmin)
  .post(async (req: RequestCreate, res: NextApiResponse<Apis.ApiPost.ResCreate | Apis.Error>) => {
    await connect()

    const post = new Post(req.body)
    await post.save()
    await post.delete()
    const content = new Content({ postId: post._id.toString() })
    await content.save()

    res.status(200).json({ result: await getNewPost(req.body) })
  })
  .patch(async (req: RequestEdit, res: NextApiResponse<Apis.ApiPost.ResEdit | Apis.Error>) => {
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
  })
  .delete(async (req: RequestDelete, res: NextApiResponse<Apis.ApiPost.ResDelete | Apis.Error>) => {
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
  })

async function getNewPost(query: any): Promise<Models.Post> {
  const post = await Post.findOneWithDeleted(query)
  return post.toObject()
}
