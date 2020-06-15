import { terser } from 'rollup-plugin-terser';

import base from './rollup.config.base';

const config = Object.assign({}, base, {
  output: {
    compact: true,
    file: 'dist/vue-notyfy.min.js',
    format: 'iife',
    name: 'VueNotyfy',
    exports: 'named',
    globals: { vue: 'Vue' },
  },
  plugins: [...base.plugins, terser()],
});

export default config;
