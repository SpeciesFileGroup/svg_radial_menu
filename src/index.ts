import "./styles.css";
import { RadialMenu } from './radialMenu'
import testIcon from './assets/icon'

const options = {
  width: 1000,
  height: 600,
  sliceSize: 120,
  centerSize: 40,
  margin: 2,
  css: {
    class: 'radial-menu'
  },
  svgAttributes: {
    fill: '#FFFFFF',
    color: '#000000',
    textAnchor: 'middle',
    fontSize: '11px',
    fontFamily: 'Arial'
  },
  middleButton: {
    backgroundColor: 'red',
    radius: 28,
    name: 'middle',
    svgAttributes: {
      fill: 'green'
    },
    icon: {
      width: 30,
      height: 30,
      url: testIcon
    }
  },
  slices: [
    {
      label: 'Data attributes',
      name: 'attributes',
      radius: 50,
      slice: [
      {
        label: '6',
        name: 'alert',
        size: 26,
        svgAttributes: {
          color: '#FFFFFF',
          fill: '#006ebf'
        }
      }],
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    },
    {
      label: 'SFG Homepage',
      link: 'https://speciesfilegroup.org',
      slice: [{
        label: 'It?',
        name: 'alert',
        size: 26,
        svgAttributes: {
          color: '#FFFFFF',
          fill: '#006ebf',
        }
      },
      {
        label: 'Like',
        name: 'alert',
        size: 26,
        svgAttributes: {
          color: '#FFFFFF',
          fill: '#006ebf',
        }
      },
      {
        label: 'You',
        name: 'alert',
        size: 26,
        svgAttributes: {
          color: '#FFFFFF',
          fill: '#006ebf',
        }
      },
      {
        label: 'Do',
        name: 'alert',
        size: 26,
        svgAttributes: {
          color: '#FFFFFF',
          fill: '#006ebf',
        }
      }],
    },
    {
      label: 'Another test',
      name: 'another'
    },
    {
      label: 'TaxonWorks',
      link: 'https://taxonworks.org'
    },
    {
      label: 'Another test',
      name: 'another'
    },
  ]
}

const element = document.querySelector('#app') as HTMLElement
let radial = new RadialMenu(element, options)


radial.on('click', (data) => {
  console.log(data)
})