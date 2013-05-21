var express = require('express'),
  RedisStore = require('connect-redis')(express);

module.exports = function (params, cb) {
  logger.debug('Initializing Express session store');

  var config = params.config;

  var sessionStore = new RedisStore(config.redis);

  config.sessions.store = sessionStore;

  console.log(config.sessions);

  return cb(null, params);
}
