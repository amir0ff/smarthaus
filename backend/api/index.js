/*

   The Node.js API module that communicates with the devices

   * Forked from Marco Schwartz [https://github.com/marcoschwartz]
   * Modified and remixed by Amir Off [https://github.com/amiroff157] on Sep, 2018
   *
   * This library is licensed under the GNU General Public License v3.0

*/


// Importing dependencies
const router = require('express').Router();
const request = require('request');
const userCtrl = require('../controllers/user.controller');
const consoleConfig = require('../config/console-stamp.config');
require('console-stamp')(console, consoleConfig);
const rpio = require('rpio');

/* Registered devices are non-persistent and
   live as long as the Node.js process is running */
const database = {
  devices: [],
  getDevice: function (device) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].id === device || this.devices[i].name === device) {
        return this.devices[i];
      }
    }
  }
};

class Device {
  constructor() {
    this.hardware = "";
    this.address = "";
    this.name = "";
    this.id = "";
  }

  getDevice(callback) {

    request({
      uri: 'http://' + this.address,
      json: true,
      timeout: 1000
    }, callback);

  };

  getVariable(variable, callback) {

    request({
      uri: 'http://' + this.address + '/' + variable,
      json: true,
      timeout: 1000
    }, callback);

  };

  callFunction(function_name, parameters, callback) {

    request({
      uri: 'http://' + this.address + '/' + function_name + "?params=" + parameters,
      json: true,
      timeout: 1000
    }, callback);

  };

  analogRead(pin, callback) {

    request({
      uri: 'http://' + this.address + '/analog/' + pin,
      json: true,
      timeout: 1000
    }, callback);

  };

  analogWrite(pin, value, callback) {

    request({
      uri: 'http://' + this.address + '/analog/' + pin + '/' + value,
      json: true,
      timeout: 1000
    }, callback);

  };

  digitalRead(pin, callback) {

    request({
      uri: 'http://' + this.address + '/digital/' + pin,
      json: true,
      timeout: 1000
    }, callback);

  };

  digitalWrite(pin, value, callback) {

    request({
      uri: 'http://' + this.address + '/digital/' + pin + '/' + value,
      json: true,
      timeout: 1000
    }, callback);

  };

  takeSnapshot(callback) {

    request({
      uri: 'http://' + this.address + '/camera/snapshot/',
      json: true,
      timeout: 1000
    }, callback);

  };

  gpioDigitalWrite(pin, value) {
    const val = parseInt(value) === 0 ? rpio.LOW : rpio.HIGH;
    rpio.open(pin, rpio.OUTPUT, rpio.LOW);
    rpio.write(pin, val);
  }

  pinMode(pin, value, callback) {

    request({
      uri: 'http://' + this.address + '/mode/' + pin + '/' + value,
      json: true,
      timeout: 1000
    }, callback);

  };
}

router.post('/signin', userCtrl.signin);
router.post('/signup', userCtrl.verifyJWT, userCtrl.signup);
router.get('/user', userCtrl.verifyJWT, userCtrl.getUser);
router.post('/add', userCtrl.verifyJWT, (req, res) => {
  let new_device = new Device();
  new_device.hardware = req.body.hardware;
  new_device.address = req.body.address;

  setTimeout(() => {
    new_device.getDevice((error, response, body) => {
      if (error || typeof (body) === 'undefined') {
        console.warn('The device is offline and cannot be added!');
        res.status(404).json({'error': 'The device is offline and cannot be added!'});
      } else {
        new_device.id = body.id;
        new_device.name = body.name;
        new_device.hardware = body.hardware;
        database.devices.push(new_device);
        // Send response headers back to client
        res.status(200).json({
          'id': body.id
        });
        console.info("Device added with ID: " + body.id);
      }
    });
  }, 2000);

});

// Return all devices
router.get('/devices', userCtrl.verifyJWT, function (req, res) {
  res.json(database.devices);
});

// Return a specific device
router.get('/:device', userCtrl.verifyJWT, function (req, res) {
  console.log('Sync request sent to device: ' + req.params.device);
  let device = database.getDevice(req.params.device);
  if (typeof (device) !== 'undefined') {
    // Get status
    device.getDevice(function (error, response, body) {
      res.json(body);
    });
  } else {
    res.json({message: 'Device not found'});
  }
});

// Execute a function
router.get('/:device/execute/:command', userCtrl.verifyJWT, function (req, res) {
  // Get device
  let device = database.getDevice(req.params.device);
  if (typeof (device) !== 'undefined') {
    console.log('Function execution request sent to device: ' + req.params.device);
    // Execute function
    device.callFunction(req.params.command, req.query.params, (error, response, body) => {
      res.json(body);
    });
  } else {
    res.json({message: 'Device not found'});
  }
});

// Get variable
router.get('/device/:device/:variable', userCtrl.verifyJWT, (req, res) => {
  // Get device
  let device = database.getDevice(req.params.device);
  if (typeof (device) !== 'undefined') {
    console.log('Variable read request sent to device: ' + req.params.device);
    // Get variable
    device.getVariable(req.params.variable, (error, response, body) => {
      res.json(body);
    });
  } else {
    res.json({message: 'Device not found'});
  }
});

// Digital write
router.get('/:device/digital/:pin/:value', userCtrl.verifyJWT, function (req, res) {
  console.log('Digital write request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  if (typeof (device) !== 'undefined') {
    // Send command
    device.digitalWrite(req.params.pin, req.params.value, function (error, response, body) {
      res.json(body);
    });
  } else {
    res.json({message: 'Device not found'});
  }
});

// Analog read
router.get('/:device/analog/:pin/', userCtrl.verifyJWT, function (req, res) {
  console.log('Analog read request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  // Get variable
  device.analogRead(req.params.pin, function (error, response, body) {
    res.json(body);
  });
});

// Analog write
router.get('/:device/analog/:pin/:value', userCtrl.verifyJWT, function (req, res) {
  console.log('Analog write request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  // Get variable
  device.analogWrite(req.params.pin, req.params.value, function (error, response, body) {
    res.json(body);
  });
});

// Digital read
router.get('/:device/digital/:pin/', userCtrl.verifyJWT, function (req, res) {
  console.log('Digital read request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  // Get variable
  device.digitalRead(req.params.pin, function (error, response, body) {
    res.json(body);
  });
});

// GPIO Digital Write
router.get('/pi/:pin/:value', userCtrl.verifyJWT, (req, res) => {
  console.info('Digital write request sent to GPIO: ' + req.params.pin);
  let device = new Device();
  device.gpioDigitalWrite(req.params.pin, req.params.value);
  return res.json({'message': 'Digital write request sent to GPIO: ' + req.params.pin})
});

// Pin mode
router.get('/:device/mode/:pin/:value', userCtrl.verifyJWT, function (req, res) {
  console.log('Pin mode request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  // Get variable
  device.pinMode(req.params.pin, req.params.value, function (error, response, body) {
    res.json(body);
  });
});

// Exporting routs to to Node.js
module.exports = router;
