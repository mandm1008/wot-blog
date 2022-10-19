import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import Head from 'next/head'
import classNames from 'classnames/bind'

import styles from '~/styles/Search.module.scss'
import { useStore } from '~/components/store'
import Wrapper from '~/components/Wrapper'
import Ads from '~/components/Ads'
import MostPopular from '~/components/MostPopular'
import Link from '~/components/Link'
import PostItem from '~/components/PostItem'
import { OptionsPopper } from '~/components/Popper'
import { SearchIcon } from '~/components/Icons'
import { TbPlayerTrackPrev, TbPlayerTrackNext } from 'react-icons/tb'

const cx = classNames.bind(styles)

function Search({ data = '[]', total }: { data: string; total: number }) {
  const router = useRouter()
  const posts: Apis.PostWithCategory[] = JSON.parse(data)
  const [{ layout }] = useStore()
  const countItem = useMemo(() => (layout === 1 ? 5 : 10), [layout])
  const [index, setIndex] = useState(0)
  const pageLength = useMemo(() => Math.ceil(Math.ceil(total / 7) / countItem), [total, countItem])

  function renderPage(page: number) {
    const results = []

    for (let i = 0; i < page; i++) {
      results.push(
        <Link
          key={i}
          className={cx('page-item', { active: parseInt(router.query.page as string, 10) === i })}
          href={
            router.query.type
              ? `/search?q=${router.query.q}&type=${router.query.type}&page=${i}`
              : `/search?q=${router.query.q}&page=${i}`
          }
        >
          {i + 1}
        </Link>
      )
    }

    return results
  }

  function onNext() {
    setIndex((prev) => (prev >= pageLength - 1 ? 0 : prev + 1))
  }

  function onPrev() {
    setIndex((prev) => (prev <= 0 ? pageLength - 1 : prev - 1))
  }

  return (
    <Wrapper
      Head={
        <Head>
          <title>{`Search: ${router.query.q || 'ALL'}`}</title>
        </Head>
      }
      Content={
        <div className={cx('head')}>
          <div className={cx('total')}>
            <div>
              <SearchIcon size={layout >= 2 ? '30' : '20'} />
              <span>{router.query.q || 'ALL'}</span>
            </div>
            <span>{total} archives</span>
          </div>
          <OptionsPopper
            content={
              <div className={cx('type', 'list-type')}>
                <Link href={`/search?q=${router.query.q}&page=0`}>Most Relevant</Link>
                <Link href={`/search?q=${router.query.q}&type=recent&page=0`}>Most Recent</Link>
                <Link href={`/search?q=${router.query.q}&type=popular&page=0`}>Most Popular</Link>
              </div>
            }
          >
            <div className={cx('type')}>
              {!!router.query.type || 'Most Relevant'}
              {router.query.type === 'recent' && 'Most Recent'}
              {router.query.type === 'popular' && 'Most Popular'}
            </div>
          </OptionsPopper>
        </div>
      }
    >
      <div className={cx('wrapper')}>
        <div className={cx('content')}>
          {posts.length > 0 ? (
            <>
              {posts.map((post, i) => (
                <PostItem key={post._id} data={post} list />
              ))}

              <div className={cx('page')}>
                <TbPlayerTrackPrev className={cx('icon', { active: pageLength > 1 })} onClick={onPrev} />
                <div className={cx('page-ctn')} style={{ maxWidth: layout === 1 ? '210px' : '420px' }}>
                  <div
                    className={cx('page-content')}
                    style={{
                      transform: `translateX(${-(index * (layout === 1 ? 210 : 420))}px)`
                    }}
                  >
                    {renderPage(Math.ceil(total / 7))}
                  </div>
                </div>
                <TbPlayerTrackNext className={cx('icon', { active: pageLength > 1 })} onClick={onNext} />
              </div>
            </>
          ) : (
            'No results for key: ' + router.query.q
          )}
        </div>

        <div className={cx('bar')}>
          <Ads />
          <MostPopular />
        </div>
      </div>
    </Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import { getCategoriesWithPosts } from '~/tools/category'
import { getPostsForSearch, removeContentOfPost } from '~/tools/post'
import { sort, sortByQ } from '~/tools'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // Query: q: string, type: '' | 'recent' | 'popular', page: number
  if (!query.q || typeof query.q !== 'string' || typeof query.page === 'object') return { props: {} }

  const page = parseInt(query.page || '0', 10)
  let posts = await getCategoriesWithPosts(await getPostsForSearch(query.q.toLowerCase()))
  const total = posts.length

  if (!query.type) {
    posts = sortByQ<Apis.PostWithCategory>(posts, query.q)
  }

  if (query.type === 'recent') {
    posts = sort(posts, 'time')
  }

  if (query.type === 'popular') {
    posts = sort(posts, 'popular')
  }

  if (!page) {
    posts = posts.slice(0, 7)
  }

  if (page) {
    posts = posts.slice(7 * page, 7 * (page + 1))
  }

  return {
    props: {
      data: JSON.stringify(removeContentOfPost(posts)),
      total
    }
  }
}

export default Search
