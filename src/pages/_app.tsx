import '@/stylesheets/html.css'

import * as React from 'react'
import { Box, ChakraProvider, Stack } from '@chakra-ui/react'
import { DefaultSeo, SocialProfileJsonLd } from 'next-seo'
import Head from 'next/head'
import NProgress from 'nprogress'
import dynamic from 'next/dynamic'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { theme } from '@/theme'
import siteConfig from '~/site-config'
import '../lib/firebase'
import type { AppProps } from '@/types/next'
import Sidebar from '@/components/Sidebar'
import 'react-block-ui/style.css'

const MobileDrawer = dynamic(() => import('@/components/mobile-drawer').then(C => C.MobileDrawer))

function App(props: AppProps) {
  const { Component, pageProps, router } = props
  const { pathname, asPath } = router

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <DefaultSeo
        title="Welcome!"
        titleTemplate={`%s · ${siteConfig.title}`}
        description={siteConfig.description}
        canonical={siteConfig.url + (router.asPath || '')}
        openGraph={{
          title: siteConfig.title,
          description: siteConfig.description,
          type: 'website',
          site_name: siteConfig.title,
          images: [
            {
              url: `${siteConfig.url}/social.png`,
              width: 1024,
              height: 512,
              alt: siteConfig.title,
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          handle: siteConfig.twitterUsername,
          site: siteConfig.twitterUsername,
        }}
      />

      <SocialProfileJsonLd
        type="person"
        name={siteConfig.title}
        url={siteConfig.url}
        sameAs={Object.values(siteConfig.socials)}
      />

      <ChakraProvider resetCSS theme={theme}>
        {Component.disableLayout ? (
          <Component {...pageProps} />
        ) : (
          <>
            {pathname === '/' ||
            pathname === '/login' ||
            pathname === '/pay/[id]' ||
            pathname === '/create-pay/[id]' ||
            pathname === '/admin' ||
            pathname === '/admin-login' ? (
              <Box as="main">
                <Component {...pageProps} />
              </Box>
            ) : (
              <>
                <Navbar />
                <Sidebar activeItemName={pathname}>
                  <Component {...pageProps} />
                  <MobileDrawer />
                </Sidebar>
              </>
            )}
          </>
        )}
      </ChakraProvider>
    </>
  )
}

export default App
