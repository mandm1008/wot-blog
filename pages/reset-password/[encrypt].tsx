import Head from 'next/head'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Wrapper from '~/components/Wrapper'
import Button from '~/components/Button'
import { FormSendResetPassword } from '~/components/Form'
import { UserServer } from '~/servers'

function ResetPasswordPage({ error, user = '{}', email }: { error?: string; email?: string; user: string }) {
  const [disable, setDisable] = useState(false)
  const data: Apis.ApiUser.ResetPasswordToken = JSON.parse(user)

  async function handleReSendEmail() {
    toast.loading('Resend email...', { id: 're-send' })
    setDisable(true)
    const res = await UserServer.resetPassword({ email: email || '' })

    if (res.error) {
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
          <title>Reset Password: {data.name}</title>
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
              <FormSendResetPassword data={data} />
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const decrypt = CryptoJS.AES.decrypt(query.encrypt as string, process.env.ENCRYPT_SECRET_KEY || '').toString(
    CryptoJS.enc.Utf8
  )
  const [token, email] = decrypt.split('/')

  try {
    const decoded = await asyncVerify(token, process.env.JWT_ACCESS_KEY || '')

    return {
      props: {
        user: JSON.stringify(decoded)
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        error: 'Link expired!',
        email
      }
    }
  }
}

export default ResetPasswordPage
