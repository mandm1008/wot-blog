import { memo } from 'react'
import classNames from 'classnames/bind'

import styles from './ShapePosts.module.scss'
import Ads from '../Ads'
import PostItem from '../PostItem'
import { useStore } from '../store'

const cx = classNames.bind(styles)

function ShapePosts({ data = [], i }: { data: Models.Post[]; i: number }) {
  const [{ layout }] = useStore()

  return (
    <div className={cx('wrapper')}>
      {layout === 3 && i % 2 === 0 && <Ads className={cx('ads')} />}
      {data[0] && <PostItem key={data[0]._id} data={data[0]} big style={{ width: 'auto' }} />}
      {layout === 3 && i % 2 !== 0 && <Ads className={cx('ads')} />}

      {data.map((post, i) => !!i && <PostItem key={post._id} data={post} />)}
      {layout !== 3 && <Ads className={cx('ads')} />}
    </div>
  )
}

export default memo(ShapePosts)
