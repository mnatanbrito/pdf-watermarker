import React from 'react'
import {Box} from '@chakra-ui/react'

type Props = {
  children?: React.ReactNode
}

const PagePreview: React.FC<Props> = ({children}: Props) => {
  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      borderColor="gray.300"
      height="320px"
      width="240px"
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Box>
  )
}

export default PagePreview
