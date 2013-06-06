var express = require('express'),
  acceptOverride = require('connect-acceptoverride'),
  path = require('path'),
  fs = require('fs'),
  connectr = require('connectr'),
  passport = require('passport');

/**
 * params:
 *  - config
 *  - app
 */
module.exports = function (params, cb) {
  logger.debug('Initializing Express middleware');

  var app = params.app,
    config = params.config;

  connectr = connectr(app);

  /**
   * Request parsing
   */
  connectr.use(express.cookieParser())
    .as('cookieParser');
  connectr.use(express.bodyParser({ uploadDir: config.uploadDir }))
    .as('bodyParser');
  connectr.use(express.methodOverride())
    .as('methodOverride');
  connectr.use(express.json())
    .as('json');
  connectr.use(acceptOverride())
    .as('acceptOverride');
  connectr.use(express.compress())
    .as('compress'); // @todo: should be done by reverse proxy?

  /**
   * Logging
   */
  // we need to tell the logger to use req.ip instead of the socket's
  // remote address if we want to use the IP set by the reverse proxy
  express.logger['remote-addr'] = function (req) { return req.ip; };

  if (!config.silent) {
    connectr.use(express.logger('dev')).as('logger');
  }

  /**
   * Sessions
   */
  connectr.use(express.session(config.sessions)).as('session');

  /**
   * CSRF
   */
  if (config.csrf !== false) {
    connectr.use(function (req, res, next) {
      if (req._disable_csrf) return next();
      express.csrf()(req, res, next);
    }).as('csrf');
  }

  /**
   * User defined middlewares
   */
  var user_middleware_path = path.join(config.rootPath, 'config/middleware.js');
  if (fs.existsSync(user_middleware_path)) {
    require(user_middleware_path)(app, config);
  }

  /**
   * Static files
   */
  app.use(express.static(path.join(config.rootPath, 'public')));

  /**
   * Routes
   */
  connectr.use(app.router).as('router');

  /**
   * 404 errors
   */
  connectr.use(function(req, res, next) {
    res.status(404);
    res.render('errors/404');
  }).as('404');

  /**
   * Display errors to browser when in development
   */
  app.configure('development', function() {
    app.use(express.errorHandler());
  });

  return cb(null, params);
}

