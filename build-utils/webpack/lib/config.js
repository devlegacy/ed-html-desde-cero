const { resolve, join } = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const glob = require('glob-all');
class Config {
  constructor() {
    this.outputPath = this.setOutputPath();
    this.publicPath = this.setPublicPath();
  }

  rootDir() {
    return resolve(__dirname, '../../../');
  }

  getPackage() {
    return require(File.find(`${this.rootDir()}/package.json`).absolutePath);
  }

  /**
   * @method getConfigName()
   *
   * getConfigName() return the name on webpack config file
   * @return {String} - Return the webpack config name
   */
  getConfigName() {
    const { configName } = webpackArgs
    return configName;
  }

  /**
   * @method production
   *
   * production() return the production status of the current
   * compilation process from npm script and CLI config
   * @return {Boolean} - Return the production status of compilation process
   */
  production() {
    const { mode } = webpackEnv;
    return mode === 'production' || process.argv.includes('-p');
  }

  /**
   * @method debug
   *
   * debug()
   * @return {Boolean} - Return the debug status of compilation process
   */
  debug() {
    const { debug } = webpackEnv;
    return debug === 'true';
  }

  /**
   * @method hot
   * hot() Server mode from CLI config
   * @return {Boolean} - Return the server mode
   */
  hot() {
    return process.argv.includes('--hot');
  }

  /**
   *
   */
  target() {
    const { target } = webpackEnv;
    return target;
  }

  serviceWorker() {
    if (this.getConfigName() === 'service-worker-config') {
      return !this.production();
    }
    return false;
  }

  /**
   * @method local
   * local() Server mode from CLI config
   * @return {Boolean} - Return if the server mode is local
   */
  local() {
    const { local } = webpackEnv;
    return local === 'true';
  }

  setOutputPath() {
    return {
      root: 'public',
      img: 'assets/img',
      fonts: 'assets/fonts',
      data: 'data',
      media: 'media',
    };
  }

  setPublicPath() {
    const { app: { url, subDomain } } = this.getPackage();
    const URL = 'http://localhost';
    const { DVX_BROWSER_SYNC_PORT, DVX_HTTP_SERVER_PORT } = this.dotEnv();
    let root = '/';
    let full = '';
    let startUrl = '';
    let appUrl = '';

    if (this.hot() || this.serviceWorker()) {
      full = `${URL}:${DVX_BROWSER_SYNC_PORT}`;
      startUrl = `${root}?utm=homescreen`
    } else if (this.local()) {
      full = `${URL}:${DVX_HTTP_SERVER_PORT}`;
      startUrl = `${root}?utm=homescreen`
    } else {
      root = subDomain ? `/${subDomain}/` : '/';
      full = subDomain ? `${url}/${subDomain}` : `${url}`;
      appUrl = url;
      startUrl = `${root}?utm=homescreen`
    }
    return {
      root,
      full,
      startUrl,
      url: appUrl,
    };
  }

  /**
   * Ruler config: Cache loader
   */
  cacheLoader() {
    return {
      loader: 'cache-loader',
      options: {
        cacheDirectory: Dvx.paths.cache(),
      },
    }
  }

  cleanWebpackPluginOptions() {

    return {//Paths to clean in public dir
      paths: [
        '.htaccess',
        '*.html',
        '*.ico',
        '*.js',
        '*.json',
        '*.map',
        '*.png',
        '*.pug',// When use pug as template for node
        '*.txt',
        '*.webapp',
        '*.webmanifest',
        '*.xml',
        'assets/css/**/*.*',
        'assets/fonts/**/*.*',
        'assets/img/**/*.*',
        'assets/js/**/*.js',
        'data/**/*.json',
        '.cache',
      ],
      //Options to clean folders
      options: {
        // Absolute path to your webpack root folder (paths appended to this)
        // Default: root of your package
        root: Dvx.paths.fromRoot(global.Config.outputPath.root),
        // Write logs to console.
        verbose: false,
        // Instead of removing whole path recursively,
        // remove all path's content with exclusion of provided immediate children.
        // Good for not removing shared files from build directories.
        //exclude: ['./folder'],
        //exclude: [],
      },
    };

  }

  browserSyncPlugin() {
    const { DVX_WEBPACK_DEV_SERVER_PORT, DVX_BROWSER_SYNC_PORT } = this.dotEnv();
    return [ // BrowserSync options
      {
        files: [
          resolve(Dvx.paths.fromRoot(), './application/views/**/*.php'),
          resolve(Dvx.paths.fromRoot('src/assets/js/sw.js')),
          resolve(Dvx.paths.fromRoot('src/assets/scss/'), './**/*.scss'),
          resolve(Dvx.paths.fromRoot('src/assets/scss/'), './**/*.css'),
          resolve(Dvx.paths.fromRoot('src/views/pug/'), './**/*.pug'),
          resolve(Dvx.paths.fromRoot('src/views/html/'), './**/*.html'),
        ],
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: DVX_BROWSER_SYNC_PORT,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: `http://localhost:${DVX_WEBPACK_DEV_SERVER_PORT}/`,
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false
      }
    ];
  }

  purifyCssPlugin(extraPaths = []) {
    extraPaths = extraPaths.map(newPath => join(Dvx.paths.fromRoot(), newPath))
    log(join(Dvx.paths.fromRoot('src'), "./**/*.pug"));
    return {
      paths: glob.sync(
        [
          join(Dvx.paths.fromRoot('src'), "./**/*.pug"),
          join(Dvx.paths.fromRoot('src'), "./**/*.html"),
          join(Dvx.paths.fromRoot('src'), "./**/*.js"),
          // dir.join(dir.src, "../node_modules/owl.carousel/dist/**/*.js")
        ]
          .concat(extraPaths)
        ,
        { nodir: true }
      ),
      // styleExtensions: ['.css'],
      // moduleExtensions: ['.pug', '.php', .html', '.js'],
      // purifyOptions: { whitelist: [".fa-github"] }
    };
  }

  purgeCssPlugin() {
    return {
      paths: glob.sync(
        [
          join(Dvx.paths.fromRoot('src'), "./**/*.pug"),
          join(Dvx.paths.fromRoot('src'), "./**/*.html"),
          join(Dvx.paths.fromRoot('src'), "./**/*.js"),
        ],
        { nodir: true }
      ),
    };
  }

  jqueryAlias() {
    return ('jquery' in Dvx.package.dependencies || 'jquery' in Dvx.package.devDependencies)
      ? { jquery: resolve(Dvx.paths.fromRoot(), './node_modules/jquery/dist/jquery') }
      : {};
  }

  jqueryProvide() {
    return ('jquery' in Dvx.package.dependencies || 'jquery' in Dvx.package.devDependencies)
      ? [
        new webpack.ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery',
          'window.jQuery': 'jquery',
          'window.$': 'jquery',
        }),
      ]
      : [];
  }

  momentJs() {
    return ('moment' in Dvx.package.dependencies || 'moment' in Dvx.package.devDependencies)
      ? [new webpack.IgnorePlugin(/^\.\/locale\/(es)\.js$/, /moment$/)]//(en|de)
      : [];
  }

  dotEnv() {
    return dotenv.config().parsed;
  }
}
module.exports = Config;
