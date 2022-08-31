import {
  Heading,
  Grid,
  GridItem,
  Box,
  Flex,
  SimpleGrid,
  Text,
  Spinner,
  Button,
  FormLabel,
  Input,
  Alert,
  Link,
  LightMode,
  DarkMode,
} from '@chakra-ui/react'
import { Navbar } from '@/components/navbar'
import { PayNavbar } from '@/components/pay-navbar'
import NextScript from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { createPaymentLink, getBulkPaymentMeta, getOrder, updateOrderStatus } from '@/utils/api'
import { useRouter } from 'next/router'
import { format } from 'date-fns'
import Swal from 'sweetalert2'
import LabelValue, { Label, Value } from '@/components/LabelValue'
import { AiFillCheckCircle } from 'react-icons/ai'

const PaymentPage = () => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [order, setOrder] = useState(null)
  const [isPrepaymentDone, setIsPrepaymentDone] = useState(false)
  const [payment, setPayment] = useState(null)
  const [createdLink, setCreatedLink] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const submitBtnRef = useRef(null)
  const router = useRouter()

  const [formValues, setFormValues] = useState({
    linkType: 'preRegistration',
    name: '',
    email: '',
    phone: '',
    sellingAmount: 0,
    minAmount: 0,
    preRegistrationAmount: 0,
  })

  const updateFormValue = e => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    })
  }

  const loadOrder = async () => {
    if (router.query.id) {
      const { data } = await getBulkPaymentMeta(router.query.id as string)
      console.log({ data })
      // setIsPrepaymentDone(data.order.amount - data.order.amountDue >= data.payment.preRegistrationAmount)
      setOrder({
        products: [data.bulkPaymentMeta.product],
      })
      setPayment(data.bulkPaymentMeta)
      console.log({ data })
    }
  }

  useEffect(() => {
    loadOrder()
  }, [router.query, razorpayLoaded])

  const onSubmitHandler = async e => {
    console.log('meh')
    setIsLoading(true)
    e.preventDefault()
    const { data } = await createPaymentLink({
      ...formValues,
      preRegistrationAmount: payment.preRegistrationAmount,
      sellingAmount: payment.totalAmount,
      courseId: order.products[0].details.bootcamp._id,
      batchId: order.products[0].details._id,
      productId: order.products[0]._id,
      isBulk: false,
      fromBulk: true,
      paymentBulkMetaId: payment._id,
    })
    setCreatedLink(data)
    setIsLoading(false)
  }

  if (!order) {
    return (
      <Flex justifyContent={'center'} alignItems={'center'} height={'100vh'}>
        <Spinner size="xl" />
      </Flex>
    )
  }

  return (
    <>
      <NextScript
        src={'https://checkout.razorpay.com/v1/checkout.js'}
        onLoad={() => {
          setRazorpayLoaded(true)
        }}
      />
      <DarkMode>
        <PayNavbar />
        <Box width={'100%'} bg={'gray.100'} height={'100vh'}>
          <SimpleGrid
            justifyContent={'space-between'}
            columns={{ md: 2, sm: 6 }}
            py={10}
            px={25}
            m={6}
            borderRadius={4}
            minH={'80vh'}
            bg={'white'}
          >
            <Box>
              <Flex w={'100%'} justify={'center'} alignItems={'center'} gap={5}>
                <Box
                  style={{
                    borderBottom: '3px solid #0A59DE',
                    width: '90%',
                  }}
                />

                <Heading fontSize={'3xl'} color={'black'} whiteSpace={'nowrap'}>
                  Billing Info
                </Heading>
                <Box
                  style={{
                    borderBottom: '3px solid #0A59DE',
                    width: '90%',
                  }}
                />
              </Flex>
              <Flex w={'100%'} justifyContent={'center'} my={6}>
                <Text color={'gray.500'} fontSize={'xl'} fontWeight={'semibold'}>
                  Please review your order and fill the form to pay.
                </Text>
              </Flex>
              <Flex gap={20} my={4} w={{ sm: '100%', md: '600px', lg: '600px' }}>
                <Flex w={'100%'} flexDirection={'column'} gap={4}>
                  <LabelValue label={'Program Name'} value={order?.products[0].details.bootcamp.name} />
                  <LabelValue
                    label={'Batch'}
                    value={`${format(new Date(order?.products[0].details.from), 'dd MMMM, yyyy')} to ${format(
                      new Date(order?.products[0].details.to),
                      'dd MMMM, yyyy',
                    )}`}
                  />

                  <hr />
                  <Box my={3}>
                    <LabelValue label={'Total Pending Amount'} value={'₹ ' + (payment?.totalAmount || 0) / 100} />
                  </Box>
                </Flex>
              </Flex>
            </Box>
            <Box>
              <Flex flexDirection={'column'} alignItems={'center'} w={'100%'}>
                <Heading zIndex={2} fontSize={'3xl'} color={'black'}>
                  Enter Your Details To pay
                </Heading>
                <Box zIndex={0} position={'relative'} w={300} h={4} borderRadius={'30px'} bg={'purple.300'} top={-2} />
                <Flex gap={20} my={4} w={{ sm: '100%', md: '300px', lg: '500px' }}>
                  <Flex w={'100%'} flexDirection={'column'} gap={4}>
                    <form onSubmit={onSubmitHandler}>
                      <Flex w={'100%'} flexDirection={'column'} gap={4}>
                        <Box>
                          <FormLabel color={'blue'}>Name</FormLabel>
                          <Input
                            bg={'white'}
                            borderColor={'purple'}
                            name={'name'}
                            value={formValues.name}
                            onChange={updateFormValue}
                            required
                          />
                        </Box>

                        <Box>
                          <FormLabel color={'blue'}>Phone</FormLabel>
                          <Input
                            bg={'white'}
                            borderColor={'purple'}
                            name={'phone'}
                            value={formValues.phone}
                            onChange={updateFormValue}
                            required
                          />
                        </Box>

                        <Box>
                          <FormLabel color={'blue'}>Email</FormLabel>
                          <Input
                            bg={'white'}
                            borderColor={'purple'}
                            name={'email'}
                            value={formValues.email}
                            onChange={updateFormValue}
                            required
                          />
                        </Box>
                        <button type="submit" hidden ref={submitBtnRef} />
                        <Flex w={'100%'} justifyContent={'center'} my={4}>
                          {createdLink ? (
                            <Flex flexDirection={'column'} alignItems={'center'} gap={5}>
                              <Alert status={'success'} color={'black'}>
                                Awesome! Please click on the below link to pay. (The same has been sent to your email)
                              </Alert>
                              <Link
                                color={'black'}
                                bg={'purple.100'}
                                p={1}
                                borderRadius={'2xl'}
                                href={`/pay/${createdLink?.order?._id}`}
                                target={'_blank'}
                              >
                                {location.origin + '/pay/' + createdLink?.order?._id}{' '}
                              </Link>
                            </Flex>
                          ) : (
                            <Button
                              mx={12}
                              isLoading={isLoading}
                              disabled={isLoading}
                              color={'white'}
                              bg={'purple.500'}
                              py={6}
                              _hover={{
                                bg: 'purple.700',
                                color: 'white',
                                mx: 13,
                                py: 7,
                              }}
                              transition={'all 0.2s ease-in-out'}
                              type={'submit'}
                            >
                              <Text fontSize={'2xl'}>{'Start Payment'}</Text>
                            </Button>
                          )}
                        </Flex>
                      </Flex>
                    </form>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          </SimpleGrid>
        </Box>
      </DarkMode>
    </>
  )
}

export default PaymentPage
