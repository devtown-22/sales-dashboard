import React, { ReactNode } from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react'
import { FiHome, FiTrendingUp, FiCompass, FiMenu, FiDollarSign, FiArrowUpRight } from 'react-icons/fi'
import { IconType } from 'react-icons'
import { ReactText } from 'react'
import { useRouter } from 'next/router'

interface LinkItemProps {
  name: string
  icon: IconType
  path?: string
}
const LinkItems: Array<LinkItemProps> = [
  // { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { name: 'Create Payment Link', icon: FiTrendingUp, path: '/create-link' },
  { name: 'Create Bulk Payment Link', icon: FiArrowUpRight, path: '/create-bulk-link' },
  { name: 'Payments', icon: FiCompass, path: '/payments' },
  { name: 'Bulk Payments', icon: FiDollarSign, path: '/bulk-payments' },
  // { name: 'My Payouts', icon: FiDollarSign, path: '/my-payouts' },
]

interface SidebarProps {
  children?: ReactNode
  activeItemName: string
}

export default function Sidebar({ children, activeItemName }: SidebarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { pathname, asPath } = useRouter()
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')} top={0}>
      <SidebarContent activeItemName={pathname} onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent activeItemName={pathname} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter()
  return (
    <Box
      bg={useColorModeValue('white', 'grey.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      {LinkItems.map(link => (
        <NavItem
          my={2}
          onClick={() => {
            onClose()
            router.push(link.path)
          }}
          bg={link.path === rest.activeItemName ? 'red.500' : useColorModeValue('white', 'grey')}
          key={link.name}
          icon={link.icon}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children: ReactText
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<FiMenu />} />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Devtown Sales
      </Text>
    </Flex>
  )
}
