var coffee = require('coffee-script'); //allows requiring .coffee files
var async = require('async');

//@todo: make gong a class?
var Gong = {};

// only let gong initialize once
var cache;

/**
 * @param {options} options optional
 * @param {Function} cb function(err, {app: ..., config: ...})
 */
Gong.init = function (options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (cache) {
    return cb.apply(null, cache);
  }

  options = options || {};

  var _this = this;
  async.waterfall([
    // Initializers
    require('./initializers/config'),
    require('./initializers/logger'),
    require('./initializers/user-initializers'),
    require('./initializers/express'),
    require('./initializers/express-sessions'),
    require('./initializers/express-middleware'),
    require('./initializers/express-routes')
  ],
  function (err, params) {
    _this.params = params;
    _this.isInit = true;
    if (cb) {
      cache = [err, params];
      return cb(err, params);
    }
    if (err) {
      console.error('Error while initializing server:');
      console.error(err);
      return process.exit(-1);
    }
    logger.info('Server initialized.');
  });
}

Gong.checkInit = function () {
  if (!this.isInit) throw new Error('You must first initialize Gong (Gong.init())');
}

Gong.start = function (cb) {
  var _this = this;
  this.init(function (err, params) {
    if (err && cb) return cb(err, params);
    if (err) {
      console.error('Error initializing server');
      console.error(err);
      return;
    }
    if (!cb) cb = function () {};
    _this.listen(cb);
  });
}

Gong.listen = function (cb) {
  Gong.checkInit();
  require('./initializers/http-server')(this.params, cb);
}

Gong.repl = function (cb) {
  Gong.checkInit();
  require('./initializers/repl')(this.params, cb);
}

module.exports = Gong;
