import config from './rollup.config';

export default Object.assign({}, config, {
  dest: 'dist/responsive-lazyload.umd.js',
  format: 'umd',
});
