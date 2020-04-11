const validate = require('../../validation');
const {
  vTask
} = require('../../validation/schema');
const {
  task,
  auth
} = require('../../controllers');

module.exports = function(router) {
  router.post(
    '/tasks',
    auth.requireAuth,
    validate(vTask),
    task.create
  );
  router.post(
    '/tasks/:id',
    auth.requireAuth,
    validate(vTask),
    task.update
  );
  router.get(
    '/tasks',
    auth.requireAuth,
    task.all
  );
  router.get(
    '/tasks/:id',
    auth.requireAuth,
    task.me
  );
  router.delete(
    '/tasks/:id',
    auth.requireAuth,
    task.delete
  );
};
