import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from '../../../../styles/admin/Email.module.scss'
import Wrapper from '../../../../components/Wrapper'
import TinyMCE from '../../../../components/TinyMCE'
import EmailPreview from '../../../../components/EmailPreview'
import Button from '../../../../components/Button'
import AutoSave from '../../../../components/AutoSave'

const cx = classNames.bind(styles)

function EmailEditor({ data, saveData }) {
  const email = JSON.parse(data)
  const content = JSON.parse(saveData)
  const router = useRouter()
  const valueContent = useRef()

  console.log(email)

  async function handleUpdateEmail() {
    const content = valueContent.current.current && valueContent.current.current.getContent()

    const data = { ...email, content }

    toast.loading('Saving...', { id: 'update-email' })

    fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: email._id, content })
    })

    const response = await fetch('/api/emails', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => res.json())

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
        <h2>
          $ Name: <i>{email.name}</i>
        </h2>
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

import { verifyAdmin } from '../../../../lib/middleware'
import Email from '../../../../models/Email'
import Content from '../../../../models/Content'

export async function getServerSideProps({ req, params }) {
  const noAdmin = await verifyAdmin(req)
  if (noAdmin) return noAdmin

  const email = await Email.findOne({ slug: params.slug })
  const content = await Content.findOne({ postId: email._id })

  return {
    props: { data: JSON.stringify(email.toObject()), saveData: JSON.stringify(content.toObject()) }
  }
}

export default EmailEditor
