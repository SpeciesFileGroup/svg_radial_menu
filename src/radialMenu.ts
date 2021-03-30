import { 
  CircleButton,
  Slice,
  RadialMenuOptions 
} from './types'
import { SVG } from './utils/svg'

export class RadialMenu extends SVG {
  centerSize: number
  centerButton: CircleButton
  parentElement: HTMLElement
  options: Object
  SVGSlices: Array<SVGElement> = []
  width: number
  height: number
  sliceSize: number
  slices: Array<Slice>
  fontSize: string | number = '14px'
  fontFamily: string = 'Arial'
  textColor: string = '#FFFFFF'
  backgroundColor: string = '#FFFFFF'
  backgroundHover: string = '#CACACA'
  backgroundSelected: string = '#A0A0A0'
  sliceMargin: number = 4

  constructor (element: HTMLElement, opt: RadialMenuOptions) {
    super(opt)
    const { backgroundColor, centerSize, width, height, slices, sliceSize, centerButton, textColor, fontFamily, fontSize } = opt

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
    this.textColor = textColor || this.textColor
    this.fontSize = fontSize || this.fontSize
    this.fontFamily = fontFamily || this.fontFamily

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
      let size = slice.size || this.sliceSize
      let segment:Slice | undefined = slice
      let startFrom = this.centerSize + this.sliceMargin

      do {
        sliceElements.push(this.createSlice(segment, centerX, centerY, startFrom, size, radiusStart, radiusEnd))
        segment = segment.slice
        startFrom = startFrom + size + this.sliceMargin
        size = segment?.size || this.sliceSize
      } while(segment)

      radiusEnd = radiusEnd + radiusSlice
      radiusStart = radiusStart + radiusSlice
    })

    return sliceElements
  }

  private createSlice (slice: Slice, x: number, y: number, startFrom: number, size: number, radiusStart: number, radiusEnd: number): SVGElement {
    const elements: Array<SVGElement> = []
    const distance = (size / 2) + startFrom

    const distanceCoordinates = this.polarToCartesian(x, y, this.sliceMargin , radiusStart + (radiusEnd - radiusStart) / 2)
    const coordinates = this.polarToCartesian(distanceCoordinates.x, distanceCoordinates.y, distance, radiusStart + (radiusEnd - radiusStart) / 2)
    const sliceElement = this.createSVGElement('path', { 
        d: this.describeArc(distanceCoordinates.x, distanceCoordinates.y, startFrom, size, radiusStart, radiusEnd),
        fill: slice.backgroundColor || this.backgroundColor
      })
      // : this.createSVGCircle(x, y, this.centerSize - (this.sliceMargin * 2))
    
    let svgGroup: SVGElement

    elements.push(sliceElement)
    
    if (slice.label) {
      elements.push(this.createSVGText(coordinates.x, coordinates.y, slice.label, {
        x: coordinates.x,
        y: coordinates.y,
        fill: slice.textColor || this.textColor,
        'text-anchor': 'middle',
        'font-size': this.fontSize,
        'font-family': this.fontFamily,
        'alignment-baseline': 'center',
        'dominant-baseline': 'middle'
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
    const innerStart = this.polarToCartesian(x, y, radius, endAngle)
    const innerEnd = this.polarToCartesian(x, y, radius, startAngle)
    const outerStart = this.polarToCartesian(x, y, radius + spread, endAngle)
    const outerEnd = this.polarToCartesian(x, y, radius + spread, startAngle)
  
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  
    const d = [
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
