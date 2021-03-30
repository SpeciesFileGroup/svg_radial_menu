import { Slice, SliceIcon, CircleButton, RadialMenuOptions } from './types'
import { SVG } from './utils/svg'

export class Segment extends SVG {

  slice: Slice
  size: number
  options: RadialMenuOptions
  radiusStart: number
  radiusEnd: number
  startFrom: number
  x: number
  y: number
  fontSize: string | number = '14px'
  fontFamily: string = 'Arial'
  textColor: string = '#FFFFFF'
  backgroundColor: string = '#FFFFFF'
  backgroundHover: string = '#CACACA'
  backgroundSelected: string = '#A0A0A0'
  sliceMargin: number = 4

  constructor (slice: Slice, x: number, y: number, startFrom: number, radiusStart: number, radiusSlice: number, opts: RadialMenuOptions) {
    super(opts)
    
    const { sliceSize, backgroundColor, textColor } = opts
    this.options = opts
    this.slice = slice
    this.size = slice.size || sliceSize
    this.startFrom = startFrom
    this.radiusStart = radiusStart
    this.radiusEnd = radiusStart + radiusSlice
    this.x = x
    this.y = y
    this.backgroundColor = backgroundColor || this.backgroundColor
    this.textColor = textColor || this.textColor

    this.SVGElement = this.createSlice(this.x, this.y, this.startFrom, this.size, this.radiusStart, this.radiusEnd, this.options)
  }

  public toSVG (): SVGElement {
    return this.SVGElement
  }

  private createSlice (x: number, y: number, startFrom: number, size: number, radiusStart: number, radiusEnd: number, opts: RadialMenuOptions): SVGElement {
    const slice = this.slice
    const elements: Array<SVGElement> = []
    const middleSlice = (size / 2) + startFrom
    const middleRadius = (radiusEnd - radiusStart) / 2
    const distanceCoordinates = this.polarToCartesian(x, y, this.sliceMargin , radiusStart + middleRadius)
    const coordinates = this.polarToCartesian(distanceCoordinates.x, distanceCoordinates.y, middleSlice, radiusStart + middleRadius)
    const d = this.describeArc(distanceCoordinates.x, distanceCoordinates.y, startFrom, size, radiusStart, radiusEnd)

    const sliceElement = this.createSVGElement('path', { d: d, fill: slice.backgroundColor || this.backgroundColor })
    
    let svgGroup: SVGElement

    elements.push(sliceElement)
    
    if (slice.label) {
      elements.push(this.createSVGText(coordinates.x, coordinates.y, slice.label, {
        x: coordinates.x,
        y: coordinates.y,
        fill: `${slice.textColor || opts.textColor}`,
        'text-anchor': 'middle',
        'font-size': opts.fontSize,
        'font-family': opts.fontFamily,
        'alignment-baseline': 'center',
        'dominant-baseline': 'middle'
      }, {
        verticalAlign: !slice?.icon
      }))
    }
    if (slice.icon) {
      elements.push(this.addIcon(slice.icon, coordinates))
    }

    svgGroup = this.createSVGGroup(elements)

    return slice.link ? this.createSVGLink(svgGroup, slice.link) : svgGroup
  }

  private addIcon (icon: SliceIcon, { x, y }: { x: number, y: number }): SVGElement {
    const { width, height, url } = icon
    const fontSize = parseInt(this.options.fontSize.toString(), 10)
    const iconCoordinates = {
      x: x - width / 2,
      y: this.slice.label ? y - height - fontSize : y - height / 2
    }

    return this.createSVGImage(iconCoordinates.x, iconCoordinates.y, width, height, url) 
  }
}