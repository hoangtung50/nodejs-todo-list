const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    unique: [true, 'The email have already existing'],
    lowercase: true,
    required: true,
    trim: true,
  },
  hashPassword: {
    type: String,
    required: true
  },
  role: {
    type: String,
    validate: {
      validator: function(v) {
        return /^((driver)|(manager)|(company_admin)|(admin))$/.test(v);
      },
      message: '{VALUE} is not a valid role!'
    }
  },
  resetPasswordToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

User.methods.isAdmin = function() {
  return this.role === 'admin';
};

User.methods.isCompanyAdmin = function() {
  return this.role === 'company_admin';
};

User.methods.isManager = function() {
  return this.role === 'manager';
};

User.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hashPassword);
};

User.methods.cryptPassword = function(password) {
  this.hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

User.virtual('password').set(function(value) {
  this._password = value;
  this.hashPassword = this.cryptPassword(value);
}).get(function() {
  return this._password;
});

User.virtual('passwordConfirmation').set(function(value) {
  this._passwordConfirmation = value;
}).get(function() {
  return this._passwordConfirmation;
});

User.path('hashPassword').validate(function() {
  if (this._password || this._passwordConfirmation) {
    if (typeof this._password === 'string' && this._password.length < 6) {
      this.invalidate('password', 'must be at least 6 characters.');
    }
    if (this._password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'must match password.');
    }
  }

  if (this.isNew && (!this._password || !this.hashPassword)) {
    this.invalidate('password', 'Password is required');
  }
});

User.options.toJSON = {
  transform: function(doc, user) {
    user.id = user._id;
    if (user.companyId instanceof Object) {
      user.companyStatus = user.companyId.status;
      user.company = user.companyId.name;
      user.companyId = user.companyId._id || user.companyId.id;
    }
    delete user._id;
    delete user.hashPassword;
    delete user.__v;
    user.createdAt = moment(user.createdAt).format('DD/MM/YYYY');
    return user;
  }
};

module.exports = mongoose.model('User', User);
