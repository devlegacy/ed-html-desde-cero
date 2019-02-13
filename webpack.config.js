module.exports = (env, args) => {
  ((env, args) => {
    global.webpackEnv = env;
    global.webpackArgs = args;
  })(env, args);

  return (({ mode } = env, args) => {
    require('./build-utils/webpack/global');
    const modeConfig = (mode) => require(`./build-utils/webpack/webpack.${mode}`);
    const webpackMerge = require('webpack-merge');
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
    const WebpackNotifierPlugin = require('webpack-notifier');
    const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
    const HtmlWebpackExcludeEmptyAssetsPlugin = require('html-webpack-exclude-empty-assets-plugin');
    const html = require('./build-utils/webpack/src/extensions/html');
    const favicon = require('./build-utils/webpack/src/extensions/favicon');
    const webpack = require('webpack');
    const webpackDevServer = require('./build-utils/webpack/src/build/server/webpack-dev-server');
    const HtmlSplitWebpackPlugin = require('./build-utils/webpack/src/build/webpack-plugins/html-split-webpack-plugin');
    const { resolve } = require('path');
    log('[cache-dir]:', Dvx.paths.cache());
    // log('[dev-server]:', webpackDevServer());
    // log(Dvx.paths.fromRoot('./node_modules/'));
    // log(Dvx.paths.fromRoot('./src/'));
    // log(Dvx.paths.fromRoot('./src/assets/img/'));
    return [
      webpackMerge(
        {
          name: 'app-config',
          devtool: Dvx.inProduction() ? (Dvx.inDebug() ? 'hidden-source-map' : 'none') : 'cheap-module-eval-source-map',
          context: Dvx.paths.fromRoot(),
          target: Dvx.target(),
          mode,
          optimization: {
            splitChunks: {
              cacheGroups: {
                styles: {
                  name: 'assets/css/styles',
                  chunks: 'all',
                  enforce: true,
                  test(module, chunks) {
                    if (module.type === 'css/mini-extract') {
                      // console.log(chunks[0].name);
                      // console.log(/assets\/js/.test(chunks[0].name));
                      return /assets\/js/.test(chunks[0].name);
                    }
                  }
                }
              },
            }
          },
          entry: {
            'assets/js/app': ['./src/assets/js/app.js'],
            'assets/css/app': ['./src/assets/scss/app.scss'],
          },
          output: {
            path: resolve(__dirname, Config.outputPath.root),
            publicPath: Config.publicPath.root,
          },
          module: {
            rules: [
              // Add support for javascript + babel
              {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                  Config.cacheLoader(),
                  {
                    loader: 'babel-loader',
                  },
                ],
              },
              // Add support for json files - File loader - JSON Data
              {
                type: 'javascript/auto',
                test: /(data).*(upload).*\.json$/i,
                use: [
                  // cacheLoader,
                  // https://github.com/webpack-contrib/file-loader
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: Config.outputPath.data,
                    }
                  },
                ],
              },
              // Add support for images and fonts with - URL Loader - Fallback File loader
              {
                test: /\.(jpe?g|png|gif|webp|svg)$/i,
                exclude: /(fonts?)+/,
                use: [
                  // cacheLoader,
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                      //file loader https://github.com/webpack-contrib/file-loader
                      fallback: 'file-loader',
                      name: '[folder]/[name].[ext]',
                      // publicPath: path.img.public,
                      outputPath: Config.outputPath.img,
                    },
                  },
                  {
                    loader: 'img-loader',
                    options: {
                      plugins: Dvx.inProduction() ? [
                        require('imagemin-gifsicle')({}),
                        require('imagemin-mozjpeg')({}),
                        require('imagemin-optipng')({}),
                        require('imagemin-svgo')({}),
                      ] : [],
                    },
                  },
                ],
              },
              // Add support for fonts only with - URL Loader - Fallback File loader
              {
                test: /(fonts?)+.*\.(ttf|eot|otf|woff2?|svg)(\?v=\d+\.\d+\.\d+)?$/i,
                exclude: /(imgs?|images?)/,
                use: [
                  // cacheLoader,
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                      //file loader https://github.com/webpack-contrib/file-loader
                      fallback: 'file-loader',
                      name: '[name].[ext]',
                      // publicPath: path.fonts.public,
                      outputPath: Config.outputPath.fonts,
                    }
                  }
                ]
              },
              //  Add support for pug files
              //  https://github.com/pugjs/pug-loader
              {
                test: /\.pug$/,
                use: [
                  Config.cacheLoader(),
                  {
                    loader: 'pug-loader',
                    options: {
                      doctype: 'html', // Insert metadata in the Doctype
                      pretty: !Dvx.inProduction(), // Pretty for user, expand file if it is true
                    }
                  },
                ],
              },
              // Add support for multimedia - Media
              {
                test: /\.(mp4|mp3|txt|xml)$/,
                exclude: /(humans|robots|security)\.txt$/,
                use: [
                  // cacheLoader,
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      // publicPath: path.media.public,
                      outputPath: Config.outputPath.media,
                    }
                  }
                ]
              },
              // Add support for cursor files
              {
                test: /\.cur$/i,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[folder]/[name].[ext]',
                      outputPath: Config.outputPath.img,
                    }
                  }
                ]
              },
              // Add support for .txt in the root
              {
                test: /\.(txt)$/,
                use: [
                  // cacheLoader,
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      // publicPath: path.public,
                      // outputPath: './',
                    }
                  }
                ]
              },
              // Add support for jquery datatables
              {
                test: /datatables\.net.*\.js$/,
                use: [{
                  loader: 'imports-loader',
                  options: {
                    define: false,
                  }
                }]
              },
            ]
          },
          plugins: [
            new WebpackNotifierPlugin({
              title: '[Devexteam] - wrapper start',
              contentImage: resolve(__dirname, './build-utils/webpack/icons/info.jpg'),
            }),
            new FriendlyErrorsWebpackPlugin(),
            new CleanWebpackPlugin(Config.cleanWebpackPluginOptions().paths, Config.cleanWebpackPluginOptions().options),
            new CopyWebpackPlugin(
              [
                { from: './src/robots.txt', to: './' },
                { from: './src/security.txt', to: './' },
              ],
              {
                copyUnmodified: true, toType: 'dir',
                fromType: 'glob'
              }),
            html({
              template: 'src/views/pug/index.pug',
              filename: 'index.html',
              title: 'Mi primera página web con EDteam',
              meta: {
                description: 'Primer proyecto web con EDteam',
                keywords: 'html, css, javascript, web, proyecto',
              },
              excludeAssets: [/assets\/css\/.*.js/],
            }, 'public'),
            html({
              template: 'src/views/pug/pages/2-estructura/index.pug',
              filename: 'index.html',
              title: 'Mi primera página web con EDteam',
              meta: {
                description: 'Primer proyecto web con EDteam',
                keywords: 'html, css, javascript, web, proyecto',
              },
              excludeAssets: [/assets\/css\/.*.js/],
            }, 'public/2-estructura'),
            html({
              template: 'src/views/pug/pages/3-agrupacion-de-contenido/index.pug',
              filename: 'index.html',
              title: 'Mi primera página web con EDteam',
              meta: {
                description: 'Primer proyecto web con EDteam',
                keywords: 'html, css, javascript, web, proyecto',
              },
              excludeAssets: [/assets\/css\/.*.js/],
            }, 'public/3-agrupacion-de-contenido'),
            html({
              template: 'src/views/pug/pages/4-textos-y-enlaces/index.pug',
              filename: 'index.html',
              title: 'Mi primera página web con EDteam',
              meta: {
                description: 'Primer proyecto web con EDteam',
                keywords: 'html, css, javascript, web, proyecto',
              },
              excludeAssets: [/assets\/css\/.*.js/],
            }, 'public/4-textos-y-enlaces'),
            html({
              template: 'src/views/pug/pages/4-textos-y-enlaces/subcarpeta/index.pug',
              filename: 'index.html',
              title: 'Mi primera página web con EDteam',
              meta: {
                description: 'Primer proyecto web con EDteam',
                keywords: 'html, css, javascript, web, proyecto',
              },
              excludeAssets: [/assets\/css\/.*.js/],
            }, 'public/4-textos-y-enlaces/subcarpeta'),
            html({
              template: 'src/views/pug/pages/4-textos-y-enlaces/marcadores/index.pug',
              filename: 'index.html',
              title: 'Mi primera página web con EDteam',
              meta: {
                description: 'Primer proyecto web con EDteam',
                keywords: 'html, css, javascript, web, proyecto',
              },
              excludeAssets: [/assets\/css\/.*.js/],
            }, 'public/4-textos-y-enlaces/marcadores'),
            html({
              template: 'src/views/pug/pages/5-imagenes/index.pug',
              filename: 'index.html',
              title: 'Mi primera página web con EDteam',
              meta: {
                description: 'Primer proyecto web con EDteam',
                keywords: 'html, css, javascript, web, proyecto',
              },
              excludeAssets: [/assets\/css\/.*.js/],
            }, 'public/5-imagenes'),
            html({
              template: 'src/views/pug/pages/6-microdatos/index.pug',
              filename: 'index.html',
              title: 'Mi primera página web con EDteam',
              meta: {
                description: 'Primer proyecto web con EDteam',
                keywords: 'html, css, javascript, web, proyecto',
              },
              excludeAssets: [/assets\/css\/.*.js/],
            }, 'public/6-microdatos'),
            new HtmlWebpackExcludeAssetsPlugin(),
            new HtmlWebpackExcludeEmptyAssetsPlugin(),
            new HtmlSplitWebpackPlugin(),
            ...favicon('./src/assets/img/dist/icons/favicon.png'),
            new webpack.DefinePlugin({
              'ENV': JSON.stringify(Dvx.inProduction() ? 'production' : 'development'),
              'PUBLIC_PATH': JSON.stringify(Config.publicPath)
            }),
          ].concat(
            Config.jqueryProvide(),
          ),
          resolve: {
            alias: {
              ...Config.jqueryAlias(),
            },
            extensions: [
              '.js',
              '.json',
              '.jsx',
              '.css',
              '.styl',
              '.scss',
              '.txt',
              '.xml',
              '.pug',
              '.html',
            ],
          },
          devServer: webpackDevServer(),
          stats: 'errors-only',
        },
        modeConfig(mode),
      ),
    ];
  })();


};
