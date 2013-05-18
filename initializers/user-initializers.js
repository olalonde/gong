var fs = require('fs'),
  debug = require('debug')('konfu:initializers:user-initializers'),
  async = require('async'),
  path = require('path');

module.exports = function (params, cb) {
  var config = params.config;

  try {
    var initializers = require(path.join(config.rootPath, 'config/initializers/'));
    logger.debug('Running user defined initializers');
  }
  catch (e) {
    // no user initializers
    cb(null, params);
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
