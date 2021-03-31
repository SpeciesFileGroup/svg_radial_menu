import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

const config = {
  input: 'src/radialMenu.ts',
  output: [
    {
      file: pkg.module,
      format: 'esm',
      compact: true
		},
    {
      file: pkg.main,
      name: 'RadialMenu',
      format: 'umd',
      compact: true
		},
  ],
  external: ["tslib"],
  plugins: [typescript(), uglify()]
}

export default config