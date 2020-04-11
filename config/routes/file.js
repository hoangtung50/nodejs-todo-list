const {
  file,
  auth
} = require('../../controllers');

module.exports = function(router) {
  router.get(
    '/files',
    auth.requireAuth,
    file.all
  );
  router.post(
    '/files',
    auth.requireAuth,
    file.create
  );
};
