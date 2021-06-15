import React from 'react'
import {ChakraProvider} from '@chakra-ui/react'

import Wizard from './Wizard'

type Props = {}

const PDFWatermarker: React.FC<Props> = (props: Props) => {
  return (
    <ChakraProvider>
      <Wizard />
    </ChakraProvider>
  )
}

export default PDFWatermarker
