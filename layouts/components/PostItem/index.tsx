import classNames from 'classnames/bind'
import Image from '~/config/image'

import styles from './PostItem.module.scss'
import Link from '~/components/Link'
import { getText, ddmmyyyy } from '~/tools'
import { SharedIcon } from '~/components/Icons'
import { demoImage } from '~/assets/images'

const cx = classNames.bind(styles)

function PostItem({ data }: { data: Models.Post }) {
  return (
    <div className={cx('wrapper')}>
      <Image src={data.banner || demoImage.src} alt={data.title} width={284} height={184} />
      <div className={cx('content')}>
        <Link href={`/posts/${data.slug}`} className={cx('title')}>
          {getText(data.title)}
        </Link>
        <p className={cx('description')}>
          {ddmmyyyy(data.postedAt || data.createdAt)} • <SharedIcon size="12" /> {data.share || '0'}
        </p>
      </div>
    </div>
  )
}

export default PostItem
