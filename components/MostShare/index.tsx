import { memo } from 'react'
import useSWR from 'swr'
import Image from '~/config/image'
import classNames from 'classnames/bind'

import styles from './MostShare.module.scss'
import Loading from '../Loading'
import Link from '../Link'
import { demoImage } from '~/assets/images'
import { getText } from '~/tools'
import { SWRServer } from '~/servers'

const cx = classNames.bind(styles)

function MostShare() {
  const { error, data } = useSWR<Apis.ApiPost.ResMost>('/api/data/posts/most?type=share', SWRServer.fetcher)

  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}>
        <span></span>
        Most Shared
        <span></span>
      </div>
      <div className={cx('content')}>
        {!data && !error && (
          <div className={cx('loading')}>
            <Loading />
          </div>
        )}
        {!data && error && 'Error loading data'}
        {data &&
          !error &&
          data.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post._id} className={cx('item')}>
              <div className={cx('banner')}>
                <Image src={post.banner || demoImage.src} width={66} height={36} alt={post.title} />
              </div>
              <span>{getText(post.title)}</span>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default memo(MostShare)
