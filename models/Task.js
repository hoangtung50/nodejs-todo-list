const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  }
});

Task.options.toJSON = {
  transform: function(doc, task) {
    task.id = task._id;
    delete task._id;
    delete task.__v;
    return task;
  }
};

module.exports = mongoose.model('Task', Task);
