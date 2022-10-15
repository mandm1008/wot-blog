import { useState, memo } from 'react'
import useSWR from 'swr'
import classNames from 'classnames/bind'
import styles from './MostPopular.module.scss'
import PostItem from '../PostItem'
import { SWRServer } from '~/servers'

const cx = classNames.bind(styles)

function MostPopular() {
  const [mode, setMode] = useState<Apis.ModePopularPost>('week')
  const { error, data } = useSWR<Models.Post[]>(`/api/data/posts/most?mode=${mode}&type=popular`, SWRServer.fetcher)

  return (
    <div className={cx('wrapper')}>
      <h1 className={cx('title')}>Most Popular</h1>
      <div className={cx('table')}>
        <div className={cx('head')}>
          <span className={cx('item', { active: mode === 'week' })} onClick={() => setMode('week')}>
            Week
          </span>
          <span className={cx('item', { active: mode === 'month' })} onClick={() => setMode('month')}>
            Month
          </span>
        </div>

        <div className={cx('content')}>
          {!data && !error && 'Loading...'}
          {error && 'Error loading data'}
          {data && data.map((post, i) => <PostItem key={post._id} big popular data={post} rank={i + 1} />)}
        </div>
      </div>
    </div>
  )
}

export default memo(MostPopular)
