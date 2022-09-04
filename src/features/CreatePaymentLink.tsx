import { useEffect, useState } from 'react'
import { Grid, GridItem, Input, Box, Heading, FormLabel, Select, Button, Flex, Text, Alert } from '@chakra-ui/react'
import { createPaymentLink, fetchBatchesByCourse, fetchCourses, fetchProductByBatch } from '../utils/api'
import { format } from 'date-fns'
import BlockUi from 'react-block-ui'
import Swal from 'sweetalert2'

const CreateLinkForm = props => {
  const { isBulk } = props
  const [courses, setCourses] = useState([])
  const [batches, setBatches] = useState([])
  const [product, setProduct] = useState({
    name: 'No product selected, please select a course and batch',
    _id: '',
    minimumPreRegistrationAmountInRupees: 0,
    minimumSellingAmountInRupees: 0,
    minimumPreRegistrationAmount: 0,
  })
  const [isBlocking, setIsBlocking] = useState(true)
  const [createdLink, setCreatedLink] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    linkType: 'preRegistration',
    name: '',
    email: '',
    phone: '',
    sellingAmount: 0,
    minimumPreRegistrationAmount: 0,
    minAmount: 0,
    preRegistrationAmount: 0,
    campaignName: '',
    note: '',
  })
  const [courseId, setCourseId] = useState('')
  const [batchId, setBatchId] = useState('')

  const updateFormValue = e => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmitHandler = async e => {
    setIsLoading(true)
    e.preventDefault()
    const { data } = await createPaymentLink({
      ...formValues,
      preRegistrationAmount: formValues.preRegistrationAmount * 100,
      sellingAmount: formValues.sellingAmount * 100,
      courseId,
      batchId,
      productId: product._id,
      isBulk: isBulk || false,
    })
    setCreatedLink(data)
    setIsLoading(false)
  }

  const loadCourses = async () => {
    const res = await fetchCourses()
    setCourses(res.data.courses)
    setCourseId(res.data.courses[0]._id)
    setFormValues({
      ...formValues,
    })
  }

  const loadBatches = async () => {
    if (courseId) {
      const res = await fetchBatchesByCourse(courseId)
      if (res.data?.batches?.length) {
        setBatches(res.data.batches)
        setBatchId(res.data.batches[0]._id)
        setFormValues({
          ...formValues,
        })
      }
    }
  }

  const loadProduct = async () => {
    if (batchId) {
      const res = await fetchProductByBatch(batchId)
      const { product } = res.data
      if (product) {
        setProduct({
          ...product,
          minimumPreRegistrationAmountInRupees: Math.ceil(product.minimumPreRegistrationAmountInRupees / 100),
          minimumSellingAmountInRupees: Math.ceil(product.minimumSellingAmountInRupees / 100),
        })
        const values = { ...formValues }
        setFormValues({
          ...formValues,
          preRegistrationAmount: Math.ceil(product.minimumPreRegistrationAmountInRupees / 100),
          sellingAmount: Math.ceil(product.minimumSellingAmountInRupees / 100),
        })
      } else {
        setProduct({
          name: 'No product selected, please select a course and batch',
          _id: '',
          minimumPreRegistrationAmountInRupees: 0,
          minimumSellingAmountInRupees: 0,
          minimumPreRegistrationAmount: 0,
        })
      }
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    loadBatches()
  }, [courseId])

  useEffect(() => {
    loadProduct()
  }, [batchId])

  useEffect(() => {
    if (product._id) {
      setIsBlocking(false)
    } else {
      setIsBlocking(true)
    }
  }, [product])

  return (
    <Box>
      {' '}
      <Heading as="h4" size={'md'} p={5} borderRadius={'5%'}>
        {' '}
        Create {isBulk && 'Bulk Payment'} Link{' '}
      </Heading>
      <form onSubmit={onSubmitHandler}>
        <Grid mx={{
            base: '0',
            md: '50',
        }} templateColumns={
          {
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            sm: 'repeat(1, 1fr)',
          }
        } gap={6}>
          {isBulk && (
            <Box>
              <FormLabel>Campaign Name</FormLabel>
              <Input name={'campaignName'} value={formValues.campaignName} onChange={updateFormValue} />
            </Box>
          )}
          <Box>
            <FormLabel>Link Type</FormLabel>
            <Select required name={'linkType'} onChange={updateFormValue}>
              <option value={'preRegistration'}>Pre Registration Payment</option>
              <option value={'fullPay'}>Full Payment</option>
            </Select>
          </Box>

          <Box>
            <FormLabel>Course</FormLabel>
            <Select required name={'courseId'} onChange={e => setCourseId(e.target.value)}>
              {courses.length ? (
                courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </Select>
          </Box>
          <Box>
            <FormLabel>Course Batch</FormLabel>
            <Select required name={'batchId'} onChange={e => setBatchId(e.target.value)}>
              {batches.length ? (
                batches.map(batch => (
                  <option key={batch._id} value={batch._id}>
                    {format(new Date(batch.from), 'd MMMM yyyy')} - {format(new Date(batch.to), 'd MMMM yyyy')}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </Select>
          </Box>
          <Box>
            <FormLabel>Product</FormLabel>
            <Input name={'product.name'} value={product.name} disabled />
          </Box>
        </Grid>
        <BlockUi
          loader={
            <Text bg={'purple.50'} py={10}>
              Please select a valid product (batch and course) first to enter the further details
            </Text>
          }
          blocking={isBlocking}
          tag={'div'}
        >
          <Grid my={6} mx={{
            base: '0',
            md: '50',
          }} templateColumns={
            {
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              sm: 'repeat(1, 1fr)',
            }
          } gap={6}>
            {!isBulk && (
              <>
                <Box>
                  <FormLabel>Name</FormLabel>
                  <Input name={'name'} value={formValues.name} onChange={updateFormValue} required />
                </Box>
                <Box>
                  <FormLabel>Phone</FormLabel>
                  <Input name={'phone'} value={formValues.phone} onChange={updateFormValue} required />
                </Box>
                <Box>
                  <FormLabel>Email</FormLabel>
                  <Input name={'email'} value={formValues.email} onChange={updateFormValue} required />
                </Box>{' '}
              </>
            )}
            {formValues.linkType === 'preRegistration' && (
              <Box>
                <FormLabel>Pre Registration Amount (Minimum {product.minimumPreRegistrationAmountInRupees})</FormLabel>
                <Input
                  type={'number'}
                  min={product.minimumPreRegistrationAmount}
                  name={'preRegistrationAmount'}
                  value={formValues.preRegistrationAmount}
                  onChange={updateFormValue}
                  required
                />
              </Box>
            )}
            <Box>
              <FormLabel>Pitched Final Amount (Minimum {product.minimumSellingAmountInRupees})</FormLabel>
              <Input name={'sellingAmount'} value={formValues.sellingAmount} onChange={updateFormValue} required />
            </Box>
            <Box>
              <FormLabel>Note *</FormLabel>
              <Input name={'note'} value={formValues.note} onChange={updateFormValue} required placeholder={"Eg: June '22 Batch"} />
            </Box>
          </Grid>
        </BlockUi>

        <Flex w={'100%'} justify={'center'} py={10}>
          <Button
            isLoading={isLoading}
            disabled={isLoading}
            type={'submit'}
            bg={'purple'}
            color={'white'}
            _hover={{
              bg: 'purple.500',
            }}
          >
            Create {isBulk && 'Bulk Payment'} Link
          </Button>
        </Flex>

        {createdLink && (
          <Flex w={'100%'} justify={'center'}>
            <Alert width={600}>
              <Flex w={'100%'} justify={'center'} gap={10} flexDirection={'column'}>
                <Text>
                  Link created successfully for<b> {isBulk ? product.name : createdLink.order.name}</b>
                </Text>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/${isBulk ? 'create-pay' : 'pay'}/${
                        createdLink?.order?._id || createdLink?.bulkPaymentMeta?._id
                      }`,
                    )
                    Swal.fire('Copied to clipboard', '', 'success')
                    setCreatedLink(null)
                  }}
                >
                  Copy Link
                </Button>
              </Flex>
            </Alert>
          </Flex>
        )}
      </form>
    </Box>
  )
}

export default CreateLinkForm
