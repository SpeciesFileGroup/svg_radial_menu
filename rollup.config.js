import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

const config = {
	input: 'src/radialMenu.ts',
	output: [
		{
      dir: 'dist',
			file: pkg.module,
			format: 'esm',
			compact: true
		},
	],
  external: ["tslib"],
	plugins: [typescript()]
};

export default config