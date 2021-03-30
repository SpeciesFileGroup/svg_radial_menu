import { SVG } from './utils/svg'
import { Segment } from './slice'
import { EventEmitter } from './utils/eventEmitter'
import { 
  CircleButton,
  Slice,
  RadialMenuOptions 
} from './types'

export class RadialMenu extends EventEmitter {
  centerSize: number
  centerButton: CircleButton
  parentElement: HTMLElement
  options: RadialMenuOptions
  SVGSlices: Array<Segment> = []
  width: number
  height: number
  sliceSize: number
  slices: Array<Slice>
  sliceMargin: number = 4
  SVGObject: SVG
  SVGElement: SVGElement

  constructor (element: HTMLElement, opt: RadialMenuOptions) {
    super()
    const { centerSize, width, height, slices, sliceSize, centerButton } = opt

    this.SVGObject = new SVG({
      width: `${width}px`,
      height: `${height}px`
    })

    this.SVGElement = this.SVGObject.SVGElement

    this.parentElement = element
    this.options = opt
    this.width = width
    this.height = height
    this.slices = slices
    this.sliceSize = sliceSize
    this.centerSize = centerSize
    this.centerButton = centerButton ? centerButton : {}

    this.generateMenu()
  }

  private generateMenu (): void {
    this.drawLevel(this.slices)
    this.SVGSlices.forEach(svgObject => {
      this.addEvents(svgObject)
      this.SVGElement.appendChild(svgObject.toSVG())
    })
    this.parentElement.innerHTML = ''
    this.parentElement.appendChild(this.SVGElement)
  }

  private drawLevel (slices: Array<Slice>, startDistance: number = this.centerSize, radiusStart: number = 0, endAngle: number = 360): void {
    const radiusSlice: number = (endAngle - radiusStart) / slices.length
    const sliceElements: Array<Segment> = []
    const centerX: number = this.width / 2
    const centerY: number = this.height / 2

    let radiusEnd = radiusSlice

    slices.forEach((slice: Slice): void => {
      let segment:Slice | undefined = slice
      let startFrom = startDistance + this.sliceMargin
      const children = segment.slice

      sliceElements.push(new Segment(segment, centerX, centerY, startFrom, radiusStart, radiusSlice, this.options))
      startFrom = startFrom + (segment?.size || this.sliceSize)

      if(children) {
        this.drawLevel(children, startFrom, radiusStart, radiusEnd)
      }

      radiusEnd = radiusEnd + radiusSlice
      radiusStart = radiusStart + radiusSlice
    })

    this.SVGSlices = this.SVGSlices.concat([], sliceElements)
  }

  private createSegments (segment: Slice | Array<Slice>, x: number, y: number, startFrom: number, radiusStart: number, radiusEnd: number, options: object):Array<Segment> {
    const radiusSlice = radiusStart + radiusEnd - radiusStart
    if(Array.isArray(segment)) {
      const radius = radiusSlice / segment.length
      return segment.map((s, index) => {
        return new Segment(s, x, y, startFrom, radiusStart + radius * index, radius, this.options)
      })
    } else {
      return [new Segment(segment, x, y, startFrom, radiusStart, radiusSlice, this.options)]
    }
  }

  private addEvents (segmentObject: Segment): void {
    const element = segmentObject.toSVG()
    const { name } = segmentObject.slice

    element.addEventListener('click', event => { this.emit('click', { event, segmentObject, name }) })
  
    element.addEventListener('dbclick', event => { this.emit('dbclick', { event, segmentObject, name }) })
  
    element.addEventListener('contextmenu', event => { this.emit('contextmenu', { event, segmentObject, name }) })
  }

}
