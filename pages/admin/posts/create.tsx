import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from '~/styles/admin/Posts.module.scss'
import Button from '~/components/Button'
import SelectCategory from '~/components/SelectCategory'
import Wrapper from '~/components/Wrapper'
import PathMenu from '~/components/PathMenu'
import { PostServer } from '~/servers'

const cx = classNames.bind(styles)

function CreatePost({ categories }: { categories: string }) {
  const category: Apis.Vi_Hi<Models.Category[]> = JSON.parse(categories)
  const router = useRouter()
  const [titleValue, setTitleValue] = useState('')
  const selectedCategoryValue = useRef<HTMLInputElement>()

  async function handleCreatePost() {
    const body = {
      title: titleValue,
      categoryId: JSON.parse(selectedCategoryValue.current!.value)
    }

    toast.loading('Creating post...', { id: 'create-post' })
    const response = await PostServer.create(body)

    const { error, result } = response
    if (error) {
      toast.error('Failed to create post!', { id: 'create-post' })
      console.log(`Failed to create Post!!! Error: ${error}`)
    } else {
      toast.success('Created post: ' + result.title, { id: 'create-post' })
      router.push(`/admin/posts/${encodeURIComponent(result.slug)}/edit`)
    }
  }

  return (
    <Wrapper
      Head={
        <Head>
          <title>Admin: Create Post</title>
        </Head>
      }
    >
      <main className={cx('main')}>
        <PathMenu />
        <h2 className={cx('title')}>Title Post</h2>
        <input type="text" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />

        <SelectCategory ref={selectedCategoryValue} categories={category} />

        <Button onClick={handleCreatePost} primary>
          Create
        </Button>
      </main>
    </Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import { getAllCategory } from '~/tools/category'
import { verifyAdmin } from '~/tools/middleware'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const noAdmin = await verifyAdmin(req as any)
  if (noAdmin) return noAdmin

  const allCategory = await getAllCategory(true)
  return {
    props: {
      categories: JSON.stringify(allCategory)
    }
  }
}

export default CreatePost
