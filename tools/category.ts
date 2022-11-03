import { connect } from '../config/db'
import Category from '../models/Category'

export async function getAllCategory(admin = false) {
  await connect()
  const visible = await Category.find<Models.Category>({})
  const hidden = await Category.findDeleted<Models.Category>({})

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
    ? await Category.findWithDeleted<Models.Category>({ _id: { $in: listId } })
    : await Category.find<Models.Category>({ _id: { $in: listId } })

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

  const category = admin
    ? await Category.findOneWithDeleted<Models.Category>({ slug })
    : await Category.findOne<Models.Category>({ slug })

  return category !== null ? category.toObject<Models.Category>() : undefined
}
