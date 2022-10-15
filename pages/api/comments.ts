import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import Comment from '../../models/Comment'
import Post from '../../models/Post'
import { connect } from '../../config/db'
import { pushUserToComments } from '../../tools/user'
import { sort, toObject } from '../../tools'
import { handleError, verifyToken, RequestVerify } from '../../tools/middleware'

interface RequestGet extends NextApiRequest {
  query: Apis.ApiComment.ReqGet
}

interface RequestCreate extends RequestVerify {
  body: Apis.ApiComment.ReqCreate
}

interface RequestDelete extends RequestVerify {
  body: Apis.ApiComment.ReqDelete
}

export default nc({
  onError: handleError
})
  .get(async (req: RequestGet, res: NextApiResponse<Apis.ApiComment.ResGet | {}>) => {
    try {
      await connect()

      const post = (await Post.findOne({ slug: req.query.slug })).toObject()
      const filter = toObject<Models.Comment>(await Comment.find({ idPost: post._id.toString() }))
      const comments = await pushUserToComments(filter as Apis.CommentWithUser[])

      let data = comments.filter((comment) => !comment.replyId)
      const reply = comments.filter((comment) => !!comment.replyId)

      data = data.map((item) => ({
        ...item,
        listReply: reply.filter((comment) => comment.replyId === item._id.toString())
      }))

      data = sort<Apis.CommentWithUser>(data, 'time')

      const total = data.length
      const page = parseInt(req.query.page || '0', 10) + 1
      const totalPages = Math.ceil((total - page * 5) / 5)
      data = data.slice((page - 1) * 5, page * 5 > total ? total : page * 5)

      res.status(200).json({
        comments: data,
        total,
        totalPages: totalPages > 0 ? totalPages : 0
      })
    } catch (e) {
      res.status(500).json({})
    }
  })
  .use(verifyToken)
  .post(async (req: RequestCreate, res: NextApiResponse<Apis.ApiComment.ResCreate | Apis.Error>) => {
    try {
      await connect()
      if (!req.user || (typeof req.user !== 'string' && !req.user.id))
        return res.status(404).json({ error: 'Account not found!' })

      const comment = new Comment({
        idUser: req.user.id,
        idPost: (await Post.findOne({ slug: req.body.slugPost }))._id,
        content: req.body.content
      })
      if (req.body.replyId) {
        comment.replyId = req.body.replyId
      }
      await comment.save()
      res.status(200).json(comment.toObject())
    } catch (e) {
      res.status(500).json({ error: 'Error in server!' })
    }
  })
  .delete(async (req: RequestDelete, res) => {
    try {
      await connect()
      if (!req.user || (typeof req.user !== 'string' && !req.user.id))
        return res.status(404).json({ error: 'Account not found!' })

      const comment = await Comment.findById(req.body.id)
      console.log(comment)
      if (comment.idUser === req.user.id) {
        await comment.delete()
        return res.status(200).json({})
      }

      res.status(403).json({ error: 'You are not allowed to delete this comment!' })
    } catch (e) {
      res.status(500).json({ error: 'Comment not found!' })
    }
  })
