import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'
import styles from '~/styles/admin/Email.module.scss'
import Wrapper from '~/components/Wrapper'
import EmailPreview from '~/components/EmailPreview'
import Button from '~/components/Button'
import { EmailServer } from '~/servers'

const cx = classNames.bind(styles)

function SendEmail({ data }: { data: string }) {
  const router = useRouter()
  const email: Models.Email = JSON.parse(data)

  function handleCancel() {
    router.back()
  }

  async function handleSend() {
    toast.loading('Send email...', { id: 'send-email' })
    const res = await EmailServer.send(email._id)

    if (res.error) {
      toast.error(res.error, { id: 'send-email' })
    } else {
      toast.success('Send email successfully!', { id: 'send-email' })
      router.push('/admin/emails')
    }
  }

  return (
    <Wrapper
      Head={
        <Head>
          <title>{`Preview Email: ${email.name}`}</title>
        </Head>
      }
    >
      <div className={cx('wrapper')}>
        <h3>Preview: {email.name}</h3>
        <h4>Title: {email.title}</h4>
        <EmailPreview body={email.content} />

        <Button onClick={handleCancel} outline>
          Cancel
        </Button>
        <Button onClick={handleSend} primary>
          Send
        </Button>
      </div>
    </Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import { verifyAdmin } from '~/tools/middleware'
import Email from '~/models/Email'

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const noAdmin = await verifyAdmin(req as any)
  if (noAdmin) return noAdmin

  const email = (await Email.findOne({ slug: params?.slug }))?.toObject()

  return {
    props: {
      data: JSON.stringify(email || '')
    }
  }
}

export default SendEmail
