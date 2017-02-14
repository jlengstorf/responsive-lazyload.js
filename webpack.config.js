const webpack = require('webpack');
const path = require('path');

const isDev = (process.env.NODE_ENV === 'development');

module.exports = {
  devtool: (isDev ? 'cheap-source-map' : 'source-map'),
  entry: {
    bundle: [
      './source/scripts/responsive-lazyload.browser.js',
    ],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'responsive-lazyload.min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
    }),
  ],
};
