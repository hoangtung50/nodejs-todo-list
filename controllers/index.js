const AuthController = require('./AuthController');
const TaskController = require('./TaskController');
const FileController = require('./FileController');

module.exports = {
  auth: AuthController,
  task: TaskController,
  file: FileController
};
