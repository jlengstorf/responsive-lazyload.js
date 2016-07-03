var webpack = require('webpack');
var isDev = (process.env.NODE_ENV === 'development');

module.exports = {
  debug: isDev,
  devtool: (isDev ? 'cheap-source-map' : 'source-map'),
  entry: {
    bundle: [
      /*'babel-polyfill',*/
      './source/scripts/responsive-lazyload.browser.js',
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'responsive-lazyload.min.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
};