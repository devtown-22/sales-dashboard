import * as React from 'react'

import { Button, Heading, Icon, Stack, Wrap, WrapItem } from '@chakra-ui/react'
import { FaCode, FaArrowRight } from 'react-icons/fa'
import { NextSeo } from 'next-seo'

import siteConfig from '~/site-config'

import type { NextPage } from '@/types/next'

const HomePage: NextPage = () => {
  return (
    <>
      <NextSeo title={siteConfig.title} titleTemplate="%s" />
      <Stack h={'full'} alignItems="center" px={8} spacing={4} textAlign="center" w="full">
        <Heading size="2xl">{siteConfig.title}</Heading>
        <Heading fontWeight="normal" pb={8} size="md">
          {siteConfig.description}
        </Heading>

        <Wrap justify="center" spacing={4}>
          <WrapItem>
            <Button as="a" href={'/login'} rightIcon={<Icon as={FaArrowRight} />}>
              Continue to Login
            </Button>
          </WrapItem>
        </Wrap>
      </Stack>
    </>
  )
}

export default HomePage
