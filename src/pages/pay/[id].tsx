import { Heading, Grid, GridItem, Box, Flex, SimpleGrid, Text, Spinner, Button } from '@chakra-ui/react'
import { Navbar } from '@/components/navbar'
import { PayNavbar } from '@/components/pay-navbar'
import NextScript from 'next/script'
import { useEffect, useState } from 'react'
import { getOrder, updateOrderStatus } from '@/utils/api'
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
  const router = useRouter()

  const loadOrder = async () => {
    if (router.query.id) {
      const { data } = await getOrder(router.query.id as string)
      setIsPrepaymentDone(data.order.amount - data.order.amountDue >= data.payment.preRegistrationAmount)
      setOrder(data.order)
      setPayment(data.payment)
      console.log({ data })
    }
  }

  const initPayment = () => {
    const product = order.products[0]
    console.log({
      key: 'rzp_test_lPiHgBJs1Zsvl6',
      name: product.name,
      order_id: order.razorpayOrderId,
      amount: order.amount,
      prefill: {
        name: order.name,
        email: order.email,
        contact: order.phone,
      },
    })
    const rzp = new window.Razorpay({
      key: 'rzp_test_lPiHgBJs1Zsvl6',
      name: product.name,
      order_id: order.razorpayOrderId,
      amount: order.amount,
      prefill: {
        name: order.name,
        email: order.email,
        contact: order.phone,
      },
      handler: async res => {
        try {
          await updateOrderStatus(res.razorpay_payment_id, res.razorpay_signature)
          Swal.fire('Payment Successful', '', 'success')
        } catch (e) {
          Swal.fire(
            'Payment was successful, but there was a problem at our end',
            'Please reach out to us in case of any issues. ' + 'More info:  ' + e.message,
            'info',
          )
        } finally {
          await loadOrder()
        }
      },
    })
    rzp.on()
    rzp.open()
  }

  useEffect(() => {
    loadOrder()
  }, [router.query, razorpayLoaded])

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
      <PayNavbar />
      <Box width={'100%'} bg={'gray.100'} height={'100vh'}>
        <SimpleGrid columns={{ md: 2, sm: 6 }} py={10} px={25} bg={'white'} m={6} borderRadius={4} minH={'80vh'}>
          <Box>
            <Heading zIndex={2} fontSize={'3xl'} color={'black'}>
              Student Details
            </Heading>
            <Box zIndex={0} position={'relative'} w={200} h={4} borderRadius={'30px'} bg={'purple.300'} top={-2} />
            <Flex gap={20} my={4} w={{ sm: '100%', md: '300px', lg: '500px' }}>
              <Flex w={'100%'} flexDirection={'column'} gap={4}>
                <LabelValue label={'Name'} value={order.name} />
                <LabelValue label={'Email'} value={order.email} />
                <LabelValue label={'Phone'} value={order.phone} />
                <LabelValue label={'Total Amount'} value={'₹ ' + order.amount / 100} />
              </Flex>
            </Flex>
          </Box>

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
                Please review your order and click on the button below to pay.
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
                <LabelValue label={'Phone'} value={order.phone} />
                {payment?.isPreRegistration && (
                  <Flex marginBottom={3} justifyContent={'space-between'} gap={10}>
                    <Label textDecor={isPrepaymentDone ? 'line-through' : ''} color={'purple'} fontSize={'xl'}>
                      {'Pre-Registration'}:
                    </Label>
                    <Value position={'relative'} color={'purple'} fontSize={'l'} fontWeight={'semibold'}>
                      {'₹ ' + payment?.preRegistrationAmount / 100}
                      <Text fontSize={'sm'}>(Min. Payable)</Text>
                      {isPrepaymentDone && (
                        <Box pos={'absolute'} right={'10%'} top={'-25%'}>
                          <AiFillCheckCircle size={'5rem'} opacity={'0.4'} />
                        </Box>
                      )}
                    </Value>
                  </Flex>
                )}
                <hr />
                <Box my={3}>
                  <LabelValue
                    label={'Total Pending Amount'}
                    value={'₹ ' + ('amountDue' in order ? order.amountDue : order?.amount) / 100}
                  />
                </Box>
                {order.status === 'completed' ? (
                  <Box p={5} bg={'gray.400'} fontWeight={'semibold'} borderRadius={5}>
                    Great! Your payment has been completely done. We will now see you in the program!
                  </Box>
                ) : (
                  <Button
                    mx={12}
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
                    onClick={initPayment}
                  >
                    <Text fontSize={'2xl'}>{isPrepaymentDone ? 'Make Another Payment' : 'Pay Pre-Registration'}</Text>
                  </Button>
                )}
              </Flex>
            </Flex>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  )
}

export default PaymentPage
