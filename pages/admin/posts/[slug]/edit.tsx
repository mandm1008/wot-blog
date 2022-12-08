import { useState, useRef } from 'react'
import Head from 'next/head'
import Image from '~/config/image'
import { useRouter } from 'next/router'
import Tippy from '@tippyjs/react'
import toast from 'react-hot-toast'
import { Editor as TinyMCEEditor } from 'tinymce'
import { ReferenceElement } from 'tippy.js'
import classNames from 'classnames/bind'

import styles from '~/styles/admin/Posts.module.scss'
import Wrapper from '~/components/Wrapper'
import SelectCategory from '~/components/SelectCategory'
import Button from '~/components/Button'
import CheckBox from '~/components/CheckBox'
import TinyMCE from '~/components/TinyMCE'
import { UploadImages, UploadFiles } from '~/components/Upload'
import AutoSave from '~/components/AutoSave'
import Timer from '~/components/Timer'
import { formatContentHTML } from '~/tools'
import { PostServer, ContentServer } from '~/servers'
import dayjs from '~/config/day'

const cx = classNames.bind(styles)

function EditPost({
  post,
  categories,
  selectedCategories
}: {
  post: string
  categories: string
  selectedCategories: string
}) {
  const router = useRouter()
  const mainPost: Models.Post = JSON.parse(post)
  const listCategory: Apis.Vi_Hi<Models.Category[]> = JSON.parse(categories)
  const listSelectedCategory = JSON.parse(selectedCategories)

  const [titleValue, setTitleValue] = useState(mainPost.title || '')
  const [subTitleValue, setSubTitleValue] = useState(mainPost.subTitle || '')
  const [srcImage, setSrcImage] = useState(mainPost.banner || '')
  const [isVisiblePost, setIsVisiblePost] = useState(!mainPost.deleted)
  const valueSelectedCategory = useRef<HTMLInputElement>()
  const bannerTippy = useRef<ReferenceElement>()
  const valueContent = useRef<React.MutableRefObject<TinyMCEEditor>>()
  const postedTime = useRef<React.MutableRefObject<HTMLInputElement>>()

  async function handleUpdatePost() {
    const content = valueContent.current!.current && valueContent.current!.current.getContent()

    const body = {
      _id: mainPost._id,
      title: titleValue,
      subTitle: subTitleValue,
      content: formatContentHTML(content),
      categoryId: JSON.parse(valueSelectedCategory.current!.value),
      deleted: !isVisiblePost,
      banner: srcImage || undefined,
      postedAt:
        postedTime.current?.current.value && dayjs.utc(new Date(postedTime.current?.current.value)).toISOString()
    }

    toast.loading('Updating...', { id: 'update' })
    await ContentServer.autoSave({ id: body._id, content: body.content })

    const response = await PostServer.edit(body)

    const { error } = response
    if (error) {
      toast.error('Update post failed!', { id: 'update' })
      console.log(error)
    } else {
      toast.success('Update post successfully!', { id: 'update' })
      router.push('/admin/posts')
    }
  }

  return (
    <Wrapper
      Head={
        <Head>
          <title>Admin: Edit Post</title>
        </Head>
      }
    >
      <main className={cx('main')}>
        <div className={cx('visible-ctn')}>
          <h1>$ Visible Post</h1>
          <CheckBox checked={isVisiblePost} onChange={(e) => setIsVisiblePost(e.target.checked)} id="isVisiblePost" />
        </div>

        <div className={cx('visible-time')}>
          <h1>$ Time Posted</h1>
          <Timer ref={postedTime} timeString={mainPost.postedAt} />
        </div>

        <h1>$ Title</h1>
        <input type="text" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />

        <h1>$ Subtitle</h1>
        <input type="text" value={subTitleValue} onChange={(e) => setSubTitleValue(e.target.value)} />

        <div className={cx('inner')}>
          <div className={cx('content-ctn')}>
            <h1 className={cx('content-title')}>
              $ Content <AutoSave ID={mainPost._id} content={valueContent} />
            </h1>
            <div className={cx('tiny')}>
              <TinyMCE ref={valueContent}>{mainPost.content || ''}</TinyMCE>
            </div>
          </div>

          <div className={cx('toolbar')}>
            <h1>$ Banner</h1>
            <Tippy
              ref={bannerTippy as React.Ref<Element>}
              trigger="click"
              appendTo={() => document.body}
              placement="top"
              interactive
              content={
                <input
                  className={cx('banner-input')}
                  type="text"
                  placeholder="Enter link image..."
                  onKeyUp={(e: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
                    if (e.key === 'Enter') {
                      setSrcImage(e.target.value)
                      bannerTippy.current!._tippy!.hide()
                    }
                  }}
                />
              }
            >
              <div className={cx('image-ctn')}>
                <Image
                  objectFit="cover"
                  width={284}
                  height={184}
                  layout="intrinsic"
                  src={srcImage || '/upload.jpg'}
                  alt="Banner"
                />
              </div>
            </Tippy>

            <UploadImages />
            <UploadFiles />

            <SelectCategory ref={valueSelectedCategory} categories={listCategory} selected={listSelectedCategory} />
          </div>
        </div>

        <Button href="/admin/posts" outline>
          Cancel
        </Button>
        <Button onClick={handleUpdatePost} primary>
          Save
        </Button>
      </main>
    </Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import { getPostBySlug, getContentForPostAdmin } from '~/tools/post'
import { getAllCategory, getListCategory } from '~/tools/category'
import { verifyAdmin } from '~/tools/middleware'

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const noAdmin = await verifyAdmin(req as any)
  if (noAdmin) return noAdmin

  const post = await getPostBySlug(params!.slug as string)
  if (!post)
    return {
      props: {},
      redirect: {
        destination: '/admin/posts'
      }
    }

  post.content = (await getContentForPostAdmin(post._id)) || post.content
  const categories = await getAllCategory(true)
  const selectedCategories = await getListCategory(post.categoryId, true)

  return {
    props: {
      post: JSON.stringify(post),
      categories: JSON.stringify(categories),
      selectedCategories: JSON.stringify(selectedCategories)
    }
  }
}

export default EditPost
