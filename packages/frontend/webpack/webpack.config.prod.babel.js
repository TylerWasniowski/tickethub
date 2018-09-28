// @flow
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import webpackCommon from './webpack.config.common.babel';

export default merge.smartStrategy({
  entry: 'prepend',
  plugins: 'append',
  'module.rules': 'prepend',
})(webpackCommon, {
  mode: 'production',

  devtool: 'source-map',

  output: {
    filename: '[hash].js',
    chunkFilename: '[hash].[chunkhash].js',
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          mangle: true,
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [{ loader: 'babel-loader' }],
      },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
              useRelativePath: false,
              outputPath: '../fonts/',
              publicPath: './fonts/',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // new DefinePlugin({
    //   __REACT_DEVTOOLS_GLOBAL_HOOK__: {}, //disables React DevTools extension
    // }),

    new BundleAnalyzerPlugin({
      analyzerMode:
        process.env.OPEN_ANALYZER === 'true' ? 'enabled' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),
  ],
});
