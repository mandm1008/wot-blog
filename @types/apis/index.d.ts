interface Header extends Models.Category {
  posts: Models.Post[]
}

interface Query {
  [index: string]: string
}

declare namespace Apis {
  interface Error {
    error?: string
    value?: string
  }

  interface PostWithCategory extends Models.Post {
    categories: Models.Category[]
  }

  interface CommentWithUser extends Models.Comment {
    user: Models.User
  }

  interface NoPassword extends Models.User {
    password?: undefined
  }

  interface Vi_Hi<Type> {
    visible: Type
    hidden: Type
  }

  type SortType = 'popular' | 'share' | 'like' | 'view' | 'time'

  type ResetPasswordToken = {
    id: string
    name: string
    email: string
  }

  type ModePopularPost = 'week' | 'month'

  type ListData = { [key: string]: string }

  type DeleteMethod = 'delete' | 'hidden' | 'restore'

  namespace ApiImages {
    interface ResImages {
      images: Models.Image[]
      totalPages: number
    }

    interface ReqDeleteImages {
      id: string
      link: string
    }
  }

  namespace ApiFiles {
    interface ReqGetFiles extends Query {
      page: string
    }
    interface ResFiles {
      files: Models.File[]
      totalPages: number
    }

    interface ReqDeleteFiles {
      id: string
      link: string
    }
  }

  interface ApiHeader extends Array<Header> {}

  namespace ApiCategory {
    interface ReqGetCategory extends Query {
      slug: string
    }
    interface ResCategory extends Models.Category {}

    interface ReqGetPosts extends Query {
      slug: string
      page: string
      q: string
    }
    interface ResPosts {
      posts: PostWithCategory[]
      total: number
      totalPages: number
    }

    interface ReqCreate {
      title: string
      color: string
    }
    interface ResCreate {
      data: Models.Category
    }

    interface ReqEdit {
      id: string
      title: string
      color?: string
    }
    interface ResEdit {
      data: Models.Category
    }
  }

  namespace ApiPost {
    interface ReqMore extends Query {
      page: string
    }
    interface ResMore {
      morePosts: PostWithCategory[]
      total: number
      totalPages: number
    }

    interface ReqMost extends Query {
      mode?: ModePopularPost
      type: SortType
      category?: string
      amount?: string
    }
    interface ResMost extends Array<PostWithCategory> {}

    interface ResNew extends ResMost {}

    interface ReqSlug extends Query {
      slug: string
    }
    interface ResSlug extends Array<Models.Post> {}

    interface ResTop extends Array<PostWithCategory> {}

    interface ReqInteractive extends Query {
      type: 'view' | 'like' | 'share'
      id: string
      idUser?: string
    }

    interface ReqCreate {
      title: string
      categoryId: string[]
    }
    interface ResCreate {
      result: Models.Post
    }

    interface ReqEdit {
      [key: string]: any
      _id: string
      title: string
      subTitle?: string
      content?: string
      banner?: string
      categoryId: string[]
      deleted?: boolean
      postedAt?: string
    }
    interface ResEdit {
      data: Models.Post
    }
  }

  namespace ApiUser {
    interface ReqResetPasswordActions {
      encrypt: string
      password: string
    }

    interface ReqResetPassword {
      email: string
    }

    interface ReqActive extends Query {
      email: string
    }

    interface ResetPasswordToken {
      id: string
      name: string
      email: string
    }

    interface ReqCreate {
      name: string
      email: string
      password: string
    }
    interface ResCreate {
      email: string
    }

    interface ReqEdit {
      name: string
    }
    interface ResEdit extends NoPassword {}

    interface ResGet extends NoPassword {
      accessToken: string
    }

    interface ReqLogin {
      email: string
      password: string
      remember: boolean
    }
    interface ResLogin extends NoPassword {
      accessToken: string
    }
  }

  namespace ApiComment {
    interface ReqGet extends Query {
      slug: string
      page: string
    }
    interface ResGet {
      comments: CommentWithUser[]
      total: number
      totalPages: number
    }

    interface ReqCreate {
      slugPost: string
      replyId?: string
      content: string
    }
    interface ResCreate extends Models.Comment {}

    interface ReqDelete {
      id: string
    }
  }

  namespace ApiContent {
    interface ReqEdit {
      id: string
      content: string
    }
  }

  namespace ApiEmail {
    interface ReqCreate {
      name: string
    }
    interface ResCreate {
      result: Models.Email
    }

    interface ReqEdit {
      _id: string
      name: string
      title: string
      content: string
    }

    interface ReqSend extends Query {
      _id: string
    }

    interface ReqCopy {
      _id: string
    }
    interface ResCopy {
      data: Vi_Hi<Models.Email[]>
    }
  }

  namespace ApiDelete {
    interface ReqQuery extends Query {
      type: DeleteMethod
    }

    interface ReqBody {
      ids: string[]
    }

    interface Res extends ReqBody {}
  }

  namespace ApiTime {
    interface Get {
      now: string
    }
  }
}
