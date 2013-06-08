var express = require('express'),
  RedisStore = require('connect-redis')(express);

module.exports = function (params, cb) {
  logger.debug('Initializing Express session store');

  var config = params.config;

  var sessionStore = new RedisStore(config.redis);
  sessionStore.client.stream.unref();

  config.sessions.store = sessionStore;
  return cb(null, params);
};
