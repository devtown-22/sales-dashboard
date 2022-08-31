import * as React from 'react'

import { HStack, Icon, IconButton, Link, useColorMode, useColorModeValue } from '@chakra-ui/react'

import { FaMoon } from 'react-icons/fa'
import NextLink from 'next/link'
import { useSocials } from '@/hooks/app'
import siteConfig from '~/site-config'

export const PayNavbar: React.FC = () => {
  const { toggleColorMode } = useColorMode()

  return (
    <HStack as="nav" fontSize="md" spacing={0} bg={'gray.50'} p={6}>
      <a href="https://devtown.in" target={'_blank'}>
        <img
          src={'https://global-uploads.webflow.com/6077f96cf4fa19216396daaf/61a1bee63c6e040a0dd33805_LOGO.svg'}
          width={135}
          height={30}
        />
      </a>
    </HStack>
  )
}
