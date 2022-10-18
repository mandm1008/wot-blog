import { memo, useEffect, useState } from 'react'
import useSWR from 'swr'
import classNames from 'classnames/bind'

import styles from './PopularCategory.module.scss'
import Loading from '../Loading'
import PostItem from '../PostItem'
import { SWRServer } from '~/servers'

const cx = classNames.bind(styles)

function PopularCategory({ categories = [] }: { categories: Models.Category[] }) {
  const [mode, setMode] = useState(categories[0] || {})
  const { error, data } = useSWR<Apis.ApiPost.ResMost>(
    `/api/data/posts/most?category=${encodeURIComponent(JSON.stringify(mode || 'null'))}&type=popular`,
    SWRServer.fetcher
  )
  const [isOpenList, setIsOpenList] = useState(false)

  useEffect(() => {
    function handler() {
      setIsOpenList(false)
    }

    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
    setMode(categories[0] || {})
  }, [categories])

  function handleOpenList(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.stopPropagation()
    setIsOpenList(true)
  }

  return (
    <div className={cx('wrapper')}>
      <h1 className={cx('title')}>
        Most Popular <i>in</i>{' '}
        <div className={cx('category')}>
          <span className={cx('now')} style={{ ['--cl' as any]: mode.color }} onClick={handleOpenList}>
            {mode.title}
          </span>
          <div className={cx('list', { open: isOpenList })}>
            {categories.map((category, i) => (
              <span key={category._id} style={{ ['--cl' as any]: category.color }} onClick={() => setMode(category)}>
                {category.title}
              </span>
            ))}
          </div>
        </div>
      </h1>

      <div className={cx('content')}>
        {!data && !error && (
          <>
            <div className={cx('loading')}>
              <Loading />
            </div>
            <div className={cx('loading')}>
              <Loading />
            </div>
            <div className={cx('loading')}>
              <Loading />
            </div>
          </>
        )}
        {!data && error && 'Error loading data'}
        {data && data.map((post) => <PostItem key={post._id} data={post} />)}
      </div>
    </div>
  )
}

export default memo(PopularCategory)
