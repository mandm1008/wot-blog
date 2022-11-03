import { memo, useEffect } from 'react'
import { PostServer } from '~/servers'

function CountView({ ID }: { ID: string }) {
  useEffect(() => {
    async function handler(config: Apis.ApiPost.ReqInteractive) {
      console.log('re-render')
      const res = await PostServer.counter(config)
      if (res.error) {
        console.log(res.error)
      }
    }

    handler({ type: 'view', id: ID })
  }, [ID])

  return null
}

export default memo(CountView)
