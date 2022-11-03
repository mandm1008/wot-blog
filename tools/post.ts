import { connect } from '../config/db'
import { toObject } from './index'
import Content from '~/models/Content'
import Post from '~/models/Post'
import Category from '~/models/Category'
import { filterPostWithPostedTime } from '~/tools'

export async function getAllSlugs(admin = false) {
  await connect()

  let posts = toObject(admin ? await Post.findWithDeleted<Models.Post>({}) : await Post.find<Models.Post>({}))

  if (!admin) {
    posts = filterPostWithPostedTime(posts)
  }

  const slugs = posts.map((post) => post.slug)

  return slugs
}

export async function getPostBySlug(slug: string) {
  await connect()

  const post = await Post.findOneWithDeleted<Models.Post>({ slug })

  return post !== null ? post.toObject<Models.Post>() : undefined
}

export async function getAllPosts(admin = false) {
  await connect()

  let visible = toObject(await Post.find<Models.Post>({}))
  let hidden = toObject(await Post.findDeleted<Models.Post>({}))

  if (!admin) {
    visible = filterPostWithPostedTime(visible)
    hidden = filterPostWithPostedTime(hidden)
  }

  return admin
    ? {
        visible,
        hidden
      }
    : visible
}

export async function getTopPosts(amount = 6) {
  await connect()

  const posts = await Post.find<Models.Post>({})
  const list = filterPostWithPostedTime(toObject(posts))
  const length = list.length

  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j < length; j++) {
      if (list[j].view >= list[i].view) {
        const step = list[j]
        list[j] = list[i]
        list[i] = step
      }
    }
  }

  return list.filter((post, i) => i < amount)
}

export async function getNewPosts(amount = 5) {
  await connect()

  const posts = await Post.find<Models.Post>({})
  const list = filterPostWithPostedTime(toObject(posts))
  const length = list.length

  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j < length; j++) {
      if (
        new Date(list[j].postedAt || list[j].createdAt).getTime() >=
        new Date(list[i].postedAt || list[i].createdAt).getTime()
      ) {
        const step = list[j]
        list[j] = list[i]
        list[i] = step
      }
    }
  }

  return list.filter((post, i) => i < amount)
}

export async function getPostsForSearch(q: string) {
  await connect()

  const posts = filterPostWithPostedTime(toObject(await Post.find<Models.Post>({})))

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      (typeof post.subTitle === 'string' && post.subTitle.toLowerCase().includes(q)) ||
      (typeof post.content === 'string' && post.content.toLowerCase().includes(q))
  )
}

export async function getPostsByCategory(slug: string) {
  await connect()

  const category = await Category.findOne<Models.Category>({ slug })
  if (category === null) return []

  const posts = filterPostWithPostedTime(toObject(await Post.find<Models.Post>({})))

  return posts.filter((post) => post.categoryId.includes(category._id.toString()))
}

export async function getContentForPostAdmin(id: string) {
  await connect()

  const content = (await Content.findOne<Models.Content>({ postId: id }))!.toObject<Models.Content>()

  return content.content
}

export function removeContentOfPost<T = Apis.PostWithCategory>(data: (T & Apis.PostWithCategory)[] = []): T[] {
  console.log(data)
  return data.map((item) => {
    item.content = ''
    console.log(1)
    return item
  })
}
