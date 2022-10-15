import { connect } from '../config/db'
import { toObject } from './index'
import Content from '~/models/Content'
import Post from '~/models/Post'
import Category from '~/models/Category'
import { filterPostWithPostedTime } from '~/tools'

export async function getAllSlugs(admin = false) {
  await connect()

  let posts = toObject<Models.Post>(admin ? await Post.findWithDeleted({}) : await Post.find({}))

  if (!admin) {
    posts = filterPostWithPostedTime(posts)
  }

  const slugs: string[] = posts.map((post) => post.slug)

  return slugs
}

export async function getPostBySlug(slug: string): Promise<Models.Post> {
  await connect()

  const post = await Post.findOneWithDeleted({ slug })

  return post && post.toObject()
}

export async function getAllPosts(admin = false) {
  await connect()

  let visible = toObject<Models.Post>(await Post.find({}))
  let hidden = toObject<Models.Post>(await Post.findDeleted({}))

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

  const posts = await Post.find({})
  const list = filterPostWithPostedTime(toObject<Models.Post>(posts))
  const length = list.length

  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j < length; j++) {
      if (list[j].view.length >= list[i].view.length) {
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

  const posts = await Post.find({})
  const list = filterPostWithPostedTime(toObject<Models.Post>(posts))
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

  const posts = filterPostWithPostedTime(toObject<Models.Post>(await Post.find({})))

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      (typeof post.subTitle === 'string' && post.subTitle.toLowerCase().includes(q)) ||
      (typeof post.content === 'string' && post.content.toLowerCase().includes(q))
  )
}

export async function getPostsByCategory(slug: string) {
  await connect()

  const category = await Category.findOne({ slug })
  const posts = filterPostWithPostedTime(toObject<Models.Post>(await Post.find({})))

  return posts.filter((post) => post.categoryId.includes(category._id.toString()))
}

export async function getContentForPostAdmin(id: string): Promise<string> {
  await connect()

  const content = await Content.findOne({ postId: id })

  return content.content
}
