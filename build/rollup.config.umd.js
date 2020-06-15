import { terser } from 'rollup-plugin-terser';

import base from './rollup.config.base';

const config = Object.assign({}, base, {
  output: {
    file: 'dist/vue-notyfy.umd.js',
    format: 'umd',
    name: 'VueNotyfy',
    exports: 'named',
    globals: { vue: 'Vue' },
  },
  plugins: [...base.plugins, terser()],
});

export default config;
