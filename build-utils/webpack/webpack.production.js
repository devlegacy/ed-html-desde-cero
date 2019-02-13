const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Fiber = require('fibers');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const nib = require('nib');
const rupture = require('rupture');
const bootstrap = require('bootstrap-styl');
const PurifyCSSPlugin = require('purifycss-webpack');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const resolveUrlLoader = require('./src/build/webpack-loaders/resolve-url-loader/lib/join-function');
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ],
    noEmitOnErrors: true,
  },
  output: {
    // the filename template for entry chunks
    filename: '[name].[hash].js',
    // the filename template for additional chunks
    chunkFilename: '[name].[chunkhash].js',
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
              importLoaders: 3,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')()
              ]
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
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
              importLoaders: 3,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')()
              ]
            }
          },
          {
            // https://github.com/bholloway/resolve-url-loader#important
            loader: 'resolve-url-loader',
            options: {
              // join: (uri, base) => {
              //   // const path = require('path');
              //   // const compose = require('compose-function');
              //   // log(`\n${uri}\n`);
              //   // console.log(`\n`, base, `\n`);
              //   // console.log(`\n`, 'Compose:', compose(path.normalize, path.join)(base, uri), `\n`);
              //   // // return 'C:\\Users\\Dell\\Desktop\\Proyectos\\dvx\\webpack\\src\\assets\\img\\dist\\icons\\favicon.png'
              //   // return compose(path.normalize, path.join)(base, uri);

              // }
              join: resolveUrlLoader.defaultJoin,
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              'include css': true,
              sourceMap: true,
              sourceMapContents: false,
              preferPathResolver: 'webpack',
              use: [
                nib(),
                rupture(),
                bootstrap(),
              ],
              import: [
                '~nib/lib/nib/index.styl', // This line has an error with resolve ur loader
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
    new FixStyleOnlyEntriesPlugin({
      extensions: ['scss', 'css', 'styl']
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: function (...args) {
        // console.log(args);
        return '[name].[hash].css';
      },
      chunkFilename: '[name].[hash].css',
    }),
    new PurifyCSSPlugin(Config.purifyCssPlugin([])),
    new IgnoreEmitPlugin(/assets\/css\/.*.\.js$/),
  ],
};
