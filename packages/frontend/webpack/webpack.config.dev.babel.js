// @flow
import merge from 'webpack-merge';
import webpackCommon from './webpack.config.common.babel';

export default merge.smartStrategy({
  entry: 'prepend',
  plugins: 'append',
  'module.rules': 'prepend',
})(webpackCommon, {
  mode: 'development',

  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: true,
              plugins: ['react-hot-loader/babel'],
            },
          },
        ],
      },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              useRelativePath: false,
              outputPath: '../fonts/',
              publicPath: './fonts/',
            },
          },
        ],
      },
    ],
  },
});
