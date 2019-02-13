const Paths = require('./paths');
class Dvx {
  constructor() {
    this.paths = new Paths();
    this.package = require(this.paths.packageJson());
  }

  inProduction() {
    return Config.production();
  }

  inDebug() {
    return Config.debug();
  }

  isHotServer() {
    return Config.hot();
  }

  target() {
    return Config.target() ? Config.target() : 'web';
  }
}
module.exports = Dvx;
