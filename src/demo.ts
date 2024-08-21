import './styles.css'
import RadialMenu from './radialMenu'
import testIcon from './assets/icon'

const options = {
  width: 1000,
  height: 600,
  sliceSize: 120,
  centerSize: 40,
  margin: 2,
  rotateAngle: 0,
  svgAttributes: {
    class: 'radial-menu'
  },
  svgSliceAttributes: {
    textAnchor: 'middle',
    fontSize: '11px',
    fontFamily: 'Arial',
    fill: '#FFFFFF',
    color: '#000000',
    class: 'slice'
  },
  middleButton: {
    radius: 28,
    name: 'middle',
    svgAttributes: {
      fill: 'green',
      class: 'test'
    },
    icon: {
      width: 30,
      height: 30,
      url: testIcon
    }
  },
  slices: [
    {
      label: 'Tags',
      name: 'attributes',
      slices: [
        {
          label: '6',
          name: 'alert',
          size: 26,
          svgAttributes: {
            color: '#FFFFFF',
            fill: '#006ebf'
          }
        }
      ],
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    },
    {
      label: 'Citations',
      link: 'https://speciesfilegroup.org',
      slices: [
        {
          label: 'It?',
          name: 'alert',
          size: 26,
          svgAttributes: {
            color: '#FFFFFF',
            fill: '#006ebf'
          }
        },
        {
          label: 'Like',
          name: 'alert',
          size: 26,
          svgAttributes: {
            color: '#FFFFFF',
            fill: '#006ebf'
          }
        },
        {
          label: 'You',
          name: 'alert',
          size: 26,
          svgAttributes: {
            color: '#FFFFFF',
            fill: '#006ebf'
          }
        },
        {
          label: 'Do',
          name: 'alert',
          size: 26,
          svgAttributes: {
            color: '#FFFFFF',
            fill: '#006ebf'
          }
        }
      ],
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    },
    {
      label: 'Alternate values',
      name: 'another',
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      },
      slices: []
    },
    {
      label: 'Depictions',
      link: 'https://taxonworks.org',
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    },
    {
      label: 'Confidences',
      name: 'another',
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    },
    {
      label: 'Identifier',
      name: 'another',
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    },
    {
      label: 'Data attributes asas',
      name: 'another',
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    },
    {
      label: 'Another test',
      name: 'another',
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    }
  ]
}

const element = document.querySelector('#app') as HTMLElement
let radial = new RadialMenu(element, options)

const EVENTS = ['click', 'mousedown', 'mouseup', 'dblclick', 'contextmenu']

EVENTS.forEach((eventName) => {
  radial.on(eventName, (data) => {
    console.log(eventName, data)
  })
})
