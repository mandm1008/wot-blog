import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from '~/styles/Post.module.scss'
import Wrapper from '~/components/Wrapper'
import Ads from '~/components/Ads'
import Interactive from '~/components/Interactive'
import Category from '~/components/Category'
import PopularCategory from '~/components/PopularCategory'
import Button from '~/components/Button'
import CountView from '~/components/CountView'
import { useStore } from '~/components/store'
import { getTime, getTimeInText } from '~/tools'
import { server } from '~/config/constants'
import Image from '~/config/image'
import { SWRServer } from '~/servers'

const MostPopular = dynamic(() => import('~/components/MostPopular'))
const MostShare = dynamic(() => import('~/components/MostShare'))
const CanLike = dynamic(() => import('~/components/CanLike'))
const UserComment = dynamic(() => import('~/components/UserComment'))
const Comment = dynamic(() => import('~/components/Comment'))
const ShareGroup = dynamic(() => import('~/components/ShareGroup'))

const cx = classNames.bind(styles)
const getListComments = (listComments: Apis.ApiComment.ResGet[]) =>
  listComments.reduce<Apis.CommentWithUser[]>((acc, crr) => [...acc, ...crr.comments], [])

function Post({ data = '{}' }) {
  const post: Apis.PostWithCategory = JSON.parse(data)
  const router = useRouter()
  const [{ layout }] = useStore()
  const getKey = useCallback((index: number) => `/api/comments?slug=${post.slug}&page=${index}`, [post])
  const {
    data: listComments = [],
    size,
    setSize,
    mutate
  } = useSWRInfinite<Apis.ApiComment.ResGet>(getKey, SWRServer.fetcher)
  const [isMutate, setIsMutate] = useState(false)
  const comments = useMemo(() => getListComments(listComments), [listComments])
  const crrDataComments = useMemo(() => listComments[listComments.length - 1], [listComments])
  const linkPage = useMemo(
    () => server + router.pathname.replace('[slug]', router.query.slug as string),
    [router.query, router.pathname]
  )

  const handleViewMore = useCallback(() => {
    setSize((prev) => prev + 1)
    toast.loading('Loading more posts...', { id: 'view-more-comments' })
  }, [setSize])
  const handleSend = useCallback(() => {
    setIsMutate(true)
    mutate()
    setTimeout(() => {
      setIsMutate(false)
    }, 1000)
  }, [mutate])

  useEffect(
    () => () => {
      setSize(1)
    },
    [setSize]
  )
  useEffect(() => {
    if (!isMutate && size > 1 && listComments.length === size) {
      toast.success('Successfully loaded more!', { id: 'view-more-comments' })
    }
  }, [size, listComments, isMutate])
  useEffect(() => {
    const interval = setInterval(() => {
      mutate()
    }, 30000)
    return () => clearInterval(interval)
  }, [mutate])

  return (
    <Wrapper
      Head={
        <NextSeo
          title={post.title}
          description={post.subTitle}
          canonical={`${server}/posts/${post.slug}`}
          openGraph={{
            url: `${server}/posts/${post.slug}`,
            title: post.title,
            description: post.subTitle,
            images: [
              {
                url: post.banner || '/logo.png',
                alt: post.title,
                width: 800,
                height: 600
              }
            ]
          }}
        />
      }
      background={post.banner}
      Content={
        <div className={cx('title')}>
          <h1>{post.title}</h1>
          <div className={cx('category')}>
            <span className={cx('border')}></span>
            <div className={cx('content')}>
              {post.categories && post.categories.map((category) => <Category key={category._id} data={category} />)}
              <span className={cx('time')}>{getTime(post.postedAt || post.createdAt)}</span>
            </div>
            <span className={cx('border')}></span>
          </div>

          <ShareGroup link={linkPage} data={post} />
        </div>
      }
    >
      <CountView ID={post._id} />
      <div
        className={cx('ctn')}
        style={{
          ['--cl' as any]: post.categories && post.categories[0] && post.categories[0].color
        }}
      >
        <Interactive id={post._id} view={post.view} like={post.like} share={post.share} />
        <div
          className={cx('content')}
          dangerouslySetInnerHTML={{
            __html:
              `<p class="${cx('time-content')}">
        ${getTimeInText(post.postedAt || post.createdAt)}
        </p>` + post.content
          }}
        ></div>
        {layout === 3 && (
          <div className={cx('popular')}>
            <Ads />
            <MostPopular />
            <MostShare />
          </div>
        )}
      </div>

      {layout !== 3 && (
        <div className={cx('popular')}>
          <Ads />
          <MostPopular />
          <MostShare />
        </div>
      )}

      <div className={cx('popular-category')}>
        <div className={cx('background')}>
          <Image src={post.banner || '/background.svg'} alt={post.title} layout="fill" />
        </div>
        <PopularCategory categories={post.categories} />
      </div>

      <div className={cx('can-like')}>
        <CanLike />
      </div>

      <div className={cx('user-comments')}>
        <UserComment onSend={handleSend} />
      </div>
      <div className={cx('comments')}>
        <h2 className={cx('title-comment')}>Comments: {crrDataComments ? crrDataComments.total : '0'}</h2>

        <div className={cx('content-comment')}>
          {comments.map((comment) => (
            <Comment key={comment._id} data={comment} onSend={handleSend} />
          ))}
        </div>

        {crrDataComments && (
          <Button primary l onClick={handleViewMore} disable={!crrDataComments.totalPages}>
            Load More ({crrDataComments.total - comments.length})
          </Button>
        )}
      </div>
    </Wrapper>
  )
}

import { GetStaticProps, GetStaticPaths } from 'next'
import { getAllSlugs, getPostBySlug } from '~/tools/post'
import { getListCategory } from '~/tools/category'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostBySlug(params!.slug as string)
  const categories = await getListCategory(post!.categoryId)

  return {
    props: {
      data: JSON.stringify({ ...post, categories })
    },
    revalidate: 60
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllSlugs()

  return {
    paths: slugs.map((slug) => ({
      params: { slug }
    })),
    fallback: 'blocking'
  }
}

export default Post
