import Head from 'next/head'
import classNames from 'classnames/bind'

import styles from '~/styles/admin/Admin.module.scss'
import Wrapper from '~/components/Wrapper'
import Link from '~/components/Link'
import PathMenu from '~/components/PathMenu'

const cx = classNames.bind(styles)

function Admin() {
  return (
    <Wrapper
      Head={
        <Head>
          <title>Admin: Home</title>
        </Head>
      }
    >
      <main className={cx('wrapper')}>
        <PathMenu />
        <h1 className={cx('name-page')}>Home Admin</h1>
        <Link href="/admin/category" className={cx('link')}>
          # Category
        </Link>
        <Link href="/admin/posts" className={cx('link')}>
          # Posts
        </Link>
        <Link href="/admin/emails" className={cx('link')}>
          # Emails
        </Link>
      </main>
    </Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import { verifyAdmin } from '~/tools/middleware'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const noAdmin = await verifyAdmin(req as any)
  if (noAdmin) return noAdmin

  return {
    props: {}
  }
}

export default Admin
