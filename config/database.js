const mongoose = require('mongoose');

module.exports = {
  connect: function() {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err) => {
      if (err){
        console.log('DB CONNECTION FAILED: '+err);
      }
      else {
        console.log('DB CONNECTION SUCCESS: '+process.env.MONGODB_URI);
      }
    });
  }
};
