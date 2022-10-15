import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Wrapper from '~/components/Wrapper'
import Button from '~/components/Button'
import { UserServer } from '~/servers'

function ResetPasswordPage({ error, email }: { error: string; email: string }) {
  const router = useRouter()
  const [disable, setDisable] = useState(false)

  if (!error) {
    router.push('/')
  }

  async function handleReSendEmail() {
    toast.loading('Resend email...', { id: 're-send' })
    setDisable(true)
    const res = await UserServer.active(email)

    if (res.error) {
      if ((res.error = 'Account was active!')) {
        toast.success(res.error, { id: 're-send' })
        router.push('/?emailUser=' + encodeURIComponent(email))
        return
      }

      toast.error(res.error, { id: 're-send' })
      setDisable(false)
    } else {
      toast.success('Send email successfully!', { id: 're-send' })
    }
  }

  return (
    <Wrapper
      Head={
        <Head>
          <title>Active Account</title>
        </Head>
      }
      Content={
        <>
          {error && (
            <h1 style={{ height: '160px' }}>
              {error}
              <Button primary style={{ display: 'flex' }} onClick={handleReSendEmail} disable={disable}>
                Send New Email
              </Button>
            </h1>
          )}
          {!error && (
            <div style={{ paddingBottom: '40px' }}>
              <h1>Account is active!</h1>
            </div>
          )}
        </>
      }
    ></Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import CryptoJS from 'crypto-js'
import { asyncVerify } from '~/tools/middleware'
import User from '~/models/User'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const decrypt = CryptoJS.AES.decrypt(query.encrypt as string, process.env.ENCRYPT_SECRET_KEY || '').toString(
    CryptoJS.enc.Utf8
  )
  const [token, email] = decrypt.split('/')
  const ErrorReturn = {
    props: {
      error: 'Link expired!',
      email
    }
  }

  try {
    const decoded = await asyncVerify(token, process.env.JWT_ACCESS_KEY || '')
    if (decoded && typeof decoded !== 'string') {
      await User.restore({ _id: decoded.id })

      return {
        props: {},
        redirect: {
          destination: '/?emailUser=' + encodeURIComponent(decoded.email)
        }
      }
    }

    return ErrorReturn
  } catch (e) {
    return ErrorReturn
  }
}

export default ResetPasswordPage
