const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');

module.exports = {
  signIn: async function(req, res) {
    try {
      const user = await User.findOne({email: req.body.email});
      if (!user) {
        return res.status(400).json({
          message: 'Authentication failed. User not found.'
        });
      }

      if (!user.comparePassword(req.body.password)) {
        return res.status(400).json({
          message: 'Authentication failed. Wrong password.'
        });
      }

      const data = user.toJSON();
      res.json({
        data: Object.assign({
          token: jwt.sign(data, process.env.JWT_SECRET_KEY)
        }, data)
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message
      });
    }
  },
  requireAuth: async function(req, res, next) {
    try {
      const access_token = req.headers.access_token || req.query.access_token || req.body.access_token;
      const decode = await jwt.verify(access_token, process.env.JWT_SECRET_KEY);
      const user = await User.findOne({_id: decode.id});
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized user!' });
      }
      if (!!user.companyId) {
        const company = await Company.findOne({_id: user.companyId});
        if (company.status === 'inactive') {
          return res.status(401).json({ message: 'Account is inactive!' });
        }
      }
      req.user = user;
      next();
    } catch(err) {
      req.user = undefined;
      return res.status(401).json({ message: err.message});
    }
  }
};
