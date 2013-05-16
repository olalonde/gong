var Application = require('./Application');

module.exports = Application.extend(function() {
  this.beforeFilter(function(req, res, next) {
    logger.debug('Called Home before filter.');
    next();
  });

  this.action('index', function (req, res, next) {
    res.send('Welcome to the demo app!');
  });
});
