const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Fiber = require('fibers');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const nib = require('nib');
const rupture = require('rupture');
const bootstrap = require('bootstrap-styl');
const webpack = require('webpack');
const resolveUrlLoader = require('./src/build/webpack-loaders/resolve-url-loader/lib/join-function');
module.exports = {
  output: {
    // the filename template for entry chunks
    filename: `[name].js`,
    // the filename template for additional chunks
    chunkFilename: `[name].js`,
    // the url to the output directory resolved relative to the HTML page
  },
  module: {
    rules: [
      // SASS rules
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('dart-sass'),
              fiber: Fiber,
              data: `$PRODUCTION: ${Dvx.inProduction()};`,
            }
          },
        ]
      },
      // Stylus rules
      {
        test: /\.styl$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
            },
          },
          {
            // https://github.com/bholloway/resolve-url-loader#important
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
              join: resolveUrlLoader.defaultJoin,
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: true,
              'include css': true,
              preferPathResolver: 'webpack',
              use: [
                nib(),
                rupture(),
                bootstrap(),
              ],
              import: [
                '~nib/lib/nib/index.styl',
              ],
              'paths': [
              ],
            }
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.NamedModulesPlugin(),
    new BrowserSyncPlugin(...Config.browserSyncPlugin()),
    new FixStyleOnlyEntriesPlugin({
      extensions: ['scss', 'css', 'styl']
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: function (...args) {
        // console.log(args);
        return '[name].css';
      },
      chunkFilename: '[name].css',
    }),

  ],
}
