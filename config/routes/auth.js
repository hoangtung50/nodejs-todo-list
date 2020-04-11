const validate = require('../../validation');
const {
  vSignIn
} = require('../../validation/schema');
const {
  auth
} = require('../../controllers');

module.exports = function(router) {
  router.post('/auth/sign_in', validate(vSignIn), auth.signIn);
};
