export type Slice = {
  name?: string,
  link?: string
  label?: string
  size?: number,
  icon?: SliceIcon
  radius?: number
  svgAttributes?: SVGAttribute,
  slices?: Array<Slice>
}

export type RadialMenuOptions = {
  height: number
  width: number
  sliceSize: number,
  centerSize: number,
  margin?: number,
  css: SVGAttribute,
  middleButton?: CircleButton,
  svgAttributes?: SVGAttribute,
  slices: Array<Slice>
}

export type SVGAttribute = { [key: string]: string | number }

export type CircleButton = {
  radius?: number,
  link?: string,
  label?: string,
  name?: string,
  svgAttributes: SVGAttribute
  icon?: SliceIcon
}

export type SliceIcon = {
  width: number,
  height: number
  url: string
}
