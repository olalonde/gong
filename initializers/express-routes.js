var path = require('path');

module.exports = function (params, cb) {
  logger.debug('Initializing Express routes');

  var config = params.config,
    app = params.app,
    controllersPath = path.join(config.rootPath, 'app/controllers/');

  try {
    require.resolve(controllersPath);
  }
  catch (e) {
    return cb(null, params);
  }

  var controllers = require(controllersPath),
    handler = require('daobao').assignHandler(controllers),
    map = new require('railway-routes').Map(app, handler);

  require(path.join(config.rootPath, 'config/routes.js'))(map);

  cb(null, params);
};
