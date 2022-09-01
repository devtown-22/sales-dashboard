import { useEffect, useState } from 'react'
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  Alert,
} from '@chakra-ui/react'
import { FaUserAlt, FaLock } from 'react-icons/fa'
import { signInUserWithCredential, onAuthStateChanged } from '../utils/firebase'
import { useRouter } from 'next/router'
import { loginAdmin } from '@/utils/api'
const CFaUserAlt = chakra(FaUserAlt)
const CFaLock = chakra(FaLock)

const App = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const handleSubmit = async () => {
    setLoading(true)
    console.log('handleSubmit')
    try {
      const credential = await loginAdmin(email, password)
      sessionStorage.adminToken = credential.data.token
      setLoading(false)
      router.push('/admin')
    } catch (e) {
      setLoading(false)
      setError('Please check your credentials')
      console.log(e)
    }
  }

  const handleShowClick = () => setShowPassword(!showPassword)

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Admin Login</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <form>
            <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<CFaUserAlt color="gray.300" />} />
                  <Input
                    type="email"
                    placeholder="email address"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" children={<CFaLock color="gray.300" />} />
                  <Input
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {/*<FormHelperText textAlign="right">*/}
                {/*    <Link>forgot password?</Link>*/}
                {/*</FormHelperText>*/}
              </FormControl>
              <Alert status="error" display={error ? 'block' : 'none'}>
                {error}
              </Alert>
              <Button
                isLoading={loading}
                disabled={loading}
                onClick={handleSubmit}
                borderRadius={0}
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  )
}

export default App
