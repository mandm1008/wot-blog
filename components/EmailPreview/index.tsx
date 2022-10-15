import React, { useEffect, useState } from 'react'
import { Editor } from 'tinymce'
import classNames from 'classnames/bind'
import styles from './EmailPreview.module.scss'
import { EmailLayout } from '~/config/constants'

const cx = classNames.bind(styles)

function EmailPreview({ editorRef }: { editorRef: React.MutableRefObject<React.MutableRefObject<Editor>> }) {
  const [content, setContent] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setContent(editorRef.current.current.getContent())
    }, 5000)

    return () => clearInterval(interval)
  }, [editorRef])

  return <div className={cx('wrapper')} dangerouslySetInnerHTML={{ __html: EmailLayout(content) }}></div>
}

export default EmailPreview
