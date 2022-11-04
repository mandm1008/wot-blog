import { NextApiResponse } from 'next'
import nc from 'next-connect'
import { handleError } from '~/tools/middleware'
import dayjs from '~/config/day'

export default nc({
  onError: handleError
}).get((req, res: NextApiResponse<Apis.ApiTime.Get | Apis.Error>) => {
  const now = dayjs().toJSON()

  return res.status(200).json({ now })
})
