import { memo, useEffect } from 'react'
import { useStore } from '../store'
import { PostServer } from '~/servers'

function CountView({ ID }: { ID: string }) {
  const [{ user }] = useStore()

  useEffect(() => {
    async function handler(config: Apis.ApiPost.ReqInteractive) {
      const res = await PostServer.counter(config)
      if (res.error) {
        console.log(res.error)
      }
    }

    if (user === null) {
      handler({ type: 'view', id: ID })
    }
    if (user && user._id) {
      handler({ type: 'view', id: ID, idUser: user._id })
    }
  }, [user, ID])

  return null
}

export default memo(CountView)
