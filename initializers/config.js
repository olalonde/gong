var fs = require('fs'),
  path = require('path'),
  _ = require('underscore')._;

module.exports = function (cb) {
  var rootPath = path.resolve('./'); // directory from where script was launched
  var configPath = path.join(rootPath, 'config/default.json');
  var config = require(configPath);

  config.rootPath = rootPath;
  config.env = process.env.NODE_ENV || 'development';

  var envConfigPath = path.join(rootPath, 'config/' + config.env + '.json');
  if (fs.existsSync(envConfigPath))
    var configOverride = require(envConfigPath);

  // override default.json with
  // production.json/development.json/<NODE_ENV>.json
  config = _.extend(config, configOverride);

  cb(null, { config: config });
}
