import { useState } from 'react'
import Head from 'next/head'
import classNames from 'classnames/bind'

import styles from '~/styles/admin/Posts.module.scss'
import Wrapper from '~/components/Wrapper'
import Button from '~/components/Button'
import Table, { Field } from '~/components/Table'
import PathMenu from '~/components/PathMenu'

const cx = classNames.bind(styles)

function Posts({ posts }: { posts: string }) {
  const post: Apis.Vi_Hi<Models.Post[]> = JSON.parse(posts)
  const [visiblePosts, setVisiblePosts] = useState(post.visible)
  const [hiddenPosts, setHiddenPosts] = useState(post.hidden)

  const fields: Field[] = [
    { name: 'title', type: 'text', options: { link: (path, slug) => `/${path}/${slug}` } },
    { name: 'categories', type: 'list' },
    { name: 'createdAt', as: 'create time', type: 'time' },
    { name: 'updatedAt', as: 'update time', type: 'time' },
    { name: 'postedAt', as: 'post time', type: 'time' }
  ]

  function handleHidden({ ids, error }: Apis.ApiDelete.Res & Apis.Error) {
    if (error) {
      console.log(error)
    } else {
      setHiddenPosts((prev) => [
        ...prev,
        ...visiblePosts.filter((post) => {
          for (const id of ids) {
            if (post._id === id) return true
          }
          return false
        })
      ])

      setVisiblePosts((prev) =>
        prev.filter((post) => {
          for (const id of ids) {
            if (post._id === id) return false
          }
          return true
        })
      )
    }
  }

  function handleRestore({ ids, error }: Apis.ApiDelete.Res & Apis.Error) {
    if (error) {
      console.log(error)
    } else {
      setVisiblePosts((prev) => [
        ...prev,
        ...hiddenPosts.filter((post) => {
          for (const id of ids) {
            if (post._id === id) return true
          }
          return false
        })
      ])

      setHiddenPosts((prev) =>
        prev.filter((post) => {
          for (const id of ids) {
            if (post._id === id) return false
          }
          return true
        })
      )
    }
  }

  function handleDelete({ ids, error }: Apis.ApiDelete.Res & Apis.Error, type: 'visible' | 'hidden') {
    if (error) {
      console.log(error)
    } else {
      if (type === 'visible') {
        setVisiblePosts((prev) =>
          prev.filter((post) => {
            for (const id of ids) {
              if (post._id === id) return false
            }
            return true
          })
        )
      }
      if (type === 'hidden') {
        setHiddenPosts((prev) =>
          prev.filter((post) => {
            for (const id of ids) {
              if (post._id === id) return false
            }
            return true
          })
        )
      }
    }
  }

  return (
    <Wrapper
      Head={
        <Head>
          <title>Admin: Posts</title>
        </Head>
      }
    >
      <main className={cx('main')}>
        <PathMenu />
        <h1>Posts Page</h1>
        <Button href="/admin/posts/create" primary>
          Create New Post
        </Button>

        <h1># Visible ({visiblePosts.length})</h1>
        <Table
          path="posts"
          fields={fields}
          data={visiblePosts}
          actions={[{ name: 'hidden', handler: handleHidden }]}
          edit
        />
        <h1># Hidden ({hiddenPosts.length})</h1>
        <Table
          path="posts"
          fields={fields}
          data={hiddenPosts}
          actions={[
            { name: 'restore', handler: handleRestore },
            { name: 'delete', handler: (response) => handleDelete(response, 'hidden') }
          ]}
          edit
        />
      </main>
    </Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import { getAllPosts } from '~/tools/post'
import { getCategoriesWithPosts } from '~/tools/category'
import { verifyAdmin } from '~/tools/middleware'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const noAdmin = await verifyAdmin(req as any)
  if (noAdmin) return noAdmin

  const data = (await getAllPosts(true)) as { visible: Models.Post[]; hidden: Models.Post[] }
  const posts = {
    visible: await getCategoriesWithPosts(data.visible, true),
    hidden: await getCategoriesWithPosts(data.hidden, true)
  }

  return {
    props: { posts: JSON.stringify(posts) }
  }
}

export default Posts
