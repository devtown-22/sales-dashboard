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
} from '@chakra-ui/react'
import { FaUserAlt, FaLock } from 'react-icons/fa'
import { signInUserWithCredential, onAuthStateChanged, } from '../utils/firebase'
import { useRouter } from 'next/router'
import {sendResetPasswordEmail} from "@/utils/api";
const CFaUserAlt = chakra(FaUserAlt)
const CFaLock = chakra(FaLock)

const App = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const handleSubmit = async () => {
    console.log('handleSubmit')
    try {
      const credential = await signInUserWithCredential(email, password)
      console.log({ credential })
      router.replace('/dashboard')
    } catch (e) {
      console.log(e)
    }
  }

  const handleForgotPassword = async () => {
    // Prompt the user with prompt to get the email and store it in a variable
    const email = prompt('Enter your email')
    // Send the email to the backend and get the reset link
     sendResetPasswordEmail(email)
    // Show the user a message saying that the email has been sent
    alert('Email has been sent')
    // Redirect the user to the reset link



  }

  const handleShowClick = () => setShowPassword(!showPassword)

  useEffect(() => {
    onAuthStateChanged(user => {
      if (user) {
        // router.replace('/dashboard');
      }
    })
  }, [])

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <form>
            <Stack spacing={4} p="1rem"  boxShadow="md">
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
                <FormHelperText textAlign="right">
                    <Button onClick={
                        handleForgotPassword
                    }

                        backgroundColor={'transparent'}>forgot password?</Button>
                </FormHelperText>
              </FormControl>
              <Button onClick={handleSubmit} borderRadius={0} variant="solid" colorScheme="teal" width="full">
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
