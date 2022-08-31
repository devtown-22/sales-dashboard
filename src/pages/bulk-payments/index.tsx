import { getBulkPayments } from '@/utils/api'
import { useEffect, useState } from 'react'
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import BulkPay from '@/features/BulkPay'

const BulkPayments = () => {
  const [bulkPayments, setBulkPayments] = useState([])
  const loadPayments = async () => {
    const data = await getBulkPayments()
    setBulkPayments(data.data.bulkPayments)
  }
  const head = ['Campaign Name', 'Pre-Registration', 'Total Amount', 'Action']

  useEffect(() => {
    loadPayments()
  }, [])
  return (
    <div>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              {head.map(h => (
                <Th key={h}>{h}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {bulkPayments.length ? (
              bulkPayments.map(bulkPayment => <BulkPay key={bulkPayment._id} {...bulkPayment} />)
            ) : (
              <Tr>
                <Td>No data found</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BulkPayments
