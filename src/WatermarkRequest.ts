type Position = {
  readonly x: number
  readonly y: number
}

export type WatermarkRequest = {
  readonly message: string
  readonly fontSize: number
  readonly rotation: number
  readonly position: Position
  readonly containerWidth: number
  readonly files: File[]
}
