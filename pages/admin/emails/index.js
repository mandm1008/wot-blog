import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from '../../../styles/admin/Email.module.scss'
import Wrapper from '../../../components/Wrapper'
import PathMenu from '../../../components/PathMenu'
import Table from '../../../components/Table'
import Button from '../../../components/Button'

const cx = classNames.bind(styles)

function Email({ data }) {
  const emails = JSON.parse(data)
  const router = useRouter()
  const [nameNewEmail, setNameNewEmail] = useState('')

  async function handleCreateNewEmail() {
    toast.loading('Creating new email...', { id: 'email' })
    const response = await fetch('/api/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: nameNewEmail })
    }).then((res) => res.json())

    if (response.error) {
      toast.error('Error creating email: ' + response.error, { id: 'email' })
    } else {
      toast.success('Created email successfully!', { id: 'email' })
      router.push('/admin/emails/edit/' + response.result.slug)
    }
  }

  const fields = useMemo(
    () => [
      {
        name: 'name',
        type: 'text'
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

        <Table data={emails} fields={fields} actions={actions} path="emails" edit />
      </main>
    </Wrapper>
  )
}

import { verifyAdmin } from '../../../lib/middleware'
import EmailSchema from '../../../models/Email'
import { toObject } from '../../../lib/connect'

export async function getServerSideProps({ req }) {
  const noAdmin = await verifyAdmin(req)
  if (noAdmin) return noAdmin

  const emails = toObject(await EmailSchema.find({}))

  return {
    props: {
      data: JSON.stringify(emails)
    }
  }
}

export default Email
