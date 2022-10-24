import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import en from 'dayjs/locale/en'

dayjs.extend(relativeTime)
dayjs.locale(en)

export default dayjs
