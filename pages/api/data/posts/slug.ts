import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { connect } from '~/config/db'
import { filterPostWithPostedTime } from '~/tools'
import { handleError } from '~/tools/middleware'
import Post from '~/models/Post'

interface Request extends NextApiRequest {
  query: Apis.ApiPost.ReqSlug
}

export default nc({
  onError: handleError
}).get(async (req: Request, res: NextApiResponse<Apis.ApiPost.ResSlug>) => {
  await connect()

  const posts: Models.Post[] = filterPostWithPostedTime((await Post.find({})).map((post) => post.toObject()))
  const index = posts.findIndex((post) => post.slug === req.query.slug)
  let post: Models.Post[] = []

  if (index <= 0) post = [posts[posts.length - 1], posts[0], posts[1]]
  else if (index >= posts.length - 1) post = [posts[posts.length - 2], posts[posts.length - 1], posts[0]]
  else post = [posts[index - 1], posts[index], posts[index + 1]]

  res.status(200).json(post)
})
