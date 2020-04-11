const express = require('express');
const router = express.Router();

const configAuthRoutes = require('./routes/auth');
const configTaskRoutes = require('./routes/task');
const configFileRoutes = require('./routes/file');

router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

// Authentication
configAuthRoutes(router);
// Task
configTaskRoutes(router);
// Task
configFileRoutes(router);

module.exports = router;
