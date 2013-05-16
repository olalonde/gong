var BaseController = require('chungking').BaseController;

module.exports = BaseController.extend(function() {
  this.beforeFilter(function(req, res, next) {
    logger.debug('Called application before filter.');
    next();
  });
});
