import "./styles.css";
import { RadialMenu } from './radialMenu'
import testIcon from './assets/icon'

const options = {
  width: 1000,
  height: 600,
  sliceSize: 130,
  centerSize: 30,
  fontSize: 11,
  fontFamily: 'Arial',
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  centerButton: {
    color: 'red',
    radius: 20,
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
      slice: [{
        label: '6',
        event: 'alert',
        size: 26,
        textColor: '#FFFFFF',
        backgroundColor: '#006ebf',
      }],
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    },
    {
      label: '0',
      event: 'alert',
      slice: [{
        label: 'Bigger',
        event: 'alert',
        textColor: '#FFFFFF',
        backgroundColor: 'red'
      }]
    },
    {
      label: '0',
      event: 'alert'
    },
    {
      label: 'SFG Homepage',
      link: 'http://speciesfilegroup.org',
      slice: [{
        label: 'It?',
        event: 'alert',
        size: 24,
        textColor: '#FFFFFF',
        backgroundColor: '#006ebf',
      },
      {
        label: 'Like',
        event: 'alert',
        size: 24,
        textColor: '#FFFFFF',
        backgroundColor: '#006ebf',
      },
      {
        label: 'You',
        event: 'alert',
        size: 24,
        textColor: '#FFFFFF',
        backgroundColor: '#006ebf',
      },
      {
        label: 'Do 1',
        event: 'alert',
        size: 24,
        textColor: '#FFFFFF',
        backgroundColor: '#006ebf',
      }],
    },
    {
      label: '0',
      slice: [{
        label: 'Red',
        event: 'alert',
        size: 50,
        textColor: '#FFFFFF',
        backgroundColor: 'red'
      }]
    },
    {
      label: '0'
    },
    {
      label: '0',
      link: 'http://taxonworks.org'
    },
    {
      label: '0'
    }
  ]
}

const element = document.querySelector('#app') as HTMLElement
let radial = new RadialMenu(element, options)


radial.on('click', (data) => {
  console.log(data)
})