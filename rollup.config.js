import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'lib/index.js',
	external: ['three'],
	plugins: [resolve(), commonjs()],
	output: [
		// UMD build
		{
			file: 'build/ratk.js',
			format: 'umd',
			name: 'Ratk',
			globals: {
				three: 'THREE',
			},
		},
		// Minified UMD build
		{
			file: 'build/ratk.min.js',
			format: 'umd',
			name: 'Ratk',
			globals: {
				three: 'THREE',
			},
			plugins: [terser()],
		},
		// ES module build
		{
			file: 'build/ratk.module.js',
			format: 'es',
		},
		// Minified ES module build
		{
			file: 'build/ratk.module.min.js',
			format: 'es',
			plugins: [terser()],
		},
	],
};
