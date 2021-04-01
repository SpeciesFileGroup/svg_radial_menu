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
		}
  ],
  external: ["tslib"],
  plugins: [typescript()]
}

export default config