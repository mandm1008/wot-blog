import Head from 'next/head'
import Wrapper from '~/components/Wrapper'
import { FormLogin } from '~/components/Form'
import PathMenu from '~/components/PathMenu'

function Admin() {
  return (
    <Wrapper
      Head={
        <Head>
          <title>Admin: Login</title>
        </Head>
      }
    >
      <main>
        <PathMenu />
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', margin: '12px 0' }}>
          <FormLogin admin />
        </div>
      </main>
    </Wrapper>
  )
}

export default Admin
