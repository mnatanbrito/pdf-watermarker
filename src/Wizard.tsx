import React, {useState} from 'react'
import {
  Flex,
  VStack,
  HStack,
  Box,
  Heading,
  Button,
  Textarea,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Center,
  Input,
  Alert,
  AlertDescription,
  AlertIcon,
  CircularProgress,
} from '@chakra-ui/react'
import {motion, PanInfo} from 'framer-motion'

import {isAllowedFileExtension, sendWatermarkRequest} from './utils'
import PagePreview from './PagePreview'

type Step = 'add-message' | 'define-ratio' | 'upload-file' | 'download-file'
type Props = {}

const downsizeFactor = 0.5

const Wizard: React.FC<Props> = (props: Props) => {
  const [step, setStep] = useState<Step>('add-message')
  const [message, setMessage] = useState<string>('')
  const [fontSize, setFontSize] = useState<number>(12)
  const [rotation, setRotation] = useState<number>(0)
  const [initialPosition, setInitialPosition] = useState<any>()
  const [position, setPosition] = useState<any>()
  const [containerWidth, setContainerWidth] = useState<number>(15)
  const [file, setFile] = useState<File>()
  const [invalidFileExtension, setInvalidFileExtension] =
    useState<boolean>(false)
  const [zeroFilesSelected, setZeroFilesSelected] = useState<boolean>(false)
  const [finished, setFinished] = useState<boolean>(false)

  const noFile = file === null || file === undefined

  const goToNextPage = () => {
    switch (step) {
      case 'add-message':
        setStep('define-ratio')
        break

      case 'define-ratio':
        setStep('upload-file')
        break

      case 'upload-file':
        break
    }
  }

  const goToPreviousPage = () => {
    switch (step) {
      case 'add-message':
        break

      case 'define-ratio':
        setStep('add-message')
        break

      case 'upload-file':
        setStep('define-ratio')
        break
    }
  }

  const onChangeMessage: React.ChangeEventHandler<HTMLTextAreaElement> = (
    evt
  ) => {
    setMessage(evt.currentTarget.value)
  }

  const onChangeSize = (newSize: number) => {
    setFontSize(newSize)
  }

  const onChangeRotation = (newRotation: number) => {
    setRotation(newRotation)
  }

  const onChangeContainerWidth = (newWidth: number) => {
    setContainerWidth(newWidth)
  }

  const onDragStart = (event: MouseEvent, info: PanInfo) => {
    if (!initialPosition) {
      setInitialPosition(info.point)
    }
  }

  const onDragEnd = (event: MouseEvent, info: PanInfo) => {
    if (initialPosition) {
      const {x, y} = info.point
      const calculatedPosition = {
        x: x - initialPosition.x,
        y: y - initialPosition.y,
      }
      setPosition(calculatedPosition)
    }
  }

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setInvalidFileExtension(false)
    setZeroFilesSelected(false)

    const files = evt.target.files
    if (!files || files.length === 0) {
      setZeroFilesSelected(true)
      return
    }

    const selectedFile = files[0]
    if (!isAllowedFileExtension(selectedFile.name)) {
      setInvalidFileExtension(true)
      return
    }

    setFile(selectedFile)
  }

  const onFinish = async () => {
    setStep('download-file')

    await sendWatermarkRequest({
      message,
      fontSize,
      position,
      rotation,
      containerWidth,
      files: [file as File],
    })

    setFinished(true)
  }

  const onResetState = () => {
    setStep('add-message')
    setMessage('')
    setFontSize(12)
    setRotation(0)
    setInitialPosition(null)
    setPosition(null)
    setContainerWidth(15)
    // @ts-ignore
    setFile()
    setInvalidFileExtension(false)
    setZeroFilesSelected(false)
  }

  return (
    <Flex
      flex="1"
      direction="column"
      justify="center"
      align="center"
      bg="gray.50"
      height="100vh"
      width="100vw"
    >
      <Heading marginBottom="10" color="purple.400">
        PDF Watermarker ❤️
      </Heading>
      <Box
        width={[
          '85%', // base
          '80%', // 480px upwards
          '75%', // 768px upwards
          '50%', // 992px upwards
        ]}
        height={[
          '35%', // base
          '45%', // 480px upwards
          '55%', // 768px upwards
          '65%', // 992px upwards
        ]}
        display="flex"
        borderWidth="1px"
        rounded="lg"
        overflow="hidden"
        bg="white"
        alignItems="stretch"
        justifyContent="center"
        padding="10px"
      >
        {step === 'add-message' && (
          <VStack flex="1" spacing={8}>
            <Heading size="md">O que deseja escrever?</Heading>
            <Textarea
              placeholder="Que mensagem gostaria de estampar? Mas não pode ter mais de 140 caracteres ein?"
              onChange={onChangeMessage}
              value={message}
              maxLength={140}
              resize="none"
            />

            <Button
              color="purple.400"
              onClick={goToNextPage}
              disabled={message.length === 0}
            >
              Próxima
            </Button>
          </VStack>
        )}
        {step === 'define-ratio' && (
          <VStack
            flex="1"
            spacing={6}
            direction="column"
            justify="center"
            align="stretch"
            paddingLeft="20px"
            paddingRight="20px"
          >
            <Center>
              <Heading size="md">Agora vamos ajustar os detalhes?</Heading>
            </Center>
            <HStack flex="1" align="stretch" spacing={4}>
              <Box flex="1" align="center">
                <VStack flex="1" align="stretch" spacing={4}>
                  <VStack flex="1" align="stretch">
                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={14}
                      min={12}
                      max={48}
                      onChange={onChangeSize}
                      value={fontSize}
                    >
                      <SliderTrack bg="purple.50">
                        <SliderFilledTrack bg="purple.100" />
                      </SliderTrack>
                      <SliderThumb bg="purple.400" />
                    </Slider>
                    <Center>
                      <Text color="purple.400">
                        Tamanho da fonte: {fontSize}pt
                      </Text>
                    </Center>
                  </VStack>

                  <VStack flex="1" align="stretch">
                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={0}
                      min={-180}
                      max={180}
                      value={rotation}
                      onChange={onChangeRotation}
                    >
                      <SliderTrack bg="purple.50">
                        <SliderFilledTrack bg="purple.100" />
                      </SliderTrack>
                      <SliderThumb bg="purple.400" />
                    </Slider>
                    <Center>
                      <Text color="purple.400">
                        Ângulo de rotação: {rotation}°
                      </Text>
                    </Center>
                  </VStack>

                  <VStack flex="1" align="stretch">
                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={15}
                      min={15}
                      max={100}
                      value={containerWidth}
                      onChange={onChangeContainerWidth}
                    >
                      <SliderTrack bg="purple.50">
                        <SliderFilledTrack bg="purple.100" />
                      </SliderTrack>
                      <SliderThumb bg="purple.400" />
                    </Slider>
                    <Center>
                      <Text color="purple.400">
                        Largura do container: {containerWidth}%
                      </Text>
                    </Center>
                  </VStack>
                </VStack>
              </Box>
              <Box flex="1">
                <Center>
                  <PagePreview>
                    <motion.div
                      drag
                      dragElastic={false}
                      dragMomentum={false}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                    >
                      <Text
                        fontSize={`${fontSize * downsizeFactor}pt`}
                        color="gray.500"
                        transform={`rotate(${rotation}deg)`}
                        width={`${containerWidth}%`}
                      >
                        {message}
                      </Text>
                    </motion.div>
                  </PagePreview>
                </Center>
              </Box>
            </HStack>
            <Center>
              <HStack>
                <Button color="purple.400" onClick={goToPreviousPage}>
                  Anterior
                </Button>

                <Button
                  color="purple.400"
                  onClick={goToNextPage}
                  disabled={message.length === 0}
                >
                  Próxima
                </Button>
              </HStack>
            </Center>
          </VStack>
        )}
        {step === 'upload-file' && (
          <VStack flex="1" spacing={8}>
            <Heading size="md">Agora me dá esse arquivo aí, vai?</Heading>

            <Input type="file" size="md" onChange={onFileSelected} />

            {file && (
              <Text fontSize="14pt" color="gray.500">
                {file.name}
              </Text>
            )}

            {invalidFileExtension && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>
                  Arquivo inválido! Apenas arquivos .pdf e .docx são permitidos.
                </AlertDescription>
              </Alert>
            )}

            {zeroFilesSelected && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>
                  Não esqueceu de nada não? Cadê o arquivo?
                </AlertDescription>
              </Alert>
            )}

            <Center>
              <HStack>
                <Button color="purple.400" onClick={goToPreviousPage}>
                  Anterior
                </Button>

                <Button
                  color="purple.400"
                  onClick={onFinish}
                  disabled={invalidFileExtension || zeroFilesSelected || noFile}
                >
                  Finalizar
                </Button>
              </HStack>
            </Center>
          </VStack>
        )}
        {step === 'download-file' && (
          <VStack flex="1" spacing={8}>
            {!finished && (
              <>
                <Heading size="md">Pronto! Agora deixa comigo 😎</Heading>
                <CircularProgress isIndeterminate color="green.300" />

                <Text size="md" color="purple.400">
                  Me dá só uns segundinhos e eu já termino 👍
                </Text>
              </>
            )}
            {finished && (
              <>
                <Heading size="md">Voilà 🎉</Heading>

                <Button color="purple.400" onClick={onResetState}>
                  Quer estampar mais arquivos?
                </Button>
              </>
            )}
          </VStack>
        )}
      </Box>
    </Flex>
  )
}

export default Wizard
