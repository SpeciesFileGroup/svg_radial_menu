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

  public createSVGText (x: number, y: number, text: string, attr: SVGAttribute = {}, { verticalAlign }: { verticalAlign: boolean }): SVGElement {
    const stringLines: Array<string> = text.split(' ')
    const lineSize = parseInt(`${attr['font-size']}`, 10)
    const middlePosition: number = stringLines.length === 1 || !verticalAlign ? 0 : (((lineSize / 2) * -stringLines.length)) + (lineSize / 2)
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

  public describeArc (x: number, y: number, radius: number, spread: number, startAngle: number, endAngle: number): string {
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

  public polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0
    
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }
}