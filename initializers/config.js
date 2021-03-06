var fs = require('fs'),
  path = require('path'),
  _ = require('underscore')._;

module.exports = function (cb) {
  var rootPath = path.resolve('./'); // directory from where script was launched
  var configPath = path.join(rootPath, 'config/default.json');

  var skelConfigPath = path.join(__dirname, '../skeletton/config/default.json');
  if (!fs.existsSync(configPath)) {
    configPath = skelConfigPath;
  }

  var skelConfig = require(skelConfigPath);
  var config = require(configPath);

  config = _.extend(skelConfig, config);

  config.rootPath = rootPath;
  config.env = process.env.NODE_ENV || 'development';

  var envConfigPath = path.join(rootPath, 'config/' + config.env + '.json');
  if (fs.existsSync(envConfigPath))
    var configOverride = require(envConfigPath);

  // override default.json with
  // production.json/development.json/<NODE_ENV>.json
  config = _.extend(config, configOverride);

  cb(null, { config: config });
};
