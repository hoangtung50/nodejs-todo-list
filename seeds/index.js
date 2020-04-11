const mongoose = require('mongoose');
const User = require('../models/User');
// Load env
require('dotenv').config();
// Load db
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
// Create admin
const adminData = {
  email: 'admin@example.com',
  password: '123123aA1#',
  passwordConfirmation: '123123aA1#',
  role: 'admin'
};
const admin = new User(adminData);
admin.cryptPassword(adminData.password);
admin.save((err) => {
  if (err) {
    console.log('Admin creation failed: ' + err.message);
  }
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected');
  });
});
