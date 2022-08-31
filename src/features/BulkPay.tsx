import {FC, useEffect, useState} from 'react'
import {Box, Button, Flex, Table, Tbody, Td, Text, Th, Thead, toast, Tr, useToast} from '@chakra-ui/react'
import { BiDownArrow, BiRightArrow } from 'react-icons/all'
import {getPaymentsByBulkId} from "@/utils/api";
import {format} from "date-fns";
import {formatRawPriceToInr} from "@/utils";
import Swal from "sweetalert2";
import CustomerDetailsSideModal from "@/features/CustomerDetailsSideModal";

const BulkPay: FC<{ _id: string; campaignName: string; preRegistrationAmount: string; totalAmount: string }> = ({
  _id,
  campaignName,
  preRegistrationAmount,
  totalAmount,
}) => {
  const [payments, setPayments] = useState([])
  const head = ['Date', 'Customer Details', 'Pre-Registration', 'Pending Amount', 'Total Amount', 'Action']
  const [isCollapsed, collapse] = useState(true)

  const [isOpen, setIsOpen] = useState(false)
  const [paymentId, setPaymentId] = useState(null)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const toggle = () => collapse(!isCollapsed)
  const toast = useToast()

  useEffect(() => {
    !isCollapsed && getPaymentsByBulkId(_id).then(res => {
      setPayments(res.data.payments)
    })
  }, [isCollapsed])
  return (
    <>
      <Tr>
        <Td>
          <Flex alignItems={'center'} gap={5} onClick={toggle} cursor={'pointer'}>
            {isCollapsed ? <BiRightArrow /> : <BiDownArrow />}
            <Text>{campaignName}</Text>

          </Flex>
            {!isCollapsed &&
                <Tr>
                    {/*<Table marginLeft={10} borderColor={'red'} borderStyle={'solid'} borderWidth={1}>*/}
                        <Thead>
                            <Tr>
                                {head.map(h => (
                                    <Th key={h}>{h}</Th>
                                ))}
                            </Tr>
                        </Thead>
                  <Tbody>
                    {payments.length &&
                        payments.map(p => (
                            <Tr key={p.id}>
                              <Td>{format(new Date(p.createdAt), 'dd MMMM, yyyy')}</Td>
                              <Td>{p.order.name}</Td>
                              <Td>{formatRawPriceToInr(p.preRegistrationAmount)}</Td>
                              <Td>{formatRawPriceToInr(p.order.amountDue)}</Td>
                              <Td>{formatRawPriceToInr(p.order.amount)}</Td>
                              <Td>
                                <Flex gap={4} justify={'center'}>
                                  <Button
                                      onClick={() => {
                                        console.log(p._id)
                                        setPaymentId(p._id)
                                        onOpen()
                                      }}
                                  >
                                    View
                                  </Button>
                                  <Button
                                      onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/pay/${p.order._id}`)
                                        toast({
                                            title: 'Copied to clipboard',
                                        })
                                      }}
                                  >
                                    Copy
                                  </Button>
                                </Flex>
                              </Td>
                            </Tr>
                        ))}
                  </Tbody>
                    {/*</Table>*/}
                </Tr>}
        </Td>

        {isCollapsed && <><Td>{preRegistrationAmount}</Td>
          <Td>{totalAmount}</Td>
          <Td><Button onClick={() => {
            window.navigator.clipboard.writeText(location.origin + '/create-pay/' +_id)
            toast({
              title: 'Link copied to clipboard'
            })
          }}>
            Copy
          </Button></Td>

        </>}
      </Tr>
      <CustomerDetailsSideModal paymentId={paymentId} isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default BulkPay
