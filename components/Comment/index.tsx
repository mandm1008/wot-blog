import { useCallback, useState, memo, useRef, useEffect } from 'react'
import Image from '~/config/image'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Comment.module.scss'
import { getTimeInText, hm } from '~/tools'
import UserComment from '../UserComment'
import { useStore } from '../store'
import { CommentServer } from '~/servers'

const cx = classNames.bind(styles)

interface dataComment extends Apis.CommentWithUser {
  listReply?: Apis.CommentWithUser[]
}

function Comment({
  data,
  onReply,
  onSend = () => {}
}: {
  data: dataComment
  onReply?: () => void
  onSend?: () => void
}) {
  const [{ user, layout }] = useStore()
  const [isReply, setIsReply] = useState(false)
  const [focus, setFocus] = useState(false)
  const inputComment = useRef<HTMLInputElement>()

  const handleReply = useCallback(() => {
    setIsReply((prev) => !prev)
    setFocus((prev) => !prev)
  }, [])
  const handleHidden = useCallback(() => {
    setIsReply(false)
  }, [])
  async function handleDelete() {
    const res = await CommentServer.deleteComment({ id: data._id })

    if (!res.error) {
      onSend()
      toast.success('Deleted!')
    } else {
      toast.error(res.error)
    }
  }

  useEffect(() => {
    inputComment.current && inputComment.current.focus()
  }, [focus])

  return (
    <div className={cx('wrapper')}>
      <div className={cx('user')}>
        <Image src={data.user.image || '/avatar.png'} alt={data.user.name} width={64} height={64} />
        <div className={cx('title')}>
          <h4>
            <span>{data.user.name}</span> says
          </h4>
          <p>
            {getTimeInText(data.updatedAt)} at {hm(data.updatedAt)}
          </p>
        </div>
      </div>

      <p className={cx('content')}>{data.content}</p>

      <div className={cx('controls')}>
        <span onClick={onReply || handleReply}>Reply</span>
        {data.user &&
          user &&
          data.user &&
          user._id === data.user._id &&
          (layout === 3 ? (
            <Tippy content="Double Click!" placement="bottom" appendTo={() => document.body}>
              <span onClick={(e) => e.detail === 2 && handleDelete()}>Delete</span>
            </Tippy>
          ) : (
            <span onClick={handleDelete}>Delete</span>
          ))}
      </div>

      {data.listReply &&
        data.listReply.length > 0 &&
        data.listReply.map((reply) => <Comment key={reply._id} data={reply} onReply={handleReply} onSend={onSend} />)}
      {data.listReply && !onReply && isReply && (
        <div className={cx('reply-box')}>
          <UserComment ref={inputComment} replyId={data._id} onHidden={handleHidden} onSend={onSend} />
        </div>
      )}
    </div>
  )
}

export default memo(Comment)
