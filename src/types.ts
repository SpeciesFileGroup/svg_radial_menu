export type Slice = {
  backgroundColor?: string,
  textColor?: string
  name?: string,
  link?: string
  radius?: number | unknown
  label?: string
  size?: number,
  icon?: SliceIcon
  slice?: Array<Slice>
}

export type RadialMenuOptions = {
  backgroundColor?: string,
  textColor?: string,
  height: number
  width: number
  sliceSize: number,
  centerSize: number,
  fontFamily: string,
  fontSize: string | number,
  centerButton?: CircleButton,
  slices: Array<Slice>
}

export type SVGAttribute = { [key: string]: string | number }

export type CircleButton = {
  radius?: number,
  backgroundColor?: string,
  link?: string,
  label?: string,
  icon?: SliceIcon
}

export type SliceIcon = {
  width: number,
  height: number
  url: string
}
