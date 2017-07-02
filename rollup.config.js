import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup'; // eslint-disable-line import/extensions

import pkg from './package.json';

const external = Object.keys(pkg.dependencies);

export default {
  entry: 'source/scripts/responsive-lazyload.js',
  plugins: [
    babel(
      babelrc({
        addExternalHelpersPlugin: false,
      })
    ),
  ],
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'responsiveLazyload',
      sourceMap: true,
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: true,
    },
  ],
  external,
};
