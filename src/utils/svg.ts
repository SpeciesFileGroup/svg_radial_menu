import { SVGAttribute } from '../types'
export class SVG {

  SVGElement: SVGElement

  constructor (options: any) {
    this.SVGElement = this.createSVGElement('svg', options)
  }

  public createSVGElement (tag: string, attr: SVGAttribute = {}): SVGElement {
    const SVGElement = document.createElementNS('http://www.w3.org/2000/svg', tag)
    
    this.SetSVGAttributes(SVGElement, attr)

    return SVGElement
  }

  public SetSVGAttributes (SVGElement: SVGElement, attr: SVGAttribute) {
    for (let key in attr) {
      SVGElement.setAttribute(key, `${attr[key]}`)
    }
  }

  public createSVGCircle (cx: number, cy: number, r: number, attr: SVGAttribute = {}): SVGElement {
    const circleElement = this.createSVGElement('circle', attr)

    this.SetSVGAttributes(circleElement, {
      cx,
      cy,
      r,
      ...attr
    })

    return circleElement
  }

  public createSVGImage (x: number, y: number, width: number, height: number, url: string): SVGElement {
    const imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image')

    imageElement.setAttribute('x', `${x}px`)
    imageElement.setAttribute('y', `${y}px`)
    imageElement.setAttribute('width', `${width}px`)
    imageElement.setAttribute('height', `${height}px`)
    imageElement.setAttribute('href', url)

    return imageElement
  }

  public createSVGLink (nodeChild: SVGElement, link: string): SVGElement {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'a')

    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link)
    element.append(nodeChild)

    return element
  }

  public createSVGText (x: number, y: number, text: string, attr: SVGAttribute = {}, opt: object = {}): SVGElement {
    const { verticalAlign } = opt
    const stringLines: Array<string> = text.split(' ')
    const lineSize = parseInt(`${attr['font-size']}`, 10)
    const middlePosition = stringLines.length === 1 || !verticalAlign ? 0 : (lineSize * stringLines.length) / 2 * -1
    const tspanLines = stringLines.map((line: string, index: number): SVGElement => {
      const tspan = this.createSVGElement('tspan', attr)
      const dy = index ? lineSize : middlePosition
      tspan.setAttribute('dy', `${dy}px`)

      tspan.removeAttribute('y')
      tspan.textContent = line

      return tspan
    })
    
    return this.createSVGGroup(tspanLines, 'text', {
      x, y, dy: 0,
    })
  }

  public createSVGGroup (elements: Array<SVGElement>, tag: string = 'g', attr: SVGAttribute = {}): SVGElement {
    const SVGElement =  this.createSVGElement(tag, attr)

    elements.forEach((element: SVGElement) => {
      SVGElement.appendChild(element)
    })

    return SVGElement
  }
}