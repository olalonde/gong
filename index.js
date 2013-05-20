var coffee = require('coffee-script'); //allows requiring .coffee files
var async = require('async');

var Konfu = function () {

}

Konfu.start = function (cb) {
  async.waterfall([
      // Initializers
      require('./initializers/config'),
      require('./initializers/logger'),
      require('./initializers/user-initializers'),
      require('./initializers/express'),
      require('./initializers/express-sessions'),
      require('./initializers/express-middleware'),
      require('./initializers/express-routes'),
      require('./initializers/http-server')
    ],
    function (err) {
      if (cb) return cb(err);
      if (err) {
        console.error('Error while initializing server:');
        console.error(err);
        return process.exit(-1);
      }
      logger.info('Server initialized.');
    }
  );
}

module.exports = Konfu;
