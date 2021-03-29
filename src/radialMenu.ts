import { 
  CircleButton,
  Slice,
  RadialMenuOptions 
} from './types'
import { SVG } from './utils/svg'

export class RadialMenu extends SVG {
  centerSize: number
  centerButton: CircleButton
  SVGElement: SVGElement
  parentElement: HTMLElement
  options: Object
  SVGSlices: Array<SVGElement> = []
  width: number
  height: number
  sliceSize: number
  slices: Array<Slice>
  fontSize: string = '14px'
  textColor: string = '#FFFFFF'
  backgroundColor: string = '#FFFFFF'
  backgroundHover: string = '#CACACA'
  backgroundSelected: string = '#A0A0A0'
  sliceMargin: number = 1

  constructor (element: HTMLElement, opt: RadialMenuOptions) {
    super(opt)
    const { backgroundColor, centerSize, width, height, slices, sliceSize, centerButton } = opt

    this.SVGElement = this.createSVGElement('svg', {
      width: `${width}px`,
      height: `${height}px`
    })

    this.backgroundColor = backgroundColor || this.backgroundColor

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

  generateMenu (): void {
    this.SVGSlices = this.generateSlices()
    this.SVGSlices.forEach(element => {
      (<any>this.SVGElement).appendChild(element)
    })
    this.parentElement.replaceWith(this.SVGElement)
  }

  private generateSlices (): Array<SVGElement> {
    const radiusSlice: number = 360 / this.slices.length
    const sliceElements: Array<SVGElement> = []
    const centerX: number = this.width / 2
    const centerY: number = this.height / 2

    let radiusStart = 0
    let radiusEnd = radiusSlice

    this.slices.forEach((slice: Slice): void => {
      sliceElements.push(this.createSlice(slice, centerX, centerY, this.centerSize, this.sliceSize, radiusStart, radiusEnd))

      radiusEnd = radiusEnd + radiusSlice
      radiusStart = radiusStart + radiusSlice
    })

    return sliceElements
  }

  private createSlice (slice: Slice, x: number, y: number, startFrom: number, size: number, radiusStart: number, radiusEnd: number): SVGElement {
    const elements: Array<SVGElement> = []
    const distance = (size / 2) + startFrom
    const coordinates = this.polarToCartesian(x, y, distance , radiusStart + (radiusEnd - radiusStart) / 2)
    const sliceElement = this.centerButton.radius ? 
      this.createSVGElement('path', { 
        d: this.describeArc(x, y, startFrom, size, radiusStart, radiusEnd),
        fill: slice.backgroundColor || this.backgroundColor
      })
      : this.createSVGCircle(x, x, this.centerSize - (this.sliceMargin * 2))
    
    let svgGroup: SVGElement

    elements.push(sliceElement)
    
    if (slice.label) {
      elements.push(this.createSVGText(coordinates.x, coordinates.y, slice.label, {
        x: coordinates.x,
        dy: this.fontSize,
        fill: this.textColor,
        'text-anchor': 'middle'
      }))
    }
    if (slice.icon) {
      const { width, height, url } = slice.icon
      const imageElement = this.createSVGImage(coordinates.x - width / 2, coordinates.y - height, width, height, url)
      elements.push(imageElement)
    }

    svgGroup = this.createSVGGroup(elements)

    return slice.link ? this.createSVGLink(svgGroup, slice.link) : svgGroup
  }


  private describeArc (x: number, y: number, radius: number, spread: number, startAngle: number, endAngle: number): string {
    const innerStart = this.polarToCartesian(x, y, radius, endAngle - this.sliceMargin)
    const innerEnd = this.polarToCartesian(x, y, radius, startAngle + this.sliceMargin)
    const outerStart = this.polarToCartesian(x, y, radius + spread, endAngle - this.sliceMargin / 2)
    const outerEnd = this.polarToCartesian(x, y, radius + spread, startAngle)
  
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  
    var d = [
        'M', outerStart.x, outerStart.y,
        'A', radius + spread, radius + spread, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
        'L', innerEnd.x, innerEnd.y, 
        'A', radius, radius, 0, largeArcFlag, 1, innerStart.x, innerStart.y, 
        'L', outerStart.x, outerStart.y, 'Z'
    ].join(' ')
  
    return d
  }

  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0
    
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

}
