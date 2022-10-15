import React, { memo, useEffect, useRef, useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Interactive.module.scss'
import { useStore } from '../store'
import { useDebounce } from '~/hooks'
import { SharedIcon } from '../Icons'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import { HiInformationCircle } from 'react-icons/hi'
import { PostServer } from '~/servers'

const cx = classNames.bind(styles)

interface Props {
  id: string
  view?: string[]
  like?: string[]
  share?: string[]
  fixedTop?: number
}

function Interactive({ id, view = [], like = [], share = [], fixedTop = 80 }: Props) {
  const [{ user }] = useStore()
  const liked = useMemo(() => !!user && like.includes(user._id), [like, user])
  const [isLike, setIsLike] = useState(liked)
  const [topPosition, setTopPosition] = useState(0)
  const wrapperElement = useRef<HTMLDivElement>()
  const innerElement = useRef<HTMLDivElement>()
  const debounceValue = useDebounce(topPosition, 300)

  async function handleLike() {
    if (user === null) {
      const evt = new Event('openLogin')
      toast('You need to login!', {
        icon: <HiInformationCircle style={{ fontSize: '2.8rem', color: 'blue' }} />
      })
      window.dispatchEvent(evt)
    } else {
      const res = await PostServer.counter({ type: 'like', id, idUser: user._id })

      if (res.error) {
        console.log(res.error)
      } else {
        setIsLike(true)
      }
    }
  }

  useEffect(() => {
    setIsLike(liked)
  }, [liked])

  useEffect(() => {
    function handler() {
      if (wrapperElement.current && innerElement.current) {
        const top = wrapperElement.current.offsetTop - fixedTop
        const bottom = wrapperElement.current.offsetTop + wrapperElement.current.offsetHeight
        const height = innerElement.current.offsetHeight
        const offset = window.scrollY - top

        setTopPosition(setOffset(top, bottom, height, offset))
      }

      function setOffset(top: number, bottom: number, height: number, offset: number) {
        if (offset < 0) return 0
        const max = top + offset + height + fixedTop
        return max > bottom ? bottom - height - top - fixedTop : offset
      }
    }

    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [fixedTop, id])

  return (
    <div ref={wrapperElement as React.LegacyRef<HTMLDivElement>} className={cx('wrapper')}>
      <div
        ref={innerElement as React.LegacyRef<HTMLDivElement>}
        className={cx('inner')}
        style={{ top: debounceValue + 'px' }}
      >
        <div className={cx('item', 'view')}>{view.length + 1}</div>

        <div className={cx('item', 'like')} onClick={isLike ? () => {} : handleLike}>
          <div className={cx('item', 'like', { liked: isLike })}>{isLike ? <AiFillLike /> : <AiOutlineLike />}</div>
          <div className={cx('item', 'like')}>{like.length + (isLike && !liked ? 1 : 0)}</div>
        </div>

        <div className={cx('item', 'share')}>
          <div className={cx('item', 'like')}>
            <SharedIcon size="12" />
          </div>
          <div className={cx('item', 'like')}>{share.length}</div>
        </div>
      </div>
    </div>
  )
}

export default memo(Interactive)
