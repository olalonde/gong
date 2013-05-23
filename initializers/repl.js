var repl = require('repl');

module.exports = function (params, cb) {
  var app = params.app;
  var config = params.config;

  if (config.repl) {
    var context = repl.start('> ').context;
    context.app = app;
    context.config = config;
  }

  cb(null, params);
}
