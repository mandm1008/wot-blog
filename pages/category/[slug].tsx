import { NextSeo } from 'next-seo'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR, { SWRConfig } from 'swr'
import useSWRInfinite from 'swr/infinite'
import useSWRImmutable from 'swr/immutable'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from '~/styles/Category.module.scss'
import Wrapper from '~/components/Wrapper'
import Button from '~/components/Button'
import SearchBtn from '~/components/SearchBtn'
import ShapePosts from '~/components/ShapePosts'
import { server } from '~/config/constants'
import { SWRServer } from '~/servers'

const cx = classNames.bind(styles)
const getListPosts = (data: Apis.ApiCategory.ResPosts[] = []) =>
  data.reduce<Apis.PostWithCategory[]>((acc, crr) => [...acc, ...crr.posts], [])

function Category() {
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const getKey = useCallback(
    (index: number) =>
      searchValue.length <= 0
        ? `/api/data/category/posts?slug=${router.query.slug}&page=${index + 1}`
        : `/api/data/category/posts?slug=${router.query.slug}&page=${index + 1}&q=${searchValue}`,
    [router.query.slug, searchValue]
  )
  const { data: category } = useSWR<Apis.ApiCategory.ResCategory>(
    '/api/data/category?slug=' + router.query.slug,
    SWRServer.fetcher
  )
  const { data: defaultData } = useSWRImmutable<Apis.ApiCategory.ResPosts>(
    `/api/data/category/posts?slug=${router.query.slug}&page=1`,
    SWRServer.fetcher
  )
  const {
    data: dataPosts = defaultData ? [defaultData] : [],
    size,
    setSize
  } = useSWRInfinite<Apis.ApiCategory.ResPosts>(getKey, SWRServer.fetcher)
  const listData = getListPosts(dataPosts)
  const crrDataPosts = dataPosts[dataPosts.length - 1] || {}
  const [isOpenSearch, setIsOpenSearch] = useState(false)

  useEffect(() => {
    function handler(e: any) {
      setSearchValue(e.target.value)
      if (e.target.value.length > 0) {
        setSize(1)
      }
    }

    window.addEventListener('search', handler)
    return () => window.removeEventListener('search', handler)
  }, [setSize])
  useEffect(() => {
    if (size > 1 && dataPosts.length === size) {
      toast.success('Successfully loaded more posts!', { id: 'view-more-posts' })
    }
  }, [size, dataPosts])
  useEffect(
    () => () => {
      setSize(1)
    },
    [setSize]
  )

  const handleViewMore = useCallback(() => {
    setSize((prev) => prev + 1)
    toast.loading('Loading more posts...', { id: 'view-more-posts' })
  }, [setSize])
  const handleCloseSearch = useCallback(() => {
    setIsOpenSearch(false)
    setSearchValue('')
  }, [])
  const handleOpenSearch = useCallback(() => setIsOpenSearch(true), [])

  const sortPosts = (data: Apis.PostWithCategory[] = []) => {
    const length = data.length
    const posts = []
    for (let i = 0; i <= length; i += 10) posts[i / 10] = data.slice(i, i + 10 > length ? length : i + 10)
    return posts.filter((item) => item.length > 0)
  }

  return (
    <Wrapper
      Head={
        <NextSeo
          title={`Category: ${category!.title}`}
          description={category!.title}
          canonical={`${server}/category/${category!.slug}`}
          openGraph={{
            url: `${server}/category/${category!.slug}`,
            title: `Category: ${category!.title}`,
            description: category!.title
          }}
        />
      }
      Content={
        <div className={cx('title')} style={{ ['--cl' as any]: category!.color }}>
          <h1>{category!.title || 'Category'}</h1>

          <SearchBtn page={size} open={isOpenSearch} onClose={handleCloseSearch} onOpen={handleOpenSearch} />

          {searchValue && (
            <span className={cx('key-search')}>
              Key: <i>{searchValue}</i>
            </span>
          )}
        </div>
      }
    >
      <div className={cx('wrapper')}>
        {sortPosts(listData).map((posts, i) => (
          <ShapePosts key={i} data={posts} i={i} />
        ))}
      </div>

      <Button primary l disable={!crrDataPosts.totalPages} onClick={handleViewMore} style={{ zIndex: 9 }}>
        View More News ({crrDataPosts.total || '0'})
      </Button>
    </Wrapper>
  )
}

function Page({ data = {} }: { data: { [key: string]: string } }) {
  const fallback: { [key: string]: string } = {}
  Object.keys(data).forEach((key) => {
    fallback[key] = JSON.parse(data[key])
  })
  return (
    <SWRConfig value={{ fallback }}>
      <Category />
    </SWRConfig>
  )
}

import { GetStaticProps, GetStaticPaths } from 'next'
import { getAllCategory, getCategoriesWithPosts, getCategoryBySlug } from '~/tools/category'
import { getPostsByCategory } from '~/tools/post'
import { sort } from '~/tools'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const posts = sort(await getCategoriesWithPosts(await getPostsByCategory(params!.slug as string)), 'time')
  const category = await getCategoryBySlug(params!.slug as string)
  const total = posts.length - 10

  return {
    props: {
      data: {
        ['/api/data/category?slug=' + params!.slug]: JSON.stringify(category),
        ['/api/data/category/posts?slug=' + params!.slug + '&page=1']: JSON.stringify({
          posts: posts.slice(0, 10),
          totalPages: Math.ceil(total / 10),
          total: total > 0 ? total : 0
        })
      }
    },
    revalidate: 60
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getAllCategory()

  if (!Array.isArray(categories)) return { paths: [], fallback: 'blocking' }

  return {
    paths: categories.map((category) => ({
      params: { slug: category.slug }
    })),
    fallback: 'blocking'
  }
}

export default Page
