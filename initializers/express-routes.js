var path = require('path');

module.exports = function (params, cb) {
  logger.debug('Initializing Express routes');

  var config = params.config,
    app = params.app,
    controllersPath = path.join(config.rootPath, 'app/controllers/'),
    controllers,
    handler,
    map;

  try {
    require.resolve(controllersPath);
    controllers = require(controllersPath);
    handler = require('daobao').assignHandler(controllers);
  }
  catch (e) {
    // didnt fint controllers path
  }

  handler = handler || function () {};
  map = new require('railway-routes').Map(app, handler);

  require(path.join(config.rootPath, 'config/routes.js'))(map);

  cb(null, params);
};
