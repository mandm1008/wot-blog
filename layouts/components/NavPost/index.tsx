import useSWR from 'swr'
import classNames from 'classnames/bind'

import styles from './NavPost.module.scss'
import Loading from '~/components/Loading'
import ScrollSlide from '~/components/ScrollSlide'
import { FcMenu } from 'react-icons/fc'
import { SWRServer } from '~/servers'

const cx = classNames.bind(styles)

function NavPost({
  slug,
  isOpen,
  onClickMenu = () => {}
}: {
  slug: string
  isOpen: boolean
  onClickMenu?: () => void
}) {
  const { error, data = [] } = useSWR<Apis.ApiPost.ResSlug>('/api/data/posts/slug?slug=' + slug, SWRServer.fetcher)

  return (
    <div className={cx('wrapper', { close: !isOpen, in: isOpen })}>
      <FcMenu className={cx('menu')} onClick={onClickMenu} />
      <h1 className={cx('title')}>
        <span>Now Reading: </span>
        {data.length <= 0 && !error && <Loading />}
        {data.length <= 0 && error && 'Error loading data'}
        {data.length > 0 && data[1].title}
      </h1>
      <div className={cx('controls')}>
        <ScrollSlide
          size={32}
          sizeIcon={12}
          hrefLeft={data[0] ? `/posts/${data[0].slug}` : '/'}
          hrefRight={data[2] ? `/posts/${data[2].slug}` : '/'}
        />
      </div>
    </div>
  )
}

export default NavPost
