var express = require('express'),
  acceptOverride = require('connect-acceptoverride'),
  path = require('path');

/**
 * params:
 *  - config
 *  - app
 */
module.exports = function (params, cb) {
  logger.debug('Initializing Express middleware');

  var app = params.app,
    config = params.config;

  /**
   * Request parsing
   */
  app.use(express.cookieParser());
  app.use(express.bodyParser({ uploadDir: config.uploadDir }));
  app.use(express.methodOverride());
  app.use(express.json());
  app.use(acceptOverride());
  app.use(express.compress()); // @todo: should be done by reverse proxy?

  /**
   * Logging
   */
  // we need to tell the logger to use req.ip instead of the socket's
  // remote address if we want to use the IP set by the reverse proxy
  express.logger['remote-addr'] = function (req) { return req.ip; };
  app.use(express.logger('dev'));

  /**
   * Sessions
   */
  config.sessions.sessionStore = params.sessionStore;
  app.use(express.session(config.sessions));

  /**
   * CSRF
   */
  app.use(express.csrf());

  /**
   * Static files
   */
  app.use(express.static(path.join(config.rootPath, 'public')));

  /**
   * Routes
   */
  app.use(app.router);

  /**
   * 404 errors
   */
  app.use(function(req, res, next) {
    res.status(404);
    res.render('errors/404');
  });

  /**
   * Display errors to browser when in development
   */
  app.configure('development', function() {
    app.use(express.errorHandler());
  });


  return cb(null, params);
}

