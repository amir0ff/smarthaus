// Importing dependencies
const express = require('express');
const routes = require('./backend');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 80;

// Navigating to the directory where the server.js lives
/*
   This is important when running node from outside the directory,
   like  on the Raspberry Pi startup script so that it doesn't
   break the "__dirname" path structure
*/
process.chdir(__dirname);

// Configure CORS headers
const corsOptions = {
  "origin": '*',
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
};

// Apply CORS configurations
app.use(cors(corsOptions));

// Use body parser for incoming  request
app.use(bodyParser.json());

// Import API routes
app.use('/api', routes);

// Serve static files form the dist directory
app.use(express.static(path.join(__dirname, 'dist/smarthaus')));
app.use('/*', express.static(path.join(__dirname, 'dist/smarthaus')));

// Fire up the Node.js server
app.listen(port, () => {
  console.log("Listening on port " + port);
});
