import toast from 'react-hot-toast'
import { memo } from 'react'
import classNames from 'classnames/bind'

import styles from './ShareGroup.module.scss'
import Link from '../Link'
import { PostServer } from '~/servers'
import { GrFacebook, GrTwitter } from 'react-icons/gr'
import { HiOutlineClipboardCopy } from 'react-icons/hi'
import { BsLinkedin } from 'react-icons/bs'
import { SiVk, SiSkype } from 'react-icons/si'

const cx = classNames.bind(styles)

function ShareGroup({ link, data }: { link: string; data: Models.Post }) {
  async function handleShare() {
    const res = await PostServer.counter({ type: 'share', id: data._id })

    if (res.error) {
      console.log(res.error)
    }
  }

  function handleCopyLink() {
    toast.promise(navigator.clipboard.writeText(link), {
      loading: 'Coping...',
      success: 'Copied!',
      error: 'Error copy!'
    })
  }

  return (
    <div className={cx('share-group')}>
      <Link
        className={cx('share-icon')}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleShare}
      >
        <GrFacebook />
      </Link>

      <Link
        className={cx('share-icon')}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleShare}
      >
        <BsLinkedin />
      </Link>

      <Link
        className={cx('share-icon')}
        href={`http://vk.com/share.php?url=${encodeURIComponent(link)}&title=${encodeURIComponent(data.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleShare}
      >
        <SiVk />
      </Link>

      <Link
        className={cx('share-icon')}
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleShare}
      >
        <GrTwitter />
      </Link>

      <Link
        className={cx('share-icon')}
        href={`https://web.skype.com/share?url=${encodeURIComponent(link)}&text=${encodeURIComponent(data.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleShare}
      >
        <SiSkype />
      </Link>

      <HiOutlineClipboardCopy
        className={cx('share-icon')}
        onClick={() => {
          handleCopyLink()
          handleShare()
        }}
      />
    </div>
  )
}

export default memo(ShareGroup)
