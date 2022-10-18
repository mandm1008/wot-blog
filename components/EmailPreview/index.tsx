import React, { useEffect, useState } from 'react'
import { Editor } from 'tinymce'
import classNames from 'classnames/bind'
import styles from './EmailPreview.module.scss'
import { EmailLayout } from '~/config/constants'

const cx = classNames.bind(styles)

function EmailPreview({
  editorRef,
  body
}: {
  editorRef?: React.MutableRefObject<React.MutableRefObject<Editor>>
  body?: string
}) {
  const [content, setContent] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      editorRef && setContent(editorRef.current.current.getContent())
    }, 5000)

    return () => clearInterval(interval)
  }, [editorRef])

  return <div className={cx('wrapper')} dangerouslySetInnerHTML={{ __html: EmailLayout(body || content) }}></div>
}

export default EmailPreview
