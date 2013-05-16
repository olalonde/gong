var express = require('express'),
  engines = require('consolidate');

/**
 * params:
 *  - config
 */
module.exports = function (params, cb) {
  logger.debug('Initializing Express');

  var config = params.config;

  var app = express(); 
  app.set('views', config.rootPath + '/app/views');
  app.set('view engine', 'hbs');
  app.set('trust proxy', config['trust proxy']);

  app.engine('hbs', engines.handlebars);

  params.app = app;
  cb(null, params);
}
