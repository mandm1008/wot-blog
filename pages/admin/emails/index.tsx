import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from '~/styles/admin/Email.module.scss'
import Wrapper from '~/components/Wrapper'
import PathMenu from '~/components/PathMenu'
import Table from '~/components/Table'
import Button from '~/components/Button'
import { EmailServer } from '~/servers'

const cx = classNames.bind(styles)

function Email({ data }: { data: string }) {
  const [emails, setEmails] = useState<Apis.Vi_Hi<Models.Email[]>>(JSON.parse(data))
  const router = useRouter()
  const [nameNewEmail, setNameNewEmail] = useState('')

  useEffect(() => {
    setEmails(JSON.parse(data))
  }, [data])

  async function handleCreateNewEmail() {
    toast.loading('Creating new email...', { id: 'email' })
    const response = await EmailServer.create({ name: nameNewEmail })

    if (response.error) {
      toast.error('Error creating email: ' + response.error, { id: 'email' })
    } else {
      toast.success('Created email successfully!', { id: 'email' })
      router.push(`/admin/emails/${response.result.slug}/edit`)
    }
  }

  const handleCopy = useCallback(async (id: string) => {
    toast.loading('Coping...', { id: 'copy-email' })
    const response = await EmailServer.copy({ _id: id })

    if (response.error) {
      toast.error(response.error, { id: 'copy-email' })
    } else {
      toast.success('Copy email successfully!', { id: 'copy-email' })
      setEmails(response.data)
    }
  }, [])

  const fields = useMemo(
    () => [
      {
        name: 'name',
        type: 'text' as 'text',
        options: {
          link: (path: string, slug: string) => `/admin/${path}/${slug}/send`
        }
      },
      {
        name: 'sended',
        type: 'time' as 'time'
      },
      {
        name: 'slug',
        as: 'name unique',
        type: 'text' as 'text'
      }
    ],
    []
  )
  const fieldsSended = useMemo(
    () => [
      {
        name: 'name',
        type: 'text' as 'text'
      },
      {
        name: 'sended',
        type: 'time' as 'time'
      },
      {
        name: 'slug',
        as: 'name unique',
        type: 'text' as 'text'
      }
    ],
    []
  )
  const actions = useMemo(
    () => [
      {
        name: 'delete',
        handler: () => {}
      }
    ],
    []
  )

  return (
    <Wrapper
      Head={
        <Head>
          <title>Admin: Email Dashboard</title>
        </Head>
      }
    >
      <main className={cx('wrapper')}>
        <PathMenu />
        <h1 className={cx('name-page')}>Email Admin</h1>

        <div>
          <h2>$ Create new email:</h2>
          <input type="text" value={nameNewEmail} onChange={(e) => setNameNewEmail(e.target.value)} />
          <Button primary disable={!nameNewEmail} onClick={handleCreateNewEmail}>
            Create
          </Button>
        </div>

        <h2></h2>
        <Table data={emails.visible} fields={fields} actions={actions} path="emails" edit copy={handleCopy} />
        <Table data={emails.hidden} fields={fieldsSended} actions={actions} path="emails" edit copy={handleCopy} />
      </main>
    </Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import { verifyAdmin } from '~/tools/middleware'
import { getAllEmail } from '~/tools/email'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const noAdmin = await verifyAdmin(req as any)
  if (noAdmin) return noAdmin

  const emails = await getAllEmail()

  return {
    props: {
      data: JSON.stringify(emails)
    }
  }
}

export default Email
