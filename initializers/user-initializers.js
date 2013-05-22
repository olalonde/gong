var fs = require('fs'),
  debug = require('debug')('gong:initializers'),
  async = require('async'),
  path = require('path');

module.exports = function (params, cb) {
  var config = params.config;

  // @todo use fs.exists instead of relying on try/catch block
  var user_initializers_path = path.join(config.rootPath, 'config/initializers/');
  if (fs.existsSync(require.resolve(user_initializers_path))) {
    var initializers = require(user_initializers_path);
    logger.debug('Running user defined initializers');
  }
  else {
    logger.debug('No user defined initializers found');
    // no user initializers
    return cb(null, params);
  }

  // Pass the Konfu's initializer's params argument to the user's first
  // initializer function.
  initializers.unshift(function (cb) {
    cb(null, params);
  });

  //debug(initializers);

  async.waterfall(initializers, function (err, res) {
    cb(err, params);
  });
}
