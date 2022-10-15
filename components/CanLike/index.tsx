import { memo } from 'react'
import useSWR from 'swr'
import classNames from 'classnames/bind'

import styles from './CanLike.module.scss'
import Loading from '../Loading'
import PostItem from '../PostItem'
import { SWRServer } from '~/servers'

const cx = classNames.bind(styles)

function CanLike() {
  const { error, data = [] } = useSWR<Apis.ApiPost.ResMost>(
    '/api/data/posts/most?type=like&amount=4',
    SWRServer.fetcher
  )

  return (
    <div className={cx('wrapper')}>
      <h1 className={cx('title')}>You may also like</h1>
      <div className={cx('content')}>
        {data.length <= 0 && !error && (
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
            <div className={cx('loading')}>
              <Loading />
            </div>
          </>
        )}
        {data.length <= 0 && error && 'Error loading data'}
        {data.length > 0 && data.map((post) => <PostItem key={post._id} data={post} small />)}
      </div>
    </div>
  )
}

export default memo(CanLike)
