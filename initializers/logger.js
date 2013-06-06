var winston = require('winston');

/**
 * 
 * params:
 *  - config
 */
module.exports = function (params, cb) {
  var config = params.config;

  // @global
  var logger = global.logger = new (winston.Logger)();

  if (config.silent) {
    return cb(null, params);
  }

  var levels = {
    debug: 0,
    info: 1,
    notice: 2,
    warning: 3,
    error: 4,
    crit: 5,
    alert: 6,
    emerg: 7
  };

  var colors = {
    debug: 'white',
    info: 'blue',
    notice: 'blue',
    warning: 'yellow',
    error: 'red',
    crit: 'red',
    alert: 'red',
    emerg: 'red'
  };

  logger.setLevels(levels);
  winston.addColors(colors);

  var handleExceptions = (config.env === 'production') ? true : false;


  logger.add(winston.transports.Console, {
    level: 'debug',
    colorize: true,
    handleExceptions: handleExceptions
  });

  if (handleExceptions) {
    if (config.logs && config.logs.exception) {
      logger.handleExceptions(new winston.transports.File({
        filename: config.logs.exception
      }));
    }
    logger.exitOnError = false;
  }

  cb(null, params);
}
