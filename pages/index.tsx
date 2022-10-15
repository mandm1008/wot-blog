import { useCallback, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import useSWR, { SWRConfig } from 'swr'
import useSWRInfinite from 'swr/infinite'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from '~/styles/Home.module.scss'
import Link from '~/components/Link'
import SlidePosts from '~/components/SlidePosts'
import PostItem from '~/components/PostItem'
import MostPopular from '~/components/MostPopular'
import Button from '~/components/Button'
import Loading from '~/components/Loading'
import Ads from '~/components/Ads'
import { getTimeInText } from '~/tools'
import { CgMenuRound } from 'react-icons/cg'
import { server } from '~/config/constants'
import { SWRServer } from '~/servers'

const cx = classNames.bind(styles)
const getKey = (index: number) => (index ? '/api/data/posts/more?page=' + index : '/api/data/posts/more')
const getMorePosts = (data: Apis.ApiPost.ResMore[] = []) =>
  data.reduce<Apis.PostWithCategory[]>((acc, crr) => [...acc, ...crr.morePosts], [])

function Home() {
  const { error: errTopPosts, data: topPosts = [] } = useSWR<Apis.ApiPost.ResTop>(
    '/api/data/posts/top',
    SWRServer.fetcher
  )
  const { error: errNewPosts, data: newPosts = [] } = useSWR<Apis.ApiPost.ResNew>(
    '/api/data/posts/new',
    SWRServer.fetcher
  )
  const {
    error: errMorePosts,
    data: posts = [],
    size,
    setSize
  } = useSWRInfinite<Apis.ApiPost.ResMore>(getKey, SWRServer.fetcher)
  const morePosts = getMorePosts(posts)
  const crrDataMorePosts = posts[posts.length - 1] || {}

  const handleViewMore = useCallback(() => {
    setSize((prev) => prev + 1)
    toast.loading('Loading more posts...', { id: 'view-more-posts' })
  }, [setSize])

  useEffect(
    () => () => {
      setSize(1)
    },
    [setSize]
  )

  useEffect(() => {
    if (size > 1 && posts.length === size) {
      toast.success('Successfully loaded more posts!', { id: 'view-more-posts' })

      return () => toast.dismiss('view-more-posts')
    }
  }, [posts, size])

  return (
    <div className={cx('wrapper')}>
      <NextSeo
        title="Home Page"
        description="Always Learning, Always Effort. You're better when you believed. Welcome To Copywriting Community"
        canonical="https://writeortalk.com/"
        openGraph={{
          url: 'https://writeortalk.com/',
          title: 'Home Page',
          description:
            "Always Learning, Always Effort. You're better when you believed. Welcome To Copywriting Community",
          images: [
            {
              url: `${server}/logo2.png`,
              alt: 'Logo WoT Blog',
              width: 800,
              height: 600
            }
          ]
        }}
      />

      <main className={cx('main')}>
        <div className={cx('slogan')}>
          <Link className={cx('slogan-about')} href="/about">
            About us
          </Link>
          <h1 className={cx('slogan-title')}>
            Always Learning, Always Effort
            <br />
            You&apos;re better when you believed
            <br />
            Welcome To Copywriting Community
          </h1>
        </div>

        <SlidePosts data={topPosts} error={errTopPosts} title="The Highlights" />

        <div className={cx('latest-news')}>
          <div className={cx('latest-news-title')}>
            <CgMenuRound />
            Latest News
            <div className={cx('latest-news-time')}>{getTimeInText()}</div>
          </div>

          <div className={cx('latest-news-content')}>
            <div className={cx('latest-news-posts')}>
              {!newPosts && !errNewPosts && (
                <div className={cx('loading')}>
                  <Loading />
                </div>
              )}
              {errNewPosts && !newPosts && 'Error loading data'}
              {newPosts && newPosts.map((post, i) => <PostItem key={post._id} data={post} big={i === 0} />)}
            </div>

            <div className={cx('latest-news-popular')}>
              <Ads />
              <MostPopular />
            </div>
          </div>
        </div>

        <div className={cx('more-news')}>
          <h1 className={cx('more-news-title')}>
            <CgMenuRound />
            More News
          </h1>

          <div className={cx('more-news-content')}>
            <div className={cx('more-news-subscribe')}></div>
            <div className={cx('more-news-posts')}>
              {morePosts.length <= 0 && !errMorePosts && (
                <div className={cx('loading')}>
                  <Loading />
                </div>
              )}
              {morePosts.length <= 0 && errNewPosts && 'Error loading data'}
              {morePosts.length > 0 && <PostItem key={morePosts[0]._id} data={morePosts[0]} big />}
            </div>
          </div>
          <div className={cx('any-post')}>
            {morePosts.map((post, i) => i !== 0 && <PostItem key={post._id} data={post} />)}
          </div>

          <Button primary l disable={!crrDataMorePosts.totalPages} onClick={handleViewMore}>
            View More News ({crrDataMorePosts.total || '0'})
          </Button>
        </div>
      </main>
    </div>
  )
}

function Page({ data }: { data: Apis.ListData }) {
  const fallback: Apis.ListData = {}
  Object.keys(data).forEach((key: any) => {
    fallback[key] = JSON.parse(data[key])
  })
  return (
    <SWRConfig value={{ fallback }}>
      <Home />
    </SWRConfig>
  )
}

import { GetStaticProps } from 'next'
import { getCategoriesWithPosts } from '~/tools/category'
import { getTopPosts, getNewPosts } from '~/tools/post'

export const getStaticProps: GetStaticProps = async () => {
  const topPosts = await getCategoriesWithPosts(await getTopPosts(9))
  const newPosts = await getCategoriesWithPosts(await getNewPosts(5))

  return {
    props: {
      data: {
        ['/api/data/posts/top']: JSON.stringify(topPosts),
        ['/api/data/posts/new']: JSON.stringify(newPosts)
      }
    },
    revalidate: 60
  }
}

export default Page
