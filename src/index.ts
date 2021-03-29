import "./styles.css";
import { RadialMenu } from './radialMenu'
import testIcon from './assets/icon'

const options = {
  width: 600,
  height: 600,
  sliceSize: 200,
  centerSize: 50,
  backgroundColor: '#000000',
  centerButton: {
    color: 'red',
    radius: 30,
    icon: {
      width: 30,
      height: 30,
      url: testIcon
    }
  },
  slices: [
    {
      label: 'Data attributes',
      event: 'alert'
    },
    {
      label: 'Empty',
      event: 'alert'
    },
    {
      label: 'Empty',
      event: 'alert'
    },
    {
      label: 'SFG Homepage',
      link: 'http://speciesfilegroup.org',
      icon: {
        width: 20,
        height: 20,
        url: testIcon
      }
    },
    {
      label: 'Bla bla'
    },
    {
      label: 'Bla bla'
    },
    {
      label: 'TaxonWorks',
      link: 'http://taxonworks.org'
    },
    {
      label: 'Bla bla'
    }
  ]
}

const element = document.querySelector('#app') as HTMLElement
const radial = new RadialMenu(element, options)