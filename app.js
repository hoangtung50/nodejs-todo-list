const express = require('express');
const path = require('path');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./config/routes');
const app = express();

// Load env
require('dotenv').config();

// Load db
require('./config/database').connect();

// enable files upload
app.use(fileUpload({
  createParentPath: true,
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hi!')
})

// Backend API
app.use('/api', api);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404);
  res.send({ message: 'Not found' });
});

// error handler
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send({ message: err.message });
});

module.exports = app;
