import * as React from 'react'

import { HStack } from '@chakra-ui/react'

export const PayNavbar: React.FC = () => {
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
