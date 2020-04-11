const Task = require('../models/Task');

module.exports = {
  me: async function(req, res) {
    try{
      const task = await Task.findOne({_id: req.params.id});
      res.json({ data: task.toJSON() });
    } catch (err) {
      res.status(400);
      res.json({ message: 'Failed to fetch task: ' + err.message});
    }
  },
  all: async function(req, res) {
    try{
      const tasks = await Task.find({userId: req.user._id});
      res.json({data: tasks.map(task => task.toJSON())});
    } catch (err) {
      res.status(400);
      res.json({message: 'Failed to fetch tasks: ' + err.message});
    }
  },
  update: async function(req, res) {
    try {
      const task = await Task.findOneAndUpdate({_id: req.params.id, userId: req.user._id}, { $set: req.body }, { new: true });
      if (!task) {
        res.status(400);
        res.json({message: 'Task not found'});
      }
      res.json({message: 'Task has been updated successfully', data: task.toJSON()});
    } catch (err) {
      res.status(400);
      res.json({message: 'Failed to update task: ' + err.message});
    }
  },
  create: async function(req, res) {
    try {
      const task = new Task(req.body);
      task.userId = req.user._id;
      await task.save();

      const body = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>New Task</title>
          </head>
          <body>
            <div>
              <p>Dear Admin,</p>
              <p>A new task has just created.</p>
              <p>----- TASK INFO ----</p>
              <p>Name: ${task.name}</p>
              <br>
              <p>Cheers!</p>
            </div>
          </body>
        </html>
        `
      ;
      const userEmail = 'tungnh90@gmail.com';
      const subject = 'New Task';
      const sendMail = require('../services/sendMail');

      sendMail({ to: userEmail, subject: subject, body: body });

      res.json({
        message: 'Task has been created successfully',
        data: task.toJSON()
      });
    } catch (err) {
      res.status(400);
      res.json({message: 'Failed to create task: ' + err.message});
    }
  },
  delete: async function(req, res) {
    try {
      await Task.findByIdAndRemove({_id: req.params.id});
      res.json({ message: 'Task has been deleted successfully' });
    } catch (err) {
      res.status(400);
      res.json({message: 'Failed to delete task: ' + err.message});
    }
  }
};
