import { useRouter } from 'next/router'
import { useState, forwardRef, useEffect } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './UserComment.module.scss'
import { useStore } from '../store'
import Button from '../Button'
import { CloseIcon } from '../Icons'
import { CommentServer } from '~/servers'

const cx = classNames.bind(styles)

function UserComment(
  { replyId, onHidden = () => {}, onSend = () => {} }: { replyId?: string; onHidden?: () => void; onSend?: () => void },
  ref: any
) {
  const [{ user }] = useStore()
  const router = useRouter()
  const [comment, setComment] = useState('')

  function handleLogin() {
    const evt = new Event('openLogin', { bubbles: true })

    window.dispatchEvent(evt)
  }

  async function handleSendComment() {
    const data = {
      slugPost: router.query.slug as string,
      content: comment,
      replyId
    }

    const res = await CommentServer.sendComment(data)

    if (!res.error) {
      setComment('')
      onSend()
      toast.success('Send comment successfully!', { id: 'view-more-comments' })
      onHidden()
    }
  }

  useEffect(() => {
    const tx = document.getElementsByTagName('textarea')
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute('style', 'height:' + tx[i].scrollHeight + 'px;overflow-y:hidden;')
      tx[i].oninput = OnInput
    }

    function OnInput(e: any) {
      e.target.style.height = 'auto'
      e.target.style.height = e.target.scrollHeight + 'px'
    }
  }, [])

  return (
    <div className={cx('wrapper')} style={{ paddingBottom: comment ? '60px' : '0' }}>
      {!user && (
        <h4>
          You need to log in to comment: <span onClick={handleLogin}>Login now</span>
        </h4>
      )}
      {user && (
        <>
          <Image src={user.image || '/avatar.png'} alt={user.name} width={60} height={60} />
          <div className={cx('input')}>
            <textarea
              ref={ref}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comments here..."
            />
            {comment && (
              <div className={cx('controls')}>
                <Button style={{ padding: '0', margin: '0', width: '70px' }} outline onClick={() => setComment('')}>
                  Clear
                </Button>
                <Button
                  style={{ padding: '0', margin: '0', width: '70px', marginLeft: '8px' }}
                  primary
                  onClick={handleSendComment}
                >
                  Send
                </Button>
              </div>
            )}
            {replyId && (
              <div className={cx('hidden')} onClick={onHidden}>
                <CloseIcon size="12" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default forwardRef(UserComment)
