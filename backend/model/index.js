const mongoose = require('mongoose');

// Connecting to MongoDB
// "C:\mongodb\bin\mongod.exe" --dbpath="C:\mongodb\data"

mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (!err) {
    console.log('MongoDB connection succeeded.');
  }
  else {
    console.log('Error in MongoDB connection: ' + JSON.stringify(err));
  }
});

require('./user.model');
