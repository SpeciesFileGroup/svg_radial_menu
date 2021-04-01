import { Slice, SliceIcon, CircleButton, RadialMenuOptions, SVGAttribute } from './types'
import { SVG } from './utils/svg'

export class MiddleButton extends SVG {
  private backgroundColor: string = '#FFFFFF'
  private middleButton: CircleButton
  private _name: string | unknown
  private options: RadialMenuOptions
  private radius: number
  private sliceMargin: number = 4
  private textColor: string = '#FFFFFF'
  private x: number
  private y: number
  public SVGElement: SVGElement
  private SVGAttributes: SVGAttribute
  private defaultSVGAttributes: SVGAttribute

  constructor (middleButton: CircleButton, x: number, y: number, opts: RadialMenuOptions) {
    super(opts)
  
    this.options = opts
    this.middleButton = middleButton
    this.radius = middleButton.radius || opts.centerSize
    this.x = x
    this.y = y
    this._name = this.middleButton.name
    this.SVGAttributes = this.parseAttributes(middleButton.svgAttributes || {})
    this.defaultSVGAttributes = this.parseAttributes(opts.svgAttributes || {})

    this.SVGElement = this.createMiddleButton(this.x, this.y, this.radius, opts)
  }

  public toSVG (): SVGElement {
    return this.SVGElement
  }

  get name () {
    return this._name
  }

  private get getAttributes () {
    return Object.assign({}, this.defaultSVGAttributes, this.SVGAttributes)
  }

  private createMiddleButton (x: number, y: number, radius: number, opts: RadialMenuOptions): SVGElement {
    const middleButton = this.middleButton
    const elements: Array<SVGElement> = []

    const sliceElement = this.createSVGCircle(x, y, radius, {
      fill: this.SVGAttributes.fill,
      color: this.textColor
    })
    
    let svgGroup: SVGElement

    elements.push(sliceElement)
    
    if (middleButton.label) {
      elements.push(this.createSVGText(x, y, middleButton.label, 
        Object.assign({},
          this.defaultSVGAttributes,
          this.SVGAttributes,
        { fill: this.SVGAttributes.color })))
    }
    if (middleButton.icon) {
      elements.push(this.addIcon(middleButton.icon, { x, y }))
    }

    svgGroup = this.createSVGGroup(elements)

    return middleButton.link ? this.createSVGLink(svgGroup, middleButton.link) : svgGroup
  }

  private addIcon (icon: SliceIcon, { x, y }: { x: number, y: number }): SVGElement {
    const { width, height, url } = icon
    const fontSize = parseInt(this.getAttributes['font-size'].toString(), 10)
    const iconCoordinates = {
      x: x - width / 2,
      y: this.middleButton.label ? y - height - fontSize : y - height / 2
    }

    return this.createSVGImage(iconCoordinates.x, iconCoordinates.y, width, height, url) 
  }
}