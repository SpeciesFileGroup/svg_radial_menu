# SVG Radial Menu

A simple SVG radial menu
## How to run on localhost

First install dependencies:

```sh
npm install
```

To run in dev mode mode:

```sh
npm start
```

Then go to http://localhost:8080


## Installation

With NPM

```bash
npm install @sfg/svg-radial-menu
```

## Quick start

### Example

```html
<div id="svg-menu-container"></div>
```
```javascript
import RadialMenu from '@sfg/svg-radial-menu'

const element = document.querySelector('#svg-menu-container')
const myMenu = new RadialMenu(element, options)
```

### Options object
```javascript
{
  width: 500,     // SVG width
  height: 500,    // SVG height
  margin: 2,      // Space between slices
  centerSize: 30, // Size for empty space in the middle of the radial
  rotateAngle: 0,  // Start radial angle, default = 0
  
  svgAttributes: { // SVG attributes
    class: 'radial-menu'
    ...
  },

  svgSliceAttributes: { // default SVG attributes for all slices
    fontSize: 11,
    fontFamily: 'Arial',
    ...
  },

  slices: [{
    label: 'Example',
    name: 'example', // (Optional) Assign a name/id to the slice, useful to identify it on event trigger
    link: 'http://taxonworks.org', // (Optional) parameter, it will make the slice work as a link
    radius: 50, // (Optional) Set the slice radius
    icon: { // (Optional) Adds an icon to the slice
      width: 20,
      height: 20,
      url: '' // url or base64 image
    },
    slices: [ // Add another level to the menu
      {
        label: '6',
        name: 'examples counts',
        size: 26, // (Optional) Set the slice size
        svgAttributes: {
          color: '#FFFFFF',
          fill: '#006ebf'
        }
      }
    ]
  ],

  middleButton: { // Middle button
    name: center,
    radius: 28,
    name: 'middle',
    svgAttributes: {
      ...
    }
    icon: {
      ...
    }
  },
}
```

### Events

#### click, dbclick, contextmenu

```javascript
import RadialMenu from '@sfg/svg-radial-menu'

const element = document.querySelector('#svg-menu-container')
const myMenu.on('click', function (event) {
  console.log('Clicked!')
})
```

Events are triggered when a slice or middle button is clicked providing the following data:

```typescript
{ 
  event: PointerEvent, 
  name: string,
  SegmentObject: Slice | MiddleButton
}
```
