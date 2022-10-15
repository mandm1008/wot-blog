export const getTime = (str: string | undefined) => {
  if (!str) return ''

  const time = new Date(+new Date() - +new Date(str))
  const d = time.getDate() - 1
  const h = time.getHours() - 8
  const m = time.getMinutes()
  let children

  if (d > 0) {
    children = d + 'd ago'
  } else if (h > 0) {
    children = `${h}h ${m}m ago`
  } else {
    children = m + 'm ago'
  }

  return <i>{children}</i>
}

export const getTimeInText = (times?: string) => {
  const textWeeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const textMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const time = times ? new Date(times) : new Date()

  return `${textWeeks[time.getDay()]}, ${textMonths[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`
}

export const hm = (times: string) => {
  const time = new Date(times)
  const m = time.getMinutes()

  return `${time.getHours()}:${m > 9 ? m : '0' + m}`
}

export const ddmmyyyy = (str: string) => {
  const time = new Date(str)

  return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`
}

export const getText = (str?: string, length = 40) => {
  return str && str.length > length ? str.substring(0, length) + '...' : str
}

export function sort<Type = Models.Post>(data: Type[], key: Apis.SortType) {
  const handler = {
    popular(x: Models.Post, y: Models.Post) {
      return (
        x.view.length + x.like.length * 5 + x.share.length * 10 <=
        y.view.length + y.like.length * 5 + y.share.length * 10
      )
    },
    share(x: Models.Post, y: Models.Post) {
      return x.share.length <= y.share.length
    },
    like(x: Models.Post, y: Models.Post) {
      return x.like.length <= y.like.length
    },
    view(x: Models.Post, y: Models.Post) {
      return x.view.length <= y.view.length
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

export function toObject<Type>(data: any[]): Type[] {
  return data.map((item) => item.toObject())
}

export function filterPostWithPostedTime(data: any[]): Models.Post[] {
  return data.filter((item) => !!item.postedAt && new Date().getTime() >= new Date(item.postedAt).getTime())
}
