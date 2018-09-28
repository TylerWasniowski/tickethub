// @flow
import 'dotenv/config';
import { EnvironmentPlugin, ProvidePlugin } from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import titleCase from 'title-case';
import Globals from './globals';
import { productName as name } from '../package.json';

const title = titleCase(name);

export default {
  target: 'web',

  context: path.join(__dirname, '..'),

  entry: [require.resolve('../src/components/Entry.jsx')],

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  output: {
    path: path.join(__dirname, '..', 'dist/assets/bundles/'),
    publicPath: './bundles/',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader' },
        ],
      },

      {
        test: /\.(png|jpg|gif)$/,
        use: [{ loader: 'url-loader' }],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin([path.join(__dirname, '..', 'dist/assets')], {
      verbose: process.env.VERBOSE === 'true',
      allowExternal: true,
    }),

    new EnvironmentPlugin({
      DEBUG: JSON.stringify(process.env.DEBUG) || false,
      TITLE: title,
      REACT_ROOT: 'root',
    }),

    new ProvidePlugin(Globals),

    new HtmlWebpackPlugin({
      title,
      inject: true,
      template: path.join(__dirname, '..', 'src/templates/index.ejs'),
      filename: path.join(__dirname, '..', 'dist/assets/index.html'),
    }),
  ],
};
