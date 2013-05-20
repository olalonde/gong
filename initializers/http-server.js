var http = require('http');

/**
 * params:
 *  - config
 *  - app
 */
module.exports = function (params, cb) {
  var config = params.config,
    app = params.app;

  http.createServer(app)
    .on('error', cb)
    .listen(config.http.port, function(err) {
      if (err) return cb(err);
      logger.info('HTTP server listening at http://' + config.domain + ':' + config.http.port);
      cb(null, params);
    });
}
