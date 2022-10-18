import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRef, useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Editor } from 'tinymce'
import classNames from 'classnames/bind'

import styles from '~/styles/admin/Email.module.scss'
import Wrapper from '~/components/Wrapper'
import TinyMCE from '~/components/TinyMCE'
import EmailPreview from '~/components/EmailPreview'
import Button from '~/components/Button'
import AutoSave from '~/components/AutoSave'
import { ContentServer, EmailServer } from '~/servers'

const cx = classNames.bind(styles)

function EmailEditor({ data, saveData }: { data: string; saveData: string }) {
  const email: Models.Email = useMemo(() => JSON.parse(data), [data])
  const content: Models.Content = useMemo(() => JSON.parse(saveData), [saveData])
  const router = useRouter()
  const [nameValue, setNameValue] = useState(email.name)
  const [titleValue, setTitleValue] = useState(email.title || '')
  const valueContent = useRef<React.MutableRefObject<Editor>>({} as React.MutableRefObject<Editor>)

  async function handleUpdateEmail() {
    const content = valueContent.current!.current!.getContent()

    const data = { ...email, content, title: titleValue, name: nameValue }

    toast.loading('Saving...', { id: 'update-email' })

    ContentServer.autoSave({ id: email._id, content })

    const response = await EmailServer.edit(data)

    if (response.error) {
      toast.error('Save error: ' + response.error, { id: 'update-email' })
    } else {
      toast.success('Saved!', { id: 'update-email' })
      router.push('/admin/emails')
    }
  }

  return (
    <Wrapper
      Head={
        <Head>
          <title>Admin: Email Dashboard</title>
        </Head>
      }
    >
      <main className={cx('wrapper')}>
        <h1 className={cx('name-page')}>Email Admin</h1>
        <h2>$ Name</h2>
        <input type="text" value={nameValue} onChange={(e) => setNameValue(e.target.value)} />
        <h2>$ Title</h2>
        <input type="text" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />
        <h2>$ Preview</h2>
        <EmailPreview editorRef={valueContent} />
        <div className={cx('editor', 'head')}>
          <h2>$ Content</h2>
          <AutoSave ID={email._id} content={valueContent} />
        </div>
        <div className={cx('editor')}>
          <TinyMCE ref={valueContent}>{content.content || email.content || ''}</TinyMCE>
        </div>
        <div className={cx('controls')}>
          <Button outline href="/admin/emails">
            Cancel
          </Button>
          <Button primary onClick={handleUpdateEmail}>
            Save
          </Button>
        </div>
      </main>
    </Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import { verifyAdmin } from '~/tools/middleware'
import Email from '~/models/Email'
import Content from '~/models/Content'

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const noAdmin = await verifyAdmin(req as any)
  if (noAdmin) return noAdmin

  const email = await Email.findOne({ slug: params?.slug })
  const content = await Content.findOne({ postId: email._id })

  return {
    props: {
      data: JSON.stringify(email.toObject()),
      saveData: JSON.stringify(content.toObject())
    }
  }
}

export default EmailEditor
