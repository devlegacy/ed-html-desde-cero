const { DVX_WEBPACK_DEV_SERVER_PORT } = Config.dotEnv();
const webpackDevServer = () => {
  return (Dvx.inProduction() && !Dvx.isHotServer()) ?
    {} :
    {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      clientLogLevel: 'none', // string You can prevent all messages
      compress: true, // boolean Enable gzip compression for everything served:
      contentBase: Dvx.paths.fromRoot('public'), // boolean | string | array Tell the server where to serve content from
      disableHostCheck: true,
      historyApiFallback: true,  // boolean | object respond to 404s with index.html
      // host: "0.0.0.0", // string Specify a host to use
      hot: true,  // boolean Enable webpack's Hot Module Replacement feature:
      inline: true, // boolean Toggle between the dev-server's two different modes
      noInfo: true, // boolean Only errors & warns on hot reload
      open: false, // boolean When open is enabled, the dev server will open the browser.
      openPage: '', // string Specify a page to navigate to when opening the browser.
      overlay: { // boolean | object Shows a full-screen overlay in the browser when there are compiler errors or warnings.
        warnings: true,
        errors: true
      },
      port: DVX_WEBPACK_DEV_SERVER_PORT, // number Specify a port number to listen for requests on:
      publicPath: Config.publicPath.pathname, // string
      quiet: true, // boolean With quiet enabled, nothing except the initial startup information will be written to the console
      stats: 'errors-only', // string | object This option lets you precisely control what bundle information gets displayed
    };
};
module.exports = webpackDevServer;
