declare type Model = {
  _id: string
  createdAt: string
  updatedAt: string
  deleted?: boolean
  deletedAt?: string
  postedAt?: string
}

declare namespace Models {
  interface Category extends Model {
    title: string
    color: string
    slug: string
  }

  interface Comment extends Model {
    idUser: string
    idPost: string
    content: string
    like: string[]
    replyId: string
  }

  interface Content extends Model {
    postId: string
    content: string
  }

  interface Email extends Model {
    name: string
    title?: string
    content?: string
    sended?: string
    slug: string
  }

  interface File extends Model {
    name: string
    link: string
  }

  interface Image extends File {}

  interface Post extends Model {
    title: string
    subTitle?: string
    banner?: string
    content?: string
    categoryId: string[]
    view: string[]
    like: string[]
    share: string[]
    author: string
    slug: string
  }

  interface User extends Model {
    name: string
    email: string
    password: string
    admin?: boolean
    image?: string
  }
}
