import Script from 'next/script'
import { useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useStore, actions } from '../components/store'
import { UserServer } from '~/servers'

type Props = {
  onFinish?: () => void
}
type GoogleResponse = {
  sub: string
  name: string
  email: string
  picture: string
}

declare global {
  interface Window {
    signIn: (res: GoogleResponse) => Promise<void>
  }
}

function Google({ onFinish = () => {} }: Props) {
  const [state, dispatch] = useStore()

  const signIn = useCallback(
    async (res: GoogleResponse) => {
      toast.loading('Login...', { id: 'login' })
      const { accessToken, ...data } = await UserServer.loginGoogle(res)

      localStorage.setItem('accountToken', accessToken || '')
      dispatch(actions.setUser(data))
      toast.success('Login successfully!', { id: 'login' })
      onFinish()
    },
    [dispatch, onFinish]
  )

  useEffect(() => {
    window.signIn = signIn
  }, [signIn])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async defer />
      <div
        id="g_id_onload"
        data-client_id="245715601788-tl0g1hr80allelr2ae3g61q2rarrccf8.apps.googleusercontent.com"
        data-callback="signIn"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="filled_blue"
        data-text="continue_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </>
  )
}

export default Google
