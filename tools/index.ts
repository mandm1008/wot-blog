import dayjs from '~/config/day'

export const getTime = (str?: string) => dayjs().to(dayjs(str))

export const getTimeInText = (times?: string) => dayjs(times).format('dddd, MMMM DD, YYYY')

export const hm = (times: string) => dayjs(times).format('HH:mm')

export const ddmmyyyy = (str: string) => dayjs(str).format('DD/MM/YYYY')

export const getText = (str?: string, length = 40) => {
  return str && str.length > length ? str.substring(0, length) + '...' : str
}

export function sort<Type = Models.Post>(data: Type[], key: Apis.SortType) {
  const handler = {
    popular(x: Models.Post, y: Models.Post) {
      return x.view + x.like.length * 5 + x.share * 10 <= y.view + y.like.length * 5 + y.share * 10
    },
    share(x: Models.Post, y: Models.Post) {
      return x.share <= y.share
    },
    like(x: Models.Post, y: Models.Post) {
      return x.like.length <= y.like.length
    },
    view(x: Models.Post, y: Models.Post) {
      return x.view <= y.view
    },
    time(x: Type & Model, y: Type & Model) {
      return new Date(x.postedAt || x.createdAt).getTime() <= new Date(y.postedAt || y.createdAt).getTime()
    }
  }

  const length = data.length
  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j < length; j++) {
      if (handler[key](data[i] as Models.Post & Type, data[j] as Models.Post & Type)) {
        const temp = data[j]
        data[j] = data[i]
        data[i] = temp
      }
    }
  }

  return data
}

export function sortByQ<Type>(data: (Type & Models.Post)[], q: string) {
  const totalList = data.map((post) => totalIncludes(post, q))
  const length = totalList.length

  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j < length; j++) {
      if (totalList[j] > totalList[i]) {
        let stemTotal = totalList[i]
        let stem = data[i]

        totalList[i] = totalList[j]
        data[i] = data[j]

        totalList[j] = stemTotal
        data[j] = stem
      }
    }
  }

  return data

  function totalIncludes(post: Type & Models.Post, q: string) {
    const string = (post.title + post.subTitle + post.content).toLowerCase()
    const lengthQ = q.length
    const length = string.length - lengthQ + 1
    let total = 0

    for (let i = 0; i < length; i++) {
      if (string.substring(i, i + lengthQ) === q) {
        total++
      }
    }

    return total
  }
}

export function formatContentHTML(content: string) {
  if (typeof content === 'boolean') content = ''
  let result = content

  // remove DDict ext
  while (result.includes('<div class="ddict_btn"')) {
    result = removeDDict(result, '<div class="ddict_btn"')
  }
  while (result.includes('<div class="ddict_div"')) {
    result = removeDDict(result, '<div class="ddict_div"')
  }

  function removeDDict(content: string, remove: string) {
    const start = content.indexOf(remove)
    const end = content.indexOf('</div>', start) + '</div>'.length
    return content.substring(0, start) + content.substring(end)
  }

  return result
}

export function toObject<Type>(data: (Type & Model)[]): Type[] {
  return data.map((item) => item.toObject())
}

export function filterPostWithPostedTime(data: Models.Post[]) {
  return data.filter((item) => !!item.postedAt && new Date().getTime() >= new Date(item.postedAt).getTime())
}
