import { SVG } from './utils/svg'
import { Segment } from './slice'
import { MiddleButton } from './middleButton'
import { EventEmitter } from './utils/eventEmitter'
import { 
  CircleButton,
  Slice,
  RadialMenuOptions,
  SVGAttribute
} from './types'

export default class RadialMenu extends EventEmitter {
  centerSize: number
  innerPosition: number = 2
  middleButton: CircleButton
  parentElement: HTMLElement
  options: RadialMenuOptions
  SVGSlices: Array<Segment> = []
  width: number
  height: number
  sliceSize: number
  slices: Array<Slice>
  margin: number = 0
  SVGObject: SVG
  SVGAttributes: SVGAttribute
  SVGElement: SVGElement

  constructor (element: HTMLElement, opts: RadialMenuOptions) {
    super()
    const { centerSize, width, height, slices, sliceSize, middleButton, margin, css, innerPosition } = opts

    this.SVGObject = new SVG({
      width: `${width}px`,
      height: `${height}px`,
      ...css || {}
    })

    this.SVGElement = this.SVGObject.SVGElement

    this.innerPosition = innerPosition || this.innerPosition
    this.parentElement = element
    this.options = opts
    this.width = width
    this.height = height
    this.slices = slices
    this.sliceSize = sliceSize
    this.centerSize = centerSize
    this.middleButton = middleButton || {} as CircleButton
    this.margin = margin || this.margin
    this.SVGAttributes = opts.svgAttributes || {}

    this.generateMenu()
  }

  private generateMenu (): void {
    let middleButton: MiddleButton

    this.drawLevel(this.slices)
    this.SVGSlices.forEach(sliceObject => {
      this.addEvents(sliceObject)
      this.SVGElement.appendChild(sliceObject.toSVG())
    })

    if(this.middleButton) {
      middleButton = new MiddleButton(this.middleButton, this.width / 2, this.height / 2, this.options)
      this.addEvents(middleButton)
      this.SVGElement.appendChild(middleButton.toSVG())
    }

    this.parentElement.innerHTML = ''
    this.parentElement.appendChild(this.SVGElement)
  }

  private drawLevel (slices: Array<Slice>, startDistance: number = this.centerSize, radiusStart: number = 0, endAngle: number = 360): void {
    const sliceElements: Array<Segment> = []
    const sliceWithSize = slices.filter(({ radius }) => radius).length
    const slicesRadiusTotal = 
      slices.map(({ radius }) => radius || 0)
      .reduce((a, b) => a + b, 0)

    const defaultSliceRadius: number = ((endAngle - slicesRadiusTotal) - radiusStart) / (slices.length - sliceWithSize)
    const centerX: number = this.width / 2
    const centerY: number = this.height / 2

    let radiusEnd = defaultSliceRadius

    slices.forEach((slice: Slice): void => {
      let startFrom = startDistance
      let radius = slice.radius || defaultSliceRadius
      const children = slice.slices

      sliceElements.push(new Segment(slice, centerX, centerY, startFrom, radiusStart, radius, this.options))
      startFrom = startFrom + (slice?.size || this.sliceSize) + this.margin

      if(children) {
        this.drawLevel(children, startFrom, radiusStart, radiusStart + radius)
      }

      radiusEnd = radiusEnd + radius
      radiusStart = radiusStart + radius
    })

    this.SVGSlices = this.SVGSlices.concat([], sliceElements)
  }

  private addEvents (segmentObject: Segment | MiddleButton): void {
    const element = segmentObject.toSVG()
    const { name } = segmentObject

    element.addEventListener('click', event => { this.emit('click', { event, segmentObject, name }) })
  
    element.addEventListener('dbclick', event => { this.emit('dbclick', { event, segmentObject, name }) })
  
    element.addEventListener('contextmenu', event => { this.emit('contextmenu', { event, segmentObject, name }) })
  }

}
