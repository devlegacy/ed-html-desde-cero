class AlterWebappWebpackPluigin {
  constructor({
    background_color,
    theme_color,
    short_name,
    developer_name,
    developer_url,
    serviceWorker,
    categories,
    version, related_applications
  } = app) {
    this.background_color = background_color;
    this.theme_color = theme_color;
    this.short_name = short_name;
    this.developer_name = developer_name;
    this.developer_url = developer_url;
    this.serviceWorker = serviceWorker;
    this.categories = categories;
    this.version = version;
    this.related_applications = related_applications;
  }
  apply(compiler) {
    compiler.hooks.make.tapAsync("AlterWebappWebpackPluigin", (compilation, callback) => {
      // console.log(compilation.hooks)
      compilation.hooks.webappWebpackPluginBeforeEmit.tapAsync("AlterWebappWebpackPluigin", (result, callback) => {
        if (result.html) {
          result.html = result.html.split('>');
          result.html = result.html
            .filter(html => html.length > 0)
            .map(html => {
              // Repait split
              html += '>';
              // Alter meta theme color, change from background color to theme color
              html = html == `<meta name="theme-color" content="${this.background_color}">` ? `<meta name="theme-color" content="${this.theme_color}">` : html;
              // Alter meta msapplication tile color, change from background color to theme color
              html = html == `<meta name="msapplication-TileColor" content="${this.background_color}">` ? `<meta name="msapplication-TileColor" content="${this.theme_color}">` : html;
              // Alter manifest, from manifest.json to manifest.webmanifest, according to example in: https://www.w3.org/TR/appmanifest/#using-a-link-element-to-link-to-a-manifest
              html = (/(rel\=.{1}manifest.{1}.*)/.test(html)) ? html.replace('manifest.json', 'manifest.webmanifest') : html;
              return html;
            })
            .reduce((prev, next) => {
              // Convert to string
              return `${prev}${next}`
            });
        } else if (result.tags) {
          result.tags = result.tags.map(tag => {
            tag = tag == `<meta name="theme-color" content="${this.background_color}">` ? `<meta name="theme-color" content="${this.theme_color}">` : tag;
            // Alter meta msapplication tile color, change from background color to theme color
            tag = tag == `<meta name="msapplication-TileColor" content="${this.background_color}">` ? `<meta name="msapplication-TileColor" content="${this.theme_color}">` : tag;
            // Alter manifest, from manifest.json to manifest.webmanifest, according to example in: https://www.w3.org/TR/appmanifest/#using-a-link-element-to-link-to-a-manifest
            tag = (/(rel\=.{1}manifest.{1}.*)/.test(tag)) ? tag.replace('manifest.json', 'manifest.webmanifest') : tag;
            return tag;
          });
        }


        // Alter manifest.json
        result.assets.forEach(file => {
          if (/manifest\.json$/.test(file.name) && !(/(yandex)/.test(file.name))) {
            // Change name of manifest.json to manifest.webmanifest, according to example in: https://www.w3.org/TR/appmanifest/#using-a-link-element-to-link-to-a-manifest
            file.name = file.name.replace('manifest.json', 'manifest.webmanifest');
            const manifestJson = JSON.parse(file.contents);
            // Add some extra options to manifest.webmanifest that favicons library does not return
            // Result validated in: https://manifest-validator.appspot.com/
            manifestJson.scope = Config.publicPath.pathname;
            manifestJson.short_name = this.short_name;
            manifestJson.developer = {
              name: this.developer_name,
              url: this.developer_url,
            };
            manifestJson.serviceWorker = {
              "src": this.serviceWorker.src,
              "scope": Config.publicPath.pathname,
              "update_via_cache": this.serviceWorker.update_via_cache
            };
            manifestJson.categories = this.categories;
            manifestJson.version = this.version;
            manifestJson.related_applications = this.related_applications;

            if (Array.isArray(manifestJson.related_applications)) {
              manifestJson.related_applications = manifestJson.related_applications.map(related => {
                if (related.platform === 'web' && !related.url) {
                  related.url = Config.publicPath.href;
                }
                return related;
              });
            }
            file.contents = JSON.stringify(manifestJson);
          }
        });
        return callback(null, result);
      });

      return callback();
    })
  }
}

module.exports = AlterWebappWebpackPluigin;
