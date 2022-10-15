import { connect } from '~/config/db'
import User from '~/models/User'

export async function pushUserToComments(comments: Apis.CommentWithUser[]): Promise<Apis.CommentWithUser[]> {
  await connect()

  for (const comment of comments) {
    comment.user = (await User.findById(comment.idUser)).toObject() as Models.User
  }

  return comments
}
