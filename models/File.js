const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const File = new Schema({
  taskId: {
    type: Schema.ObjectId,
    ref: 'Task'
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
});

File.options.toJSON = {
  transform: function(doc, file) {
    file.id = file._id;
    delete file._id;
    delete file.__v;
    return file;
  }
};

module.exports = mongoose.model('File', File);
