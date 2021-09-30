export type Slice = {
  name?: string
  link?: string
  label?: string
  size?: number
  icon?: SliceIcon
  radius?: number
  innerPosition?: number
  svgAttributes?: SVGAttribute,
  slices?: Array<Slice>
}

export type RadialMenuOptions = {
  height: number
  width: number
  sliceSize: number
  centerSize: number
  margin?: number
  innerPosition?: number
  rotateAngle?: number
  middleButton?: CircleButton
  svgAttributes?: SVGAttribute
  svgSliceAttributes?: SVGAttribute
  slices: Array<Slice>
}

export type SVGAttribute = { [key: string]: string | number }
export type SVGClass = Array<string> | string

export type CircleButton = {
  radius?: number
  link?: string
  label?: string
  name?: string
  svgAttributes: SVGAttribute
  icon?: SliceIcon
}

export type SliceIcon = {
  width: number
  height: number
  url: string
}
