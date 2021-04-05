import { Slice, SliceIcon, RadialMenuOptions, SVGAttribute } from './types/types'
import { SVG } from './utils/svg'

export class Segment extends SVG {
  private slice: Slice
  private backgroundColor: string = '#FFFFFF'
  private _name: string | unknown
  private options: RadialMenuOptions
  private radiusEnd: number
  private radiusStart: number
  private size: number
  private margin: number = 0
  private startFrom: number
  private textColor: string = '#FFFFFF'
  private SVGAttributes: SVGAttribute
  private defaultSVGAttributes: SVGAttribute
  private x: number
  private y: number
  private innerPosition: number = 2

  constructor (slice: Slice, x: number, y: number, startFrom: number, radiusStart: number, radiusSlice: number, opts: RadialMenuOptions) {
    super(opts)
    
    const { sliceSize, margin } = opts
    this.options = opts
    this.slice = slice
    this._name = slice.name
    this.size = slice.size || sliceSize
    this.startFrom = startFrom
    this.radiusStart = radiusStart
    this.radiusEnd = radiusStart + radiusSlice
    this.x = x
    this.y = y
    this.margin = margin || this.margin
    this.SVGAttributes = this.parseAttributes(slice.svgAttributes || {})
    this.defaultSVGAttributes = this.parseAttributes(opts.svgAttributes || {})
    this.innerPosition = slice.innerPosition || opts.innerPosition || this.innerPosition

    if ((this.radiusEnd - this.radiusStart) >= 360) {
      this.radiusEnd = 359.999
      this.margin = 0
    }
  
    this.SVGElement = this.createSlice(this.x, this.y, this.startFrom, this.size, this.radiusStart, this.radiusEnd, this.options)
  }

  public toSVG (): SVGElement {
    return this.SVGElement
  }

  private createSlice (x: number, y: number, startFrom: number, size: number, radiusStart: number, radiusEnd: number, opts: RadialMenuOptions): SVGElement {
    const slice = this.slice
    const elements: Array<SVGElement> = []
    const middleSlice = (size / this.innerPosition) + startFrom
    const middleRadius = (radiusEnd - radiusStart) / 2
    const distanceCoordinates = this.polarToCartesian(x, y, this.margin, radiusStart + middleRadius)
    const coordinates = this.polarToCartesian(distanceCoordinates.x, distanceCoordinates.y, middleSlice, radiusStart + middleRadius)
    const d = this.describeArc(distanceCoordinates.x, distanceCoordinates.y, startFrom, size, radiusStart, radiusEnd)
    const sliceElement = this.createSVGElement('path', Object.assign({}, this.getAttributes, { d: d }))
    let svgGroup: SVGElement

    elements.push(sliceElement)

    if (slice.label) {
      const iconSize = (slice?.icon?.height || 0)

      elements.push(this.createSVGText(coordinates.x, (coordinates.y + iconSize / 2) , slice.label, Object.assign({},
        this.defaultSVGAttributes,
        this.SVGAttributes,
      { fill: this.SVGAttributes.color || this.defaultSVGAttributes.color })))
    }
    if (slice.icon) {
      elements.push(this.addIcon(slice.icon, coordinates))
    }

    svgGroup = this.createSVGGroup(elements)

    return slice.link ? this.createSVGLink(svgGroup, slice.link) : svgGroup
  }

  public get name (): string | unknown {
    return this._name
  }

  private get fontSize (): number {
    return parseInt(`${this.getAttributes['font-size'] || 11}`, 10)
  }

  private get getAttributes (): SVGAttribute {
    return Object.assign({}, this.defaultSVGAttributes, this.SVGAttributes)
  }

  private addIcon (icon: SliceIcon, { x, y }: { x: number, y: number }): SVGElement {
    const { width, height, url } = icon
    const iconCoordinates = {
      x: x - width / 2,
      y: this.slice.label ? y - (height/2) - (this.getTextSize(this.slice.label)) : y - (height / 2)
    }

    return this.createSVGImage(iconCoordinates.x, iconCoordinates.y, width, height, url) 
  }

  private getTextSize (label: string): number {
    const stringLines = label.split(' ').length

    return (stringLines * this.fontSize) / 2
  }
}