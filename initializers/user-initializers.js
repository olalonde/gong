var fs = require('fs'),
  debug = require('debug')('konfu:initializers'),
  async = require('async'),
  path = require('path');

module.exports = function (params, cb) {
  var config = params.config;

  try {
    user_initializers_path = path.join(config.rootPath, 'config/initializers/');
    var initializers = require(user_initializers_path);
    logger.debug('Running user defined initializers');
  }
  catch (e) {
    debug(e);
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
