import babel from 'rollup-plugin-babel'; // eslint-disable-line
import closure from 'rollup-plugin-closure-compiler-js'; //eslint-disable-line

export default {
  entry: 'source/scripts/responsive-lazyload.js',
  dest: 'dist/responsive-lazyload.es2015.js',
  moduleName: 'responsiveLazyload',
  exports: 'named',
  format: 'iife',
  sourceMap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['es2015', { modules: false }]],
    }),
    closure(),
  ],
};
