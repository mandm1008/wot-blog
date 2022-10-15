import { connect } from '../config/db'
import Category from '../models/Category'

export async function getAllCategory(admin = false) {
  await connect()
  const visible: Models.Category[] = await Category.find({})
  const hidden: Models.Category[] = await Category.findDeleted({})

  return admin
    ? {
        visible,
        hidden
      }
    : visible
}

export async function getListCategory(listId: string[], admin = false): Promise<Models.Category[]> {
  await connect()

  const categories = admin
    ? await Category.findWithDeleted({ _id: { $in: listId } })
    : await Category.find({ _id: { $in: listId } })

  return categories
}

export async function getCategoriesWithPosts(posts: Models.Post[], admin = false): Promise<Apis.PostWithCategory[]> {
  const results = []
  for (const post of posts) {
    results.push({
      ...post,
      categories: await getListCategory(post.categoryId, admin)
    })
  }
  return results
}

export async function getCategoryBySlug(slug: string, admin = false): Promise<Models.Category | undefined> {
  await connect()

  const category = admin ? await Category.findOneWithDeleted({ slug }) : await Category.findOne({ slug })

  return category && category.toObject()
}
