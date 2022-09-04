import { Box, Button, CloseButton, Divider, Flex, Heading, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getPayment } from '../utils/api'
import LabelValue from '../components/LabelValue'
import { format } from 'date-fns'
import { formatRawPriceToInr } from '../utils'

const CustomerDetailsSideModal = ({ paymentId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState(null)
  console.log({ paymentId, isOpen, onClose })

  useEffect(() => {
    setLoading(true)
    if (paymentId)
      getPayment(paymentId)
        .then(res => {
          setPayment(res.data)
          setLoading(false)
        })
        .catch(err => {
          setLoading(false)
        })
        .finally(() => {
          setLoading(false)
        })
  }, [paymentId])
  return (
    <Box
      display={isOpen ? 'block' : 'none'}
      pos={'fixed'}
      right={1}
      overflowY={'scroll'}
      top={'100px'}
      zIndex={9999}
      bg={'white'}
      height={'100Vh'}
      width={isOpen ? '36%' : '0'}
      transition={'all 0.3s linear'}
      borderRadius={'5px'}
      paddingBottom={'50px'}
    >
      <Box mx={5} my={10}>
        <Flex justifyContent={'space-between'}>
          <Heading fontSize={'xl'}>Customer Details</Heading>
          <CloseButton size={'3xl'} onClick={onClose} />
        </Flex>
        {payment ? (
          <Flex w={'100%'} flexDirection={'column'} gap={4} my={5}>
            <LabelValue label={'Name'} value={payment.payment.name} />
            <LabelValue label={'Email'} value={payment.payment.email} />
            <LabelValue label={'Phone'} value={payment.payment.phone} />
            <LabelValue label={'Total amount'} value={formatRawPriceToInr(payment.payment.order.amount)} />
            <LabelValue label={'Amount due'} value={formatRawPriceToInr(payment.payment.order.amountDue)} />
            <Divider />
            <LabelValue label={'Course'} value={payment.payment.order.products[0].details.bootcamp.name} />
            <LabelValue
              label={'Batch'}
              value={
                format(new Date(payment.payment.order.products[0].details.from), 'dd MMMM, yyyy') +
                ' to ' +
                format(new Date(payment.payment.order.products[0].details.to), 'dd MMMM, yyyy')
              }
            />
            <Divider />
            <Heading size={'md'}>Payments</Heading>
            {payment.razorpayPayments && payment.razorpayPayments.items.length > 0 ? (
              payment.razorpayPayments.items.map(payment => (
                <>
                  <LabelValue label={'Payment ID'} value={payment.id} />
                  <LabelValue label={'Amount'} value={formatRawPriceToInr(payment.amount)} />
                  <LabelValue label={'Status'} value={payment.status} />
                  <LabelValue label={'Payment Method'} value={payment.method} />
                  <LabelValue label={'Initiated at'} value={new Date(payment.created_at * 1000).toDateString()} />
                  <Divider />
                </>
              ))
            ) : (
              <LabelValue label={'Payment'} value={'No payment found'} />
            )}
          </Flex>
        ) : (
          <Flex justifyContent={'center'} alignItems={'center'} gap={5}>
            <Spinner />
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default CustomerDetailsSideModal
