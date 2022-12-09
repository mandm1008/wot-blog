import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'
import NextProgressBar from 'nextjs-progressbar'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import '../styles/global.scss'
import Layout from '~/layouts'
import { UserProvider } from '~/components/store'
import Notification from '~/components/Notification'

const Scrollbar = dynamic(() => import('~/components/Scrollbar'))

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        {/* Google tag (gtag.js) */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-EHPPMQKM19"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-EHPPMQKM19');
            `
          }}
        ></script>
        {router.pathname.startsWith('/admin') || (
          <script
            async
            defer
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1096397626515313"
            crossOrigin="anonymous"
          ></script>
        )}
      </Head>

      <NextSeo
        titleTemplate="%s | WoT Blog"
        defaultTitle="WoT Blog"
        additionalLinkTags={[
          { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/180x180.png' },
          { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/32x32.png' },
          { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/16x16.png' },
          { rel: 'manifest', href: '/favicon/site.webmanifest' }
        ]}
        facebook={{
          appId: '820746182274481'
        }}
      />

      <NextProgressBar />

      <Notification />

      <UserProvider>
        <>
          <Scrollbar />

          <Layout>
            <Component {...pageProps} />
          </Layout>
        </>
      </UserProvider>
    </>
  )
}
