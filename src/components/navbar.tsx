import * as React from 'react'

import { HStack, Icon, IconButton, Link, useColorMode, useColorModeValue } from '@chakra-ui/react'

import { FaMoon } from 'react-icons/fa'
import NextLink from 'next/link'
import siteConfig from '~/site-config'

export const Navbar: React.FC = () => {
  const { toggleColorMode } = useColorMode()

  return (
    <HStack as="nav" fontSize="md" p={4} spacing={0}>
      <NextLink href="/">
        <Link fontWeight="bold" href="/" p={4} variant="link">
          {siteConfig.title}
        </Link>
      </NextLink>

      <HStack flexGrow={1} justify="flex-end" p={4} spacing={{ base: 0, sm: 2 }}>
        <IconButton
          aria-label="toggle dark mode"
          color="currentColor"
          icon={<Icon as={FaMoon} boxSize={5} />}
          onClick={toggleColorMode}
          variant="link"
        />
      </HStack>
    </HStack>
  )
}
