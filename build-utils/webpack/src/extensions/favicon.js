const WebappWebpackPlugin = require('webapp-webpack-plugin');
const AlterWebappWebpackPluigin = require('../build/webpack-plugins/alter-webapp-webpack-plugin/');
const { app } = Dvx.package;
module.exports = (src) => {
  return [
    // https://www.w3.org/TR/appmanifest/
    new WebappWebpackPlugin({
      // Your source logo (required)
      logo: Dvx.paths.fromRoot(src),
      // Path to store cached data or false/null to disable caching altogether
      // Note: disabling caching may increase build times considerably
      cache: Dvx.paths.cache(),
      // Prefix path for generated assets
      prefix: '',
      // Inject html links/metadata (requires html-webpack-plugin)
      inject: true,
      // Favicons configuration options. Read more on: https://github.com/evilebottnawi/favicons#usage
      favicons: {
        path: Config.publicPath.pathname,                                   // Path for overriding default icons path. `string`
        appName: app.name,                                              // Your application's name. `string`
        appShortName: app.short_name,                                   // Your application's short name. `string` : Not implemented
        appDescription: app.description,                                // Your application's description. `string`
        developerName: app.developer_name,                              // Your (or your developer's) name. `string`
        developerURL: app.developer_url,                                // Your (or your developer's) URL. `string`
        dir: app.dir,                                                   // Primary text direction for name, short_name, and description
        lang: app.lang,                                                 // Primary language for name and short_name
        background: app.background_color,                               // Background colour for flattened icons. `string`
        theme_color: app.theme_color,                                   // Theme color user for example in Android's task switcher. `string`
        appleStatusBarStyle: app.apple_status_bar_style,                // Color for appleStatusBarStyle : Not implemented (black-translucent | default | black)
        display: app.display,                                           // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
        orientation: app.orientation,                                   // Default orientation: "any", "natural", "portrait" or "landscape". `string`
        scope: Config.publicPath.pathname,                                  // Color for appleStatusBarStyle : Not implemented
        start_url: Config.publicPath.startURL,                          // Start URL when launching the application from a device. `string`
        version: app.version,                                           // Your application's version string. `string`
        logging: false,                                                 // Print logs to console? `boolean`
        pixel_art: false,                                                // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
        loadManifestWithCredentials: false,       // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
        serviceworker: {
          src: app.serviceWorker.src,
          scope: Config.publicPath.pathname,
          update_via_cache: app.serviceWorker.update_via_cache
        },
        related_applications: app.related_applications,
        icons: {
          // Platform Options:
          // - offset - offset in percentage
          // - background:
          //   * false - use default
          //   * true - force use default, e.g. set background for Android icons
          //   * color - set background for the specified icons
          //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
          //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
          //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
          //
          android: { background: false },              // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
          appleIcon: { background: false },            // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
          appleStartup: { background: false },         // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
          coast: { background: false },                // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
          favicons: { background: false },             // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
          firefox: { background: false },              // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
          windows: { background: false },              // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
          yandex: { background: false }                // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        }
      },
    }),
    new AlterWebappWebpackPluigin(app),
    // new AlterWebappWebpackPluigin(app),
  ];
}
