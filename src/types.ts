export type Slice = {
  backgroundColor?: string,
  color?: string
  event?: string,
  link?: string
  radius?: number | unknown
  label?: string
  icon?: SliceIcon
}

export type RadialMenuOptions = {
  backgroundColor?: string,
  color?: string,
  height: number
  width: number
  sliceSize: number,
  centerSize: number,
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

type SliceIcon = {
  width: number,
  height: number
  url: string
}
