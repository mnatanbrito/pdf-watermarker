import {WatermarkRequest} from './WatermarkRequest'

type FileExtension = '.pdf' | '.docx'

const allowedFileExtensions: FileExtension[] = ['.pdf', '.docx']

const fileExtRegex: RegExp = /\.[0-9a-z]+$/i

const isAllowedFileExtension = (fileName: string): boolean => {
  const matches = fileExtRegex.exec(fileName)
  if (!matches || matches.length === 0) {
    return false
  }

  const ext = matches[0]

  return (
    allowedFileExtensions.findIndex(
      (fileExt) => fileExt === ext.toLowerCase()
    ) !== -1
  )
}

const sendWatermarkRequest = (
  requestParams: WatermarkRequest
): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 2000))
}

export {isAllowedFileExtension, sendWatermarkRequest}
