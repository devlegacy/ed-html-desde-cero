
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { parse, normalize } = require('path');
const { app } = Dvx.package;

const baseHtmlWebpackPluginOptions = {
  title: 'Default HTMLWebpackPlugin title',
  description: 'Default HTMLWebpackPlugin description',
  lang: app.lang || 'es-MX',
  dir: app.dir || 'ltr',
  publicPath: Config.publicPath,
  meta: {
    description: 'Default HTMLWebpackPlugin description',
    keywords: 'Default, HTMLWebpackPlugin, keywords',
  },
  PRODUCTION: Dvx.inProduction(),
  template: null,
  filename: null,
  excludeAssets: [], // * Note: this option needs html-webpack-exclude-assets-plugin
};
/**
 * https://github.com/kangax/html-minifier
 */
const baseHtmlWebpackPluginMinify = {
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  removeComments: false,  // To preserve comments for split html webpack
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
};

const html = (entry, output) => {
  return buildHTMLConfig(entry, output);
};

const buildHTMLConfig = (entry, output) => {
  // entry as an object
  entry = (typeof entry === 'string') ? { template: entry } : entry;
  // Set name, before set full path
  entry.filename = entry.filename || `${parse(entry.template).name}.html`;

  entry.filename = Dvx.paths.fromRoot(normalize(`${output}/${entry.filename}`));
  entry.template = Dvx.paths.fromRoot(entry.template);

  // config.filename = Dvx.paths.fromRoot(config.filename);
  // const type = /\.html$/i.test(entry.template) ? 'html' : 'pug';
  entry.template = `${entry.template}`;

  entry = Object.assign(baseHtmlWebpackPluginOptions, entry);

  entry.minify = Dvx.inProduction() ? baseHtmlWebpackPluginMinify : false;

  return builtHTMLPlugin(entry);
};

const builtHTMLPlugin = (entry) => {
  return new HtmlWebpackPlugin(entry);
}

module.exports = html;
