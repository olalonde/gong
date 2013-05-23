var coffee = require('coffee-script'); //allows requiring .coffee files
var async = require('async');

var Gong = function () {

}

Gong.startSilent = function (cb) {

  Gong.start({ silent: true }, cb);

}

/**
 * @param {options} options optional
 * @param {Function} cb function(err, {app: ..., config: ...})
 */
Gong.start = function (options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  options = options || {};

  async.waterfall([
      // Initializers
      require('./initializers/config'),
      require('./initializers/logger'),
      require('./initializers/user-initializers'),
      require('./initializers/express'),
      require('./initializers/express-sessions'),
      require('./initializers/express-middleware'),
      require('./initializers/express-routes'),
      function (params, cb) {
        if (options.silent) {
          // dont launch server when silent options is true
          cb(null, params);
        }
        else {
          require('./initializers/http-server')(params, cb);
        }
      },
      require('./initializers/repl')
    ],
    function (err, params) {
      if (cb) return cb(err, params);
      if (err) {
        console.error('Error while initializing server:');
        console.error(err);
        return process.exit(-1);
      }
      logger.info('Server initialized.');
    }
  );
}

module.exports = Gong;
