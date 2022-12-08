import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Image from '~/config/image'
import { formatContentHTML } from '~/tools'
import { BsFillCloudCheckFill, BsFillCloudSlashFill } from 'react-icons/bs'
import { Editor } from 'tinymce'
import { ContentServer } from '~/servers'

const style = { marginLeft: '32px', fontSize: '32px', color: 'var(--primary)', display: 'flex', alignItems: 'center' }

function AutoSave({
  ID,
  content
}: {
  ID: string
  content: React.MutableRefObject<React.MutableRefObject<Editor> | undefined>
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(true)
  const [oldContent, setOldContent] = useState('')

  useEffect(() => {
    const interval = loading
      ? undefined
      : setInterval(async () => {
          setLoading(true)
          const body = {
            id: ID,
            content: formatContentHTML(content.current!.current.getContent())
          }

          if (body.content && body.content !== oldContent) {
            const res = await ContentServer.autoSave(body)

            if (res.error) {
              toast.error('Auto save failed!')
              setSuccess(false)
            } else {
              setSuccess(true)
              setOldContent(body.content)
            }
          }
          setLoading(false)
        }, 5000)
    return () => clearInterval(interval)
  }, [ID, content, loading, oldContent])

  return (
    <div style={style}>
      {loading ? (
        <Image src="/loading.svg" alt="loading..." width={32} height={32} />
      ) : success ? (
        <BsFillCloudCheckFill />
      ) : (
        <BsFillCloudSlashFill />
      )}
    </div>
  )
}

export default AutoSave
