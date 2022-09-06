import {
  Box,
  TableCaption,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Button,
  Flex,
  Heading,
  useDisclosure,
  Input,
  Radio,
  Checkbox,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getPayments, searchPayments } from '../../utils/api'
import { format } from 'date-fns'
import { formatRawPriceToInr } from '../../utils'
import Swal from 'sweetalert2'
import CustomerDetailsSideModal from '../../features/CustomerDetailsSideModal'
import { GrRefresh } from 'react-icons/gr'

const P = props => {
  const head = ['Date', 'Customer Details', 'Pre-Registration', 'Pending Amount', 'Total Amount', 'Action']
  const [payments, setPayments] = useState([])
  const [displayModal, showModal] = useState(false)
  const [loading, isLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  const [search, setSearch] = useState('')
  const [showOnlyPending, setShowOnlyPending] = useState(false)
  const [id, setId] = useState(null)

  const loadPayments = async () => {
    isLoading(true)
    const res = await getPayments()
    setPayments(res.data.payments)
    isLoading(false)
  }
  useEffect(() => {
    loadPayments()
  }, [])

  useEffect(() => {
    searchPayments(search, showOnlyPending).then(res => setPayments(res.data.payments))
  }, [search, showOnlyPending])
  return (
    <Box px-={5}>
      <Flex mx={5} my={5} gap={10} p={3}>
        <Button p={3} color={'purple'} bg={'gray.300'} disabled={loading} isLoading={loading} onClick={loadPayments}>
          <Flex gap={2}>
            Refresh <GrRefresh />
          </Flex>
        </Button>
        <Input
          width={500}
          placeholder="Search by customer name, phone number or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Checkbox
          isChecked={showOnlyPending}
          onChange={e => {
            setShowOnlyPending(e.target.checked)
          }}
        >
          Show Only Pending
        </Checkbox>
      </Flex>
      <TableContainer>
        <Table>
          <Thead color={'teal'}>
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
                          setId(p._id)
                          onOpen()
                        }}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/pay/${p.order._id}`)
                          Swal.fire('Copied to clipboard', '', 'success')
                        }}
                      >
                        Copy
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <CustomerDetailsSideModal paymentId={id} isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default P
