// Import database configurations
require('./config');
require('./model');
require('./config/passport');

// Importing dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const app = express();

// Importing API routes
const routes = require('./api');

// Using body parser for requests
app.use(bodyParser.json());

// Apply CORS config
app.use(cors());

// Initialize passport middleware
app.use(passport.initialize());

// Import API routes
app.use('/api', routes);

// Serve static files form the dist directory
app.use(express.static(path.join(__dirname, '../dist/smarthaus')));
app.use('/*', express.static(path.join(__dirname, '../dist/smarthaus')));

// Handle errors
app.use((err, req, res, next) => {
  res.json({message: err.message});
  console.log(err);
});

// Fire up the Node.js server
app.listen(process.env.PORT, () => console.log(`Server started at port: ${process.env.PORT}`));
