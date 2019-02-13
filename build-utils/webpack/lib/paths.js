const { resolve } = require('path');
const { tmpdir } = require('os');
/**
 * Class to manage paths
 */
class Paths {
  constructor() {
    this.root = Config.rootDir();
  }
  /**
   * Resolve to cache dir
   */
  cache() {
    const { name: cacheName } = Dvx.package;
    // return resolve(tmpdir(), (cacheName || process.env.npm_package_name || 'default-cache'), 'cache');
    return resolve(this.fromRoot(), './.cache/webpack/', (cacheName || process.env.npm_package_name || 'default-cache'));
  }

  /**
   * Resolve to package.json file
   */
  packageJson() {
    return this.fromRoot('./package.json');
  }

  /**
   * Resolve from root path
   */
  fromRoot(path = '') {
    return resolve(this.root, path);
  }
}

module.exports = Paths;
