import { Flex, Heading, Text } from '@chakra-ui/react'

export const Label = ({ children, ...props }) => {
  return (
    <Heading fontSize={'md'} color={'black'} {...props}>
      {children}
    </Heading>
  )
}

export const Value = ({ children, ...props }) => {
  return (
    <Text fontWeight={300} fontSize={'md'} color={'black'} {...props}>
      {children}
    </Text>
  )
}

const LabelValue = ({ label, value }) => {
  return (
    <Flex justifyContent={'space-between'} gap={10}>
      <Label>{label}:</Label>
      <Flex justifyContent={'flex-start'}>
        <Value>{value}</Value>
      </Flex>
    </Flex>
  )
}

export default LabelValue
