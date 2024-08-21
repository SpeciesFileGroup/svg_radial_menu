import { SVG } from './utils/svg'
import { Segment } from './slice'
import { MiddleButton } from './middleButton'
import { EventEmitter } from './utils/eventEmitter'
import {
  CircleButton,
  Slice,
  RadialMenuOptions,
  SVGAttribute
} from './types/types'

export default class RadialMenu extends EventEmitter {
  SVGAttributes: SVGAttribute
  SVGElement: SVGElement
  SVGObject: SVG
  SVGSlices: Array<Segment> = []
  centerSize: number
  height: number
  innerPosition: number = 2
  margin: number = 0
  middleButton: CircleButton
  options: RadialMenuOptions
  parentElement: HTMLElement
  rotateAngle: number = 0
  sliceSize: number
  slices: Array<Slice>
  width: number

  constructor(element: HTMLElement, opts: RadialMenuOptions) {
    super()

    const {
      centerSize,
      svgAttributes,
      height,
      innerPosition,
      margin,
      middleButton,
      rotateAngle,
      sliceSize,
      slices,
      width
    } = opts

    this.SVGObject = new SVG({
      width: `${width}px`,
      height: `${height}px`,
      ...(svgAttributes || {})
    })

    this.SVGAttributes = opts.svgAttributes || {}
    this.SVGElement = this.SVGObject.SVGElement
    this.centerSize = centerSize
    this.height = height
    this.innerPosition = innerPosition || this.innerPosition
    this.margin = margin || this.margin
    this.middleButton = middleButton || ({} as CircleButton)
    this.options = opts
    this.parentElement = element
    this.rotateAngle = rotateAngle || this.rotateAngle
    this.sliceSize = sliceSize
    this.slices = slices
    this.width = width

    this.generateMenu()
  }

  private generateMenu(): void {
    let middleButton: MiddleButton

    this.drawLevel(this.slices)
    this.SVGSlices.forEach((sliceObject) => {
      this.addEvents(sliceObject)
      this.SVGElement.appendChild(sliceObject.toSVG())
    })

    if (this.middleButton) {
      middleButton = new MiddleButton(
        this.middleButton,
        this.width / 2,
        this.height / 2,
        this.options
      )
      this.addEvents(middleButton)
      this.SVGElement.appendChild(middleButton.toSVG())
    }

    this.parentElement.innerHTML = ''
    this.parentElement.appendChild(this.SVGElement)
  }

  private drawLevel(
    slices: Array<Slice>,
    startDistance: number = this.centerSize,
    radiusStart: number = this.rotateAngle,
    endAngle: number = 360 + this.rotateAngle
  ): void {
    const sliceElements: Array<Segment> = []
    const sliceWithSize = slices.filter(({ radius }) => radius).length
    const slicesRadiusTotal = slices
      .map(({ radius }) => radius || 0)
      .reduce((a, b) => a + b, 0)

    const defaultSliceRadius: number =
      (endAngle - slicesRadiusTotal - radiusStart) /
      (slices.length - sliceWithSize)
    const centerX: number = this.width / 2
    const centerY: number = this.height / 2

    let radiusEnd = defaultSliceRadius

    slices.forEach((slice: Slice): void => {
      let startFrom = startDistance
      let radius = slice.radius || defaultSliceRadius
      const children = slice.slices

      sliceElements.push(
        new Segment(
          slice,
          centerX,
          centerY,
          startFrom,
          radiusStart,
          radius,
          this.options
        )
      )
      startFrom = startFrom + (slice?.size || this.sliceSize) + this.margin

      if (children) {
        this.drawLevel(children, startFrom, radiusStart, radiusStart + radius)
      }

      radiusEnd = radiusEnd + radius
      radiusStart = radiusStart + radius
    })

    this.SVGSlices = this.SVGSlices.concat([], sliceElements)
  }

  private addEvents(segmentObject: Segment | MiddleButton): void {
    const EVENTS = ['click', 'mousedown', 'mouseup', 'dblclick', 'contextmenu']
    const element = segmentObject.toSVG()
    const { name } = segmentObject

    EVENTS.forEach((eventName) => {
      element.addEventListener(eventName, (event) => {
        this.emit(eventName, { event, segmentObject, name })
      })
    })
  }
}
