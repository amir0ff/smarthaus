// Importing dependencies
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 80;

// Navigating to the directory where the server.js lives
process.chdir(__dirname);
/* This is important when running node from
   outside the directory, like  on the
   Raspberry Pi startup so that it doesn't
   break the "__dirname" path structure */

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

// Import API routes and functions
const routes = require('./backend');
app.use('/', routes);

// Serve static files form the dist directory
app.use(express.static('dist/smarthaus'));
app.use(favicon(path.join(__dirname, 'dist/smarthaus', 'favicon.ico')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/smarthaus/index.html'));
});

// Fire up the Node.js server
app.listen(port, () => {
  console.log("Listening on port " + port);
});
