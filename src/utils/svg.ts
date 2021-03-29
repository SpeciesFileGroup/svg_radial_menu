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

  public createSVGText (x: number, y: number, text: string, attr: SVGAttribute = {}): SVGElement {
    const stringLines: Array<string> = text.split(' ')
    const tspanLines = stringLines.map((line: string): SVGElement => {
      const tspan = this.createSVGElement('tspan', attr)
      tspan.setAttribute('x', `${x}px`)
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