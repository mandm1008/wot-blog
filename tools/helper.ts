import fs from 'fs/promises'
import path from 'path'
import dayjs from '~/config/day'

export async function logger(mgs: string) {
  const date = dayjs()

  try {
    await fs.appendFile(
      path.join(__dirname.substring(0, __dirname.indexOf(path.join('.next', 'server'))), 'error.log'),
      `${date.format('HH:mm:ss-DD/MM/YYYY\t-\t')}${mgs} ~ ${__filename.substring(
        __filename.indexOf(path.join('.next', 'server')) + path.join('.next', 'server').length,
        __filename.length - 3
      )}\n`
    )
  } catch (e) {
    console.log(e)
  }
}
