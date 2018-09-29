// @flow
import { HotModuleReplacementPlugin } from 'webpack';
import DashboardPlugin from 'webpack-dashboard/plugin';
import merge from 'webpack-merge';
import WriteFilePlugin from 'write-file-webpack-plugin';
import webpackDev from './webpack.config.dev.babel';
import outputDir from '../lib';

const port = process.env.PORT || 3000;

export default function(env, argv) {
  return merge.smartStrategy({
    entry: 'prepend',
    plugins: 'append',
  })(webpackDev, {
    entry: [
      `webpack-dev-server/client?http://localhost:${port}/`,
      'webpack/hot/only-dev-server',
    ],

    devServer: {
      https: false,
      open: true,
      openPage: '../',
      overlay: true,
      compress: true,
      stats: 'errors-only',
      publicPath: '/bundles',
      lazy: false,
      port,
      hot: true,
      historyApiFallback: false,
      inline: false,
      contentBase: outputDir,
      watchContentBase: true,
    },

    plugins: [
      new WriteFilePlugin({
        test: /\.((woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?)|(html|ejs)$/,
        useHashIndex: true,
      }),

      new DashboardPlugin(),

      new HotModuleReplacementPlugin({
        // multiStep: true,
        // ADD multiStep BACK WHEN FIXED (https://github.com/webpack/webpack/issues/6693)
      }),
    ],
  });
}
