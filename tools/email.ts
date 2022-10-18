import Email from '~/models/Email'
import { toObject } from '.'

export async function getAllEmail() {
  const emails = toObject<Models.Email>(await Email.find({}))

  return emails.reduce<{
    visible: Models.Email[]
    hidden: Models.Email[]
  }>(
    (prev, curr) => {
      if (!!curr.sended) {
        prev.hidden.push(curr)
      } else {
        prev.visible.push(curr)
      }

      return prev
    },
    { visible: [], hidden: [] }
  )
}
