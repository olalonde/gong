var express = require('express'),
  RedisStore = require('connect-redis')(express);

module.exports = function (params, cb) {
  logger.debug('Initializing Express session store');

  var config = params.config;

  params.sessionStore = new RedisStore(config.redis);

  return cb(null, params);
}
