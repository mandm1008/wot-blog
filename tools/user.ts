import { connect } from '~/config/db'
import { toObject } from '.'
import User from '~/models/User'

export async function pushUserToComments(comments: Apis.CommentWithUser[]): Promise<Apis.CommentWithUser[]> {
  await connect()

  for (const comment of comments) {
    comment.user = (await User.findById(comment.idUser)).toObject() as Models.User
  }

  return comments
}

export async function getAllEmailOfUser() {
  await connect()

  const users = toObject<Models.User>(await User.find({}))

  return users.map<string>((user) => user.email)
}
